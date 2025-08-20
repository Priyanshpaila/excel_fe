export function b64url(obj){ const raw = JSON.stringify(obj); const b64 = btoa(unescape(encodeURIComponent(raw))); return b64.replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'') }
