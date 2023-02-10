"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPluginOptions = void 0;
const DEFAULT_PLUGIN_OPTIONS = {
    id: "modules",
    docsRoot: "docs",
    out: "modules",
    cleanOutputDir: true,
    hideInPageTOC: true,
    hideBreadcrumbs: true,
    hidePageTitle: true,
    hideMembersSymbol: false,
    entryDocument: "index.md",
    plugin: ["none"],
    watch: false,
    includeExtension: true,
    indexSlug: undefined,
    theme: "docusaurus",
    frontmatter: undefined,
};
const getPluginOptions = (opts) => {
    const options = {
        ...DEFAULT_PLUGIN_OPTIONS,
        ...opts,
    };
    return options;
};
exports.getPluginOptions = getPluginOptions;
