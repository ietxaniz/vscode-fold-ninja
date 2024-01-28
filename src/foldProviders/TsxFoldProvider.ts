import { TextDocument, FoldingContext, CancellationToken } from "vscode";
import Parser from "web-tree-sitter";
import { FoldingRange, FoldingRangeType } from "./FoldingRange";
import { DocumentManager } from "../store/DocumentManager";
import { FoldNinjaConfiguration } from "../configuration/FoldNinjaConfiguration";
import { FoldingRangeProvider } from "./FoldingRangeProvider";
import { FoldRangeCollector } from "./FoldRangeCollector";

export class TsxFoldProvider implements FoldingRangeProvider {
  protected _languageTreeParser: string;

  constructor() {
    this._languageTreeParser = "tree-sitter-tsx.wasm";
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

  async computeFoldingRanges(
    document: TextDocument,
    context: FoldingContext,
    token: CancellationToken,
    limit: number
  ): Promise<{ collector: FoldRangeCollector | null; computed: boolean }> {
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
      this.parseImports(tree.rootNode.children, collector);
      this.parse([tree.rootNode], collector);
      return { collector: collector, computed: true };
    }
    return { collector: null, computed: false };
  }

  private parseImports(nodes: Parser.SyntaxNode[], collector: FoldRangeCollector) {
    let startIndex = -1;
    let endIndex = -1;
    for (let i = 0; i < nodes.length; i++) {
      if (nodes[i].type === "import_statement") {
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

  private parse(nodes: Parser.SyntaxNode[], collector: FoldRangeCollector) {
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      this.parse(node.children, collector);
      if (node.type === "comment" && node.endPosition.row > node.startPosition.row) {
        collector.addFoldingRange(new FoldingRange(node.startPosition.row, node.endPosition.row, FoldingRangeType.Comment));
      }
      if (
        (node.type === "lexical_declaration" || node.type === "export_statement" || node.type === "interface_declaration" || node.type === "public_field_definition") &&
        node.endPosition.row > node.startPosition.row
      ) {
        collector.addFoldingRange(new FoldingRange(node.startPosition.row, node.endPosition.row, FoldingRangeType.Declaration));
      }
      if (
        (node.type === "class_declaration") &&
        node.endPosition.row > node.startPosition.row
      ) {
        collector.addFoldingRange(new FoldingRange(node.startPosition.row, node.endPosition.row, FoldingRangeType.Class));
      }
      if (
        (node.type === "method_definition") &&
        node.endPosition.row > node.startPosition.row
      ) {
        collector.addFoldingRange(new FoldingRange(node.startPosition.row, node.endPosition.row, FoldingRangeType.Function));
      }
      if (
        (node.type === "jsx_element") &&
        node.endPosition.row > node.startPosition.row
      ) {
        collector.addFoldingRange(new FoldingRange(node.startPosition.row, node.endPosition.row, FoldingRangeType.Jsx));
      }
    }
  }
}
