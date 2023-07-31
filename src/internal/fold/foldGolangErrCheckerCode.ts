import * as vscode from "vscode";

export const foldGolangErrCheckerCode = async (editor: vscode.TextEditor) => {
  const originalSelection = editor.selection;

  const selectionsToFold: vscode.Selection[] = [];

  const step1Expr = /\s+err\s+:?=/g;
  const step2Expr = /^\s+if\s+err\s+!=\s+nil\s+\{/; // /^\s+if\s+err\s+!=\s+nil\s+\{\s*$/g;
  const countExpr = /^\s+/g;
  let step3Expr = /^\s{2}\}\s+$/g;

  let lastLineStart = -1;
  let lastLineLength = 0;
  for (let lineIndex = 0; lineIndex < editor.document.lineCount; lineIndex++) {
    if (lastLineStart < 0) {
      const lineText = editor.document.lineAt(lineIndex).text;
      const hasMatch = step1Expr.test(lineText);
      if (hasMatch) {
        lastLineStart = lineIndex;
        lastLineLength = lineText.length;
        const match = lineText.match(countExpr);
        if (match) {
          step3Expr = new RegExp(`^\\s{${match[0].length}}\\}\\s*$`, "g");
        } else {
          step3Expr = new RegExp(`^\\s{${0}}\\}\\s*$`, "g");
        }
      }
    } else {
      if (lastLineStart + 1 === lineIndex) {
        const lineText = editor.document.lineAt(lineIndex).text;
        const hasMatch = step2Expr.test(lineText);
        if (!hasMatch) {
          lastLineStart = -1;
        }
      } else {
        const lineText = editor.document.lineAt(lineIndex).text;
        const hasMatch = step3Expr.test(lineText);
        if (hasMatch) {
          const newSelection = new vscode.Selection(lastLineStart, 0, lineIndex, lineText.length);
          selectionsToFold.push(newSelection);
          lastLineStart = -1;
        }
      }
    }
  }

  if (selectionsToFold.length > 0) {
    editor.selections = selectionsToFold;
    await vscode.commands.executeCommand("editor.createFoldingRangeFromSelection");

    editor.selection = originalSelection;
  }
};
