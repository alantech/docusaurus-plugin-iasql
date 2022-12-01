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
const typedoc_1 = require("typedoc");
const utils_1 = require("../../utils");
function default_1() {
    Handlebars.registerHelper("propertyTable", function () {
        const comments = this.map((param) => { var _a; return !!((_a = param.comment) === null || _a === void 0 ? void 0 : _a.hasVisibleComponent()); });
        const hasComments = !comments.every((value) => !value);
        const headers = ["Name", "Type"];
        if (hasComments) {
            headers.push("Description");
        }
        const flattenParams = (current) => {
            var _a, _b, _c;
            return (_c = (_b = (_a = current.type) === null || _a === void 0 ? void 0 : _a.declaration) === null || _b === void 0 ? void 0 : _b.children) === null || _c === void 0 ? void 0 : _c.reduce((acc, child) => {
                const childObj = {
                    ...child,
                    name: `${(0, utils_1.camelToSnakeCase)(current.name)}.${(0, utils_1.camelToSnakeCase)(child.name)}`,
                };
                return parseParams(childObj, acc);
            }, []);
        };
        const parseParams = (current, acc) => {
            var _a, _b;
            const shouldFlatten = (_b = (_a = current.type) === null || _a === void 0 ? void 0 : _a.declaration) === null || _b === void 0 ? void 0 : _b.children;
            return shouldFlatten
                ? [...acc, current, ...flattenParams(current)]
                : [...acc, current];
        };
        const properties = this.reduce((acc, current) => parseParams(current, acc), []);
        const rows = properties.map((property) => {
            const propertyType = getPropertyType(property);
            const row = [];
            const nameCol = [];
            const name = property.name.match(/[\\`\\|]/g) !== null
                ? (0, utils_1.escapeChars)((0, utils_1.camelToSnakeCase)(getName(property)))
                : `\`${(0, utils_1.camelToSnakeCase)(getName(property))}\``;
            nameCol.push(name);
            row.push(nameCol.join(" "));
            row.push(Handlebars.helpers.type
                .call(propertyType)
                .replace(/(?<!\\)\|/g, "\\|"));
            if (hasComments) {
                const comments = getComments(property);
                if (comments) {
                    row.push((0, utils_1.stripLineBreaks)(Handlebars.helpers.comments(comments)).replace(/\|/g, "\\|"));
                }
                else {
                    row.push("-");
                }
            }
            return `| ${row.join(" | ")} |\n`;
        });
        const output = `\n| ${headers.join(" | ")} |\n| ${headers
            .map(() => ":------")
            .join(" | ")} |\n${rows.join("")}`;
        return output;
    });
}
exports.default = default_1;
function getPropertyType(property) {
    if (property.getSignature) {
        return property.getSignature.type;
    }
    if (property.setSignature) {
        return property.setSignature.type;
    }
    return property.type ? property.type : property;
}
function getName(property) {
    var _a;
    const md = [];
    if (property.flags.isRest) {
        md.push("...");
    }
    if (property.getSignature) {
        md.push(`get ${property.getSignature.name}()`);
    }
    else if (property.setSignature) {
        md.push(`set ${property.setSignature.name}(${(_a = property.setSignature.parameters) === null || _a === void 0 ? void 0 : _a.map((parameter) => {
            return `${(0, utils_1.camelToSnakeCase)(parameter.name)}:${Handlebars.helpers.type.call(parameter.type, "all", false)}`;
        })})`);
    }
    else {
        md.push(property.name);
    }
    if (property.flags.isOptional) {
        md.push("?");
    }
    return md.join("");
}
function getComments(property) {
    var _a, _b, _c;
    if (property.type instanceof typedoc_1.ReflectionType) {
        if ((_b = (_a = property.type) === null || _a === void 0 ? void 0 : _a.declaration) === null || _b === void 0 ? void 0 : _b.signatures) {
            return (_c = property.type) === null || _c === void 0 ? void 0 : _c.declaration.signatures[0].comment;
        }
    }
    if (property.signatures) {
        return property.signatures[0].comment;
    }
    return property.comment;
}
