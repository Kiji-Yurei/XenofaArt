/**
 * Genera galeria.json escaneando Arte/ y Cosplay/
 * Usa el mensaje del commit como descripción para cada foto (al subir nueva)
 * Las descripciones existentes se preservan para edición manual
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const DIRS = [
  { folder: 'Arte', key: 'arte' },
  { folder: 'Cosplay', key: 'cosplay' },
  { folder: 'Pelucas', key: 'pelucas' }
];
const EXT = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];

function getCommitMessage(filePath) {
  try {
    const msg = execSync(`git log -1 --format=%B -- "${filePath}"`, {
      encoding: 'utf8',
      cwd: path.join(__dirname, '..')
    }).trim();
    return msg || '';
  } catch {
    return '';
  }
}

function getExistingDescriptions() {
  const jsonPath = path.join(__dirname, '..', 'galeria.json');
  if (!fs.existsSync(jsonPath)) return {};
  try {
    const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    const out = {};
    DIRS.forEach(({ key }) => {
      out[key] = {};
      if (Array.isArray(data[key])) {
        data[key].forEach(item => {
          const src = typeof item === 'string' ? item : item.src;
          if (src) out[key][src] = (typeof item === 'object' && item.desc) ? item.desc : '';
        });
      }
    });
    return out;
  } catch {
    return {};
  }
}

const existing = getExistingDescriptions();
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

  galeria[key] = files.map(src => {
    const existingDesc = existing[key] && existing[key].hasOwnProperty(src) ? existing[key][src] : null;
    const commitDesc = getCommitMessage(src);
    const desc = existingDesc !== null && existingDesc !== undefined ? existingDesc : (commitDesc || '');
    return { src, desc };
  });
});

const outputPath = path.join(__dirname, '..', 'galeria.json');
fs.writeFileSync(outputPath, JSON.stringify(galeria, null, 2));
console.log('galeria.json actualizado:', Object.keys(galeria).map(k => `${k}: ${galeria[k].length} imágenes`).join(', '));
