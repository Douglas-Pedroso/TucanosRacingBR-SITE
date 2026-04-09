import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const svgPath = path.join(__dirname, 'logo.svg');
const pngPath = path.join(__dirname, 'logo.png');

sharp(svgPath)
  .resize(512, 512, {
    fit: 'contain',
    background: { r: 10, g: 14, b: 39, alpha: 1 }
  })
  .png()
  .toFile(pngPath)
  .then(() => {
    console.log('✓ Logo PNG criada com sucesso:', pngPath);
  })
  .catch(err => {
    console.error('Erro ao criar PNG:', err);
  });
