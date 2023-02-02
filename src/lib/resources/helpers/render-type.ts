import { DeclarationReflection, ParameterReflection } from "typedoc";
import { MarkdownTheme } from "../../theme";
import * as Handlebars from "handlebars";

export default function (theme: MarkdownTheme) {
  Handlebars.registerHelper(
    "renderType",
    function (this: ParameterReflection | DeclarationReflection) {
      // get type from url and class
      let type, color;
      if (this.kindString == "Class") {
        if (this.url?.toLowerCase().includes("rpcs")) {
          type = "Function";
          color = "95CE3D";
        } else {
          type = "Table";
          color = "3D95CE";
        }
      } else if (this.kindString == "Enumeration") {
        type = "Enum";
        color = "CD3C94";
      } else if (this.kindString == "Module") {
        type = "module";
        color = "CE3D3D";
      }

      return `![${type}](https://img.shields.io/static/v1?label=&message=${type}&color=${color}&style=for-the-badge)`;
    }
  );
}
