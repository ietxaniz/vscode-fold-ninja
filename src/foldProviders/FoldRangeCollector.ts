import { computeHash } from "../compute/computeHash";
import { FoldingRange } from "./FoldingRange";

export class FoldRangeCollector {
    private _ranges: FoldingRange[];
    private _lineComments: number[];
    private _lineCommentToken: string;
    private _hash: string;
    
    constructor(lineCommentToken:string, content: string) {
        this._ranges = [];
        this._lineCommentToken = lineCommentToken;
        this._lineComments = [];
        this._hash = computeHash(content);
    }

    addLineComment(lineText: string, lineNumber: number) {
        if (lineText.trim().startsWith(this._lineCommentToken)) {
            this._lineComments.push(lineNumber);
        }
    }
    
    addFoldingRange(range:FoldingRange) {
        this._ranges.push(range);
    }

    postprocess() {
        // TODO: add consecutive line comments
        // TODO: sort by position
        // TODO: extract some indicators
    }

    get ranges():FoldingRange[] {
        return this._ranges;
    }

    get hash():string {
      return this._hash;
    }
}