export interface BlockCommentDelimiter {
  start: string;
  end: string;
}

export interface LineCommentDelimiter {
  start: string;
}

export interface StringDelimiter {
  delimiter: string;
  multiline: boolean;
}
