import * as Handlebars from "handlebars";
import { PageEvent } from "typedoc";
import { MarkdownTheme } from "../../theme";
import { camelToSnakeCase, escapeChars } from "../../utils";

export default function (theme: MarkdownTheme) {
  Handlebars.registerHelper("breadcrumbs", function (this: PageEvent) {
    const { entryPoints, project, readme } = theme;

    if (!project) {
      return "";
    }

    const hasReadmeFile = !readme.endsWith("none");
    const breadcrumbs: string[] = [];
    const globalsName = entryPoints.length > 1 ? "Modules" : "Tables";
    breadcrumbs.push(project.name);
    if (hasReadmeFile) {
      breadcrumbs.push(globalsName);
    }
    const breadcrumbsOut = breadcrumb(this, this.model, breadcrumbs);
    return breadcrumbsOut;
  });
}

function breadcrumb(page: PageEvent, model: any, md: string[]) {
  if (model && model.parent) {
    breadcrumb(page, model.parent, md);
    if (model.url) {
      md.push(`${escapeChars(camelToSnakeCase(model.name))}`);
    }
  }
  return md.join(" / ");
}
