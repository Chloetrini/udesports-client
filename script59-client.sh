#!/bin/bash
set -e

echo "Applying: import react-toastify's stylesheet (fixes toasts rendering behind other content)..."

python3 - << 'PYEOF'
import sys

def patch(path, old, new, expected=1):
    with open(path, "r") as f:
        content = f.read()
    count = content.count(old)
    if count != expected:
        print(f"ABORT: expected {expected} match(es) of a block in {path}, found {count}.")
        print("The file may have changed since this script was generated — nothing was written.")
        sys.exit(1)
    content = content.replace(old, new)
    with open(path, "w") as f:
        f.write(content)
    print(f"Patched {path}")

with open("src/App.tsx") as f:
    _c = f.read()

if "react-toastify/dist/ReactToastify.css" not in _c:
    patch(
        "src/App.tsx",
        '''import './App.css'
import {RouterProvider} from 'react-router'
 import { ToastContainer } from 'react-toastify';''',
        '''import './App.css'
import {RouterProvider} from 'react-router'
 import { ToastContainer } from 'react-toastify';
 // Without this stylesheet, react-toastify's container has no position:fixed
 // or z-index at all — it just sits in normal page flow, which is why
 // toasts were rendering underneath the navbar/modals/other content instead
 // of floating on top.
 import 'react-toastify/dist/ReactToastify.css';''',
    )
else:
    print("Skipped — src/App.tsx already imports react-toastify's stylesheet.")

print("Done.")
PYEOF

echo ""
echo "Changed: src/App.tsx (one import line added)"
echo ""
echo "What this fixes: react-toastify's own CSS was never being imported"
echo "anywhere in the app. Without it, the toast container has no"
echo "position:fixed or z-index — it just renders as a plain block in"
echo "normal page flow, so it ends up buried behind your navbar, modals,"
echo "and other positioned elements instead of floating on top like a"
echo "toast is supposed to. This one import fixes it everywhere toasts"
echo "are used across the whole app, not just one page."
echo ""
echo "Now run:"
echo "  npx tsc -p tsconfig.app.json --noEmit && npx eslint . && npm run build"
echo "to double check, then commit and push as usual."
