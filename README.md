# XenofaArt

Sitio web de portfolio para Arte y Cosplay.

## Cómo añadir fotos nuevas

1. **Sube la imagen** a GitHub:
   - Ve al repositorio en GitHub
   - Entra en la carpeta `Arte/` o `Cosplay/` según corresponda
   - Haz clic en **Add file** → **Upload files**
   - Arrastra tu imagen (jpg, jpeg, png, gif o webp)
   - Haz commit

2. **Automático:** Un GitHub Action escaneará las carpetas y actualizará `galeria.json`. El **mensaje del commit** que escribas al subir se usará como descripción de la foto en el lightbox.

3. **Descripciones manuales:** Puedes editar `galeria.json` y añadir texto en el campo `"desc"` de cada imagen. Si dejas `"desc": ""` vacío, al subir una foto nueva el comentario del commit será la descripción.
