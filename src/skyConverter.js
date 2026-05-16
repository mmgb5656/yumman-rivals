const Jimp = require('jimp');
const fs = require('fs-extra');
const path = require('path');

/**
 * Convierte una imagen a skybox de Roblox (.tex = PNG 1024x1024).
 *
 * Los archivos .tex de Roblox son PNG estándar renombrados.
 * Cada skybox tiene 6 caras: ft, bk, lf, rt, up, dn.
 *
 * Modos de conversión según el tipo de imagen:
 *   1. Panorámica equirectangular (2:1 ratio) → proyección esférica a 6 caras
 *   2. Imagen normal (cualquier ratio)        → tinte de color sobre plantilla
 *
 * @param {string} imagePath     - Ruta de la imagen del usuario
 * @param {string} outputDir     - Directorio de salida para los .tex
 * @param {string} templateSkybox - Ruta al skybox plantilla (para fallback)
 * @returns {Promise<Object>}
 */
async function convertImageToSkybox(imagePath, outputDir, templateSkybox = null) {
  try {
    console.log('=== CONVIRTIENDO IMAGEN A SKYBOX ===');
    console.log('Imagen:', imagePath);
    console.log('Salida:', outputDir);

    await fs.ensureDir(outputDir);

    const userImage = await Jimp.read(imagePath);
    const { width, height } = userImage.bitmap;
    const ratio = width / height;

    console.log(`Dimensiones: ${width}x${height} (ratio ${ratio.toFixed(2)})`);

    // ── Modo 1: Panorámica equirectangular (ratio ~2:1) ───────────────────────
    // Una imagen panorámica 360° se puede proyectar en 6 caras reales
    if (ratio >= 1.8 && ratio <= 2.2) {
      console.log('Modo: panorámica equirectangular → 6 caras reales');
      return await convertEquirectangular(userImage, outputDir);
    }

    // ── Modo 2: Imagen normal → tinte sobre plantilla ─────────────────────────
    // Tomamos la imagen, la escalamos a 1024x1024 y la usamos directamente
    // como las 6 caras. Resultado: skybox de color sólido con la imagen.
    console.log('Modo: imagen directa → 6 caras con la imagen del usuario');
    return await convertDirectImage(userImage, outputDir, templateSkybox);

  } catch (error) {
    console.error('Error al convertir imagen:', error);
    return { success: false, message: `Error: ${error.message}` };
  }
}

/**
 * Convierte una imagen equirectangular (panorámica 360°) en 6 caras de skybox.
 * Cada cara se extrae de la región correspondiente de la panorámica.
 *
 * Layout equirectangular → cubemap:
 *   ft (front)  = centro
 *   bk (back)   = opuesto al centro
 *   lf (left)   = 90° izquierda
 *   rt (right)  = 90° derecha
 *   up (top)    = polo norte
 *   dn (bottom) = polo sur
 */
async function convertEquirectangular(image, outputDir) {
  const SIZE = 1024;

  // Escalar la panorámica a 4096x2048 para mejor calidad de muestreo
  const pano = image.clone().resize(4096, 2048, Jimp.RESIZE_BICUBIC);
  const pW = pano.bitmap.width;
  const pH = pano.bitmap.height;

  // Definición de las 6 caras: [nombre, yaw_center_deg, pitch_center_deg]
  // yaw: rotación horizontal (0=frente, 90=derecha, 180=atrás, 270=izquierda)
  // pitch: rotación vertical (0=horizonte, 90=arriba, -90=abajo)
  const faces = [
    { name: 'sky512_ft', yaw: 0,   pitch: 0  },
    { name: 'sky512_bk', yaw: 180, pitch: 0  },
    { name: 'sky512_lf', yaw: 270, pitch: 0  },
    { name: 'sky512_rt', yaw: 90,  pitch: 0  },
    { name: 'sky512_up', yaw: 0,   pitch: 90 },
    { name: 'sky512_dn', yaw: 0,   pitch: -90 },
  ];

  let copiedCount = 0;

  for (const face of faces) {
    const faceImg = new Jimp(SIZE, SIZE, 0x000000FF);

    const yawRad   = (face.yaw   * Math.PI) / 180;
    const pitchRad = (face.pitch * Math.PI) / 180;

    // Para cada píxel de la cara, calcular la dirección 3D y mapear a la panorámica
    for (let py = 0; py < SIZE; py++) {
      for (let px = 0; px < SIZE; px++) {
        // Coordenadas normalizadas [-1, 1]
        const u = (px / (SIZE - 1)) * 2 - 1;
        const v = (py / (SIZE - 1)) * 2 - 1;

        // Dirección 3D en el espacio de la cara
        let dx, dy, dz;

        if (face.pitch === 0) {
          // Caras laterales
          const faceYaw = face.yaw * Math.PI / 180;
          // Vector forward de la cara
          const fx = Math.sin(faceYaw);
          const fz = Math.cos(faceYaw);
          // Vector right de la cara (perpendicular)
          const rx = Math.cos(faceYaw);
          const rz = -Math.sin(faceYaw);

          dx = fx + u * rx;
          dy = -v; // y invertido
          dz = fz + u * rz;
        } else if (face.pitch === 90) {
          // Cara superior (up)
          dx = u;
          dy = -1;
          dz = v;
        } else {
          // Cara inferior (dn)
          dx = u;
          dy = 1;
          dz = -v;
        }

        // Normalizar
        const len = Math.sqrt(dx * dx + dy * dy + dz * dz);
        dx /= len; dy /= len; dz /= len;

        // Convertir dirección 3D a coordenadas esféricas
        const theta = Math.atan2(dx, dz); // azimuth [-π, π]
        const phi   = Math.asin(Math.max(-1, Math.min(1, dy))); // elevación [-π/2, π/2]

        // Mapear a coordenadas de la panorámica [0, 1]
        const panoU = (theta / (2 * Math.PI) + 0.5) % 1;
        const panoV = 0.5 - phi / Math.PI;

        // Muestrear la panorámica (bilinear)
        const srcX = Math.min(pW - 1, Math.max(0, Math.round(panoU * (pW - 1))));
        const srcY = Math.min(pH - 1, Math.max(0, Math.round(panoV * (pH - 1))));

        const color = pano.getPixelColor(srcX, srcY);
        faceImg.setPixelColor(color, px, py);
      }
    }

    const destPath = path.join(outputDir, `${face.name}.tex`);
    await faceImg.writeAsync(destPath);
    copiedCount++;
    console.log(`  ✓ ${face.name}.tex generado`);
  }

  // Preview
  const preview = image.clone().resize(512, 256, Jimp.RESIZE_BICUBIC);
  await preview.writeAsync(path.join(outputDir, '! SCREENSHOT.png'));

  return {
    success: true,
    message: `Skybox panorámico convertido (${copiedCount} caras reales desde tu imagen)`,
    files: copiedCount,
    mode: 'equirectangular',
  };
}

/**
 * Usa la imagen directamente como las 6 caras del skybox.
 * La imagen se escala a 1024x1024 y se aplica a todas las caras.
 * Si la imagen tiene ratio 1:1 o similar, el resultado es un skybox
 * de "color sólido" con la textura de la imagen en todas las caras.
 */
async function convertDirectImage(image, outputDir, templateSkybox) {
  const SIZE = 1024;
  const faceNames = ['sky512_ft', 'sky512_bk', 'sky512_lf', 'sky512_rt', 'sky512_up', 'sky512_dn'];

  // Escalar la imagen a 1024x1024
  const scaled = image.clone().resize(SIZE, SIZE, Jimp.RESIZE_BICUBIC);

  let copiedCount = 0;

  for (const name of faceNames) {
    const destPath = path.join(outputDir, `${name}.tex`);
    try {
      await scaled.clone().writeAsync(destPath);
      copiedCount++;
      console.log(`  ✓ ${name}.tex`);
    } catch (e) {
      console.warn(`  ✗ Error en ${name}:`, e.message);
    }
  }

  // Preview
  const preview = image.clone().resize(512, 512, Jimp.RESIZE_BICUBIC);
  await preview.writeAsync(path.join(outputDir, '! SCREENSHOT.png'));

  return {
    success: true,
    message: `Skybox creado con tu imagen en las 6 caras (${copiedCount} archivos)`,
    files: copiedCount,
    mode: 'direct',
    tip: 'Para mejor resultado usa una imagen panorámica 360° (ratio 2:1)',
  };
}

/**
 * Obtiene el color dominante de una imagen Jimp.
 * @param {Jimp} image
 * @returns {{ r: number, g: number, b: number }}
 */
function getDominantColor(image) {
  const { width, height } = image.bitmap;
  let r = 0, g = 0, b = 0, count = 0;
  const step = Math.max(1, Math.floor(Math.min(width, height) / 20));
  for (let y = 0; y < height; y += step) {
    for (let x = 0; x < width; x += step) {
      const rgba = Jimp.intToRGBA(image.getPixelColor(x, y));
      if (rgba.a > 10) { r += rgba.r; g += rgba.g; b += rgba.b; count++; }
    }
  }
  if (count === 0) return { r: 128, g: 128, b: 128 };
  return { r: Math.round(r / count), g: Math.round(g / count), b: Math.round(b / count) };
}

/**
 * Genera una vista previa de 400x400.
 */
async function generatePreview(imagePath, outputPath) {
  try {
    const image = await Jimp.read(imagePath);
    image.resize(400, 400, Jimp.RESIZE_BICUBIC);
    await image.writeAsync(outputPath);
    return { success: true, previewPath: outputPath };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

module.exports = { convertImageToSkybox, generatePreview };
