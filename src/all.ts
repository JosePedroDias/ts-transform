import { API, FileInfo } from 'jscodeshift';

import globalToExplicitImport from './globalToExplicitImport';
import groupPackages from './groupPackages';
import avoidRequires from './avoidRequires';
import addHeaderComment from './addHeaderComment';

const TRANSFORMS = [
    globalToExplicitImport, // used to make sure pixi.js symbols are ESM imported
    //avoidRequires, // if require is used for uses other than inlining assets, comment for later fixing
    //groupPackages,
    //addHeaderComment,
];

/*
runs all codemods in sequence
*/

export default function transformer(file: FileInfo, api: API) {
    const trans = TRANSFORMS.slice();
    let nextTrans;
    while (nextTrans = trans.shift()) {
        file.source = nextTrans(file, api);
    }
    return file.source;
};
