import * as Handlebars from "handlebars";
import {
  ParameterReflection,
  ReflectionKind,
  SignatureReflection,
} from "typedoc";
import { camelToSnakeCase, memberSymbol } from "../../utils";
import { MarkdownTheme } from "../../theme";

export default function (theme: MarkdownTheme) {
  Handlebars.registerHelper(
    "signatureTitle",
    function (this: SignatureReflection, accessor?: string, standalone = true) {
      const md: string[] = [];

      if (standalone && !theme.hideMembersSymbol) {
        md.push(`${memberSymbol(this)} `);
      }

      if (this.parent && this.parent.flags?.length > 0) {
        md.push(this.parent.flags.map((flag) => `\`${flag}\``).join(" ") + " ");
      }

      if (accessor) {
        md.push(`\`${accessor}\` **${camelToSnakeCase(this.name)}**`);
      } else if (this.name !== "__call" && this.name !== "__type") {
        md.push(`**${camelToSnakeCase(this.name)}**`);
      }

      if (this.typeParameters) {
        md.push(
          `<${this.typeParameters
            .map(
              (typeParameter) => `\`${camelToSnakeCase(typeParameter.name)}\``
            )
            .join(", ")}\\>`
        );
      }
      md.push(`(${getParameters(this.parameters)})`);

      if (this.type && !this.parent?.kindOf(ReflectionKind.Constructor)) {
        md.push(`: ${Handlebars.helpers.type.call(this.type, "object")}`);
      }
      return md.join("") + (standalone ? "\n" : "");
    }
  );
}

const getParameters = (
  parameters: ParameterReflection[] = [],
  backticks = true
) => {
  return parameters
    .map((param) => {
      const paramsmd: string[] = [];
      if (param.flags.isRest) {
        paramsmd.push("...");
      }
      const paramItem = `${camelToSnakeCase(param.name)}${
        param.flags.isOptional || param.defaultValue ? "?" : ""
      }`;
      paramsmd.push(backticks ? `\`${paramItem}\`` : paramItem);
      return paramsmd.join("");
    })
    .join(", ");
};
