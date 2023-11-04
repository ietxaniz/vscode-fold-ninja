import * as vscode from "vscode";

export const foldGolangErrCheckerCode = async (editor: vscode.TextEditor) => {
  if (editor.visibleRanges.length === 0) {
    return;
  }

  const originalSelection = editor.selection;
  const selectionsToFold: vscode.Selection[] = [];

  const step1Expr = /\s+err\s+:?=/g;
  const step2Expr = /^\s+if\s+err\s+!=\s+nil\s+\{/;

  let braceCount = 0;
  let lastLineStart = -1;

  for (let lineIndex = 0; lineIndex < editor.document.lineCount; lineIndex++) {
    const lineText = editor.document.lineAt(lineIndex).text;

    if (step1Expr.test(lineText)) {
      braceCount = 0;
      lastLineStart = lineIndex;
    }

    if (step2Expr.test(lineText)) {
      braceCount++;
    }

    if (lineText.trim() === "}") {
      braceCount--;

      if (braceCount === 0 && lastLineStart !== -1) {
        const newSelection = new vscode.Selection(lastLineStart, 0, lineIndex, lineText.length);
        selectionsToFold.push(newSelection);
        lastLineStart = -1;
      }
    }
  }

  if (selectionsToFold.length > 0) {
    editor.selections = selectionsToFold;
    await vscode.commands.executeCommand("editor.createFoldingRangeFromSelection");
    editor.selection = originalSelection;
  }
};
