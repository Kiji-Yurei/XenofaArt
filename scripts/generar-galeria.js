/**
 * Genera galeria.json escaneando las carpetas Arte/ y Cosplay/
 * Extensiones permitidas: jpg, jpeg, png, gif, webp
 */
const fs = require('fs');
const path = require('path');

const DIRS = [
  { folder: 'Arte', key: 'arte' },
  { folder: 'Cosplay', key: 'cosplay' }
];
const EXT = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];

const galeria = {};

DIRS.forEach(({ folder, key }) => {
  const dirPath = path.join(__dirname, '..', folder);
  if (!fs.existsSync(dirPath)) {
    galeria[key] = [];
    return;
  }
  const files = fs.readdirSync(dirPath)
    .filter(f => EXT.some(e => f.toLowerCase().endsWith(e)))
    .map(f => `${folder}/${f}`)
    .sort();
  galeria[key] = files;
});

const outputPath = path.join(__dirname, '..', 'galeria.json');
fs.writeFileSync(outputPath, JSON.stringify(galeria, null, 2));
console.log('galeria.json actualizado:', Object.keys(galeria).map(k => `${k}: ${galeria[k].length} imágenes`).join(', '));
