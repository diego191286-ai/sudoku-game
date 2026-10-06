// Datos del crucigrama — pistas y respuestas
export const CRUCIGRAMAS = [
  {
    size: 11,
    palabras: [
      { palabra: 'REACT',      fila: 1, col: 1, dir: 'H', pista: 'Librería de JavaScript para interfaces' },
      { palabra: 'JAVASCRIPT', fila: 1, col: 1, dir: 'V', pista: 'Lenguaje de programación web' },
      { palabra: 'HTML',       fila: 3, col: 3, dir: 'H', pista: 'Lenguaje de marcado web' },
      { palabra: 'CSS',        fila: 1, col: 7, dir: 'V', pista: 'Estilos visuales en la web' },
      { palabra: 'VITE',       fila: 5, col: 1, dir: 'H', pista: 'Bundler ultra rápido para React' },
      { palabra: 'JUEGO',      fila: 7, col: 2, dir: 'H', pista: 'Actividad de entretenimiento' },
      { palabra: 'DIEGO',      fila: 1, col: 9, dir: 'V', pista: 'El creador de esta app' },
      { palabra: 'CODIGO',     fila: 9, col: 1, dir: 'H', pista: 'Instrucciones para computadoras' },
      { palabra: 'APP',        fila: 3, col: 9, dir: 'V', pista: 'Aplicación móvil o web' },
      { palabra: 'WEB',        fila: 7, col: 8, dir: 'V', pista: 'Red de páginas en internet' },
    ]
  }
]

export function generarTablero(crucigrama) {
  const { size, palabras } = crucigrama
  // Grilla vacía
  const grid = Array.from({ length: size }, () => Array(size).fill(null))

  // Colocar letras
  for (const p of palabras) {
    for (let i = 0; i < p.palabra.length; i++) {
      const r = p.dir === 'H' ? p.fila : p.fila + i
      const c = p.dir === 'H' ? p.col + i : p.col
      if (r < size && c < size) grid[r][c] = { letra: p.palabra[i], negro: false }
    }
  }

  // Numerar celdas de inicio de palabra
  const numeradas = {}
  let num = 1
  for (const p of palabras) {
    const key = `${p.fila},${p.col}`
    if (!numeradas[key]) { numeradas[key] = num++; }
    p.numero = numeradas[key]
  }

  return { grid, numeradas }
}
