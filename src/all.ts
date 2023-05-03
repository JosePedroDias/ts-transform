import { API, FileInfo } from 'jscodeshift';

import normalizePixi from './normalizePixi';
import groupPackages from './groupPackages';

/*
runs both codemods in sequence
*/

export default function transformer(file: FileInfo, api: API) {
    file.source = normalizePixi(file, api);
    return groupPackages(file, api);
};
