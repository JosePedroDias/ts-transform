import buildTransformer from 'simple-ts-transform';

import { MyContext } from './MyContext';

//import MyFileNameInserter from './MyFileNameInserter';
//import NumberToString from './NumberToString';
//import OnlyRootImports from './OnlyRootImports';
// import RenameImportedPackages from './RenameImportedPackages'; // TODO W/ CFG
//import ChangeImportSymbols from './ChangeImportSymbols'; // TODO W/ CFG
import GroupImports from './GroupImports'; // TO END

const transformer = buildTransformer(
    MyContext, [
        //MyFileNameInserter,
        //NumberToString,
        //OnlyRootImports,
        //RenameImportedPackages,
        //ChangeImportSymbols,
        GroupImports,
    ]
);

export default transformer;
