import * as vscode from 'vscode'
import { DocumentManager } from '../store/DocumentManager';
import { FoldNinjaState, WorkingMode } from '../configuration/FoldNinjaState';

export const foldCurrent = async (force: boolean) => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      return;
    }

    const docItem = DocumentManager.getItem(editor.document);
    const { timestamp } = FoldNinjaState.getWorkingMode();
    await docItem.updateDocument(WorkingMode.COMPACT, timestamp, force);
}
