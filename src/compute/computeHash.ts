import * as crypto from 'crypto'

export const computeHash = (content: string): string => {
  const hash = crypto.createHash('sha1');
  hash.update(content);
  return hash.digest('base64');
}
