import { FoldingRangeKind } from "vscode";
import { computeHash } from "../compute/computeHash";
import { FoldingRange, FoldingRangeType } from "./FoldingRange";

export class FoldRangeCollector {
  private _ranges: FoldingRange[];
  private _lineComments: number[];
  private _lineCommentToken: string;
  private _hash: string;
  private _processed: boolean;
  private _processedRanges: FoldingRange[];

  constructor(lineCommentToken: string, content: string) {
    this._ranges = [];
    this._processedRanges = [];
    this._lineCommentToken = lineCommentToken;
    this._lineComments = [];
    this._hash = computeHash(content);
    this._processed = false;
  }

  addLineComment(lineText: string, lineNumber: number) {
    if (lineText.trim().startsWith(this._lineCommentToken)) {
      this._lineComments.push(lineNumber);
    }
    this._processed = false;
  }

  addFoldingRange(range: FoldingRange) {
    this._ranges.push(range);
    this._processed = false;
  }

  private postprocess() {
    if (this._processed) {
      return;
    }
    this._processed = true;
    this._processedRanges = [...this._ranges];
    const consecutiveLineBlocks = this.getConsecutiveLineCommentBlocks();
    for (let i=0; i<consecutiveLineBlocks.length;i++) {
      this._processedRanges.push(consecutiveLineBlocks[i]);
    }
    this._processedRanges = this._processedRanges.sort((a, b)=>a.start - b.start);
  }

  private getConsecutiveLineCommentBlocks():FoldingRange[] {
    const ranges:FoldingRange[] = [];
    let startCommentLine = -1;
    let endCommentLine = -1;
    for (let i=0; i<this._lineComments.length;i++) {
      if (startCommentLine < 0) {
        startCommentLine = this._lineComments[i];
        endCommentLine = this._lineComments[i];
      } else {
        if (this._lineComments[i] === endCommentLine + 1) {
          endCommentLine = this._lineComments[i];
        } else {
          if (endCommentLine > startCommentLine) {
            ranges.push(new FoldingRange(startCommentLine, endCommentLine, FoldingRangeType.Comment));
          }
          startCommentLine = -1;
          endCommentLine = -1;
        }
      }
    }
    if (endCommentLine > startCommentLine) {
      ranges.push(new FoldingRange(startCommentLine, endCommentLine, FoldingRangeType.Comment));
    }
    return ranges;
  }

  get ranges(): FoldingRange[] {
    this.postprocess();
    return this._processedRanges;
  }

  get hash(): string {
    return this._hash;
  }

  get firstComment(): FoldingRange | null {
    for (let i=0; i<this._processedRanges.length;i++) {
      const range = this._processedRanges[i];
      if (range.kind === FoldingRangeKind.Comment) {
        return range;
      }
    }
    return null;
  }
}
