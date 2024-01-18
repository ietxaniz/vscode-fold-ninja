import * as fs from 'fs';
import * as path from 'path';
import * as assert from 'assert';
import * as vscode from 'vscode';
import { CStyleCommentFoldingRangeProvider } from '../../internal/foldProviders/CStyleCommentFoldingProvider';

suite('CStyleCommentFoldingRangeProvider Test Suite', () => {
  test('Block Comment Folding Test', async () => {
    const testFilePath = path.join(__dirname, '..', '..', '..', 'src', 'test', 'assets', 'time_manager.c');
    const content = fs.readFileSync(testFilePath, 'utf8');
    
    const document = await vscode.workspace.openTextDocument({ content });
    const provider = new CStyleCommentFoldingRangeProvider([{start: "/*", end: "*/"}], [{start: "//"}], []);
    const context = {}; // Adjust this as per your method's expectations
    const token: vscode.CancellationToken = new vscode.CancellationTokenSource().token;

    const foldingRanges = await provider.provideFoldingRanges(document, context, token);

    assert.strictEqual(foldingRanges.length, 5);
    assert.strictEqual(foldingRanges[0].start, 0);
    assert.strictEqual(foldingRanges[0].end, 4);
    assert.strictEqual(foldingRanges[1].start, 9);
    assert.strictEqual(foldingRanges[1].end, 12);
    assert.strictEqual(foldingRanges[2].start, 14);
    assert.strictEqual(foldingRanges[2].end, 15);
    assert.strictEqual(foldingRanges[3].start, 19);
    assert.strictEqual(foldingRanges[3].end, 22);
    assert.strictEqual(foldingRanges[4].start, 24);
    assert.strictEqual(foldingRanges[4].end, 25);
  });
});
