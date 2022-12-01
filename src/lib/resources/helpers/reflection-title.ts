import * as Handlebars from "handlebars";
import { PageEvent, ParameterReflection } from "typedoc";
import { camelToSnakeCase, escapeChars } from "../../utils";
import { MarkdownTheme } from "../../theme";

export default function (theme: MarkdownTheme) {
  Handlebars.registerHelper(
    "reflectionTitle",
    function (this: PageEvent<any>, shouldEscape = true) {
      const title: string[] = [""];
      if (
        this.model &&
        this.model.kindString &&
        this.url !== this.project.url
      ) {
        title.push(`${this.model.kindString}: `);
      }
      if (this.url === this.project.url) {
        title.push(camelToSnakeCase(theme.indexTitle) || this.project.name);
      } else {
        title.push(
          shouldEscape
            ? escapeChars(camelToSnakeCase(this.model.name))
            : camelToSnakeCase(this.model.name)
        );
        if (this.model.typeParameters) {
          const typeParameters = this.model.typeParameters
            .map((typeParameter: ParameterReflection) => typeParameter.name)
            .join(", ");
          title.push(
            `<${camelToSnakeCase(typeParameters)}${shouldEscape ? "\\>" : ">"}`
          );
        }
      }
      return title.join("");
    }
  );
}
