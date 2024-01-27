import * as vscode from "vscode";

import { FoldRangeCollector } from "./FoldRangeCollector";

export interface FoldingRangeProvider extends vscode.FoldingRangeProvider {
  computeFoldingRanges(
    document: vscode.TextDocument,
    context: vscode.FoldingContext,
    token: vscode.CancellationToken,
    limit: number
  ): Promise<{ collector: FoldRangeCollector | null; computed: boolean }>;
}
