import { TextDocument, FoldingContext, FoldingRangeProvider, CancellationToken, ProviderResult, FoldingRangeKind } from "vscode";
import { FoldingRange } from "./FoldingRange";
import { DocumentManager } from "../store/DocumentManager";
import Parser from "web-tree-sitter";
import { DocumentItem } from "../store/DocumentItem";
import { FoldNinjaConfiguration } from "../configuration/FoldNinjaConfiguration";

export enum LanguageType {
    PROCEDURAL = 1,
    OOP = 2,
}

export class BaseFoldProvider implements FoldingRangeProvider {
    protected _languageTreeParser: string;
    protected _lineCommentTokens: string[];
    protected _multilineCommentTokens: { start: string, end: string }[];
    protected _languageType: LanguageType;
    protected _getFoldingRangesInsideFunction: ((node: Parser.SyntaxNode)=>FoldingRange[])|null;

    provideFoldingRanges(document: TextDocument, context: FoldingContext, token: CancellationToken): ProviderResult<FoldingRange[]> {
        const { range, computed } = this.computeFoldingRanges(document, context, token, FoldNinjaConfiguration.getMaxNumberOfBytesInIntenseMode());
        const documentItem = DocumentManager.getItem(document);
        documentItem.foldProvider = this;
        if (!computed) {
            documentItem.resetComputedFoldingRange();
            return range;
        }
        documentItem.setComputedFoldingRange(document, range);
        return range;
    }

    constructor(languageTreeParser: string, lineCommentTokens: string[], multilineCommentTokens: { start: string, end: string }[], languageType: LanguageType) {
        this._languageTreeParser = languageTreeParser;
        this._lineCommentTokens = lineCommentTokens;
        this._multilineCommentTokens = multilineCommentTokens;
        this._languageType = languageType;
        this._getFoldingRangesInsideFunction = null;
    }

    public setGetFoldingRangesInsideFunction(fnc:((node: Parser.SyntaxNode)=>FoldingRange[])) {
        this._getFoldingRangesInsideFunction = fnc;
    }

    computeFoldingRanges(document: TextDocument, context: FoldingContext, token: CancellationToken, limit: number): { range: FoldingRange[], computed: boolean } {
        const documentItem = DocumentManager.getItem(document);
        documentItem.setParser(this._languageTreeParser);
        if (document.getText().length > limit) {
            return { range: [], computed: false };
        }
        const parser = documentItem.parser;
        if (parser) {
            if (this._languageType === LanguageType.PROCEDURAL) {
                return this.computeProceduralFoldingRanges(documentItem, context, token, parser);
            }
        }
        return { range: [], computed: false };
    }

    private computeProceduralFoldingRanges(documentItem: DocumentItem, context: FoldingContext, token: CancellationToken, parser: Parser): { range: FoldingRange[], computed: boolean } {
        const tree = parser.parse(documentItem.document.getText());
        const rootNode = tree.rootNode;
        const foldingRanges: FoldingRange[] = [];
        let startCommentLine:number|null = null;
        let endCommentLine:number|null = null;
        let isFirstComment = true;
        const collectFoldingRanges = (node: Parser.SyntaxNode) => {
            if (node.type === 'function_declaration' || node.type === 'import_declaration') {
                const startLine = node.startPosition.row;
                const endLine = node.endPosition.row;
                if (startLine < endLine) {
                    foldingRanges.push(new FoldingRange(startLine, endLine));
                }
                if (node.type === 'function_declaration') {
                    if (this._getFoldingRangesInsideFunction) {
                        this._getFoldingRangesInsideFunction(node).map((item)=>{foldingRanges.push(item)});
                    }
                }
            }
            if (node.type === 'comment') {
                const startLine = node.startPosition.row;
                const endLine = node.endPosition.row;
        
                if (this.checkNodeStartsWithMultilineCommentToken(node) && startLine < endLine) {
                    foldingRanges.push(new FoldingRange(startLine, endLine, FoldingRangeKind.Comment, isFirstComment));
                    isFirstComment = false;
                } else if (this.checkNodeStartsWithLineCommentToken(node)) {
                    if (startCommentLine === null) {
                        startCommentLine = startLine;
                    }
                    else {
                        endCommentLine = endLine;
                    }
                }
            } else {
                if (endCommentLine && startCommentLine && endCommentLine > startCommentLine) {
                    foldingRanges.push(new FoldingRange(startCommentLine, endCommentLine, FoldingRangeKind.Comment, isFirstComment));
                    isFirstComment = false;
                }
                startCommentLine = null;
                endCommentLine = null;
            }
            node.children.forEach(collectFoldingRanges);
        }

        collectFoldingRanges(rootNode);
        return { range: foldingRanges, computed: true };
    }

    private checkNodeStartsWithMultilineCommentToken(node:Parser.SyntaxNode) {
        for (let i=0; i<this._multilineCommentTokens.length; i++) {
            if (node.text.startsWith(this._multilineCommentTokens[i].start)) {
                return true;
            }
        }
        return false;
    }

    private checkNodeStartsWithLineCommentToken(node:Parser.SyntaxNode) {
        for (let i=0; i<this._lineCommentTokens.length; i++) {
            if (node.text.startsWith(this._lineCommentTokens[i])) {
                return true;
            }
        }
        return false;
    }
}
