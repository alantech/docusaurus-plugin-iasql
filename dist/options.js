"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPluginOptions = void 0;
const DEFAULT_PLUGIN_OPTIONS = {
    id: "default",
    docsRoot: "docs",
    out: "sql",
    cleanOutputDir: true,
    sidebar: {
        fullNames: false,
        categoryLabel: "SQL reference",
        indexLabel: undefined,
        readmeLabel: "Introduction",
        position: null,
        autoConfiguration: true,
    },
    hideInPageTOC: true,
    hideBreadcrumbs: true,
    hidePageTitle: true,
    hideMembersSymbol: false,
    entryDocument: "sql_reference.md",
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
