import { API, FileInfo } from 'jscodeshift';

/*
- restores original whitespace lines
*/

const WHITESPACE_LINE_REGEX = /debugger;\/\/whitespace/;

export default function transformer(file: FileInfo, { j }: API) {
    return file.source.replace(WHITESPACE_LINE_REGEX, '\n');
}
