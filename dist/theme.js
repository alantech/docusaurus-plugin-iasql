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
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const typedoc_1 = require("typedoc");
const groups_1 = require("./lib/groups");
const theme_1 = require("./lib/theme");
const front_matter_1 = require("typedoc-plugin-markdown/dist/utils/front-matter");
const utils_1 = require("./lib/utils");
const CATEGORY_POSITION = {
    [typedoc_1.ReflectionKind.Class]: 1,
    [typedoc_1.ReflectionKind.Enum]: 2,
    [typedoc_1.ReflectionKind.Variable]: 3,
    [typedoc_1.ReflectionKind.Function]: 4,
    [typedoc_1.ReflectionKind.ObjectLiteral]: 5,
};
class DocusaurusTheme extends theme_1.MarkdownTheme {
    constructor(renderer) {
        super(renderer);
        this.listenTo(this.application.renderer, {
            [typedoc_1.PageEvent.END]: this.onPageEnd,
            [typedoc_1.RendererEvent.END]: this.onRendererEnd,
        });
    }
    getRelativeUrl(url) {
        const re = new RegExp(this.includeExtension === "true" ? "" : ".md", "g");
        const relativeUrl = super.getRelativeUrl(url).replace(re, "");
        if (path.basename(relativeUrl).startsWith("index")) {
            return relativeUrl.replace("index", "").replace(".md", "");
        }
        return relativeUrl;
    }
    onPageEnd(page) {
        if (page.contents) {
            page.contents = (0, front_matter_1.prependYAML)(page.contents, this.getYamlItems(page));
        }
    }
    onRendererEnd(renderer) {
        if (this.sidebar.autoConfiguration) {
            writeCategoryYaml(renderer.outputDirectory, this.sidebar.categoryLabel, this.sidebar.position);
            Object.keys(groupUrlsByKind(this.getUrls(renderer.project))).forEach((group) => {
                const kind = parseInt(group);
                const mapping = this.mappings.find((mapping) => mapping.kind.includes(kind));
                if (mapping) {
                    if (mapping.directory != "modules") {
                        writeCategoryYaml(renderer.outputDirectory + "/" + mapping.directory, (0, groups_1.getKindPlural)(kind), CATEGORY_POSITION[kind]);
                    }
                }
            });
        }
    }
    getYamlItems(page) {
        const pageId = this.getId(page);
        const pageTitle = this.getTitle(page);
        const sidebarLabel = "Reference";
        const sidebarPosition = "0";
        let items = {
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
                items = { ...items, sidebar_label: sidebarLabel };
            }
            if (sidebarPosition) {
                items = { ...items, sidebar_position: parseFloat(sidebarPosition) };
            }
        }
        if (page.url === page.project.url && this.entryPoints.length > 1) {
            items = { ...items, hide_table_of_contents: true };
        }
        items = { ...items, custom_edit_url: null };
        if (this.frontmatter) {
            items = { ...items, ...this.frontmatter };
        }
        return {
            ...items,
        };
    }
    getSidebarLabel(page) {
        const indexLabel = this.sidebar.indexLabel ||
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
                ? (0, utils_1.camelToSnakeCase)(page.model.getFullName())
                : (0, utils_1.camelToSnakeCase)(page.model.name);
        }
        else {
            const fragments1 = fragments[1].split(".");
            if (fragments1.length == 3) {
                const fragments2 = fragments1[0].split("_");
                const name = fragments2[0] + "_" + fragments2[1];
                return name + "." + (0, utils_1.camelToSnakeCase)(page.model.name);
            }
            else {
                return this.sidebar.fullNames
                    ? (0, utils_1.camelToSnakeCase)(page.model.getFullName())
                    : (0, utils_1.camelToSnakeCase)(page.model.name);
            }
        }
    }
    getSidebarPosition(page) {
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
    (0, typedoc_1.BindOption)("sidebar")
], DocusaurusTheme.prototype, "sidebar", void 0);
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
const writeCategoryYaml = (categoryPath, label, position) => {
    const yaml = [`label: "${label}"`];
    if (position !== null) {
        yaml.push(`position: ${position}`);
    }
    if (fs.existsSync(categoryPath)) {
        fs.writeFileSync(categoryPath + "/_category_.yml", yaml.join("\n"));
    }
};
const groupUrlsByKind = (urls) => {
    return urls.reduce((r, v, i, a, k = v.model.kind) => ((r[k] || (r[k] = [])).push(v), r), {});
};
