import { API, FileInfo } from 'jscodeshift';

/*
- simplifies package names (drop paths)
- group symbols of the same package and sort them alphabetically
*/

function simplifyPackageName(s: string) {
  if (s[0] !== '@') return s;
  let parts = s.split('/');
  if (parts.length > 2) {
    parts = parts.slice(0, 2);
  }
  return parts.join('/');
}

export default function transformer(file: FileInfo, api: API) {
  const j = api.jscodeshift;
  const root = j(file.source);

  const imports = new Map<string, string[]>();

  //root.findVariableDeclarators('x').renameTo('xyz');

  root.find(j.ImportDeclaration).forEach((path) => {
    const packageName = simplifyPackageName(path.node.source.value as string);
    let symbols = path.node.specifiers.map(spec => spec.local.name);

    let prevSymbols: string[] | undefined = imports.get(packageName);
    if (prevSymbols) {
      symbols = [...prevSymbols, ...symbols];
    }
    imports.set(packageName, symbols);

    j(path).remove();
  });

  // console.log(imports);

  const entries = imports.entries();
  for (const [packageName, symbols] of entries) {
    symbols.sort();
    const decl = j.importDeclaration(
      symbols.map(sym => j.importSpecifier(j.identifier(sym), j.identifier(sym))),
      j.stringLiteral(packageName)
    );

    let child0;
    root.find(j.Statement).forEach((path) => {
      if (!child0) child0 = path;
    });

    j(child0).insertBefore(decl);

    //console.log('0', root.at(0));
    //const ch0 = root.findJSXElements();
    //console.log(ch0);
    //root.childNodes()[0].insertBefore(decl);
    //root.at(0).insertBefore(decl);
  }

    //console.log('*****', j(path).toSource() );

    //console.log(path.node.source.value);
    //path.node.source.value += "x";
    //console.log(path.node.specifiers.map(spec => spec.local.name ));
    //path.node.specifiers.forEach(spec => { spec.local.name += 'z'; });
    
  return root.toSource();
}