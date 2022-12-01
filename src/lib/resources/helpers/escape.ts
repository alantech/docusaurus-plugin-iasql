import * as Handlebars from "handlebars";
import { camelToSnakeCase, escapeChars } from "../../utils";

export default function () {
  Handlebars.registerHelper("escape", function (str: string) {
    return escapeChars(str);
  });
  Handlebars.registerHelper("camelToSnakeCase", function (str: string) {
    return camelToSnakeCase(str);
  });
}
