"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocusaurusTheme = void 0;
const path = __importStar(require("path"));
const typedoc_1 = require("typedoc");
const theme_1 = require("./lib/theme");
const front_matter_1 = require("typedoc-plugin-markdown/dist/utils/front-matter");
class DocusaurusTheme extends theme_1.MarkdownTheme {
    constructor(renderer) {
        super(renderer);
        this.listenTo(this.application.renderer, {
            [typedoc_1.PageEvent.END]: this.onPageEnd,
        });
    }
    getRelativeUrl(url) {
        const re = new RegExp(this.includeExtension === "true" ? "" : ".md", "g");
        const relativeUrl = super.getRelativeUrl(url).replace(re, "");
        if (path.basename(relativeUrl).startsWith("index")) {
            // always remove the extension for the index or else it creates weird paths like `../.md`
            return relativeUrl.replace("index", "").replace(".md", "");
        }
        return relativeUrl;
    }
    onPageEnd(page) {
        if (page.contents) {
            page.contents = (0, front_matter_1.prependYAML)(page.contents, this.getYamlItems(page));
        }
    }
    getYamlItems(page) {
        const pageId = this.getId(page);
        const pageTitle = this.getTitle(page);
        //const sidebarLabel = this.getSidebarLabel(page);
        //const sidebarPosition = this.getSidebarPosition(page);
        let items = {
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
    getId(page) {
        return path.basename(page.url, path.extname(page.url));
    }
    getTitle(page) {
        const readmeTitle = this.readmeTitle || page.project.name;
        if (page.url === this.entryDocument && page.url !== page.project.url) {
            return readmeTitle;
        }
        let result = (0, front_matter_1.getPageTitle)(page);
        const items = result.split(":");
        if (items.length == 2)
            return items[1].trim();
        else
            return result;
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
__decorate([
    (0, typedoc_1.BindOption)("readmeTitle")
], DocusaurusTheme.prototype, "readmeTitle", void 0);
__decorate([
    (0, typedoc_1.BindOption)("indexSlug")
], DocusaurusTheme.prototype, "indexSlug", void 0);
__decorate([
    (0, typedoc_1.BindOption)("includeExtension")
], DocusaurusTheme.prototype, "includeExtension", void 0);
__decorate([
    (0, typedoc_1.BindOption)("frontmatter")
], DocusaurusTheme.prototype, "frontmatter", void 0);
exports.DocusaurusTheme = DocusaurusTheme;
