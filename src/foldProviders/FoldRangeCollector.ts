import { FoldingRange } from "./FoldingRange";

export class FoldRangeCollector {
    private _ranges: FoldingRange[];
    private _lineComments: number[];
    private _lineCommentToken: string;
    
    constructor(lineCommentToken:string) {
        this._ranges = [];
        this._lineCommentToken = lineCommentToken;
        this._lineComments = [];
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
}