import { FoldingRange } from "./FoldingRange";
import Parser from "web-tree-sitter";
import { BaseFoldProvider, LanguageType } from "./BaseFoldProvider";

export class CFoldProvider extends BaseFoldProvider {

    constructor() {
        super("tree-sitter-c.wasm", ["//"], [{start: "/*", end:"*/"}], LanguageType.PROCEDURAL);
    }
}
