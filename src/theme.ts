import * as fs from "fs";
import * as path from "path";
import {
  BindOption,
  DeclarationReflection,
  PageEvent,
  ReflectionKind,
  Renderer,
  RendererEvent,
  UrlMapping,
} from "typedoc";
import { getKindPlural } from "./lib/groups";
import { MarkdownTheme } from "./lib/theme";
import {
  FrontMatterVars,
  getPageTitle,
  prependYAML,
} from "typedoc-plugin-markdown/dist/utils/front-matter";
import { FrontMatter, SidebarOptions } from "./types";
import { camelToSnakeCase } from "./lib/utils";

const CATEGORY_POSITION = {
  [ReflectionKind.Class]: 1,
  [ReflectionKind.Enum]: 2,
  [ReflectionKind.Variable]: 3,
  [ReflectionKind.Function]: 4,
  [ReflectionKind.ObjectLiteral]: 5,
};

export class DocusaurusTheme extends MarkdownTheme {
  @BindOption("sidebar")
  sidebar!: SidebarOptions;

  @BindOption("readmeTitle")
  readmeTitle!: string;

  @BindOption("indexSlug")
  indexSlug!: string;

  @BindOption("includeExtension")
  includeExtension!: string;

  @BindOption("frontmatter")
  frontmatter!: FrontMatter;

  constructor(renderer: Renderer) {
    super(renderer);

    this.listenTo(this.application.renderer, {
      [PageEvent.END]: this.onPageEnd,
      [RendererEvent.END]: this.onRendererEnd,
    });
  }

  getRelativeUrl(url: string) {
    const re = new RegExp(this.includeExtension === "true" ? "" : ".md", "g");
    const relativeUrl = super.getRelativeUrl(url).replace(re, "");
    if (path.basename(relativeUrl).startsWith("index")) {
      // always remove the extension for the index or else it creates weird paths like `../.md`
      return relativeUrl.replace("index", "").replace(".md", "");
    }
    return relativeUrl;
  }

  onPageEnd(page: PageEvent<DeclarationReflection>) {
    if (page.contents) {
      page.contents = prependYAML(
        page.contents,
        this.getYamlItems(page) as FrontMatterVars
      );
    }
  }

  onRendererEnd(renderer: RendererEvent) {
    if (this.sidebar.autoConfiguration) {
      writeCategoryYaml(
        renderer.outputDirectory,
        this.sidebar.categoryLabel,
        this.sidebar.position
      );

      Object.keys(groupUrlsByKind(this.getUrls(renderer.project))).forEach(
        (group) => {
          const kind = parseInt(group);
          const mapping = this.mappings.find((mapping) =>
            mapping.kind.includes(kind)
          );
          if (mapping) {
            if (mapping.directory != "modules") {
              writeCategoryYaml(
                renderer.outputDirectory + "/" + mapping.directory,
                getKindPlural(kind),
                CATEGORY_POSITION[kind]
              );
            }
          }
        }
      );
    }
  }

  getYamlItems(page: PageEvent<DeclarationReflection>): FrontMatter {
    const pageId = this.getId(page);
    const pageTitle = this.getTitle(page);
    //const sidebarLabel = this.getSidebarLabel(page);
    //const sidebarPosition = this.getSidebarPosition(page);
    const sidebarLabel = "Reference";
    const sidebarPosition = "0";

    let items: FrontMatter = {
      id: pageId,
      title: pageTitle,
    };
    if (page.url === this.entryDocument && this.indexSlug) {
      items = { ...items, slug: this.indexSlug };
    }

    if (this.sidebar.usedSidebar)
      items = { ...items, displayed_sidebar: this.sidebar.usedSidebar };

    if (this.sidebar.autoConfiguration) {
      if (sidebarLabel && sidebarLabel !== pageTitle) {
        items = { ...items, sidebar_label: sidebarLabel as string };
      }
      if (sidebarPosition) {
        items = { ...items, sidebar_position: parseFloat(sidebarPosition) };
      }
    }

    items = {
      ...items,
      hide_table_of_contents: true,
    };
    items = { ...items, custom_edit_url: null };
    if (this.frontmatter) {
      items = { ...items, ...this.frontmatter };
    }
    return {
      ...items,
    };
  }

  getSidebarLabel(page: PageEvent<DeclarationReflection>) {
    const indexLabel =
      this.sidebar.indexLabel ||
      (this.entryPoints.length > 1 ? "Table of Contents" : "Tables");

    if (page.url === this.entryDocument) {
      return page.url === page.project.url
        ? indexLabel
        : this.sidebar.readmeLabel;
    }

    if (page.url === this.globalsFile) {
      return indexLabel;
    }

    const fragments = page.url.split("/");
    if (fragments.length != 2) {
      return this.sidebar.fullNames
        ? camelToSnakeCase(page.model.getFullName())
        : camelToSnakeCase(page.model.name);
    } else {
      const fragments1 = fragments[1].split(".");
      if (fragments1.length == 3) {
        const fragments2 = fragments1[0].split("_");
        const name = fragments2[0] + "_" + fragments2[1];
        return name + "." + camelToSnakeCase(page.model.name);
      } else {
        return this.sidebar.fullNames
          ? camelToSnakeCase(page.model.getFullName())
          : camelToSnakeCase(page.model.name);
      }
    }
  }

  getSidebarPosition(page: PageEvent<DeclarationReflection>) {
    if (page.url === this.entryDocument) {
      return page.url === page.project.url ? "0.5" : "0";
    }
    if (page.url === this.globalsFile) {
      return "0.5";
    }
    if (page.model.getFullName().split(".").length === 1) {
      return "0";
    }
    return null;
  }

  getId(page: PageEvent) {
    return path.basename(page.url, path.extname(page.url));
  }

  getTitle(page: PageEvent) {
    const readmeTitle = this.readmeTitle || page.project.name;
    if (page.url === this.entryDocument && page.url !== page.project.url) {
      return readmeTitle;
    }
    let result = getPageTitle(page);
    const items = result.split(":");
    if (items.length == 2) return items[1].trim();
    else return result;
  }

  get mappings() {
    return super.mappings.map((mapping) => {
      return mapping;
    });
  }

  get globalsFile() {
    return "index.md";
  }
}

const writeCategoryYaml = (
  categoryPath: string,
  label: string,
  position: number | null
) => {
  const yaml: string[] = [`label: "${label}"`];
  if (position !== null) {
    yaml.push(`position: ${position}`);
  }
  if (fs.existsSync(categoryPath)) {
    fs.writeFileSync(categoryPath + "/_category_.yml", yaml.join("\n"));
  }
};

const groupUrlsByKind = (urls: UrlMapping[]) => {
  return urls.reduce(
    (r, v, i, a, k = v.model.kind) => ((r[k] || (r[k] = [])).push(v), r),
    {}
  );
};
