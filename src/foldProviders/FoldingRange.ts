import * as vscode from "vscode";

export enum FoldingRangeType {
  Comment = "comment",
  Import = "import",
  Region = "region",
  Function = "func",
  Error = "err",
  Declaration = "decl",
  Class = "class",
  Jsx = "jsx",
}

export class FoldingRange extends vscode.FoldingRange {
  protected _foldType: FoldingRangeType;
  constructor(start: number, end: number, foldType: FoldingRangeType) {
    switch (foldType) {
      case FoldingRangeType.Comment:
        super(start, end, vscode.FoldingRangeKind.Comment);
        break;
      case FoldingRangeType.Import:
        super(start, end, vscode.FoldingRangeKind.Imports);
        break;
      case FoldingRangeType.Region:
        super(start, end, vscode.FoldingRangeKind.Region);
        break;
      default:
        super(start, end);
        break;
    }
    this._foldType = foldType;
  }

  get foldType() {
    return this._foldType;
  }

  static getTypesFromString(typeListDefinition: string): { addFirstComment: boolean; types: FoldingRangeType[] } {
    const items = typeListDefinition.split(",");
    let addFirstComment = false;
    let types: FoldingRangeType[] = [];
    for (let i = 0; i < items.length; i++) {
      const item = items[i].trim();
      if (item === "first-comment") {
        addFirstComment = true;
      } else {
        for (const value of Object.values(FoldingRangeType)) {
          if (value === item && types.indexOf(value) < 0) {
            types.push(value);
          }
        }
      }
    }
    for (let i = 0; i < items.length; i++) {
      if (items[i] === FoldingRangeType.Comment) {
        addFirstComment = false;
      }
    }
    return { addFirstComment, types };
  }
}
