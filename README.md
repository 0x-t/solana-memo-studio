# Solana Memo Studio

A small offline-first browser tool for understanding Solana memo instruction
data: UTF-8 byte counts, hexadecimal bytes and Base64 JSON exports.

```sh
# Node.js 20 or newer, no dependency install
node serve.mjs
# Open http://127.0.0.1:4173/
node --test
```

Type text, choose a byte budget and copy or download the resulting instruction
data. The library `memo.mjs` also runs directly in Node. Its tests cover Unicode,
surrogate pairs, byte-budget boundaries and known byte encodings.

The chosen budget is an editor limit, not an assertion that a full transaction
will fit. Account addresses, signatures and other instructions also consume
transaction space. The legacy/v0 and v1 transaction formats have different
limits. Always validate a complete transaction with the intended SDK/network.

This tool has no wallet, signing, RPC calls, persistence, analytics or external
assets. Text stays in memory unless you choose to export it. The local server
serves only five allowlisted application files, not arbitrary directory files.

References: the [Memo program on Solana Explorer](https://explorer.solana.com/address/MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr)
and [Solana transaction formats](https://solana.com/docs/core/transactions/versioned-transactions),
reviewed 22 November 2026. Original educational code created with AI assistance.
