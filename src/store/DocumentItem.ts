import * as vscode from 'vscode'
import Parser from 'web-tree-sitter'
import path from 'path';

import { FoldNinjaState, WorkingMode } from '../configuration/FoldNinjaState';
import { FoldingRangeProvider } from '../foldProviders/FoldingRangeProvider';
import { FoldNinjaConfiguration } from '../configuration/FoldNinjaConfiguration';
import { FoldRangeCollector } from '../foldProviders/FoldRangeCollector';
import { computeHash } from '../compute/computeHash';

export class DocumentItem {
    private _document: vscode.TextDocument;
    private _parser: Parser | null;
    private _parserLanguage: string;
    private _foldProvider: FoldingRangeProvider | null;
    private _collector: FoldRangeCollector | null;
    private _updatedTimestamp: number;

    constructor(document: vscode.TextDocument) {
        this._document = document;
        this._parserLanguage = "";
        this._parser = null;
        this._foldProvider = null;
        this._collector = null;
        this._updatedTimestamp = 0;
    }

    set foldProvider(provider:FoldingRangeProvider) {
        this._foldProvider = provider;
    }

    get fileName(): string {
        return this.document.fileName;
    }

    get document(): vscode.TextDocument {
        return this._document;
    }

    async setParser(language: string) {
        if (this._parser) {
            if (this._parserLanguage !== language) {
                vscode.window.showErrorMessage(`Parser language mismatch: ${this._parserLanguage} !== ${language}`);
            }
            return;
        }
        if (language === "tree-sitter-go.wasm") {
            await Parser.init();
            this._parser = new Parser();
            const Lang = await Parser.Language.load(path.join(__dirname, 'tree-sitter-go.wasm'));
            this._parser.setLanguage(Lang);
            this._parserLanguage = language;
            return;
        }
        if (language === "tree-sitter-c.wasm") {
            await Parser.init();
            this._parser = new Parser();
            const Lang = await Parser.Language.load(path.join(__dirname, 'tree-sitter-c.wasm'));
            this._parser.setLanguage(Lang);
            this._parserLanguage = language;
            return;
        }
    }

    async removeParser() {
        this._parser = null;
        this._parserLanguage = "";
    }

    get parser(): Parser | null {
        return this._parser;
    }

    async updateDocument(mode:WorkingMode, modeTimestamp:number, force: boolean) {
      if (this._updatedTimestamp > modeTimestamp && !force) {
        return;
      }
      this._updatedTimestamp = Date.now();
      if (mode === WorkingMode.INACTIVE) {
        return;
      }
      const currentHash = computeHash(this._document.getText());
      let shouldCompute = false;
      if (!this._collector) {
        shouldCompute = true;
      } else {
        if (currentHash !== this._collector.hash) {
          shouldCompute = true;
        }
      }
      if (shouldCompute) {
        if (this._foldProvider) {
          const token: vscode.CancellationToken = new vscode.CancellationTokenSource().token;
          const { collector, computed } = await this._foldProvider.computeFoldingRanges(this._document, {}, token, FoldNinjaConfiguration.getMaxNumberOfBytes());
          if (computed) {
            this._collector = collector;
          }
        }
      }

      switch(mode) {
        case WorkingMode.COMPACT:
          this.setCompact(this._collector);
          return;
        case WorkingMode.EXPANDED:
          this.setExpanded(this._collector);
          return;
        case WorkingMode.INTERMEDIATE:
          this.setIntermediate(this._collector);
          return;
      }
    }

    private async setCompact(collector: FoldRangeCollector|null) {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        return;
      }
      if (!collector) {
        await vscode.commands.executeCommand("editor.foldAllBlockComments");
        return;
      }
      const ranges = collector.ranges;
      const currentSelection = editor.selection;
      const selectionStart = currentSelection.start.line;
      const selectionEnd = currentSelection.end.line;
      const selectionsToFold:vscode.Selection[] = [];
      for (let i=0; i<ranges.length;i++) {
        const range = ranges[i];
        if (selectionStart < range.start || selectionEnd > range.end) {
          selectionsToFold.push(new vscode.Selection(range.start, 0, range.end, editor.document.lineAt(range.end).text.length));
        }
      }
      editor.selections = selectionsToFold;
      await vscode.commands.executeCommand("editor.createFoldingRangeFromSelection");
      editor.selection = currentSelection;
    }

    private async setIntermediate(collector: FoldRangeCollector|null) {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        return;
      }
      if (!collector) {
        await vscode.commands.executeCommand("editor.foldAllBlockComments");
        return;
      }
      const range = collector.firstComment;
      if (!range) {
        return;
      }
      const currentSelection = editor.selection;
      editor.selection = new vscode.Selection(range.start, 0, range.end, editor.document.lineAt(range.end).text.length);
      await vscode.commands.executeCommand("editor.createFoldingRangeFromSelection");
      editor.selection = currentSelection;
    }

    private async setExpanded(collector: FoldRangeCollector|null) {
      await vscode.commands.executeCommand("editor.unfoldAll");
    }

    setFoldData(collector:FoldRangeCollector | null) {
      let shouldUpdate = false;
      if (!this._collector && collector) {
        // first time collector is added, updateDocument is triggered before collector is created. So we need to call updateDocument again
        shouldUpdate = true;
      }
      this._collector = collector;
      if (shouldUpdate) {
        this._updatedTimestamp = 0;
        const { mode, timestamp } = FoldNinjaState.getWorkingMode();
        this.updateDocument(mode, timestamp, false);
      }
    }
}
