import { API, FileInfo } from 'jscodeshift';

/*
- if imported path in require not in whitelist, comment for addressing later
*/

const ACCEPTABLE_EXTENSIONS = ['json', 'css', 'txt'];

export default function transformer(file: FileInfo, api: API) {
    const j = api.jscodeshift;
    const root = j(file.source);


    root.find(j.CallExpression).forEach(path => {
        // console.log('***', j(path).toSource());
        const callee = (path.node.callee as any).name;

        if (callee === 'require') {
            const args = path.node.arguments.map(arg => (arg as any).value);
            const ext = args[0] && args[0].split('.').pop();
            const ok = ACCEPTABLE_EXTENSIONS.includes(ext);
            // console.log('require', args[0], ext, ok);
            path.value.comments = path.value.comments || [];
            if (!ok) {
                path.value.comments.push(j.commentBlock(' TODO replace with an import! ', false, true));
            }
        }
    });

    return root.toSource();
}
