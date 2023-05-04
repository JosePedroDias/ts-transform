import { API, FileInfo, MemberExpression, Identifier, NewExpression, ObjectExpression, StringLiteral, ObjectProperty } from 'jscodeshift';

const CLASS_NAME = "BitmapText";

/*
from:
new BitmapText('asd', { font: '32px sans-serif' });
to:
new BitmapText('asd', { fontSize: 32, fontName: 'sans-serif' });

npm run codemod -- -t dist/all.js /Users/josepedrodias/Work/msft-jewel-plus/src/game/Views/Effects/ScoreMessageTextView.ts

- 
/Users/josepedrodias/Work/msft-jewel-plus/src/game/Views/Effects/ScoreMessageTextView.ts
/Users/josepedrodias/Work/msft-jewel-plus/src/game/Views/GameScreen/ScorePanelView.ts
*/

export default function transformer(file: FileInfo, { j }: API) {
    const root = j(file.source);

    let isDirty = false;

    const onCtorArguments = (neNode: NewExpression) => {
        if (neNode.arguments.length >= 2) { // #0: text, #1: options
            if (j.ObjectExpression.check(neNode.arguments[1])) {
                const objPropNode = <ObjectProperty> j(neNode).find(j.ObjectProperty, { key: { name: 'font' }}).paths()[0]?.value;

                if (objPropNode && j.StringLiteral.check(objPropNode.value)) {
                    const fontStringValueNode = <StringLiteral> objPropNode.value;
                    console.log('fontStringValueNode', fontStringValueNode.value);

                    // TODO remove font prop
                    // TODO grab values for name and size
                    // TODO create fontName prod
                    // TODO create fontSize prod
                }
            }
        }
    }

    root.find(j.NewExpression).forEach(path => {
        const neNode = path.node;

        if (j.MemberExpression.check(neNode.callee)) {
            const calleeNode = <MemberExpression> neNode.callee;
            if (j.Identifier.check(calleeNode.property)) {
                const calleeIdentNode = <Identifier> calleeNode.property;
                if (calleeIdentNode.name === CLASS_NAME) {
                    console.log('TODO member', j(path).toSource());
                    onCtorArguments(neNode);
                }
            }
        } else if (j.Identifier.check(neNode.callee)) {
            const calleeNode = <Identifier>(neNode.callee);
            if (calleeNode.name === CLASS_NAME) {
                console.log('TODO non-member', j(path).toSource());
                onCtorArguments(neNode);
            }
        }

        // console.log('***', j(path).toSource());
    });

    return isDirty ? root.toSource() : file.source;;
}
