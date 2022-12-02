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

      /*function pushGroup(group: ReflectionGroup, md: string[]) {
        const children = group.children.map(
          (child) =>
            `- [${camelToSnakeCase(
              escapeChars(child.name)
            )}](${Handlebars.helpers.relativeURL(child.url)})`
        );
        md.push(children.join("\n"));
      }*/

      if ((!hideInPageTOC && this.groups) || (isVisible && this.groups)) {
        if (!hideInPageTOC) {
          md.push(`## Table of contents\n\n`);
        }

        // traverse all children with parent id = 0
        for (const child of this.children ?? []) {
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
            md.push(`### ${child.name}\n\n`);

            // now need to find the depending modules
            for (const child1 of this.children ?? []) {
              if (
                child1.name.includes(child.name) &&
                (child1.name.includes("entity") || child1.name.includes("rpc"))
              ) {
                // display children
                for (const child2 of child1.children ?? []) {
                  if (!child2.url?.includes("modules")) {
                    md.push(
                      `[${camelToSnakeCase(child2.name)}](${child2.url})\n\n`
                    );
                  }
                }
              }
            }
          }
        }

        /*const headingLevel = hideInPageTOC ? `##` : `###`;
        this.groups?.forEach((group) => {
          const groupTitle = group.title;
          if (group.categories) {
            group.categories.forEach((category) => {
              md.push(`${headingLevel} ${category.title} ${groupTitle}\n\n`);
              pushGroup(category as any, md);
              md.push("\n");
            });
          } else {
            if (!hideInPageTOC || group.allChildrenHaveOwnDocument()) {
              md.push(`${headingLevel} ${groupTitle}\n\n`);
              pushGroup(group, md);
              md.push("\n");
            }
          }
        });*/
      }
      return md.length > 0 ? md.join("\n") : null;
    }
  );
}
