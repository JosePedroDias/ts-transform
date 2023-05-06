import { API, FileInfo } from 'jscodeshift';

import globalToExplicitImport from './globalToExplicitImport';
import groupPackages from './groupPackages';
import avoidRequires from './avoidRequires';
import changeConstructorCall from './changeConstructorCall';
import addHeaderComment from './addHeaderComment';

const TRANSFORMS = [
    //globalToExplicitImport, // used to make sure pixi.js symbols are ESM imported
    //avoidRequires, // if require is used for uses other than inlining assets, comment for later fixing
    groupPackages, // major refactoring and organizing of imports
    //changeConstructorCall, // change BitmapText options from font to fontSize and fontName
    //addHeaderComment, // legalese
];

/*
runs all codemods in sequence
*/

export default function transformer(file: FileInfo, api: API, options: any) {
    const trans = TRANSFORMS.slice();
    let nextTrans;
    while (nextTrans = trans.shift()) {
        file.source = nextTrans(file, api, options);
    }
    return file.source;
};
