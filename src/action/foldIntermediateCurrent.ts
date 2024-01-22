import * as vscode from 'vscode'
import { DocumentManager } from '../store/DocumentManager';
import { WorkingMode } from '../configuration/FoldNinjaState';

export const foldIntermediateCurrent = async () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      return;
    }

    const docItem = DocumentManager.getItem(editor.document);
    const ranges = await docItem.getUpdateData(editor.document, WorkingMode.COMPACT);
    const currentSelection = editor.selection;
    for (let i=0; i<ranges.length; i++) {
        const range = ranges[i];
        if (range.isFirstComment) {
            const selectionStartLine = currentSelection.start.line;
            const selectionEndLine = currentSelection.end.line;
            if (selectionEndLine < range.start || selectionStartLine > range.end) {
                const newSelection = new vscode.Selection(range.start, 0, range.end, editor.document.lineAt(range.end).text.length);
                editor.selection = newSelection;
                await vscode.commands.executeCommand("editor.createFoldingRangeFromSelection");
            }
            break;
        }
    }
    editor.selection = currentSelection;
}
