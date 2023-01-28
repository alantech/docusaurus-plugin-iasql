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
function default_1(theme) {
    Handlebars.registerHelper("renderType", function () {
        var _a;
        let type, color;
        if (this.kindString == "Class") {
            if ((_a = this.url) === null || _a === void 0 ? void 0 : _a.toLowerCase().includes("rpcs")) {
                type = "Function";
                color = "95CE3D";
            }
            else {
                type = "Table";
                color = "3D95CE";
            }
        }
        else if (this.kindString == "Enumeration") {
            type = "Enum";
            color = "CD3C94";
        }
        return `![${type}](https://img.shields.io/static/v1?label=&message=${type}&color=${color}&style=for-the-badge)`;
    });
}
exports.default = default_1;
