import * as vscode from "vscode";
import * as path from "path";
import { ConfigType, Status } from "../configuration/config";
import { foldGolangErrCheckerCode } from "./fold/foldGolangErrCheckerCode"
import { StatusManager } from "./StatusManager";

export const unfoldCurrent = async () => {
  await vscode.commands.executeCommand("editor.unfoldAll");
};

export const foldFirst = async () => {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    return;
  }

  const fileName = editor.document.fileName;
  const foldingRanges = StatusManager.getInstance().getFoldingRanges(fileName);
  if (foldingRanges.length > 0) {
    const firstFoldingRange = foldingRanges[0];

    editor.selection = new vscode.Selection(firstFoldingRange.start, 0, firstFoldingRange.start, 0);
    await vscode.commands.executeCommand('editor.fold');
    editor.selection = new vscode.Selection(0, 0, 0, 0);
  }
}

export const foldCurrent = async () => {
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

export const updateEditorStatus = async (config: ConfigType, forceAction:boolean) => {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    return;
  }
  const currentFileName = editor.document.fileName;
  const currentFileContent = editor.document.getText();
  const shouldUpdate = StatusManager.getInstance().update(currentFileName, currentFileContent, config.status);
  if (shouldUpdate || forceAction) {
    switch (config.status) {
      case Status.Inactive:
        break;
      case Status.Expanded:
        unfoldCurrent();
        break;
      case Status.Compact:
        foldCurrent();
        break;
      case Status.FoldFirst:
        foldFirst();
        break;
      default:
        break;
    }
  }
};
