import { MarkdownTheme } from '../../theme';
export default function (theme: MarkdownTheme): void;
/**
 * Load the given file and return its contents.
 *
 * @param file  The path of the file to read.
 * @returns The files contents.
 */
export declare function readFile(file: string): string;
