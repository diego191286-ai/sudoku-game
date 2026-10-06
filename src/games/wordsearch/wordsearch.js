// Generador de sopa de letras
const PALABRAS = [
  'REACT', 'VITE', 'JAVASCRIPT', 'HTML', 'CSS',
  'CODIGO', 'JUEGO', 'LOGICA', 'PANTALLA', 'DIEGO',
  'INTERNET', 'BROWSER', 'MOBILE', 'DESIGN', 'APP'
]

const LETRAS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const DIRS = [
  [0,1],[1,0],[1,1],[0,-1],[-1,0],[-1,-1],[1,-1],[-1,1]
]

export function generarSopa(size = 14) {
  const grid = Array.from({ length: size }, () => Array(size).fill(''))
  const colocadas = []

  const palabras = [...PALABRAS].sort(() => Math.random() - 0.5).slice(0, 10)

  for (const palabra of palabras) {
    let intentos = 0
    let ok = false
    while (intentos < 100 && !ok) {
      const [dr, dc] = DIRS[Math.floor(Math.random() * DIRS.length)]
      const row = Math.floor(Math.random() * size)
      const col = Math.floor(Math.random() * size)
      const endRow = row + dr * (palabra.length - 1)
      const endCol = col + dc * (palabra.length - 1)
      if (endRow < 0 || endRow >= size || endCol < 0 || endCol >= size) { intentos++; continue }
      let cabe = true
      for (let i = 0; i < palabra.length; i++) {
        const r = row + dr * i, c = col + dc * i
        if (grid[r][c] !== '' && grid[r][c] !== palabra[i]) { cabe = false; break }
      }
      if (cabe) {
        const celdas = []
        for (let i = 0; i < palabra.length; i++) {
          const r = row + dr * i, c = col + dc * i
          grid[r][c] = palabra[i]
          celdas.push([r, c])
        }
        colocadas.push({ palabra, celdas })
        ok = true
      }
      intentos++
    }
  }

  // Rellena espacios vacíos con letras aleatorias
  for (let r = 0; r < size; r++)
    for (let c = 0; c < size; c++)
      if (grid[r][c] === '') grid[r][c] = LETRAS[Math.floor(Math.random() * LETRAS.length)]

  return { grid, palabras: colocadas }
}
