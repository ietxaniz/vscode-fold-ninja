import * as vscode from 'vscode';
import { Status, readConfig } from '../configuration/config';

let statusBarItem: vscode.StatusBarItem;

export const updateStatusBarItem = () => {
  if (!statusBarItem) {
    statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    statusBarItem.text = "{ }";
    statusBarItem.tooltip = `Fold Ninja: ${Status.Inactive}`;
    statusBarItem.show();
    statusBarItem.command = "fold-ninja.toggleStatus";
  }

  const config = readConfig();
  const currentStatus = config.status;


  switch (currentStatus) {
    case 'inactive':
      statusBarItem.text = '{X}';
      statusBarItem.tooltip = 'Folding Ninja: inactive';
      break;
    case 'compact':
      statusBarItem.text = '{...}';
      statusBarItem.tooltip = 'Folding Ninja: compact';
      break;
    case 'expanded':
      statusBarItem.text = '{<-  ->}';
      statusBarItem.tooltip = 'Folding Ninja: expanded';
      break;
    default:
      console.error(`Unexpected status: ${currentStatus}`);
  }

}
