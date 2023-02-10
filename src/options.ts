import { PluginOptions } from "./types";

const DEFAULT_PLUGIN_OPTIONS: PluginOptions = {
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

export const getPluginOptions = (
  opts: Partial<PluginOptions>
): PluginOptions => {
  const options = {
    ...DEFAULT_PLUGIN_OPTIONS,
    ...opts,
  };
  return options;
};
