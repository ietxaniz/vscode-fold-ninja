import * as vscode from 'vscode'
import * as crypto from 'crypto'
import Parser from 'web-tree-sitter'
import path from 'path';

import { WorkingMode } from '../configuration/FoldNinjaState';
import { FoldingRange } from '../foldProviders/FoldingRange';
import { FoldingRangeProvider } from '../foldProviders/FoldingRangeProvider';
import { FoldNinjaConfiguration } from '../configuration/FoldNinjaConfiguration';
import { FoldRangeCollector } from '../foldProviders/FoldRangeCollector';

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
      // TODO: Check if document last updated timestamp is bigger than modeTimestamp. If so return
      // TODO: Check that collector hash matches current documents hash, if not compute collector again
      // TODO: Apply mode to document
      // TODO: Update document timestamp
    }

    setFoldData(collector:FoldRangeCollector | null) {
      this._collector = collector;
    }
}
