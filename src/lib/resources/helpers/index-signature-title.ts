import * as Handlebars from "handlebars";
import { SignatureReflection } from "typedoc";
import { camelToSnakeCase } from "../../utils";

export default function () {
  Handlebars.registerHelper(
    "indexSignatureTitle",
    function (this: SignatureReflection) {
      const md = ["▪"];
      const parameters = this.parameters
        ? this.parameters.map((parameter) => {
            return `${camelToSnakeCase(
              parameter.name
            )}: ${Handlebars.helpers.type.call(parameter.type)}`;
          })
        : [];
      md.push(
        `\[${parameters.join("")}\]: ${Handlebars.helpers.type.call(this.type)}`
      );
      return md.join(" ");
    }
  );
}
