import { DocumentStatus } from "./DocumentStatus";

export class DocumentManager {
  private static documents:DocumentStatus[] = [];

  public static getDocument(fileName:string):DocumentStatus {
    for(let i=0; i<this.documents.length;i++) {
      if(this.documents[i].fileName === fileName) {
        return this.documents[i];
      }
    }
    const newDocument = new DocumentStatus(fileName);
    this.documents.push(newDocument);
    return newDocument;
  }
}
