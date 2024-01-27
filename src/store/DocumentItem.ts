import * as vscode from 'vscode'
import * as crypto from 'crypto'
import Parser from 'web-tree-sitter'
import path from 'path';

import { WorkingMode } from '../configuration/FoldNinjaState';
import { FoldingRange } from '../foldProviders/FoldingRange';
import { FoldingRangeProvider } from '../foldProviders/FoldingRangeProvider';
import { FoldNinjaConfiguration } from '../configuration/FoldNinjaConfiguration';

const computeHash = (content: string): string => {
    const hash = crypto.createHash('sha1');
    hash.update(content);
    return hash.digest('base64');
}


export class DocumentItem {
    private _document: vscode.TextDocument;
    private _parser: Parser | null;
    private _parserLanguage: string;
    private _computedHash: string;
    private _usedHash: string;
    private _workingMode: WorkingMode;
    private _computedRanges: FoldingRange[];
    private _foldProvider: FoldingRangeProvider | null;

    constructor(document: vscode.TextDocument) {
        this._document = document;
        this._parserLanguage = "";
        this._parser = null;
        this._computedHash = "";
        this._usedHash = "";
        this._workingMode = WorkingMode.INACTIVE;
        this._computedRanges = [];
        this._foldProvider = null;
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


    checkNeedsUpdateInEditor(document: vscode.TextDocument, workingMode: WorkingMode): boolean {
        const hashb64 = computeHash(document.getText());
        if (this._workingMode === workingMode && this._computedHash === hashb64 && this._usedHash === hashb64) {
            return false;
        }
        return true;
    }

    resetComputedFoldingRange() {
        this._computedHash = "";
        this._computedRanges = [];
    }

    setComputedFoldingRange(document: vscode.TextDocument, computedFoldingRanges: FoldingRange[]) {
        this._computedHash = computeHash(document.getText());
        this._computedRanges = computedFoldingRanges;
    }

    async getUpdateData(document: vscode.TextDocument, workingMode: WorkingMode): Promise<FoldingRange[]> {
        const hashb64 = computeHash(document.getText());
        if (this._computedHash === hashb64) {
            this._usedHash = hashb64;
            this._workingMode = workingMode;
            return this._computedRanges;
        }
        if (!this._foldProvider) {
            return [];
        }
        const token: vscode.CancellationToken = new vscode.CancellationTokenSource().token;
        const { range, computed } = await this._foldProvider.computeFoldingRanges(document, {}, token, FoldNinjaConfiguration.getMaxNumberOfBytes())
        if (!computed) {
            return [];
        }
        if (!range) {
            return [];
        }
        this._usedHash = hashb64;
        this._workingMode = workingMode;
        return range;
    }
}
