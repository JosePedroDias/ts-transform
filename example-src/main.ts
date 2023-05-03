import { hello } from "./aux";

import { x } from '@a/b';
import { z, a } from '@a/b';
import { y } from '@a/b/adasd/dqwd';

function stuff() {
    const x = 2;
    const y = 'stuff2';
    console.log(y);

    console.log(hello('john'));

    return x + 1;
}
