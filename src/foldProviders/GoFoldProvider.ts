import { FoldingRange } from "./FoldingRange";
import Parser from "web-tree-sitter";
import { BaseFoldProvider, LanguageType } from "./BaseFoldProvider";


export class GoFoldProvider extends BaseFoldProvider {

    constructor() {
        super("tree-sitter-go.wasm", ["//"], [{start: "/*", end:"*/"}], LanguageType.PROCEDURAL);
        super.setGetFoldingRangesInsideFunction(this.getFoldingRangesInsideFunction);
    }

    private getFoldingRangesInsideFunction(node: Parser.SyntaxNode):FoldingRange[] {
        const foldingRanges:FoldingRange[] = [];
        for (const child of node.children) {
            if (child.type === "block") {
                for (let i = 0; i < child.children.length - 2; i++) {
                    const current = child.children[i];
                    const next = child.children[i + 2];
                
                    const isErrorAssignment = (current.type === "short_var_declaration" || current.type === "assignment_statement") &&
                                              (current.text.includes("err :=") || current.text.includes("err ="));
                    const isErrorCheck = next.type === "if_statement" && next.text.includes("err != nil");
                
                    if (isErrorAssignment && isErrorCheck) {
                        const startLine = current.startPosition.row;
                        const endLine = next.endPosition.row;
                        if (startLine < endLine) {
                            foldingRanges.push(new FoldingRange(startLine, endLine));
                        }
                    }
                }
            }  
        }
        return foldingRanges;
    }
}
