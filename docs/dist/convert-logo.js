const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

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
