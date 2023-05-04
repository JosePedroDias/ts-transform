import { API, FileInfo } from 'jscodeshift';

/*
- checks for first comment.
    - if same, noop
    - if prefix of other, replace
    - else prepend it to program
*/

const headerContent = `!@license
 * Copyright (c) Arkadium Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 `;

export default function transformer(file: FileInfo, api: API) {
    const j = api.jscodeshift;
    const root = j(file.source);

    const progBodyNode = j(root.get().node.program.body).get().node;
    const comment0 = progBodyNode?.comments && progBodyNode?.comments[0];

    if (comment0 && comment0.value === headerContent) {
        // console.log('ok noop');
        return file.source;
    } else if (comment0 && comment0.value.indexOf(headerContent) === 0) {
        // console.log('tweak comment');
        comment0.value = headerContent;
        return file.source;
    } else if (comment0) {
        // console.log('other comment', comment0.value);
    } else {
        // console.log('no comment');
    }

    const newComment = j.commentBlock(headerContent);
    progBodyNode.comments = progBodyNode.comments ? [newComment, ...progBodyNode.comments] : [newComment];

    return root.toSource();
}
