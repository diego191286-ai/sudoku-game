// ─── Categorías y datos del crucigrama por tema ─────────────────────────────

export const CATEGORIAS_CW = [
  {
    id: 'tecnologia',
    nombre: 'Tecnología',
    emoji: '💻',
    color: '#7c3aed', color2: '#6366f1',
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
  },
  {
    id: 'geografia',
    nombre: 'Geografía',
    emoji: '🌍',
    color: '#10b981', color2: '#0ea5e9',
    size: 13,
    palabras: [
      { palabra: 'PARIS',      fila: 1,  col: 1,  dir: 'H', pista: 'Capital de Francia' },
      { palabra: 'PERU',       fila: 1,  col: 1,  dir: 'V', pista: 'País de Machu Picchu' },
      { palabra: 'EUROPA',     fila: 4,  col: 1,  dir: 'H', pista: 'Continente de Francia e Italia' },
      { palabra: 'OCEANO',     fila: 7,  col: 1,  dir: 'H', pista: 'Gran extensión de agua salada' },
      { palabra: 'RIO',        fila: 1,  col: 5,  dir: 'V', pista: 'Corriente natural de agua' },
      { palabra: 'AMAZONIA',   fila: 1,  col: 7,  dir: 'V', pista: 'Selva tropical de Sudamérica' },
      { palabra: 'NILO',       fila: 4,  col: 8,  dir: 'H', pista: 'Río más largo de África' },
      { palabra: 'AFRICA',     fila: 4,  col: 7,  dir: 'V', pista: 'Segundo continente más grande' },
      { palabra: 'DESIERTO',   fila: 9,  col: 1,  dir: 'H', pista: 'Zona muy árida con poca lluvia' },
      { palabra: 'ECUADOR',    fila: 11, col: 1,  dir: 'H', pista: 'Línea imaginaria que divide la Tierra' },
    ]
  },
  {
    id: 'ciencia',
    nombre: 'Ciencia',
    emoji: '🔬',
    color: '#0ea5e9', color2: '#6366f1',
    size: 12,
    palabras: [
      { palabra: 'ATOMO',      fila: 1,  col: 1,  dir: 'H', pista: 'Unidad básica de la materia' },
      { palabra: 'ADN',        fila: 1,  col: 1,  dir: 'V', pista: 'Molécula que guarda la herencia genética' },
      { palabra: 'NEWTON',     fila: 4,  col: 1,  dir: 'H', pista: 'Científico de la gravedad' },
      { palabra: 'NANOTECNOLOGIA', fila: 1, col: 3, dir: 'V', pista: 'Tecnología a escala nanométrica' },
      { palabra: 'OXI',        fila: 1,  col: 9,  dir: 'V', pista: 'Prefijo de Oxígeno' },
      { palabra: 'CELULA',     fila: 7,  col: 1,  dir: 'H', pista: 'Unidad básica de los seres vivos' },
      { palabra: 'LUZ',        fila: 4,  col: 8,  dir: 'V', pista: 'Radiación visible del espectro' },
      { palabra: 'ENERGIA',    fila: 9,  col: 1,  dir: 'H', pista: 'Capacidad de realizar trabajo' },
      { palabra: 'LUNA',       fila: 4,  col: 10, dir: 'V', pista: 'Satélite natural de la Tierra' },
      { palabra: 'ORBITA',     fila: 11, col: 1,  dir: 'H', pista: 'Trayectoria de un planeta alrededor de una estrella' },
    ]
  },
  {
    id: 'historia',
    nombre: 'Historia',
    emoji: '🏛️',
    color: '#f59e0b', color2: '#ef4444',
    size: 12,
    palabras: [
      { palabra: 'ROMA',       fila: 1,  col: 1,  dir: 'H', pista: 'Imperio de los césares' },
      { palabra: 'REY',        fila: 1,  col: 1,  dir: 'V', pista: 'Monarca gobernante' },
      { palabra: 'EGIPTO',     fila: 4,  col: 1,  dir: 'H', pista: 'Civilización de las pirámides' },
      { palabra: 'ESPADA',     fila: 1,  col: 4,  dir: 'V', pista: 'Arma blanca de los caballeros' },
      { palabra: 'AZTECA',     fila: 4,  col: 7,  dir: 'V', pista: 'Civilización de Tenochtitlán' },
      { palabra: 'GUERRA',     fila: 7,  col: 1,  dir: 'H', pista: 'Conflicto armado entre naciones' },
      { palabra: 'NAPOLEON',   fila: 1,  col: 9,  dir: 'V', pista: 'Emperador francés de gran conquista' },
      { palabra: 'FEUDAL',     fila: 9,  col: 1,  dir: 'H', pista: 'Sistema político medieval' },
      { palabra: 'COLONO',     fila: 11, col: 1,  dir: 'H', pista: 'Poblador de tierras conquistadas' },
    ]
  },
  {
    id: 'entretenimiento',
    nombre: 'Entretenimiento',
    emoji: '🎬',
    color: '#ec4899', color2: '#f97316',
    size: 13,
    palabras: [
      { palabra: 'CINE',       fila: 1,  col: 1,  dir: 'H', pista: 'Arte de las películas' },
      { palabra: 'CONCIERTO',  fila: 1,  col: 1,  dir: 'V', pista: 'Presentación en vivo de música' },
      { palabra: 'NETFLIX',    fila: 3,  col: 2,  dir: 'H', pista: 'Plataforma de streaming popular' },
      { palabra: 'MARIO',      fila: 1,  col: 7,  dir: 'V', pista: 'Fontanero famoso de videojuegos' },
      { palabra: 'OSCAR',      fila: 5,  col: 1,  dir: 'H', pista: 'Premio del cine estadounidense' },
      { palabra: 'ROCK',       fila: 1,  col: 11, dir: 'V', pista: 'Género musical eléctrico' },
      { palabra: 'ANIME',      fila: 7,  col: 1,  dir: 'H', pista: 'Animación de origen japonés' },
      { palabra: 'TEATRO',     fila: 9,  col: 1,  dir: 'H', pista: 'Arte escénico en vivo' },
      { palabra: 'ACTRIZ',     fila: 1,  col: 9,  dir: 'V', pista: 'Mujer que actúa en cine o teatro' },
      { palabra: 'CANCION',    fila: 11, col: 1,  dir: 'H', pista: 'Composición musical con letra' },
    ]
  },
]

export function generarTablero(crucigrama) {
  const { size, palabras } = crucigrama
  const grid = Array.from({ length: size }, () => Array(size).fill(null))

  for (const p of palabras) {
    for (let i = 0; i < p.palabra.length; i++) {
      const r = p.dir === 'H' ? p.fila : p.fila + i
      const c = p.dir === 'H' ? p.col + i : p.col
      if (r < size && c < size) grid[r][c] = { letra: p.palabra[i], negro: false }
    }
  }

  const numeradas = {}
  let num = 1
  for (const p of palabras) {
    const key = `${p.fila},${p.col}`
    if (!numeradas[key]) { numeradas[key] = num++ }
    p.numero = numeradas[key]
  }

  return { grid, numeradas }
}
