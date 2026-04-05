/**
 * Genera imágenes ligeras en {Arte,Cosplay,Pelucas}/_preview/*.webp
 * para la cuadrícula y el popup; el lightbox sigue usando el archivo original.
 *
 * Uso: npm run vistas-previas
 */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT = path.join(__dirname, '..');
const FOLDERS = ['Arte', 'Cosplay', 'Pelucas'];
const EXT = /\.(jpe?g|png|gif|webp)$/i;
const MAX_WIDTH = 960;
const WEBP_QUALITY = 78;

async function processFile(folder, file) {
  const srcPath = path.join(ROOT, folder, file);
  const stat = fs.statSync(srcPath);
  if (!stat.isFile()) return;

  const previewDir = path.join(ROOT, folder, '_preview');
  fs.mkdirSync(previewDir, { recursive: true });

  const base = path.basename(file, path.extname(file));
  const outPath = path.join(previewDir, `${base}.webp`);

  const inStat = stat;
  if (fs.existsSync(outPath)) {
    const outStat = fs.statSync(outPath);
    if (outStat.mtimeMs >= inStat.mtimeMs) return;
  }

  await sharp(srcPath)
    .rotate()
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .webp({ quality: WEBP_QUALITY, effort: 4 })
    .toFile(outPath);

  console.log('OK', path.relative(ROOT, outPath));
}

async function main() {
  let count = 0;
  for (const folder of FOLDERS) {
    const dir = path.join(ROOT, folder);
    if (!fs.existsSync(dir)) continue;
    const files = fs.readdirSync(dir).filter(f => EXT.test(f));
    for (const file of files) {
      await processFile(folder, file);
      count++;
    }
  }
  console.log(`Vistas previas: ${count} origen(es) comprobados en ${FOLDERS.join(', ')}`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
