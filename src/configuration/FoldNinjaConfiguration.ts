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
    return "";
  }
  public static getIntermediateFolded(language:string):string {
    if (language === "tree-sitter-go.wasm"){
      return vscode.workspace.getConfiguration('fold-ninja').get<string>('go-intermediate-folded', 'first-comment,err');
    }
    return "";
  }
}
