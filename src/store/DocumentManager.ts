import * as vscode from 'vscode'
import { DocumentItem } from "./DocumentItem";

export class DocumentManager {
    private static _documents:Map<string, DocumentItem>|null;

    public static getItem(document:vscode.TextDocument):DocumentItem {
        if (!this._documents) {
            this._documents = new Map<string, DocumentItem>;
        }
        if (!this._documents.has(document.fileName)) {
            this._documents.set(document.fileName, new DocumentItem(document));
        }
        return this._documents.get(document.fileName) as DocumentItem;
    }

    public static removeItem(fileName:string) {
        if (!this._documents) {
            this._documents = new Map<string, DocumentItem>;
        }
        this._documents.delete(fileName);
    }

    public static renameDocument(oldFileName:string, newFileName:string) {
        if (!this._documents) {
            this._documents = new Map<string, DocumentItem>;
        }
        const document = this._documents.get(oldFileName);
        this._documents.delete(oldFileName);
        if (document) {
            this._documents.set(newFileName, document);
            document.removeParser(); // A renaming of the document could mean a change in the parser language
        }
    }
}
