import { ContainerReflection, DeclarationReflection, PageEvent, ProjectReflection, Reflection, ReflectionKind, Renderer, RendererEvent, Theme, UrlMapping } from "typedoc";
import { NavigationItem } from "./navigation-item";
export declare class MarkdownTheme extends Theme {
    allReflectionsHaveOwnDocument: boolean;
    entryDocument: string;
    entryPoints: string[];
    filenameSeparator: string;
    hideBreadcrumbs: boolean;
    hideInPageTOC: boolean;
    hidePageTitle: boolean;
    hideMembersSymbol: boolean;
    includes: string;
    indexTitle: string;
    mediaDirectory: string;
    namedAnchors: boolean;
    readme: string;
    out: string;
    publicPath: string;
    preserveAnchorCasing: boolean;
    project?: ProjectReflection;
    reflection?: DeclarationReflection;
    location: string;
    anchorMap: Record<string, string[]>;
    static URL_PREFIX: RegExp;
    constructor(renderer: Renderer);
    render(page: PageEvent<Reflection>): string;
    getOption(key: string): unknown;
    getUrls(project: ProjectReflection): UrlMapping<any>[];
    buildUrls(reflection: DeclarationReflection, urls: UrlMapping[]): UrlMapping[];
    toUrl(mapping: any, reflection: DeclarationReflection): string;
    getUrl(reflection: Reflection, relative?: Reflection): string;
    applyAnchorUrl(reflection: Reflection, container: Reflection, isSymbol?: boolean): void;
    toAnchorRef(reflectionId: string): string;
    getRelativeUrl(absolute: string): string;
    getReflectionTemplate(): (pageEvent: PageEvent<ContainerReflection>) => string;
    getReflectionMemberTemplate(): (pageEvent: PageEvent<ContainerReflection>) => string;
    getIndexTemplate(): (pageEvent: PageEvent<ContainerReflection>) => string;
    getNavigation(project: ProjectReflection): NavigationItem;
    get mappings(): {
        kind: ReflectionKind[];
        isLeaf: boolean;
        directory: string;
        template: (pageEvent: PageEvent<ContainerReflection>) => string;
    }[];
    /**
     * Triggered before the renderer starts rendering a project.
     *
     * @param event  An event object describing the current render operation.
     */
    protected onBeginRenderer(event: RendererEvent): void;
    /**
     * Triggered before a document will be rendered.
     *
     * @param page  An event object describing the current render operation.
     */
    protected onBeginPage(page: PageEvent): void;
    get globalsFile(): string;
}
