import { DeclarationReflection } from "typedoc";
import { MarkdownTheme } from "../../theme";
import * as Handlebars from "handlebars";
import { camelToSnakeCase } from "../../utils";

export default function (theme: MarkdownTheme) {
  Handlebars.registerHelper(
    "renderComponents",
    function (this: DeclarationReflection) {
      const items: DeclarationReflection[] = [];

      this.parent?.traverse((child) => {
        if (child instanceof DeclarationReflection) {
          if (
            child.name.includes(this.name) &&
            (child.name.includes("entity") || child.name.includes("rpc"))
          ) {
            items.push(child);
          }
        }
      });

      const md: string[] = [];

      // now need to find the depending modules
      const tables: DeclarationReflection[] = [];
      const methods: DeclarationReflection[] = [];
      const enums: DeclarationReflection[] = [];

      for (const filt of items) {
        for (const item of filt.children ?? []) {
          if (item.kindString == "Class" && !item.url?.includes("rpc"))
            tables.push(item);
          if (item.kindString == "Class" && item.url?.includes("rpc"))
            methods.push(item);
          if (item.kindString == "Enumeration") enums.push(item);
        }
      }

      if (tables.length > 0 || methods.length > 0 || enums.length > 0)
        md.push("## Components\n\n");

      // display them
      if (tables.length > 0) md.push(`### Tables\n\n`);
      for (const child2 of tables) {
        md.push(
          `\u00a0\u00a0\u00a0\u00a0[${camelToSnakeCase(
            child2.name
          )}](../../${child2.url?.replace(".md", "")})\n\n`
        );
      }
      if (methods.length > 0) md.push(`### Functions\n`);

      for (const child2 of methods) {
        md.push(
          `\u00a0\u00a0\u00a0\u00a0[${camelToSnakeCase(
            child2.name
          )}](../../${child2.url?.replace(".md", "")})\n\n`
        );
      }
      if (enums.length > 0) md.push(`### Enums\n`);

      for (const child2 of enums) {
        md.push(
          `\u00a0\u00a0\u00a0\u00a0[${camelToSnakeCase(
            child2.name
          )}](../../${child2.url?.replace(".md", "")})\n\n`
        );
      }

      return md.join("");
    }
  );
}
