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

// '32px monospace' => [32, monospace]
const FONT_RGX = /([0-9]+)px (.+)/;

export default function transformer(file: FileInfo, { j }: API) {
    const root = j(file.source);

    let isDirty = false;

    const onCtorArguments = (neNode: NewExpression) => {
        if (neNode.arguments.length >= 2) {
            if (j.ObjectExpression.check(neNode.arguments[1])) {
                const objExpNode = <ObjectExpression> neNode.arguments[1];

                const objPropFontNode = <ObjectProperty> j(objExpNode).find(j.ObjectProperty, { key: { name: 'font' }}).paths()[0]?.value;
                if (objPropFontNode && j.StringLiteral.check(objPropFontNode.value)) {
                    const fontStringValueNode = <StringLiteral> objPropFontNode.value;
                    const m = FONT_RGX.exec(fontStringValueNode.value);

                    const fontSizeValue = parseInt(m[1], 10);
                    const sizeProp = j.objectProperty(
                        j.identifier('fontSize'),
                        j.numericLiteral(fontSizeValue)
                    );
                    objExpNode.properties.push(sizeProp);
                    
                    const fontNameValue = m[2];
                    const nameProp = j.objectProperty(
                        j.identifier('fontName'),
                        j.stringLiteral(fontNameValue)
                    );
                    objExpNode.properties.push(nameProp);

                    isDirty = true;

                    j(objExpNode).find(j.ObjectProperty, { key: { name: 'font' }}).remove();
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
                    // console.log('TODO member', j(path).toSource());
                    onCtorArguments(neNode);
                }
            }
        } else if (j.Identifier.check(neNode.callee)) {
            const calleeNode = <Identifier>(neNode.callee);
            if (calleeNode.name === CLASS_NAME) {
                // console.log('TODO non-member', j(path).toSource());
                onCtorArguments(neNode);
            }
        }

        // console.log('***', j(path).toSource());
    });

    return isDirty ? root.toSource() : file.source;;
}
