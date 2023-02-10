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
const typedoc_1 = require("typedoc");
const Handlebars = __importStar(require("handlebars"));
const utils_1 = require("../../utils");
function default_1(theme) {
    Handlebars.registerHelper("renderComponents", function () {
        var _a, _b, _c, _d, _e, _f, _g;
        const items = [];
        (_a = this.parent) === null || _a === void 0 ? void 0 : _a.traverse((child) => {
            if (child instanceof typedoc_1.DeclarationReflection) {
                if (child.name.includes(this.name) &&
                    (child.name.includes("entity") || child.name.includes("rpc"))) {
                    items.push(child);
                }
            }
        });
        const md = [];
        // now need to find the depending modules
        const tables = [];
        const methods = [];
        const enums = [];
        for (const filt of items) {
            for (const item of (_b = filt.children) !== null && _b !== void 0 ? _b : []) {
                if (item.kindString == "Class" && !((_c = item.url) === null || _c === void 0 ? void 0 : _c.includes("rpc")))
                    tables.push(item);
                if (item.kindString == "Class" && ((_d = item.url) === null || _d === void 0 ? void 0 : _d.includes("rpc")))
                    methods.push(item);
                if (item.kindString == "Enumeration")
                    enums.push(item);
            }
        }
        // display them
        if (tables.length > 0)
            md.push(`### Tables\n\n`);
        for (const child2 of tables) {
            let url = (_e = child2.url) === null || _e === void 0 ? void 0 : _e.replace(".md", "");
            url = "../../" + url;
            md.push(`\u00a0\u00a0\u00a0\u00a0[${(0, utils_1.camelToSnakeCase)(child2.name)}](${url})\n\n`);
        }
        if (methods.length > 0)
            md.push(`### Functions\n`);
        for (const child2 of methods) {
            let url = (_f = child2.url) === null || _f === void 0 ? void 0 : _f.replace(".md", "");
            url = "../../" + url;
            md.push(`\u00a0\u00a0\u00a0\u00a0[${(0, utils_1.camelToSnakeCase)(child2.name)}](${url})\n\n`);
        }
        if (enums.length > 0)
            md.push(`### Enums\n`);
        for (const child2 of enums) {
            let url = (_g = child2.url) === null || _g === void 0 ? void 0 : _g.replace(".md", "");
            url = "../../" + url;
            md.push(`\u00a0\u00a0\u00a0\u00a0[${(0, utils_1.camelToSnakeCase)(child2.name)}](${url})\n\n`);
        }
        return md.join("");
    });
}
exports.default = default_1;
