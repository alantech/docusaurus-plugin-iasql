"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPluginOptions = void 0;
const DEFAULT_PLUGIN_OPTIONS = {
    id: "aws",
    docsRoot: "docs",
    out: "aws",
    cleanOutputDir: true,
    sidebar: {
        fullNames: false,
        categoryLabel: "Modules",
        indexLabel: undefined,
        readmeLabel: "Modules",
        position: null,
        autoConfiguration: true,
        usedSidebar: "docs",
    },
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
        sidebar: {
            ...DEFAULT_PLUGIN_OPTIONS.sidebar,
            ...opts.sidebar,
        },
    };
    return options;
};
exports.getPluginOptions = getPluginOptions;
