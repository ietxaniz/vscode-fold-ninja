import * as vscode from 'vscode'

export class FoldingRange extends vscode.FoldingRange {
    protected _isFirstComment: boolean;
    constructor(start: number, end: number, kind?: vscode.FoldingRangeKind, isFirstComment?: boolean) {
        super(start, end, kind);
        this._isFirstComment = isFirstComment ? isFirstComment : false;
    }

    get isFirstComment(): boolean {
        return this._isFirstComment;
    }
}
