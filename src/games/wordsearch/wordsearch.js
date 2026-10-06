const DIRS = [
  [0,1],[1,0],[1,1],[0,-1],[-1,0],[-1,-1],[1,-1],[-1,1]
]

const LETRAS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

export const CATEGORIAS_SOPA = [
  {
    id: 'tecnologia',
    nombre: 'Tecnología',
    emoji: '💻',
    color: '#7c3aed', color2: '#6366f1',
    palabras: ['REACT','VITE','JAVASCRIPT','PYTHON','GITHUB','DOCKER','LINUX','ANDROID','BROWSER','CODIGO','INTERNET','SERVER','DATABASE','MOBILE','DEPLOY']
  },
  {
    id: 'animales',
    nombre: 'Animales',
    emoji: '🦁',
    color: '#f59e0b', color2: '#ef4444',
    palabras: ['LEON','TIGRE','DELFIN','AGUILA','SERPIENTE','COCODRILO','JIRAFA','ELEFANTE','PINGÜINO','LOBO','ZORRO','PUMA','GORILA','BALLENA','LEOPARDO']
  },
  {
    id: 'paises',
    nombre: 'Países',
    emoji: '🌍',
    color: '#10b981', color2: '#0ea5e9',
    palabras: ['MEXICO','BRASIL','FRANCIA','JAPON','CANADA','ESPANA','ITALIA','CHINA','INDIA','EGYPT','CHILE','PERU','COLOMBIA','ARGENTINA','AUSTRALIA']
  },
  {
    id: 'comida',
    nombre: 'Comida',
    emoji: '🍕',
    color: '#ec4899', color2: '#f97316',
    palabras: ['PIZZA','SUSHI','TACOS','PASTA','HAMBURGUESA','ENSALADA','BURRITO','RAMEN','PAELLA','EMPANADA','CEVICHE','FALAFEL','WAFFLES','CREPE','SOPA']
  },
  {
    id: 'deportes',
    nombre: 'Deportes',
    emoji: '⚽',
    color: '#0ea5e9', color2: '#10b981',
    palabras: ['FUTBOL','TENIS','NATACION','BOXEO','CICLISMO','ATLETISMO','RUGBY','VOLEIBOL','BEISBOL','GOLF','KARATE','ESQUI','SURF','REMO','POLO']
  },
  {
    id: 'colores',
    nombre: 'Colores',
    emoji: '🎨',
    color: '#a855f7', color2: '#ec4899',
    palabras: ['ROJO','AZUL','VERDE','AMARILLO','NARANJA','MORADO','ROSADO','CELESTE','BLANCO','NEGRO','GRIS','MARRON','TURQUESA','SALMON','VIOLETA']
  },
]

export function generarSopa(size = 14, palabrasInput) {
  const grid = Array.from({ length: size }, () => Array(size).fill(''))
  const colocadas = []

  const lista = [...(palabrasInput || CATEGORIAS_SOPA[0].palabras)]
    .sort(() => Math.random() - 0.5)
    .slice(0, 10)

  for (const palabra of lista) {
    let intentos = 0, ok = false
    while (intentos < 150 && !ok) {
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
          grid[r][c] = palabra[i]; celdas.push([r, c])
        }
        colocadas.push({ palabra, celdas }); ok = true
      }
      intentos++
    }
  }

  for (let r = 0; r < size; r++)
    for (let c = 0; c < size; c++)
      if (grid[r][c] === '') grid[r][c] = LETRAS[Math.floor(Math.random() * LETRAS.length)]

  return { grid, palabras: colocadas }
}
