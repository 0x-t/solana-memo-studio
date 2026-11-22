export const MEMO_PROGRAM = 'MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr';

function validUnicode(text) {
  for (let i = 0; i < text.length; i++) {
    const code = text.charCodeAt(i);
    if (code >= 0xd800 && code <= 0xdbff) {
      const next = text.charCodeAt(++i);
      if (!(next >= 0xdc00 && next <= 0xdfff)) throw new Error('Text contains an unpaired high surrogate');
    } else if (code >= 0xdc00 && code <= 0xdfff) throw new Error('Text contains an unpaired low surrogate');
  }
}

export function memoPayload(text, byteBudget = 256) {
  if (typeof text !== 'string') throw new TypeError('Memo text must be a string');
  if (!Number.isInteger(byteBudget) || byteBudget < 1 || byteBudget > 1024) throw new RangeError('Choose a byte budget from 1 to 1024');
  validUnicode(text);
  const bytes = new TextEncoder().encode(text);
  if (bytes.length > byteBudget) throw new RangeError(`Memo uses ${bytes.length} bytes; chosen budget is ${byteBudget}`);
  const binary = Array.from(bytes, value => String.fromCharCode(value)).join('');
  return {
    programId: MEMO_PROGRAM,
    accounts: [],
    utf8Bytes: bytes.length,
    dataBase64: btoa(binary),
    dataHex: Array.from(bytes, value => value.toString(16).padStart(2, '0')).join(''),
  };
}
