import * as vscode from "vscode";
import { DocumentManager } from "../store/DocumentManager";
import { FoldNinjaState, WorkingMode } from "../configuration/FoldNinjaState";

import { foldCurrent } from "./foldCurrent";
import { foldIntermediateCurrent } from "./foldIntermediateCurrent";
import { unfoldCurrent } from "./unfoldCurrent";

export const updateEditorStatus = async (forceAction: boolean) => {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    return;
  }
  const currentWorkingMode = FoldNinjaState.getWorkingMode();
  switch (currentWorkingMode.mode) {
    case WorkingMode.INACTIVE:
      break;
    case WorkingMode.EXPANDED:
      unfoldCurrent(false);
      break;
    case WorkingMode.COMPACT:
      foldCurrent(false);
      break;
    case WorkingMode.INTERMEDIATE:
      foldIntermediateCurrent(false);
      break;
  }
};
