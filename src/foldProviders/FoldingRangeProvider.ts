import * as vscode from 'vscode';

import { FoldingRange } from './FoldingRange';


export interface FoldingRangeProvider extends vscode.FoldingRangeProvider {
  computeFoldingRanges(
    document: vscode.TextDocument,
    context: vscode.FoldingContext,
    token: vscode.CancellationToken,
    limit: number): Promise<{
      range: FoldingRange[],
      computed: boolean
    }>
}
