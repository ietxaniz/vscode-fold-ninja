import * as vscode from "vscode";
import * as action from "../internal/updateEditorStatus"
import { setStatus } from "../internal/toggleStatus";
import { Status } from "../configuration/config";
import { updateStatusBarItem } from "../internal/updateStatusBarItem";

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
      setStatus(Status.Compact, false);
      updateStatusBarItem();
      break;
    case "Change status to collapsing first":
      setStatus(Status.FoldFirst, false);
      updateStatusBarItem();
      break;
    case "Change status to expanding":
      setStatus(Status.Expanded, false);
      updateStatusBarItem();
      break;
    case "Change status to inactive":
      setStatus(Status.Inactive, false);
      updateStatusBarItem();
      break;
  }
};
