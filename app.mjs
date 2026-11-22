import { memoPayload } from './memo.mjs';
const input = document.querySelector('#memo');
const budget = document.querySelector('#budget');
const status = document.querySelector('#status');
const output = document.querySelector('#output');
const copy = document.querySelector('#copy');
const download = document.querySelector('#download');
let json = '';
function update() {
  try {
    const payload = memoPayload(input.value, Number(budget.value));
    json = JSON.stringify(payload, null, 2);
    output.textContent = json;
    status.textContent = `${payload.utf8Bytes} UTF-8 bytes · ${Number(budget.value) - payload.utf8Bytes} remaining`;
    status.dataset.error = 'false';
    copy.disabled = download.disabled = false;
  } catch (error) {
    json = ''; output.textContent = '';
    status.textContent = error.message; status.dataset.error = 'true';
    copy.disabled = download.disabled = true;
  }
}
input.addEventListener('input', update);
budget.addEventListener('input', update);
copy.addEventListener('click', async () => {
  try { await navigator.clipboard.writeText(json); status.textContent = 'JSON copied'; }
  catch { status.textContent = 'Copy is unavailable. Select the JSON output to copy it.'; }
});
download.addEventListener('click', () => {
  const url = URL.createObjectURL(new Blob([json], { type: 'application/json' }));
  const link = document.createElement('a'); link.href = url; link.download = 'memo-instruction.json'; link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
});
update();
