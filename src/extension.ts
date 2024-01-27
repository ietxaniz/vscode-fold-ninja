import * as vscode from 'vscode';
import * as providers from './foldProviders'

import * as event from './event'
import { showMenuOptions } from './action/showMenuOptions';

export function activate(context: vscode.ExtensionContext) {

	event.onLoad(context);
	context.subscriptions.push(vscode.commands.registerCommand('fold-ninja.showMenuOptions', showMenuOptions));
	context.subscriptions.push(vscode.window.onDidChangeActiveTextEditor(event.onTextEditorActivated));
	context.subscriptions.push(vscode.languages.registerFoldingRangeProvider({ language: 'go' }, new providers.GoFoldProvider()));

}

// This method is called when your extension is deactivated
export function deactivate() {}
