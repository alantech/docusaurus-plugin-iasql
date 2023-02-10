import { DeclarationReflection, PageEvent, Renderer } from "typedoc";
import { MarkdownTheme } from "./lib/theme";
import { FrontMatter } from "./types";
export declare class DocusaurusTheme extends MarkdownTheme {
    readmeTitle: string;
    indexSlug: string;
    includeExtension: string;
    frontmatter: FrontMatter;
    constructor(renderer: Renderer);
    getRelativeUrl(url: string): string;
    onPageEnd(page: PageEvent<DeclarationReflection>): void;
    getYamlItems(page: PageEvent<DeclarationReflection>): FrontMatter;
    getId(page: PageEvent): string;
    getTitle(page: PageEvent): any;
    get mappings(): {
        kind: import("typedoc").ReflectionKind[];
        isLeaf: boolean;
        directory: string;
        template: (pageEvent: PageEvent<import("typedoc").ContainerReflection>) => string;
    }[];
    get globalsFile(): string;
}
