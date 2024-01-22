import * as vscode from 'vscode'
import { FoldNinjaState, WorkingMode } from '../configuration/FoldNinjaState';

let statusBarItem: vscode.StatusBarItem;

export const updateStatusbarItem = async () => {
    if (!statusBarItem) {
        statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
        statusBarItem.text = "{ }";
        statusBarItem.tooltip = `Fold Ninja: ${WorkingMode.INACTIVE}`;
        statusBarItem.show();
        statusBarItem.command = "fold-ninja.showMenuOptions";
    }

    const currentStatus = FoldNinjaState.getWorkingMode();

    switch (currentStatus) {
        case WorkingMode.INACTIVE:
            statusBarItem.text = '{X}';
            statusBarItem.tooltip = 'Fold Ninja: inactive';
            break;
        case WorkingMode.COMPACT:
            statusBarItem.text = '{...}';
            statusBarItem.tooltip = 'Fold Ninja: compact';
            break;
        case WorkingMode.EXPANDED:
            statusBarItem.text =  '{<- ->}';
            statusBarItem.tooltip = 'Fold Ninja: expanded';
            break;
        case WorkingMode.INTERMEDIATE:
            statusBarItem.text = '{.|.}';
            statusBarItem.tooltip = 'Fold Ninja: intermediate';
            break;
        default:
            console.error(`Unexpected sstatus: ${currentStatus}`);
    }
}
