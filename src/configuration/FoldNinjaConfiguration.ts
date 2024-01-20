import * as vscode from 'vscode';

export class FoldNinjaConfiguration {
  public static getMaxNumberOfBytes():number {
    return vscode.workspace.getConfiguration('fold-ninja').get<number>('maxNumberOfBytes', 1000000);
  }
  public static getMaxNumberOfBytesInIntenseMode():number {
    return vscode.workspace.getConfiguration('fold-ninja').get<number>('maxNumberOfBytesIntenseMode', 10000);
  }
}
