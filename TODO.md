# TODO – Guía paso a paso para XenofaArt

## 1. Descripciones en el lightbox

- **Situación**: Las descripciones de las fotos no se veían en el lightbox.
- **Cambios realizados**:
  - `script.js`: `buildLightboxImages` ahora incluye `desc` desde `data-desc`.
  - `script.js`: `updateLightboxImage` actualiza también `lightbox-desc` con el texto.
  - `styles.css`: `.lightbox-desc` tiene `min-height` y `flex: 1` para verse bien.
  - `index.html`: Se sincroniza `lightboxImages` cuando se abre con `openLightboxInline`.
- **Comprobación**: Abrir una foto en la galería y verificar que la descripción aparece en el panel derecho.

---

## 2. Sección Pelucas

### 2.1 Estructura de carpetas

- Carpeta: `Pelucas/`
- Imágenes: `.jpg`, `.jpeg`, `.png`, `.gif`, `.webp`

### 2.2 Archivos modificados

| Archivo | Cambio |
|---------|--------|
| `galeria.json` | Añadida sección `pelucas` con las imágenes de `Pelucas/`. |
| `scripts/generar-galeria.js` | Añadido `{ folder: 'Pelucas', key: 'pelucas' }` en `DIRS`. |
| `.github/workflows/actualizar-galeria.yml` | Añadido `Pelucas/**` en `paths` del `push`. |
| `index.html` | Nav, página `page-pelucas`, galería `data-galeria="pelucas"`. |
| `script.js` | Carga de galería pelucas, sparkles, `initPopupPelucas`. |
| `styles.css` | Estilos `.section-pelucas`, `.gallery-pelucas`. |

### 2.3 Cómo añadir fotos nuevas a Pelucas

1. Guardar las imágenes en `Pelucas/`.
2. Hacer commit y push a `main` (o la rama que use el workflow).
3. El workflow `actualizar-galeria.yml` se ejecuta al cambiar `Pelucas/**`.
4. El script `generar-galeria.js` actualiza `galeria.json` con las nuevas fotos.
5. Si hace falta, editar manualmente las descripciones en `galeria.json`.

---

## 3. Popup anuncio estilizado de pelucas

### 3.1 Comportamiento

- Mensaje: *"¿Quieres que tu peluca quede así? También contamos con servicios de estilizados de pelucas."*
- Slider de fotos: usa las imágenes de `pelucas` en `galeria.json`.
- Se muestra automáticamente la primera vez en la sesión (tras ~2.5 s).
- Flechas prev/next y avance automático cada 4 s.
- Botón "Ver pelucas" que cierra el popup y va a la sección Pelucas.

### 3.2 Archivos

- `index.html`: HTML del popup.
- `styles.css`: Estilos `.popup-pelucas-*`.
- `script.js`: Función `initPopupPelucas()` que llena el slider y configura eventos.

### 3.3 Cambiar fotos del popup

El popup usa las mismas imágenes que la galería Pelucas en `galeria.json`. Al subir fotos nuevas a `Pelucas/`, se actualizan galería y popup a la vez.

---

## 4. Subir cambios a git

```bash
# 1. Ir al directorio del proyecto
cd c:\Users\josef\Desktop\KijiWasHere\HIsoka

# 2. Ver qué archivos han cambiado
git status

# 3. Añadir todos los cambios
git add .

# 4. Commit con mensaje descriptivo
git commit -m "feat: descripciones en lightbox, sección Pelucas, popup estilizado"

# 5. Subir a GitHub (ajustar rama si es necesario)
git push origin main
```

---

## 5. Resumen de archivos tocados

| Archivo | Descripción |
|---------|-------------|
| `index.html` | Nav Pelucas, página Pelucas, popup, funciones JS inline. |
| `script.js` | Galería pelucas, popup, lightbox con desc, sync. |
| `styles.css` | Lightbox desc, sección pelucas, popup. |
| `galeria.json` | Sección `pelucas` (generada por el script). |
| `scripts/generar-galeria.js` | Inclusión de `Pelucas` en `DIRS`. |
| `.github/workflows/actualizar-galeria.yml` | Trigger con `Pelucas/**`. |
| `Pelucas/` | Carpeta nueva con imágenes. |

---

## 6. Evitar confusiones

1. **Descripciones**: Si no se ven, revisar que `galeria.json` tenga `desc` en cada ítem.
2. **Pelucas**: Las fotos han de estar en `Pelucas/`; el workflow actualiza `galeria.json`.
3. **Popup**: Solo se muestra una vez por sesión; borrar `sessionStorage` si quieres probarlo de nuevo.
4. **Workflow**: Se ejecuta solo al hacer push de cambios en `Arte/**`, `Cosplay/**` o `Pelucas/**`.
