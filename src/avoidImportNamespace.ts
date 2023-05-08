import { API, FileInfo } from 'jscodeshift';

/*
- for every `import { * as x } from 'z'; add block comment
*/

export default function transformer(file: FileInfo, { j }: API) {
    const root = j(file.source);

    let isDirty = false;

    root.find(j.ImportNamespaceSpecifier).forEach(path => {
        // console.log('***', j(path).toSource());

        isDirty = true;
        let comments = path.node.comments;
        if (!comments) { 
            comments = [];
            path.node.comments = comments;
        }
        comments.push(j.commentBlock(' TODO: avoid namespace import! ', false, true));
    });

    return isDirty ? root.toSource() : file.source;;
}
