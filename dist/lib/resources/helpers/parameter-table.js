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
const type_1 = require("./type");
function default_1() {
    Handlebars.registerHelper("parameterTable", function () {
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
            var _a, _b, _c, _d;
            const shouldFlatten = ((_b = (_a = current.type) === null || _a === void 0 ? void 0 : _a.declaration) === null || _b === void 0 ? void 0 : _b.kind) === typedoc_1.ReflectionKind.TypeLiteral &&
                ((_d = (_c = current.type) === null || _c === void 0 ? void 0 : _c.declaration) === null || _d === void 0 ? void 0 : _d.children);
            return shouldFlatten
                ? [...acc, current, ...flattenParams(current)]
                : [...acc, current];
        };
        return table(this.reduce((acc, current) => parseParams(current, acc), []));
    });
}
exports.default = default_1;
function table(parameters) {
    const showDefaults = hasDefaultValues(parameters);
    const comments = parameters.map((param) => { var _a; return !!((_a = param.comment) === null || _a === void 0 ? void 0 : _a.hasVisibleComponent()); });
    const hasComments = !comments.every((value) => !value);
    const headers = ["Name", "Type"];
    if (showDefaults) {
        headers.push("Default value");
    }
    if (hasComments) {
        headers.push("Description");
    }
    const rows = parameters.map((parameter) => {
        const row = [];
        row.push(`\`${parameter.flags.isRest ? "..." : ""}${(0, utils_1.camelToSnakeCase)(parameter.name)}${parameter.flags.isOptional ? "?" : ""}\``);
        row.push(parameter.type
            ? Handlebars.helpers.type.call(parameter.type, "object")
            : (0, type_1.getReflectionType)(parameter, "object"));
        if (showDefaults) {
            row.push(getDefaultValue(parameter));
        }
        if (hasComments) {
            if (parameter.comment) {
                row.push((0, utils_1.stripLineBreaks)(Handlebars.helpers.comments(parameter.comment)).replace(/\|/g, "\\|"));
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
}
function getDefaultValue(parameter) {
    return parameter.defaultValue && parameter.defaultValue !== "..."
        ? `\`${parameter.defaultValue}\``
        : "`undefined`";
}
function hasDefaultValues(parameters) {
    const defaultValues = parameters.map((param) => param.defaultValue !== "{}" &&
        param.defaultValue !== "..." &&
        !!param.defaultValue);
    return !defaultValues.every((value) => !value);
}
