#!/usr/bin/env bash
set -euo pipefail
echo "Restoring vercel.json to the CLIENT repo (udesports-client) -- this got accidentally deleted..."

mkdir -p "$(dirname "vercel.json")"
cat > "vercel.json" << 'UDERESTORE_01_EOF'
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
UDERESTORE_01_EOF
echo "  wrote vercel.json"

echo ""
echo "Done. Next steps -- make sure you are inside udesports-client, NOT udesports-server:"
echo "  1. pwd    (double check this says .../udesports-client)"
echo "  2. npm run build"
echo "  3. git add -A && git commit -m \"restore vercel.json for SPA routing\" && git push"
