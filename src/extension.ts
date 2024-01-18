import * as vscode from 'vscode';
import * as command from './command'
import * as event from './event'

import { setGlobalState } from "./configuration/config";
import { CStyleCommentFoldingRangeProvider } from './internal/foldProviders/CStyleCommentFoldingProvider';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	console.log('Activating fold-ninja extension');
  setGlobalState(context.globalState);

	context.subscriptions.push(vscode.commands.registerCommand('fold-ninja.toggleStatus', command.showMenuOptions));
  context.subscriptions.push(vscode.window.onDidChangeActiveTextEditor(event.onTextEditorActivated));

  context.subscriptions.push(vscode.languages.registerFoldingRangeProvider({ language: 'c' }, new CStyleCommentFoldingRangeProvider([{start:"/*", end: "*/"}], [{start: "//"}], [{delimiter: "\"", multiline: false}])));
  context.subscriptions.push(vscode.languages.registerFoldingRangeProvider({ language: 'cpp' }, new CStyleCommentFoldingRangeProvider([{start:"/*", end: "*/"}], [{start: "//"}], [{delimiter: "\"", multiline: false}])));
  context.subscriptions.push(vscode.languages.registerFoldingRangeProvider({ language: 'csharp' }, new CStyleCommentFoldingRangeProvider([{start:"/*", end: "*/"}], [{start: "//"}], [{delimiter: "\"", multiline: false}])));
  context.subscriptions.push(vscode.languages.registerFoldingRangeProvider({ language: 'go' }, new CStyleCommentFoldingRangeProvider([{start:"/*", end: "*/"}], [{start: "//"}], [{delimiter: "\"", multiline: false}, {delimiter: "`", multiline: true}])));
  context.subscriptions.push(vscode.languages.registerFoldingRangeProvider({ language: 'rust' }, new CStyleCommentFoldingRangeProvider([{start:"/*", end: "*/"}], [{start: "//"}], [{delimiter: "\"", multiline: false}])));
  context.subscriptions.push(vscode.languages.registerFoldingRangeProvider({ language: 'javascript' }, new CStyleCommentFoldingRangeProvider([{start:"/*", end: "*/"}], [{start: "//"}], [{delimiter: "\"", multiline: false}, {delimiter: "'", multiline: false}, {delimiter: "`", multiline: true}])));
  context.subscriptions.push(vscode.languages.registerFoldingRangeProvider({ language: 'typescript' }, new CStyleCommentFoldingRangeProvider([{start:"/*", end: "*/"}], [{start: "//"}], [{delimiter: "\"", multiline: false}, {delimiter: "'", multiline: false}, {delimiter: "`", multiline: true}])));
  context.subscriptions.push(vscode.languages.registerFoldingRangeProvider({ language: 'python' }, new CStyleCommentFoldingRangeProvider([], [{start: "#"}], [{delimiter: "\"", multiline: false}, {delimiter: "'", multiline: false}, {delimiter: '"""', multiline: true}, {delimiter: "'''", multiline: true}])));


	console.log('Registering events');
  command.initializationCommand();
	console.log('Initialisation done');
}

// This method is called when your extension is deactivated
export function deactivate() {}
