#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('=== Build Post-Processor ===');
console.log('Current directory:', process.cwd());
console.log('Files in current dir:');
fs.readdirSync('.').forEach(f => console.log(' ', f));

const distPath = path.resolve('docs');

console.log('\nChecking docs directory...');
if (fs.existsSync(distPath)) {
  console.log('✓ docs exists at:', distPath);
  const files = fs.readdirSync(distPath);
  console.log('  Contents:', files);
  
  // Ensure docs is readable
  if (files.includes('index.html')) {
    const htmlSize = fs.statSync(path.join(distPath, 'index.html')).size;
    console.log('  index.html size:', htmlSize, 'bytes');
  }
} else {
  console.log('✗ docs NOT found at:', distPath);
  process.exit(1);
}

console.log('\n✓ Post-build verification complete');
