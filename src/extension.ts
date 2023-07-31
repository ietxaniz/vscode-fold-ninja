import * as vscode from 'vscode';
import * as command from './command'
import * as event from './event'

import { setGlobalState } from "./configuration/config";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	console.log('Activating fold-ninja extension');
  setGlobalState(context.globalState);

	context.subscriptions.push(vscode.commands.registerCommand('fold-ninja.toggleStatus', command.toggleStatusCommand));
  context.subscriptions.push(vscode.window.onDidChangeActiveTextEditor(event.onTextEditorActivated));

	console.log('Registering events');
  command.initializationCommand();
	console.log('Initialisation done');
}

// This method is called when your extension is deactivated
export function deactivate() {}
