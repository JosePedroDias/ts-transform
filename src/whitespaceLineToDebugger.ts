import { API, FileInfo } from 'jscodeshift';

/*
- replaces whitespace lines with a debugger statement with a special line comment with content `whitespace`
*/

const WHITESPACE_LINE_REGEX = /^\s*$/g;

export default function transformer(file: FileInfo, { j }: API) {
    return file.source.replace(WHITESPACE_LINE_REGEX, 'debugger;//whitespace');
}
