import { API, FileInfo, Identifier, StringLiteral } from 'jscodeshift';

/*
- if imported path in require not in whitelist, comment for addressing later
*/

const ACCEPTABLE_PACKAGES = ['arenax-game-api'];
const ACCEPTABLE_EXTENSIONS = ['json', 'css', 'txt'];

export default function transformer(file: FileInfo, { j }: API) {
    const root = j(file.source);

    let isDirty = false;

    root.find(j.CallExpression).forEach(path => {
        // console.log('***', j(path).toSource());

        const callNode = path.node;

        if (!j.Identifier.check(callNode.callee)) return;
        const calleeNode = <Identifier> callNode.callee;
        const calleeName = calleeNode.name;
        if (calleeName !== 'require') return;

        if (!j.StringLiteral.check(callNode.arguments[0])) return;        
        const arg0Node = <StringLiteral> callNode.arguments[0];
        const arg0 = arg0Node.value;

        if (ACCEPTABLE_PACKAGES.includes(arg0)) return;
        const ext = arg0.split('.').pop();
        if (ACCEPTABLE_EXTENSIONS.includes(ext)) return;

        isDirty = true;
        let comments = path.value.comments;
        if (!comments) { 
            comments = [];
            path.value.comments = comments;
        }
        if (!comments) comments = [];
        comments.push(j.commentBlock(' TODO: replace with an import! ', false, true));
    });

    return isDirty ? root.toSource() : file.source;;
}
