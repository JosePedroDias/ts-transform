import { API, FileInfo } from 'jscodeshift';

import normalizePixi from './normalizePixi';
import groupPackages from './groupPackages';
import avoidRequires from './avoidRequires';

/*
runs all codemods in sequence
*/

export default function transformer(file: FileInfo, api: API) {
    file.source = normalizePixi(file, api);
    file.source = groupPackages(file, api);
    return avoidRequires(file, api);
};
