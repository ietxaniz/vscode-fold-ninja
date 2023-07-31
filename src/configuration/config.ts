import * as vscode from "vscode";

const CONFIG_SECTION = "fold-ninja";

let globalState: vscode.Memento;

export enum Status {
  Inactive = "inactive",
  Expanded = "expanded",
  Compact = "compact",
}

export interface ConfigType {
  status: Status;
}

export const setGlobalState = (state: vscode.Memento) => {
  globalState = state;
};

export const readConfig = (): ConfigType => {
  return globalState.get<ConfigType>(CONFIG_SECTION, { status: Status.Inactive });
};

export const writeConfig = async (config: ConfigType) => {
  await globalState.update(CONFIG_SECTION, config);
};
