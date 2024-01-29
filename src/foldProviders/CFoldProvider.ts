import { TextDocument, FoldingContext, CancellationToken, ProviderResult, FoldingRangeKind } from "vscode";
import Parser from "web-tree-sitter";
import { FoldingRange, FoldingRangeType } from "./FoldingRange";
import { DocumentManager } from "../store/DocumentManager";
import { FoldNinjaConfiguration } from "../configuration/FoldNinjaConfiguration";
import { FoldingRangeProvider } from "./FoldingRangeProvider";
import { FoldRangeCollector } from "./FoldRangeCollector";

export class CFoldProvider implements FoldingRangeProvider {

  protected _languageTreeParser: string;

  constructor() {
    this._languageTreeParser = "tree-sitter-c.wasm";
  }

  async provideFoldingRanges(document: TextDocument, context: FoldingContext, token: CancellationToken): Promise<FoldingRange[]> {
    const { collector, computed } = await this.computeFoldingRanges(document, context, token, FoldNinjaConfiguration.getMaxNumberOfBytes());
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
    await documentItem.setParser(this._languageTreeParser);
    const text = document.getText();
    if (text.length > limit) {
      return { collector: null, computed: false };
    }
    const parser = documentItem.parser; 
    if (parser) {
      const tree = parser.parse(text);
      const collector = new FoldRangeCollector("//", text);
      this.parsePreproc(tree.rootNode.children, collector);
      this.parse([tree.rootNode], collector);
      return { collector: collector, computed: true };
    }
    return { collector: null, computed: false };
  }

  private parse(nodes: Parser.SyntaxNode[], collector: FoldRangeCollector) {
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      if (node.type === "comment" && node.endPosition.row > node.startPosition.row) {
        collector.addFoldingRange(new FoldingRange(node.startPosition.row, node.endPosition.row, FoldingRangeType.Comment));
      }
      if (node.type === "import_declaration" && node.endPosition.row > node.startPosition.row) {
        collector.addFoldingRange(new FoldingRange(node.startPosition.row, node.endPosition.row, FoldingRangeType.Import));
      }
      if (node.type === "function_definition" && node.endPosition.row > node.startPosition.row) {
        collector.addFoldingRange(new FoldingRange(node.startPosition.row, node.endPosition.row, FoldingRangeType.Function));
      }
      if (
        (node.type === "short_var_declaration" || node.type === "assignment_statement"  || node.type === "type_declaration") &&
        node.endPosition.row > node.startPosition.row
      ) {
        collector.addFoldingRange(new FoldingRange(node.startPosition.row, node.endPosition.row, FoldingRangeType.Declaration));
      }
      this.parse(node.children, collector);
    }
  }

  private parsePreproc(nodes: Parser.SyntaxNode[], collector: FoldRangeCollector) {
    let startIndex = -1;
    let endIndex = -1;
    for (let i = 0; i < nodes.length; i++) {
      if (nodes[i].type === "preproc_include" || nodes[i].type === "preproc_ifdef" || nodes[i].type === "preproc_def") {
        if (startIndex < 0) {
          startIndex = nodes[i].startPosition.row;
        }
        endIndex = nodes[i].endPosition.row;
      } else {
        break;
      }
    }
    if (startIndex < endIndex) {
      collector.addFoldingRange(new FoldingRange(startIndex, endIndex, FoldingRangeType.Import));
    }
  }
}
