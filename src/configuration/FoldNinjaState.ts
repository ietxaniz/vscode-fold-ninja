import * as vscode from "vscode";

export enum WorkingMode {
  INACTIVE = "INACTIVE",
  COMPACT = "COMPACT",
  INTERMEDIATE = "INTERMEDIATE",
  EXPANDED = "EXPANDED",
}

export enum CalculationMode {
  INTENSE = "INTENSE",
  ONDEMAND = "ONDEMAND",
}

export class FoldNinjaState {
  private static _vscodeMemento: vscode.Memento;
  private static _workingMode: WorkingMode | null = null;
  private static _calculationMode: CalculationMode | null;
  private static _timestamp: number;

  public static initialize(context: vscode.ExtensionContext) {
    this._vscodeMemento = context.globalState;
    this._timestamp = Date.now();
  }

  public static getWorkingMode(): {mode: WorkingMode, timestamp: number} {
    if (!this._workingMode) {
      this._workingMode = this._vscodeMemento.get<WorkingMode>("fold-ninja:WorkingMode", WorkingMode.INACTIVE);
    }
    return { mode: this._workingMode, timestamp: this._timestamp };
  }

  public static async setWorkingMode(mode: WorkingMode) {
    try {
      await this._vscodeMemento.update("fold-ninja:WorkingMode", mode);
      this._workingMode = mode;
      this._timestamp = Date.now();
    } catch (error) {
      console.error("Error updating working mode in Fold Ninja:", error);
    }
  }
}
