import * as vscode from 'vscode';

import { WorkingMode } from "../../configuration/FoldNinjaState";
import { computeHash } from './computeHash';
import { FoldingRangeProvider } from '../foldProviders/FoldingRangeProvider';

export class DocumentStatus {
  private _fileName: string;
  private _computedHash: string;
  private _usedHash: string;
  private _workingMode: WorkingMode;
  private _computedRanges: vscode.FoldingRange[];
  private _foldComputer: FoldingRangeProvider|null;

  constructor (fileName: string) {
    this._fileName = fileName;
    this._computedHash = "";
    this._usedHash = "";
    this._workingMode = WorkingMode.INACTIVE;
    this._computedRanges = [];
    this._foldComputer = null;
  }

  get fileName():string {
    return this._fileName;
  }

  checkNeedsUpdateInEditor(document:vscode.TextDocument, workingMode:WorkingMode):boolean {
    const hashb64 = computeHash(document.getText());
    if (this._workingMode === workingMode && this._computedHash === hashb64 && this._usedHash === hashb64) {
      return false;
    }
    return true;
  }

  getComputedFoldingRanges():vscode.FoldingRange[] {
    return this._computedRanges;
  }

  resetComputedFoldingRange() {
    this._computedHash = "";
    this._computedRanges = [];
  }

  setComputedFoldingRange(document:vscode.TextDocument, computedFoldingRanges: vscode.FoldingRange[]) {
    this._computedHash = computeHash(document.getText());
    this._computedRanges = computedFoldingRanges;
  }

  async getUpdateData(document:vscode.TextDocument, workingMode:WorkingMode):Promise<vscode.FoldingRange[]> {
    const hashb64 = computeHash(document.getText());
    if (this._computedHash === hashb64) {
      this._usedHash = hashb64;
      this._workingMode = workingMode;
      return this._computedRanges;
    }
    if (!this._foldComputer) {
      return [];
    }
    const token: vscode.CancellationToken = new vscode.CancellationTokenSource().token;
    const { range, completed } = await this._foldComputer.provideFoldingRangesOnDemand(document, {}, token);
    if (!completed) {
      return [];
    }
    this._usedHash = hashb64;
    this._workingMode = workingMode;
    return range;
  }

}
