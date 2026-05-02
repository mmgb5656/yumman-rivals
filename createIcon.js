// Script para crear un icono .ico de 256x256
const Jimp = require('jimp');
const fs = require('fs-extra');
const path = require('path');

async function createIcon() {
  try {
    console.log('Creando icono 256x256...');
    
    // Leer imagen temporal
    const image = await Jimp.read('icon-temp.png');
    
    // Redimensionar a 256x256
    image.resize(256, 256);
    
    // Guardar como PNG temporal
    const tempPng = 'icon-256.png';
    await image.writeAsync(tempPng);
    
    console.log('✓ Icono PNG 256x256 creado');
    console.log('');
    console.log('⚠️  NOTA: Para crear un .ico real, necesitas usar una herramienta externa.');
    console.log('Por ahora, electron-builder puede usar el PNG directamente.');
    console.log('');
    console.log('Opciones:');
    console.log('1. Renombrar icon-256.png a icon.png y actualizar package.json');
    console.log('2. Usar una herramienta online para convertir PNG a ICO:');
    console.log('   https://convertio.co/png-ico/');
    console.log('   https://www.icoconverter.com/');
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

createIcon();
