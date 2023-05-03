import buildTransformer from 'simple-ts-transform';

import { MyContext } from './MyContext';

import MyFileNameInserter from './MyFileNameInserter';
import NumberToString from './NumberToString';

const transformer = buildTransformer(
    MyContext, [
        // MyFileNameInserter,
        NumberToString,
    ]
);

export default transformer;
