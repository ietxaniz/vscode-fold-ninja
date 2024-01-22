import * as vscode from 'vscode'
import { DocumentManager } from '../store/DocumentManager';
import { FoldNinjaState, WorkingMode } from '../configuration/FoldNinjaState';

import { foldCurrent } from './foldCurrent';
import { foldIntermediateCurrent } from './foldIntermediateCurrent';
import { unfoldCurrent } from './unfoldCurrent';

export const updateEditorStatus = async (forceAction:boolean) => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        return;
    }
    const docItem = DocumentManager.getItem(editor.document);
    const currentWorkingMode = FoldNinjaState.getWorkingMode();
    const shouldUpdate = docItem.checkNeedsUpdateInEditor(editor.document, currentWorkingMode);
    if (shouldUpdate || forceAction) {
        switch (currentWorkingMode) {
            case WorkingMode.INACTIVE:
                break;
            case WorkingMode.EXPANDED:
                unfoldCurrent();
                break;
            case WorkingMode.COMPACT:
                foldCurrent();
                break;
            case WorkingMode.INTERMEDIATE:
                foldIntermediateCurrent();
                break;
        }
    }
}
