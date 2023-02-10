import * as path from "path";
import {
  BindOption,
  DeclarationReflection,
  PageEvent,
  Renderer,
} from "typedoc";
import { MarkdownTheme } from "./lib/theme";
import {
  FrontMatterVars,
  getPageTitle,
  prependYAML,
} from "typedoc-plugin-markdown/dist/utils/front-matter";
import { FrontMatter } from "./types";

export class DocusaurusTheme extends MarkdownTheme {
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

  getYamlItems(page: PageEvent<DeclarationReflection>): FrontMatter {
    const pageId = this.getId(page);
    const pageTitle = this.getTitle(page);
    //const sidebarLabel = this.getSidebarLabel(page);
    //const sidebarPosition = this.getSidebarPosition(page);

    let items: FrontMatter = {
      id: pageId,
      title: pageTitle,
    };
    if (page.url === this.entryDocument && this.indexSlug) {
      items = { ...items, slug: this.indexSlug };
    }

    items = {
      ...items,
      hide_table_of_contents: true,
    };
    items = { ...items, custom_edit_url: null, displayed_sidebar: "docs" };
    if (this.frontmatter) {
      items = { ...items, ...this.frontmatter };
    }
    return {
      ...items,
    };
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
