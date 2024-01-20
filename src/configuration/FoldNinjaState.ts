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

  public static initialize(context: vscode.ExtensionContext) {
    this._vscodeMemento = context.globalState;
  }

  public static getWorkingMode(): WorkingMode {
    if (!this._workingMode) {
      this._workingMode = this._vscodeMemento.get<WorkingMode>("fold-ninja:WorkingMode", WorkingMode.INACTIVE);
    }
    return this._workingMode;
  }

  public static async setWorkingMode(mode: WorkingMode) {
    try {
      await this._vscodeMemento.update("fold-ninja:WorkingMode", mode);
      this._workingMode = mode;
    } catch (error) {
      console.error("Error updating working mode in Fold Ninja:", error);
    }
  }

  public static getCalculationMode(): CalculationMode {
    if (!this._calculationMode) {
      this._calculationMode = this._vscodeMemento.get<CalculationMode>("fold-ninja:CalculationMode", CalculationMode.INTENSE);
    }
    return this._calculationMode;
  }

  public static async setCalculationMode(mode: CalculationMode) {
    try {
      await this._vscodeMemento.update("fold-ninja:CalculationMode", mode);
      this._calculationMode = mode;
    } catch (error) {
      console.error("Error updating calculation mode in Fold Ninja:", error);
    }
  }
}
