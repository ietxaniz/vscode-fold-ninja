import { Status } from "../configuration/config";
import { computeHash } from "./computeHash";
import * as vscode from 'vscode';

interface FileInfo {
  name: string;
  hash: string;
  status: Status;
  foldingRanges: vscode.FoldingRange[];
}

export class StatusManager {
  private static _instance:StatusManager;
  static getInstance():StatusManager {
    if (!this._instance) {
      this._instance = new StatusManager();
    }
    return this._instance;
  }

  private _files:FileInfo[];
  constructor() {
    this._files = [];
  }

  update(fileName:string, content: string, status:Status):boolean {
    const hashb64 = computeHash(content);
    for (let i=0; i<this._files.length; i++) {
      if (this._files[i].name === fileName) {
        if (this._files[i].hash === hashb64 && this._files[i].status === status) {
          return false;
        }
        this._files[i].hash = hashb64;
        this._files[i].status = status;
        return true;
      }
    }
    this._files.push({
      name: fileName,
      hash: hashb64,
      status: status,
      foldingRanges: [],
    });
    return true;
  }

  setFoldingRanges(fileName:string, foldingRanges: vscode.FoldingRange[]) {
    for (let i=0; i<this._files.length; i++) {
      if (this._files[i].name === fileName) {
        this._files[i].foldingRanges = foldingRanges;
        return;
      }
    }
    this._files.push({
      name: fileName,
      hash: "",
      status: Status.Inactive,
      foldingRanges,
    });
  }

  getFoldingRanges(fileName: string):vscode.FoldingRange[] {
    for (let i=0; i<this._files.length; i++) {
      if (this._files[i].name === fileName) {
        return this._files[i].foldingRanges ;
      }
    }
    return [];
  }
}
