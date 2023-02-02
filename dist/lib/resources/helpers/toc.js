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
function default_1(theme) {
    Handlebars.registerHelper("toc", function () {
        var _a, _b, _c, _d, _e, _f;
        const md = [];
        const { hideInPageTOC } = theme;
        const isVisible = (_a = this.groups) === null || _a === void 0 ? void 0 : _a.some((group) => group.allChildrenHaveOwnDocument());
        if ((!hideInPageTOC && this.groups) || (isVisible && this.groups)) {
            if (!hideInPageTOC) {
                md.push(`## Table of contents\n\n`);
            }
            let sortedChildren = (_b = this.children) !== null && _b !== void 0 ? _b : [];
            sortedChildren.sort(function (x, y) {
                return x.name == "iasql_functions"
                    ? -1
                    : y.name == "iasql_functions"
                        ? 1
                        : 0;
            });
            // traverse all children with parent id = 0
            for (const child of sortedChildren) {
                if (((_c = child.parent) === null || _c === void 0 ? void 0 : _c.id) == 0 &&
                    child.kind == 2 &&
                    !child.name.includes("/") &&
                    !child.name.includes("ecs_simplified") &&
                    !child.name.includes("index") &&
                    !child.name.includes("interfaces") &&
                    !child.name.includes("subscribers")) {
                    // it is a module, print it
                    md.push(`### [${child.name}](${child.url})\n\n`);
                    // now need to find the depending modules
                    const tables = [];
                    const methods = [];
                    const enums = [];
                    const filtered = sortedChildren === null || sortedChildren === void 0 ? void 0 : sortedChildren.filter((x) => x.name.includes(child.name) &&
                        (x.name.includes("entity") || x.name.includes("rpc")));
                    for (const filt of filtered) {
                        for (const item of (_d = filt.children) !== null && _d !== void 0 ? _d : []) {
                            if (item.kindString == "Class" && !((_e = item.url) === null || _e === void 0 ? void 0 : _e.includes("rpc")))
                                tables.push(item);
                            if (item.kindString == "Class" && ((_f = item.url) === null || _f === void 0 ? void 0 : _f.includes("rpc")))
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
                }
            }
        }
        return md.length > 0 ? md.join("\n") : null;
    });
}
exports.default = default_1;
