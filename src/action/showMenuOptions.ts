import * as vscode from "vscode";
import { foldCurrent } from "./foldCurrent";
import { foldIntermediateCurrent } from "./foldIntermediateCurrent";
import { unfoldCurrent } from "./unfoldCurrent";
import { FoldNinjaState, WorkingMode } from "../configuration/FoldNinjaState";
import { updateEditorStatus } from "./updateEditorStatus";
import { updateStatusbarItem } from "./updateStatusbarItem";

export const showMenuOptions = async () => {
    const options = [
        "Collapse current", 
        "Intermediate collapse current", 
        "Expand current", 
        "Change status to collapsing", 
        "Change status to intermediate collapsing", 
        "Change status to expanding", 
        "Change status to inactive"
    ];
    const selection = await vscode.window.showQuickPick(options, { placeHolder: "Choose an action" });

    if (!selection) {
        return;
    }

    switch (selection) {
        case "Collapse current":
            await foldCurrent(true);
            break;
        case "Intermediate collapse current":
            await foldIntermediateCurrent(true);
            break;
        case "Expand current":
            await unfoldCurrent(true);
            break;
        case "Change status to collapsing":
            await FoldNinjaState.setWorkingMode(WorkingMode.COMPACT);
            await updateEditorStatus(false);
            await updateStatusbarItem();
            break;
        case "Change status to intermediate collapsing":
            await FoldNinjaState.setWorkingMode(WorkingMode.INTERMEDIATE);
            await updateEditorStatus(false);
            await updateStatusbarItem();
            break;
        case "Change status to expanding":
            await FoldNinjaState.setWorkingMode(WorkingMode.EXPANDED);
            await updateEditorStatus(false);
            await updateStatusbarItem();
            break;
        case "Change status to inactive":
            await FoldNinjaState.setWorkingMode(WorkingMode.INACTIVE);
            await updateEditorStatus(false);
            await updateStatusbarItem();
            break;
    }

}
