#!/usr/bin/env node
// Small source patches applied after `npm install` (run from the Dockerfile).
//
// hapi 16 on Node >= 16: IncomingMessage emits 'close' as soon as the request body
// has been consumed (not only when the socket drops). hapi 16 treats that 'close' as
// a client disconnect and silently aborts the response, so every POST/PUT with a
// body hangs. Only treat 'close' as a disconnect while the request is incomplete.
const fs = require('fs');
const path = require('path');

function patch(file, replacements) {
  const p = path.join(__dirname, '..', 'node_modules', file);
  let src = fs.readFileSync(p, 'utf8');
  for (const [from, to] of replacements) {
    if (src.includes(to)) continue; // already applied
    if (!src.includes(from)) throw new Error('patch target not found in ' + file + ': ' + from);
    src = src.replace(from, to);
  }
  fs.writeFileSync(p, src);
  console.log('patched', file);
}

patch('hapi/lib/request.js', [[
  "    this._onClose = () => {\n\n        this._log(['request', 'closed', 'error']);",
  "    this._onClose = () => {\n\n        if (this.raw.req.complete && !this.raw.req.aborted) {\n            return;                                                     // Node >= 16: 'close' follows 'end' of a consumed body\n        }\n\n        this._log(['request', 'closed', 'error']);",
]]);

patch('hapi/lib/transmit.js', [[
  "    const onClose = () => end(null, 'close');\n\n    request.raw.req.once('aborted', onAborted);\n    request.raw.req.once('close', onClose);",
  "    const onClose = () => end(null, 'close');\n    const onReqClose = () => {\n\n        if (!request.raw.req.complete || request.raw.req.aborted) {\n            return end(null, 'close');                                   // Node >= 16: 'close' follows 'end' of a consumed body\n        }\n    };\n\n    request.raw.req.once('aborted', onAborted);\n    request.raw.req.once('close', onReqClose);",
]]);
