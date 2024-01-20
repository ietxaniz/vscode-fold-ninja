import * as vscode from "vscode";
import * as interfaces from "../foldcomputation/interfaces";
import { CStyle } from "../foldcomputation/CStyle";
import { FoldingRangeProvider } from "./FoldingRangeProvider";
import { FoldNinjaConfiguration } from "../../configuration/FoldNinjaConfiguration";
import { DocumentManager } from "../document/DocumentManager";

export class CStyleCommentFoldingRangeProvider implements FoldingRangeProvider {
  protected _blockCommentDelimiters: interfaces.BlockCommentDelimiter[];
  protected _lineCommentDelimiters: interfaces.LineCommentDelimiter[];
  protected _stringDelimiters: interfaces.StringDelimiter[];

  constructor(
    blockCommentDelimiters: interfaces.BlockCommentDelimiter[],
    lineCommentDelimiters: interfaces.LineCommentDelimiter[],
    stringDelimiters: interfaces.StringDelimiter[]
  ) {
    this._blockCommentDelimiters = blockCommentDelimiters;
    this._lineCommentDelimiters = lineCommentDelimiters;
    this._stringDelimiters = stringDelimiters;
  }

  public async provideFoldingRanges(
    document: vscode.TextDocument,
    _context: vscode.FoldingContext,
    _token: vscode.CancellationToken
  ): Promise<vscode.FoldingRange[]> {
    const documentStatus = DocumentManager.getDocument(document.fileName);
    if (document.getText().length > FoldNinjaConfiguration.getMaxNumberOfBytesInIntenseMode()) {
      documentStatus.resetComputedFoldingRange();
      return [];
    }
    const {range, completed} = CStyle.getFoldingRanges(document, _token, this._blockCommentDelimiters, this._lineCommentDelimiters, this._stringDelimiters);

    if (!completed) {
      documentStatus.resetComputedFoldingRange();
      return range;
    }
    documentStatus.setComputedFoldingRange(document, range);
    return range;
  }

  public async provideFoldingRangesOnDemand(
    document: vscode.TextDocument,
    _context: vscode.FoldingContext,
    _token: vscode.CancellationToken
  ): Promise<{range: vscode.FoldingRange[]; completed: boolean}> {
    const documentStatus = DocumentManager.getDocument(document.fileName);
    if (document.getText().length > FoldNinjaConfiguration.getMaxNumberOfBytes()) {
      return { range: [], completed: false };
    }
    const {range, completed} = CStyle.getFoldingRanges(document, _token, this._blockCommentDelimiters, this._lineCommentDelimiters, this._stringDelimiters);

    if (!completed) {
      documentStatus.resetComputedFoldingRange();
      return  { range: [], completed: false };
    }
    documentStatus.setComputedFoldingRange(document, range);
    return  { range: [], completed: false };
  }
}
