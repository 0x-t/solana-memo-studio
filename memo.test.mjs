import test from 'node:test';
import assert from 'node:assert/strict';
import { memoPayload, MEMO_PROGRAM } from './memo.mjs';

test('ASCII output matches independent known bytes', () => {
  const result = memoPayload('Hello, Solana!');
  assert.equal(result.programId, MEMO_PROGRAM);
  assert.equal(result.dataBase64, 'SGVsbG8sIFNvbGFuYSE=');
  assert.equal(result.dataHex, '48656c6c6f2c20536f6c616e6121');
  assert.equal(result.utf8Bytes, 14);
  assert.deepEqual(result.accounts, []);
});
test('the budget counts UTF-8 bytes, including supplementary characters', () => {
  assert.equal(memoPayload('π').dataHex, 'cf80');
  assert.equal(memoPayload('星').utf8Bytes, 3);
  assert.equal(memoPayload('🚀', 4).dataHex, 'f09f9a80');
  assert.throws(() => memoPayload('🚀', 3), /4 bytes/);
});
test('empty text is an empty instruction payload', () => {
  assert.equal(memoPayload('').dataBase64, '');
  assert.equal(memoPayload('').utf8Bytes, 0);
});
test('ill-formed Unicode is rejected instead of silently replaced', () => {
  assert.throws(() => memoPayload('\ud800'), /surrogate/);
  assert.throws(() => memoPayload('\udc00'), /surrogate/);
  assert.throws(() => memoPayload('\ud800a'), /surrogate/);
});
test('budgets and input types are validated', () => {
  assert.throws(() => memoPayload('x', 0), /budget/);
  assert.throws(() => memoPayload('x', 1025), /budget/);
  assert.throws(() => memoPayload('x', 1.5), /budget/);
  assert.throws(() => memoPayload(123), /string/);
  assert.throws(() => memoPayload('x'.repeat(257)), /257 bytes/);
});
