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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const path = __importStar(require("path"));
const typedoc_1 = require("typedoc");
const typedoc_plugin_markdown_1 = require("typedoc-plugin-markdown");
const options_1 = require("./options");
const render_1 = require("./render");
const theme_1 = require("./theme");
// store list of plugin ids when running multiple instances
const apps = [];
function pluginDocusaurus(context, opts) {
    return {
        name: "docusaurus-plugin-iasql",
        async loadContent() {
            if (opts.id && !apps.includes(opts.id)) {
                apps.push(opts.id);
                const { siteDir } = context;
                const options = (0, options_1.getPluginOptions)(opts);
                const outputDir = path.resolve(siteDir, options.docsRoot, options.out);
                if (opts.cleanOutputDir) {
                    (0, render_1.removeDir)(outputDir);
                }
                const app = new typedoc_1.Application();
                app.renderer.defineTheme("docusaurus", theme_1.DocusaurusTheme);
                (0, typedoc_plugin_markdown_1.load)(app);
                (0, render_1.bootstrap)(app, options);
                const project = app.convert();
                // if project is undefined typedoc has a problem - error logging will be supplied by typedoc.
                if (!project) {
                    return;
                }
                if (options.watch) {
                    app.convertAndWatch(async (project) => {
                        await app.generateDocs(project, outputDir);
                    });
                }
                else {
                    await app.generateDocs(project, outputDir);
                }
            }
        },
    };
}
exports.default = pluginDocusaurus;
