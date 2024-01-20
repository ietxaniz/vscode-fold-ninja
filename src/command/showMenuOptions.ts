import * as vscode from "vscode";
import * as action from "../internal/updateEditorStatus"
import { updateStatusBarItem } from "../internal/updateStatusBarItem";
import { WorkingMode, FoldNinjaState } from "../configuration/FoldNinjaState";
import { updateEditorStatus } from '../internal/updateEditorStatus';

export const showMenuOptions = async () => {
  const options = ["Collapse", "Collapse first", "Expand", "Change status to collapsing", "Change status to collapsing first", "Change status to expanding", "Change status to inactive"];
  const selection = await vscode.window.showQuickPick(options, { placeHolder: "Choose an action" });
  if (!selection) {
    return;
  }
  switch (selection) {
    case "Collapse":
      action.foldCurrent();
      break;
    case "Collapse first":
      action.foldFirst();
      break;
    case "Expand":
      action.unfoldCurrent();
      break;
    case "Change status to collapsing":
      await FoldNinjaState.setWorkingMode(WorkingMode.COMPACT);
      updateEditorStatus(false);
      updateStatusBarItem();
      break;
    case "Change status to collapsing first":
      await FoldNinjaState.setWorkingMode(WorkingMode.INTERMEDIATE);
      updateEditorStatus(false);
      updateStatusBarItem();
      break;
    case "Change status to expanding":
      await FoldNinjaState.setWorkingMode(WorkingMode.EXPANDED);
      updateEditorStatus(false);
      updateStatusBarItem();
      break;
    case "Change status to inactive":
      await FoldNinjaState.setWorkingMode(WorkingMode.INACTIVE);
      updateEditorStatus(false);
      updateStatusBarItem();
      break;
  }
};
