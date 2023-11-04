import { Range } from "vscode";

export class Region {
  private startLine: number;
  private endLine: number;

  constructor(startLine: number, endLine: number) {
    this.startLine = startLine;
    this.endLine = endLine;
  }

  update(r: Range, _newText: string): boolean {
    if (r.start.line > this.endLine) {
      return false;
    }
    if (r.end.line < this.startLine) {
      // TODO: We need to update startLine and endLine
      return false;
    }

    // TODO: This part is more tricky as text inside the region has changed
    return true;
  }
}
