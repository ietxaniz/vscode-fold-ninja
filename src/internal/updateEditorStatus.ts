import * as vscode from "vscode";
import * as path from "path";
import { foldGolangErrCheckerCode } from "./fold/foldGolangErrCheckerCode"
import { WorkingMode, FoldNinjaState } from "../configuration/FoldNinjaState";
import { DocumentManager } from "./document/DocumentManager";

export const unfoldCurrent = async () => {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    return;
  }

  const docStatus = DocumentManager.getDocument(editor.document.fileName);
  await docStatus.getUpdateData(editor.document, WorkingMode.EXPANDED); // TODO: In this case we could remove computation...

  await vscode.commands.executeCommand("editor.unfoldAll");
};

export const foldFirst = async () => {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    return;
  }

  const docStatus = DocumentManager.getDocument(editor.document.fileName);
  const ranges = await docStatus.getUpdateData(editor.document, WorkingMode.INTERMEDIATE);
  if (ranges.length > 0) {
    const originalSelection = editor.selection;
    const firstFoldingRange = ranges[0];

    editor.selection = new vscode.Selection(firstFoldingRange.start, 0, firstFoldingRange.start, 0);
    await vscode.commands.executeCommand('editor.fold');
    editor.selection = originalSelection;
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

export const updateEditorStatus = async (forceAction:boolean) => {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    return;
  }
  const currentFileName = editor.document.fileName;
  const currentWorkingMode = FoldNinjaState.getWorkingMode();
  const docStatus = DocumentManager.getDocument(currentFileName);
  const shouldUpdate = docStatus.checkNeedsUpdateInEditor(editor.document, currentWorkingMode);
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
        foldFirst();
        break;
      default:
        break;
    }
  }
};
