import { TextDocument, FoldingContext, CancellationToken, ProviderResult, FoldingRangeKind } from "vscode";
import { FoldingRange } from "./FoldingRange";
import Parser from "web-tree-sitter";
import { DocumentManager } from "../store/DocumentManager";
import { FoldNinjaConfiguration } from "../configuration/FoldNinjaConfiguration";
import { FoldingRangeProvider } from "./FoldingRangeProvider";
import { FoldRangeCollector } from "./FoldRangeCollector";

export class GoFoldProvider implements FoldingRangeProvider {

  protected _languageTreeParser: string;
  protected _lineCommentTokens: string[];

  constructor() {
    this._languageTreeParser = "tree-sitter-go.wasm";
    this._lineCommentTokens = ["//"];
  }

  async provideFoldingRanges(document: TextDocument, context: FoldingContext, token: CancellationToken): Promise<FoldingRange[]> {
    const { collector, computed } = await this.computeFoldingRanges(document, context, token, FoldNinjaConfiguration.getMaxNumberOfBytesInIntenseMode());
    const documentItem = DocumentManager.getItem(document);
    documentItem.foldProvider = this;
    if (!computed) {
      documentItem.setFoldData(null);
      return [];
    }
    documentItem.setFoldData(collector);
    if (collector) {
      return collector.ranges;
    }
    return [];
  }

  async computeFoldingRanges(document: TextDocument, context: FoldingContext, token: CancellationToken, limit: number): Promise<{ collector: FoldRangeCollector|null; computed: boolean }> {
    const documentItem = DocumentManager.getItem(document);
    await documentItem.setParser(this._languageTreeParser); // Issue: this is an asynchronous call
    if (document.getText().length > limit) {
      return { collector: null, computed: false };
    }
    const parser = documentItem.parser; 
    if (parser) { // Issue: this is always false in the first call
      const tree = parser.parse(document.getText());
      const collector = new FoldRangeCollector("//");
      const range = this.parse([tree.rootNode], collector);
      console.log(collector);
      return { collector: collector, computed: true };
    }
    console.log("Parser not initialized");
    return { collector: null, computed: false };
  }

  private parse(nodes: Parser.SyntaxNode[], collector: FoldRangeCollector) {
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      if (node.type === "comment" && node.endPosition.row > node.startPosition.row) {
        collector.addFoldingRange(new FoldingRange(node.startPosition.row, node.endPosition.row, FoldingRangeKind.Comment, false));
      }
      if (node.type === "import_declaration" && node.endPosition.row > node.startPosition.row) {
        collector.addFoldingRange(new FoldingRange(node.startPosition.row, node.endPosition.row, FoldingRangeKind.Imports, false));
      }
      if (node.type === "function_declaration" && node.endPosition.row > node.startPosition.row) {
        collector.addFoldingRange(new FoldingRange(node.startPosition.row, node.endPosition.row));
        this.processFoldingRangesInsideFunction(node, collector);
      }
      if (node.type === "func_literal" && node.endPosition.row > node.startPosition.row) {
        this.processFoldingRangesInsideFunction(node, collector);
      }
      if (
        (node.type === "short_var_declaration" || node.type === "assignment_statement" || node.type === "return_statement" || node.type === "type_declaration") &&
        node.endPosition.row > node.startPosition.row
      ) {
        collector.addFoldingRange(new FoldingRange(node.startPosition.row, node.endPosition.row));
      }
      this.parse(node.children, collector);
    }
  }

  private processFoldingRangesInsideFunction(node: Parser.SyntaxNode, collector: FoldRangeCollector) {
    for (const child of node.children) {
      if (child.type === "block") {
        for (let i = 0; i < child.children.length - 2; i++) {
          const current = child.children[i];
          const next = child.children[i + 2];

          const isErrorAssignment =
            (current.type === "short_var_declaration" || current.type === "assignment_statement") &&
            (current.text.includes("err :=") || current.text.includes("err ="));
          const isErrorCheck = next.type === "if_statement" && next.text.includes("err != nil");

          if (isErrorAssignment && isErrorCheck) {
            const startLine = current.startPosition.row;
            const endLine = next.endPosition.row;
            if (startLine < endLine) {
              collector.addFoldingRange(new FoldingRange(startLine, endLine));
            }
          }
        }
      }
    }
  }
}
