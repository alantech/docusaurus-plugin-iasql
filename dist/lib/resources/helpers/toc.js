"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Handlebars = __importStar(require("handlebars"));
const utils_1 = require("../../utils");
function displayChild(child, children) {
    var _a, _b, _c;
    const md = [];
    // it is a module, print it
    md.push(`### [${child.name}](${child.url})\n\n`);
    // now need to find the depending modules
    const tables = [];
    const methods = [];
    const enums = [];
    const filtered = children === null || children === void 0 ? void 0 : children.filter((x) => x.name.includes(child.name) &&
        (x.name.includes("entity") || x.name.includes("rpc")));
    for (const filt of filtered) {
        for (const item of (_a = filt.children) !== null && _a !== void 0 ? _a : []) {
            if (item.kindString == "Class" && !((_b = item.url) === null || _b === void 0 ? void 0 : _b.includes("rpc")))
                tables.push(item);
            if (item.kindString == "Class" && ((_c = item.url) === null || _c === void 0 ? void 0 : _c.includes("rpc")))
                methods.push(item);
            if (item.kindString == "Enumeration")
                enums.push(item);
        }
    }
    // display them
    if (tables.length > 0)
        md.push("&nbsp;&nbsp;**Tables**\n");
    for (const child2 of tables) {
        md.push(`&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[${(0, utils_1.camelToSnakeCase)(child2.name)}](${child2.url})\n\n`);
    }
    if (methods.length > 0)
        md.push("&nbsp;&nbsp;**Functions**\n");
    for (const child2 of methods) {
        md.push(`&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[${(0, utils_1.camelToSnakeCase)(child2.name)}](${child2.url})\n\n`);
    }
    if (enums.length > 0)
        md.push("&nbsp;&nbsp;**Enums**\n");
    for (const child2 of enums) {
        md.push(`&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[${(0, utils_1.camelToSnakeCase)(child2.name)}](${child2.url})\n\n`);
    }
    return md;
}
function default_1(theme) {
    Handlebars.registerHelper("toc", function () {
        var _a, _b, _c;
        const md = [];
        const { hideInPageTOC } = theme;
        const isVisible = (_a = this.groups) === null || _a === void 0 ? void 0 : _a.some((group) => group.allChildrenHaveOwnDocument());
        if ((!hideInPageTOC && this.groups) || (isVisible && this.groups)) {
            if (!hideInPageTOC) {
                md.push(`# Table of contents\n\n`);
            }
            // builtin
            const builtin = (_b = this.children) === null || _b === void 0 ? void 0 : _b.filter((child) => {
                var _a, _b;
                return ((_a = child.parent) === null || _a === void 0 ? void 0 : _a.id) == 0 &&
                    child.kind == 2 &&
                    ((_b = child.url) === null || _b === void 0 ? void 0 : _b.startsWith("builtin"));
            });
            md.push("## Builtin");
            for (const child of builtin !== null && builtin !== void 0 ? builtin : []) {
                if (child.name == "iasql_functions") {
                    const content = displayChild(child, builtin !== null && builtin !== void 0 ? builtin : []);
                    md.push(...content);
                }
            }
            // aws
            const aws = (_c = this.children) === null || _c === void 0 ? void 0 : _c.filter((child) => {
                var _a, _b;
                return ((_a = child.parent) === null || _a === void 0 ? void 0 : _a.id) == 0 &&
                    child.kind == 2 &&
                    ((_b = child.url) === null || _b === void 0 ? void 0 : _b.startsWith("aws"));
            });
            md.push("## AWS");
            for (const child of aws !== null && aws !== void 0 ? aws : []) {
                if (!child.name.includes("/")) {
                    const content = displayChild(child, aws !== null && aws !== void 0 ? aws : []);
                    md.push(...content);
                }
            }
        }
        return md.length > 0 ? md.join("\n") : null;
    });
}
exports.default = default_1;
