import * as vscode from 'vscode'
import { DocumentManager } from '../store/DocumentManager';
import { WorkingMode } from '../configuration/FoldNinjaState';

export const unfoldCurrent = async () => {
    const editor = vscode.window.activeTextEditor;
  if (!editor) {
    return;
  }

  const docItem = DocumentManager.getItem(editor.document);
  await docItem.getUpdateData(editor.document, WorkingMode.EXPANDED); // TODO: In this case we could remove computation...

  await vscode.commands.executeCommand("editor.unfoldAll");
}
