import * as vscode from "vscode";
import * as path from "path";
import { ConfigType, Status } from "../configuration/config";
import { foldGolangErrCheckerCode } from "./fold/foldGolangErrCheckerCode"

const unfoldCurrent = async () => {
  await vscode.commands.executeCommand("editor.unfoldAll");
};

const foldCurrent = async () => {
  await vscode.commands.executeCommand("editor.foldAllBlockComments");
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    return;
  }
  if (editor.document.uri.scheme !== "file") {
    return;
  }
  const fileExtension = path.extname(editor.document.uri.fsPath);
  if (fileExtension.toLowerCase() !== ".go") {
    return;
  }
  
  await foldGolangErrCheckerCode(editor);

};

export const updateEditorStatus = async (config: ConfigType) => {
  switch (config.status) {
    case Status.Inactive:
      break;
    case Status.Expanded:
      unfoldCurrent();
      break;
    case Status.Compact:
      foldCurrent();
      break;
    default:
      break;
  }
};
