import { toggleStatus } from "../internal/toggleStatus";
import { updateStatusBarItem } from "../internal/updateStatusBarItem";
import * as vscode from 'vscode';

export const toggleStatusCommand = async () => {
  await toggleStatus();
  updateStatusBarItem();
}
