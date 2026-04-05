/**
 * Genera imágenes ligeras en {Arte,Cosplay,Pelucas}/_preview/*.webp
 * para la cuadrícula y el popup; el lightbox sigue usando el archivo original.
 *
 * Uso: npm run vistas-previas
 * Tras cambiar recetas de compresión: npm run vistas-previas -- --force
 */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT = path.join(__dirname, '..');
const FOLDERS = ['Arte', 'Cosplay', 'Pelucas'];
const EXT = /\.(jpe?g|png|gif|webp)$/i;

/** Arte: mismo tamaño y recorte → pesos y tiempos de descarga más parejos */
const PREVIEW_BY_FOLDER = {
  Arte: {
    resize: { width: 720, height: 720, fit: 'cover', position: 'centre' },
    webp: { quality: 76, effort: 4 },
  },
  default: {
    resize: { width: 960, withoutEnlargement: true },
    webp: { quality: 78, effort: 4 },
  },
};

const forceRegenerate = process.argv.includes('--force');

async function processFile(folder, file) {
  const srcPath = path.join(ROOT, folder, file);
  const stat = fs.statSync(srcPath);
  if (!stat.isFile()) return;

  const previewDir = path.join(ROOT, folder, '_preview');
  fs.mkdirSync(previewDir, { recursive: true });

  const base = path.basename(file, path.extname(file));
  const outPath = path.join(previewDir, `${base}.webp`);

  const inStat = stat;
  if (!forceRegenerate && fs.existsSync(outPath)) {
    const outStat = fs.statSync(outPath);
    if (outStat.mtimeMs >= inStat.mtimeMs) return;
  }

  const opts = PREVIEW_BY_FOLDER[folder] || PREVIEW_BY_FOLDER.default;
  let pipeline = sharp(srcPath).rotate();

  const r = opts.resize;
  if (r.height != null && r.fit) {
    pipeline = pipeline.resize(r.width, r.height, {
      fit: r.fit,
      position: r.position || 'centre',
    });
  } else {
    pipeline = pipeline.resize({
      width: r.width,
      withoutEnlargement: r.withoutEnlargement !== false,
    });
  }

  await pipeline.webp(opts.webp).toFile(outPath);

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
