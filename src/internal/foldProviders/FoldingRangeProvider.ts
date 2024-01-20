import * as vscode from 'vscode';


export interface FoldingRangeProvider extends vscode.FoldingRangeProvider {
  provideFoldingRangesOnDemand(document: vscode.TextDocument, context: vscode.FoldingContext, token: vscode.CancellationToken): Promise<{range: vscode.FoldingRange[]; completed: boolean}>
}
