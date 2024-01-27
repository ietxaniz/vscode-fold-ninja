import * as vscode from 'vscode'
import * as crypto from 'crypto'
import Parser from 'web-tree-sitter'
import path from 'path';

import { WorkingMode } from '../configuration/FoldNinjaState';
import { FoldingRange } from '../foldProviders/FoldingRange';
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

    private setCompact(collector: FoldRangeCollector|null) {
      // TODO: Set compact
    }

    private setIntermediate(collector: FoldRangeCollector|null) {
      // TODO: Set intermediate
    }

    private setExpanded(collector: FoldRangeCollector|null) {
      // TODO: Set expanded
    }

    setFoldData(collector:FoldRangeCollector | null) {
      this._collector = collector;
    }
}
