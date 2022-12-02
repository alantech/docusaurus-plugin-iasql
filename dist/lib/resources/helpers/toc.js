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
            for (const child of (_b = this.children) !== null && _b !== void 0 ? _b : []) {
                if (((_c = child.parent) === null || _c === void 0 ? void 0 : _c.id) == 0 &&
                    child.kind == 2 &&
                    !child.name.includes("/") &&
                    !child.name.includes("ecs_simplified") &&
                    !child.name.includes("index") &&
                    !child.name.includes("interfaces") &&
                    !child.name.includes("subscribers")) {
                    md.push(`### ${child.name}\n\n`);
                    for (const child1 of (_d = this.children) !== null && _d !== void 0 ? _d : []) {
                        if (child1.name.includes(child.name) &&
                            (child1.name.includes("entity") || child1.name.includes("rpc"))) {
                            for (const child2 of (_e = child1.children) !== null && _e !== void 0 ? _e : []) {
                                if (!((_f = child2.url) === null || _f === void 0 ? void 0 : _f.includes("modules"))) {
                                    md.push(`[${(0, utils_1.camelToSnakeCase)(child2.name)}](${child2.url})\n\n`);
                                }
                            }
                        }
                    }
                }
            }
        }
        return md.length > 0 ? md.join("\n") : null;
    });
}
exports.default = default_1;
