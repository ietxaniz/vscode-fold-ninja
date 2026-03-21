import * as vscode from 'vscode'
import Parser from 'web-tree-sitter'

import { FoldNinjaState, WorkingMode } from '../configuration/FoldNinjaState';
import { FoldingRangeProvider } from '../foldProviders/FoldingRangeProvider';
import { FoldNinjaConfiguration } from '../configuration/FoldNinjaConfiguration';
import { FoldRangeCollector } from '../foldProviders/FoldRangeCollector';
import { computeHash } from '../compute/computeHash';
import { FoldingRange } from '../foldProviders/FoldingRange';
import { ParserLoader, SupportedLanguage } from './ParserLoader';

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
        if (this._parser && this._parserLanguage === language) {
            return;
        }

        let targetLang: SupportedLanguage | undefined;
        switch (language) {
            case 'tree-sitter-go.wasm': targetLang = SupportedLanguage.GO; break;
            case 'tree-sitter-c.wasm': targetLang = SupportedLanguage.C; break;
            case 'tree-sitter-tsx.wasm': targetLang = SupportedLanguage.TSX; break;
            case 'tree-sitter-typescript.wasm': targetLang = SupportedLanguage.TYPESCRIPT; break;
        }

        if (!targetLang) {
            vscode.window.showErrorMessage(`Fold Ninja: Unsupported language file ${language}`);
            return;
        }

        try {
            const lang = await ParserLoader.getLanguage(targetLang);
            if (!this._parser) {
                this._parser = new Parser();
            }
            this._parser.setLanguage(lang);
            this._parserLanguage = language;
        } catch (e) {
            console.error(`Fold Ninja: Failed to load language ${language}`, e);
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
      } else if (currentHash !== this._collector.hash) {
        shouldCompute = true;
      }

      if (shouldCompute && this._foldProvider) {
          const cts = new vscode.CancellationTokenSource();
          const { collector, computed } = await this._foldProvider.computeFoldingRanges(
            this._document,
            {},
            cts.token,
            FoldNinjaConfiguration.getMaxNumberOfBytes()
          );
          cts.dispose();

          if (computed) {
            this._collector = collector;
          }
      }

      switch(mode) {
        case WorkingMode.COMPACT:
          this.setCustomFold(this._collector, FoldNinjaConfiguration.getFolded(this._parserLanguage));
          return;
        case WorkingMode.EXPANDED:
          this.setExpanded();
          return;
        case WorkingMode.INTERMEDIATE:
          this.setCustomFold(this._collector, FoldNinjaConfiguration.getIntermediateFolded(this._parserLanguage));
          return;
      }
    }

    private getEditor(): vscode.TextEditor | undefined {
      return vscode.window.visibleTextEditors.find(e => e.document === this._document);
    }

    private async setExpanded() {
      const editor = this.getEditor();
      if (!editor) return;
      await vscode.commands.executeCommand("editor.unfoldAll");
    }

    private async setCustomFold(collector: FoldRangeCollector|null, items: string) {
      const editor = this.getEditor();
      if (!editor) return;

      if (!collector) {
        await vscode.commands.executeCommand("editor.foldAllBlockComments");
        return;
      }

      const { addFirstComment, types } = FoldingRange.getTypesFromString(items);
      const ranges:FoldingRange[] = [];

      if (addFirstComment && collector.firstComment) {
        ranges.push(collector.firstComment);
      }

      for (const range of collector.ranges) {
        if (types.includes(range.foldType)) {
          ranges.push(range);
        }
      }

      const currentSelection = editor.selection;
      const { selectionStart, selectionEnd } = this.getSelectionStartAndEnd(editor);

      const selections: vscode.Selection[] = [];

      for (const range of ranges) {
        if (selectionStart < range.start || selectionEnd > range.end) {
          selections.push(new vscode.Selection(range.start, 0, range.end, editor.document.lineAt(range.end).text.length));
        }
      }

      if (selections.length > 0) {
        editor.selections = selections;
        await vscode.commands.executeCommand("editor.createFoldingRangeFromSelection");
        editor.selection = currentSelection;
      }
    }

    private getSelectionStartAndEnd(editor:vscode.TextEditor):{selectionStart: number, selectionEnd: number} {
      if (FoldNinjaConfiguration.getFoldSelection()) {
        return { selectionStart: -1, selectionEnd: -1};
      }
      const currentSelection = editor.selection;
      return {
        selectionStart: currentSelection.start.line,
        selectionEnd: currentSelection.end.line
      };
    }

    setFoldData(collector:FoldRangeCollector | null) {
      let shouldUpdate = false;
      if (!this._collector && collector) {
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
