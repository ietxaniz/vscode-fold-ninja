import * as path from 'path';
import Parser from 'web-tree-sitter';

export enum SupportedLanguage {
    GO = 'tree-sitter-go.wasm',
    C = 'tree-sitter-c.wasm',
    TSX = 'tree-sitter-tsx.wasm',
    TYPESCRIPT = 'tree-sitter-typescript.wasm',
}

export class ParserLoader {
    private static _languages: Map<string, Parser.Language> = new Map();
    private static _initPromise: Promise<void> | null = null;

    private static async init(): Promise<void> {
        if (!this._initPromise) {
            this._initPromise = Parser.init();
        }
        return this._initPromise;
    }

    public static async getLanguage(langFile: SupportedLanguage): Promise<Parser.Language> {
        await this.init();

        if (!this._languages.has(langFile)) {
            const langPath = path.join(__dirname, langFile);
            const language = await Parser.Language.load(langPath);
            this._languages.set(langFile, language);
        }

        return this._languages.get(langFile)!;
    }
}
