import * as vscode from 'vscode';

import { FoldNinjaState } from "../configuration/FoldNinjaState"
import { updateStatusbarItem } from '../action/updateStatusbarItem';
import { updateEditorStatus } from '../action/updateEditorStatus';

export const onLoad = async (context: vscode.ExtensionContext) => {
    FoldNinjaState.initialize(context);
    await updateStatusbarItem();
    await updateEditorStatus(true);
}
