const sharp = require('sharp')
const fs = require('fs')

// SVG del icono con fondo redondeado estilo iOS (sin clip-path, fondo cuadrado)
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 180 180">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="180" y2="180" gradientUnits="userSpaceOnUse">
      <stop stop-color="#7c3aed"/>
      <stop offset="1" stop-color="#ec4899"/>
    </linearGradient>
  </defs>
  <rect width="180" height="180" fill="url(#g)"/>
  <!-- 3x3 grid de cuadros -->
  <rect x="20"  y="20"  width="42" height="42" rx="8" fill="white" fill-opacity="0.92"/>
  <rect x="69"  y="20"  width="42" height="42" rx="8" fill="white" fill-opacity="0.35"/>
  <rect x="118" y="20"  width="42" height="42" rx="8" fill="white" fill-opacity="0.92"/>
  <rect x="20"  y="69"  width="42" height="42" rx="8" fill="white" fill-opacity="0.35"/>
  <rect x="69"  y="69"  width="42" height="42" rx="8" fill="white" fill-opacity="0.92"/>
  <rect x="118" y="69"  width="42" height="42" rx="8" fill="white" fill-opacity="0.35"/>
  <rect x="20"  y="118" width="42" height="42" rx="8" fill="white" fill-opacity="0.92"/>
  <rect x="69"  y="118" width="42" height="42" rx="8" fill="white" fill-opacity="0.35"/>
  <rect x="118" y="118" width="42" height="42" rx="8" fill="white" fill-opacity="0.92"/>
</svg>`

sharp(Buffer.from(svg))
  .resize(180, 180)
  .png()
  .toFile('public/apple-touch-icon.png')
  .then(() => console.log('apple-touch-icon.png generado'))
  .catch(e => console.error(e))
