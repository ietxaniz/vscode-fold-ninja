import * as vscode from "vscode";
import * as interfaces from "../interfaces";
import { StatusManager } from "../StatusManager";

enum AnalysisStatus {
  None = "None",
  LineString = "LineString",
  MultilineString = "MultilineString",
  BlockComment = "BlockComment",
  LineComment = "LineComment",
}

export class CStyleCommentFoldingRangeProvider implements vscode.FoldingRangeProvider {
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

  private analyzeLineFromNoneStatus(line: string): {
    status: AnalysisStatus;
    startPos: number;
    statusItem: interfaces.BlockCommentDelimiter | interfaces.LineCommentDelimiter | interfaces.StringDelimiter | null;
  } {
    let status = AnalysisStatus.None;
    let startPos = -1;
    let statusItem: interfaces.BlockCommentDelimiter | interfaces.LineCommentDelimiter | interfaces.StringDelimiter | null = null;

    for (let j = 0; j < line.length; j++) {
      if (status === AnalysisStatus.None) {
        let found = false;
        for (let k = 0; k < this._blockCommentDelimiters.length; k++) {
          if (line.startsWith(this._blockCommentDelimiters[k].start, j)) {
            status = AnalysisStatus.BlockComment;
            startPos = k;
            statusItem = this._blockCommentDelimiters[k];
            j = j + this._blockCommentDelimiters[k].start.length - 1;
            found = true;
            break;
          }
        }
        if (!found) {
          for (let k = 0; k < this._lineCommentDelimiters.length; k++) {
            if (line.startsWith(this._lineCommentDelimiters[k].start, j)) {
              status = AnalysisStatus.LineComment;
              startPos = k;
              statusItem = this._lineCommentDelimiters[k];
              found = true;
              return { status, startPos, statusItem };
            }
          }
        }
        if (!found) {
          for (let k = 0; k < this._stringDelimiters.length; k++) {
            if (line.startsWith(this._stringDelimiters[k].delimiter, j)) {
              if (this._stringDelimiters[k].multiline) {
                status = AnalysisStatus.MultilineString;
              } else {
                status = AnalysisStatus.LineString;
              }
              startPos = k;
              statusItem = this._stringDelimiters[k];
              j = j + this._stringDelimiters[k].delimiter.length - 1;
            }
          }
        }
      } else {
        if (status === AnalysisStatus.BlockComment) {
          const itemUnknown = statusItem as unknown;
          const item = itemUnknown as interfaces.BlockCommentDelimiter;
          if (line.startsWith(item.end, j)) {
            status = AnalysisStatus.None;
            startPos = -1;
            statusItem = null;
            j = j + item.end.length - 1;
          }
        }
        if (status === AnalysisStatus.LineString || status === AnalysisStatus.MultilineString) {
          const itemUnknown = statusItem as unknown;
          const item = itemUnknown as interfaces.StringDelimiter;
          if (line.startsWith(item.delimiter, j)) {
            status = AnalysisStatus.None;
            startPos = -1;
            statusItem = null;
            j = j + item.delimiter.length - 1;
          }
        }
      }
    }
    return { status, startPos, statusItem };
  }

  public async provideFoldingRanges(
    document: vscode.TextDocument,
    _context: vscode.FoldingContext,
    _token: vscode.CancellationToken
  ): Promise<vscode.FoldingRange[]> {
    const foldingRanges: vscode.FoldingRange[] = [];

    let previousStatus = AnalysisStatus.None;
    let statusStartLine = -1;
    let _statusStartPos = -1;
    let statusStartItem: interfaces.BlockCommentDelimiter | interfaces.LineCommentDelimiter | interfaces.StringDelimiter | null = null;

    for (let i = 0; i < document.lineCount; i++) {
      const line = document.lineAt(i).text;

      if (previousStatus === AnalysisStatus.None) {
        const { status, startPos, statusItem } = this.analyzeLineFromNoneStatus(line);
        if (status === AnalysisStatus.LineComment || status === AnalysisStatus.BlockComment || status === AnalysisStatus.MultilineString) {
          statusStartLine = i;
          _statusStartPos = startPos;
          previousStatus = status;
          statusStartItem = statusItem;
        }
      } else {
        if (previousStatus === AnalysisStatus.LineComment) {
          const itemUnknown = statusStartItem as unknown;
          const item = itemUnknown as interfaces.LineCommentDelimiter;
          if (!line.trim().startsWith(item.start)) {
            if ((i - 1 - statusStartLine) > 0) {
              foldingRanges.push(new vscode.FoldingRange(statusStartLine, i - 1, vscode.FoldingRangeKind.Comment));
            }
            previousStatus = AnalysisStatus.None;
            statusStartLine = -1;
            _statusStartPos = -1;
            statusStartItem = null;
            const { status, startPos, statusItem } = this.analyzeLineFromNoneStatus(line);
            if (status === AnalysisStatus.LineComment || status === AnalysisStatus.BlockComment || status === AnalysisStatus.MultilineString) {
              statusStartLine = i;
              _statusStartPos = startPos;
              previousStatus = status;
              statusStartItem = statusItem;
            }
          }
        }
        if (previousStatus === AnalysisStatus.BlockComment) {
          const itemUnknown = statusStartItem as unknown;
          const item = itemUnknown as interfaces.BlockCommentDelimiter;
          let lineEnd = 0;
          for (let j = 0; j < line.length; j++) {
            if (line.startsWith(item.end, j)) {
              if (i - statusStartLine > 1) {
                foldingRanges.push(new vscode.FoldingRange(statusStartLine, i, vscode.FoldingRangeKind.Comment));
              }
              previousStatus = AnalysisStatus.None;
              statusStartLine = -1;
              _statusStartPos = -1;
              statusStartItem = null;
              lineEnd = j + item.end.length;
              break;
            }
          }
          if (previousStatus === AnalysisStatus.None) {
            const { status, startPos, statusItem } = this.analyzeLineFromNoneStatus(line.substring(lineEnd));
            if (status === AnalysisStatus.LineComment || status === AnalysisStatus.BlockComment || status === AnalysisStatus.MultilineString) {
              statusStartLine = i;
              _statusStartPos = startPos;
              previousStatus = status;
              statusStartItem = statusItem;
            }
          }
        }
        if (previousStatus === AnalysisStatus.MultilineString) {
          const itemUnknown = statusStartItem as unknown;
          const item = itemUnknown as interfaces.StringDelimiter;
          let lineEnd = 0;
          for (let j = 0; j < line.length; j++) {
            if (line.startsWith(item.delimiter, j)) {
              previousStatus = AnalysisStatus.None;
              statusStartLine = -1;
              _statusStartPos = -1;
              statusStartItem = null;
              lineEnd = j + item.delimiter.length;
              break;
            }
          }
          if (previousStatus === AnalysisStatus.None) {
            const { status, startPos, statusItem } = this.analyzeLineFromNoneStatus(line.substring(lineEnd));
            if (status === AnalysisStatus.LineComment || status === AnalysisStatus.BlockComment || status === AnalysisStatus.MultilineString) {
              statusStartLine = i;
              _statusStartPos = startPos;
              previousStatus = status;
              statusStartItem = statusItem;
            }
          }
        }
      }
    }

    StatusManager.getInstance().setFoldingRanges(document.fileName, foldingRanges);
    return foldingRanges;
  }
}
