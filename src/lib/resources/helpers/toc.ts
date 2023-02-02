import * as Handlebars from "handlebars";
import { DeclarationReflection, ProjectReflection } from "typedoc";
import { MarkdownTheme } from "../../theme";
import { camelToSnakeCase } from "../../utils";

export default function (theme: MarkdownTheme) {
  Handlebars.registerHelper(
    "toc",
    function (this: ProjectReflection | DeclarationReflection) {
      const md: string[] = [];

      const { hideInPageTOC } = theme;

      const isVisible = this.groups?.some((group) =>
        group.allChildrenHaveOwnDocument()
      );

      if ((!hideInPageTOC && this.groups) || (isVisible && this.groups)) {
        if (!hideInPageTOC) {
          md.push(`## Table of contents\n\n`);
        }

        let sortedChildren = this.children ?? [];
        sortedChildren.sort(function (x, y) {
          return x.name == "iasql_functions"
            ? -1
            : y.name == "iasql_functions"
            ? 1
            : 0;
        });
        // traverse all children with parent id = 0
        for (const child of sortedChildren) {
          if (
            child.parent?.id == 0 &&
            child.kind == 2 &&
            !child.name.includes("/") &&
            !child.name.includes("ecs_simplified") &&
            !child.name.includes("index") &&
            !child.name.includes("interfaces") &&
            !child.name.includes("subscribers")
          ) {
            // it is a module, print it
            md.push(`### [${child.name}](${child.url})\n\n`);

            // now need to find the depending modules
            const tables: DeclarationReflection[] = [];
            const methods: DeclarationReflection[] = [];
            const enums: DeclarationReflection[] = [];

            const filtered = sortedChildren?.filter(
              (x) =>
                x.name.includes(child.name) &&
                (x.name.includes("entity") || x.name.includes("rpc"))
            );

            for (const filt of filtered) {
              for (const item of filt.children ?? []) {
                if (item.kindString == "Class" && !item.url?.includes("rpc"))
                  tables.push(item);
                if (item.kindString == "Class" && item.url?.includes("rpc"))
                  methods.push(item);
                if (item.kindString == "Enumeration") enums.push(item);
              }
            }

            // display them
            if (tables.length > 0) md.push("&nbsp;&nbsp;**Tables**\n");
            for (const child2 of tables) {
              md.push(
                `&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[${camelToSnakeCase(
                  child2.name
                )}](${child2.url})\n\n`
              );
            }
            if (methods.length > 0) md.push("&nbsp;&nbsp;**Functions**\n");

            for (const child2 of methods) {
              md.push(
                `&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[${camelToSnakeCase(
                  child2.name
                )}](${child2.url})\n\n`
              );
            }
            if (enums.length > 0) md.push("&nbsp;&nbsp;**Enums**\n");

            for (const child2 of enums) {
              md.push(
                `&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[${camelToSnakeCase(
                  child2.name
                )}](${child2.url})\n\n`
              );
            }
          }
        }
      }
      return md.length > 0 ? md.join("\n") : null;
    }
  );
}
