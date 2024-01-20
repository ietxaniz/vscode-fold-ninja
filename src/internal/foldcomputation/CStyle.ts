import * as vscode from "vscode";

import { AnalysisStatus } from "./enums";
import { BlockCommentDelimiter, LineCommentDelimiter, StringDelimiter } from "./interfaces";

export class CStyle {
  private static analyzeLineFromNoneStatus(
    line: string,
    blockCommentDelimiters: BlockCommentDelimiter[],
    lineCommentDelimiters: LineCommentDelimiter[],
    stringDelimiters: StringDelimiter[]
  ): {
    status: AnalysisStatus;
    startPos: number;
    statusItem: BlockCommentDelimiter | LineCommentDelimiter | StringDelimiter | null;
  } {
    let status = AnalysisStatus.None;
    let startPos = -1;
    let statusItem: BlockCommentDelimiter | LineCommentDelimiter | StringDelimiter | null = null;

    for (let j = 0; j < line.length; j++) {
      if (status === AnalysisStatus.None) {
        let found = false;
        for (let k = 0; k < blockCommentDelimiters.length; k++) {
          if (line.startsWith(blockCommentDelimiters[k].start, j)) {
            status = AnalysisStatus.BlockComment;
            startPos = k;
            statusItem = blockCommentDelimiters[k];
            j = j + blockCommentDelimiters[k].start.length - 1;
            found = true;
            break;
          }
        }
        if (!found) {
          for (let k = 0; k < lineCommentDelimiters.length; k++) {
            if (line.startsWith(lineCommentDelimiters[k].start, j)) {
              status = AnalysisStatus.LineComment;
              startPos = k;
              statusItem = lineCommentDelimiters[k];
              found = true;
              return { status, startPos, statusItem };
            }
          }
        }
        if (!found) {
          for (let k = 0; k < stringDelimiters.length; k++) {
            if (line.startsWith(stringDelimiters[k].delimiter, j)) {
              if (stringDelimiters[k].multiline) {
                status = AnalysisStatus.MultilineString;
              } else {
                status = AnalysisStatus.LineString;
              }
              startPos = k;
              statusItem = stringDelimiters[k];
              j = j + stringDelimiters[k].delimiter.length - 1;
            }
          }
        }
      } else {
        if (status === AnalysisStatus.BlockComment) {
          const itemUnknown = statusItem as unknown;
          const item = itemUnknown as BlockCommentDelimiter;
          if (line.startsWith(item.end, j)) {
            status = AnalysisStatus.None;
            startPos = -1;
            statusItem = null;
            j = j + item.end.length - 1;
          }
        }
        if (status === AnalysisStatus.LineString || status === AnalysisStatus.MultilineString) {
          const itemUnknown = statusItem as unknown;
          const item = itemUnknown as StringDelimiter;
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

  public static getFoldingRanges(
    document: vscode.TextDocument,
    _token: vscode.CancellationToken,
    blockCommentDelimiters: BlockCommentDelimiter[],
    lineCommentDelimiters: LineCommentDelimiter[],
    stringDelimiters: StringDelimiter[]
  ): { range: vscode.FoldingRange[]; completed: boolean } {
    const foldingRanges: vscode.FoldingRange[] = [];

    let previousStatus = AnalysisStatus.None;
    let statusStartLine = -1;
    let _statusStartPos = -1;
    let statusStartItem: BlockCommentDelimiter | LineCommentDelimiter | StringDelimiter | null = null;

    for (let i = 0; i < document.lineCount; i++) {
      if (_token.isCancellationRequested) {
        return { range: [], completed: false };
      }
      const line = document.lineAt(i).text;

      if (previousStatus === AnalysisStatus.None) {
        const { status, startPos, statusItem } = this.analyzeLineFromNoneStatus(line, blockCommentDelimiters, lineCommentDelimiters, stringDelimiters);
        if (status === AnalysisStatus.LineComment || status === AnalysisStatus.BlockComment || status === AnalysisStatus.MultilineString) {
          statusStartLine = i;
          _statusStartPos = startPos;
          previousStatus = status;
          statusStartItem = statusItem;
        }
      } else {
        if (previousStatus === AnalysisStatus.LineComment) {
          const itemUnknown = statusStartItem as unknown;
          const item = itemUnknown as LineCommentDelimiter;
          if (!line.trim().startsWith(item.start)) {
            if (i - 1 - statusStartLine > 0) {
              foldingRanges.push(new vscode.FoldingRange(statusStartLine, i - 1, vscode.FoldingRangeKind.Comment));
            }
            previousStatus = AnalysisStatus.None;
            statusStartLine = -1;
            _statusStartPos = -1;
            statusStartItem = null;
            const { status, startPos, statusItem } = this.analyzeLineFromNoneStatus(line, blockCommentDelimiters, lineCommentDelimiters, stringDelimiters);
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
          const item = itemUnknown as BlockCommentDelimiter;
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
            const { status, startPos, statusItem } = this.analyzeLineFromNoneStatus(
              line.substring(lineEnd),
              blockCommentDelimiters,
              lineCommentDelimiters,
              stringDelimiters
            );
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
          const item = itemUnknown as StringDelimiter;
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
            const { status, startPos, statusItem } = this.analyzeLineFromNoneStatus(
              line.substring(lineEnd),
              blockCommentDelimiters,
              lineCommentDelimiters,
              stringDelimiters
            );
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
    return { range: foldingRanges, completed: true };
  }
}
