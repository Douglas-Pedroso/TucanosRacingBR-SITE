#!/bin/bash
set -e

echo "=== Building application ==="
npm run build

echo "=== Verifying dist directory ==="
if [ -d "dist" ]; then
  echo "✓ dist directory found"
  echo "✓ Contents:"
  ls -lah dist/
else
  echo "✗ dist directory NOT found!"
  exit 1
fi

echo "=== Listing current directory ==="
pwd
ls -la

echo "=== Build verification complete ==="
