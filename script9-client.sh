#!/usr/bin/env bash
set -euo pipefail
echo "Applying UDESPORT frontend round-9: Vercel SPA deployment config..."

mkdir -p "$(dirname "vercel.json")"
cat > "vercel.json" << 'UDE9_01_EOF'
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
UDE9_01_EOF
echo "  wrote vercel.json"

echo ""
echo "Done. Next steps:"
echo "  1. npm run build && npx tsc --noEmit -p tsconfig.app.json && npx eslint ."
echo "  2. git add -A && git commit -m \"add Vercel SPA deployment config\" && git push"
echo "  3. In the Vercel dashboard: import this repo (Vite framework should auto-detect), set VITE_API_URL to your deployed backend URL + /api, and deploy."
