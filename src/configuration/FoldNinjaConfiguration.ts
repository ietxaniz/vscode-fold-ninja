import * as vscode from 'vscode';

export class FoldNinjaConfiguration {
  public static getMaxNumberOfBytes():number {
    return vscode.workspace.getConfiguration('fold-ninja').get<number>('maxNumberOfBytes', 1000000);
  }
  public static getFoldSelection():boolean {
    return vscode.workspace.getConfiguration('fold-ninja').get<boolean>('foldSelection', false);
  }
  public static getFolded(language:string):string {
    if (language === "tree-sitter-go.wasm"){
      return vscode.workspace.getConfiguration('fold-ninja').get<string>('go-folded', 'comment,err,import,decl');
    }
    if (language === "tree-sitter-c.wasm"){
      return vscode.workspace.getConfiguration('fold-ninja').get<string>('c-folded', 'comment,import,decl,func');
    }
    if (language === "tree-sitter-tsx.wasm"){
      return vscode.workspace.getConfiguration('fold-ninja').get<string>('tsx-folded', 'import,comment,func,decl,jsx,class');
    }
    if (language === "tree-sitter-typescript.wasm"){
      return vscode.workspace.getConfiguration('fold-ninja').get<string>('typescript-folded', 'import,comment,func,decl,class');
    }
    return "";
  }
  public static getIntermediateFolded(language:string):string {
    if (language === "tree-sitter-go.wasm"){
      return vscode.workspace.getConfiguration('fold-ninja').get<string>('go-intermediate-folded', 'first-comment,err');
    }
    if (language === "tree-sitter-v.wasm"){
      return vscode.workspace.getConfiguration('fold-ninja').get<string>('c-intermediate-folded', 'first-comment');
    }
    if (language === "tree-sitter-tsx.wasm"){
      return vscode.workspace.getConfiguration('fold-ninja').get<string>('tsx-intermediate-folded', 'import,first-comment,func,decl,jsx,class');
    }
    if (language === "tree-sitter-typescript.wasm"){
      return vscode.workspace.getConfiguration('fold-ninja').get<string>('typescript-intermediate-folded', 'import,first-comment,func,decl');
    }
    return "";
  }
}
