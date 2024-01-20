import * as vscode from 'vscode';
import { WorkingMode, FoldNinjaState } from '../configuration/FoldNinjaState';

let statusBarItem: vscode.StatusBarItem;

export const updateStatusBarItem = () => {
  if (!statusBarItem) {
    statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    statusBarItem.text = "{ }";
    statusBarItem.tooltip = `Fold Ninja: ${WorkingMode.INACTIVE}`;
    statusBarItem.show();
    statusBarItem.command = "fold-ninja.toggleStatus";
  }

  const currentStatus = FoldNinjaState.getWorkingMode();


  switch (currentStatus) {
    case WorkingMode.INACTIVE:
      statusBarItem.text = '{X}';
      statusBarItem.tooltip = 'Folding Ninja: inactive';
      break;
    case WorkingMode.COMPACT:
      statusBarItem.text = '{...}';
      statusBarItem.tooltip = 'Folding Ninja: compact';
      break;
    case WorkingMode.EXPANDED:
      statusBarItem.text = '{<-  ->}';
      statusBarItem.tooltip = 'Folding Ninja: expanded';
      break;
    case WorkingMode.INTERMEDIATE:
      statusBarItem.text = '{.1.}';
      statusBarItem.tooltip = 'Folding Ninja: fold first item';
      break;
    default:
      console.error(`Unexpected status: ${currentStatus}`);
  }

}
