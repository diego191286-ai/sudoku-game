import { useState, useEffect, useCallback, useRef } from 'react'
import { generarSudoku, verificarTablero, estaCompleto, obtenerPista } from './sudoku'
import './index.css'

const STORAGE_KEY = 'sudoku_partida'

function cargarPartida() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

function guardarPartida(estado) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(estado)) } catch {}
}

function borrarPartida() {
  try { localStorage.removeItem(STORAGE_KEY) } catch {}
}

function formatTiempo(seg) {
  const m = Math.floor(seg / 60).toString().padStart(2, '0')
  const s = (seg % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

function SplashScreen({ onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2400)
    return () => clearTimeout(t)
  }, [])

  const celdas = [1,7,4, 0,0,0, 3,0,0,
                  0,0,0, 0,0,3, 0,8,5,
                  0,0,0, 0,0,0, 0,0,0]
  return (
    <div className="splash">
      <div className="splash-content">
        <div className="splash-grid">
          {celdas.map((n, i) => (
            <div key={i} className={`splash-cell ${n !== 0 ? 'filled' : ''}`}
              style={{ animationDelay: `${i * 0.04}s` }}>
              {n !== 0 ? n : ''}
            </div>
          ))}
        </div>
        <div className="splash-titulo">Sudoku</div>
        <div className="splash-subtitulo">Pon a prueba tu lógica</div>
        <div className="splash-loader"><div className="splash-loader-bar"></div></div>
      </div>
    </div>
  )
}

export default function App() {
  const [splash, setSplash] = useState(true)
  const [puzzle, setPuzzle] = useState(null)
  const [solucion, setSolucion] = useState(null)
  const [fijas, setFijas] = useState(null)
  const [actual, setActual] = useState(null)
  const [seleccionada, setSeleccionada] = useState(null)
  const [dificultad, setDificultad] = useState('medio')
  const [errores, setErrores] = useState(null)
  const [ganado, setGanado] = useState(false)
  const [tiempo, setTiempo] = useState(0)
  const [corriendo, setCorriendo] = useState(false)
  const [pistasUsadas, setPistasUsadas] = useState(0)
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('sudoku_tema') !== 'light')
  const intervalRef = useRef(null)

  useEffect(() => {
    document.documentElement.setAttribute('data-tema', darkMode ? 'dark' : 'light')
    localStorage.setItem('sudoku_tema', darkMode ? 'dark' : 'light')
  }, [darkMode])

  useEffect(() => {
    if (corriendo && !ganado) {
      intervalRef.current = setInterval(() => setTiempo(t => t + 1), 1000)
    } else {
      clearInterval(intervalRef.current)
    }
    return () => clearInterval(intervalRef.current)
  }, [corriendo, ganado])

  useEffect(() => {
    if (!puzzle) return
    guardarPartida({ puzzle, solucion, fijas, actual, dificultad, tiempo, pistasUsadas })
  }, [actual, tiempo])

  useEffect(() => {
    const guardada = cargarPartida()
    if (guardada) {
      setPuzzle(guardada.puzzle)
      setSolucion(guardada.solucion)
      setFijas(guardada.fijas)
      setActual(guardada.actual)
      setDificultad(guardada.dificultad)
      setTiempo(guardada.tiempo || 0)
      setPistasUsadas(guardada.pistasUsadas || 0)
      setCorriendo(true)
    } else {
      nuevaPartida('medio')
    }
  }, [])

  const nuevaPartida = useCallback((dif) => {
    const { puzzle: p, solucion: s } = generarSudoku(dif)
    const f = p.map(fila => fila.map(v => v !== 0))
    const a = p.map(fila => [...fila])
    setPuzzle(p)
    setSolucion(s)
    setFijas(f)
    setActual(a)
    setDificultad(dif)
    setSeleccionada(null)
    setErrores(null)
    setGanado(false)
    setTiempo(0)
    setPistasUsadas(0)
    setCorriendo(true)
    borrarPartida()
  }, [])

  const ingresarNumero = useCallback((num) => {
    if (!seleccionada || ganado) return
    const [r, c] = seleccionada
    if (fijas[r][c]) return
    const nuevo = actual.map(f => [...f])
    nuevo[r][c] = num
    setActual(nuevo)
    // Validación en tiempo real
    setErrores(verificarTablero(nuevo, solucion))
    if (estaCompleto(nuevo, solucion)) {
      setCorriendo(false)
      setGanado(true)
      borrarPartida()
    }
  }, [seleccionada, actual, fijas, solucion, ganado])

  const verificar = useCallback(() => {
    if (!actual) return
    setErrores(verificarTablero(actual, solucion))
  }, [actual, solucion])

  const usarPista = useCallback(() => {
    if (!actual || ganado) return
    const pos = obtenerPista(actual, solucion, fijas)
    if (!pos) return
    const [r, c] = pos
    const nuevo = actual.map(f => [...f])
    nuevo[r][c] = solucion[r][c]
    setActual(nuevo)
    setSeleccionada([r, c])
    setErrores(verificarTablero(nuevo, solucion))
    setPistasUsadas(p => p + 1)
    if (estaCompleto(nuevo, solucion)) {
      setCorriendo(false)
      setGanado(true)
      borrarPartida()
    }
  }, [actual, solucion, fijas, ganado])

  useEffect(() => {
    const handler = (e) => {
      if (e.key >= '1' && e.key <= '9') ingresarNumero(parseInt(e.key))
      if (e.key === 'Backspace' || e.key === 'Delete' || e.key === '0') ingresarNumero(0)
      if (e.key === 'ArrowUp' && seleccionada) setSeleccionada([Math.max(0, seleccionada[0] - 1), seleccionada[1]])
      if (e.key === 'ArrowDown' && seleccionada) setSeleccionada([Math.min(8, seleccionada[0] + 1), seleccionada[1]])
      if (e.key === 'ArrowLeft' && seleccionada) setSeleccionada([seleccionada[0], Math.max(0, seleccionada[1] - 1)])
      if (e.key === 'ArrowRight' && seleccionada) setSeleccionada([seleccionada[0], Math.min(8, seleccionada[1] + 1)])
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [ingresarNumero, seleccionada])

  if (splash) return <SplashScreen onDone={() => setSplash(false)} />
  if (!puzzle || !actual) return <div className="loading">Generando sudoku...</div>

  const getCeldaClase = (r, c) => {
    const clases = ['celda']
    if (fijas[r][c]) clases.push('fija')
    if (seleccionada) {
      const [sr, sc] = seleccionada
      if (r === sr && c === sc) clases.push('seleccionada')
      else if (r === sr || c === sc) clases.push('resaltada')
      else if (Math.floor(r / 3) === Math.floor(sr / 3) && Math.floor(c / 3) === Math.floor(sc / 3)) clases.push('resaltada')
      if (actual[r][c] !== 0 && actual[r][c] === actual[sr][sc]) clases.push('mismo-numero')
    }
    if (errores) {
      const e = errores[r][c]
      if (e === 'incorrecto') clases.push('incorrecto')
      else if (e === 'correcto' && !fijas[r][c]) clases.push('correcto')
    }
    return clases.join(' ')
  }

  return (
    <div className="app">
      <header className="header">
        <div className="header-brand">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="28" height="28" rx="7" fill="url(#grad)"/>
            <rect x="3" y="3" width="7" height="7" rx="1.5" fill="white" fillOpacity="0.9"/>
            <rect x="11" y="3" width="7" height="7" rx="1.5" fill="white" fillOpacity="0.35"/>
            <rect x="19" y="3" width="7" height="7" rx="1.5" fill="white" fillOpacity="0.9"/>
            <rect x="3" y="11" width="7" height="7" rx="1.5" fill="white" fillOpacity="0.35"/>
            <rect x="11" y="11" width="7" height="7" rx="1.5" fill="white" fillOpacity="0.9"/>
            <rect x="19" y="11" width="7" height="7" rx="1.5" fill="white" fillOpacity="0.35"/>
            <rect x="3" y="19" width="7" height="7" rx="1.5" fill="white" fillOpacity="0.9"/>
            <rect x="11" y="19" width="7" height="7" rx="1.5" fill="white" fillOpacity="0.35"/>
            <rect x="19" y="19" width="7" height="7" rx="1.5" fill="white" fillOpacity="0.9"/>
            <defs>
              <linearGradient id="grad" x1="0" y1="0" x2="28" y2="28" gradientUnits="userSpaceOnUse">
                <stop stopColor="#7c3aed"/>
                <stop offset="1" stopColor="#ec4899"/>
              </linearGradient>
            </defs>
          </svg>
          <span>Sudoku</span>
        </div>
        <button className="btn-tema" onClick={() => setDarkMode(d => !d)} title="Cambiar tema">
          {darkMode ? '☀️' : '🌙'}
        </button>
      </header>

      <div className="controles-top">
        <div className="dificultad-btns">
          {['facil', 'medio', 'dificil'].map(d => (
            <button key={d} className={`btn-dif ${dificultad === d ? 'activo' : ''}`} onClick={() => nuevaPartida(d)}>
              {d === 'facil' ? 'Fácil' : d === 'medio' ? 'Medio' : 'Difícil'}
            </button>
          ))}
        </div>
        <div className="stats">
          <span className="stat">⏱ {formatTiempo(tiempo)}</span>
          <span className="stat">💡 {pistasUsadas}</span>
        </div>
      </div>

      <div className="tablero-wrap">
        <div className="tablero">
          {actual.map((fila, r) =>
            fila.map((val, c) => (
              <div
                key={`${r}-${c}`}
                className={getCeldaClase(r, c)}
                style={{
                  borderRight: (c + 1) % 3 === 0 && c !== 8 ? '2px solid var(--border-box)' : '',
                  borderBottom: (r + 1) % 3 === 0 && r !== 8 ? '2px solid var(--border-box)' : '',
                }}
                onClick={() => !fijas[r][c] && setSeleccionada([r, c])}
                onFocus={() => !fijas[r][c] && setSeleccionada([r, c])}
                tabIndex={fijas[r][c] ? -1 : 0}
              >
                {val !== 0 ? val : ''}
              </div>
            ))
          )}
        </div>
      </div>

      <div className="teclado">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
          <button key={n} className="btn-num" onClick={() => ingresarNumero(n)}>{n}</button>
        ))}
        <button className="btn-num borrar" onClick={() => ingresarNumero(0)}>✕</button>
      </div>

      <div className="acciones">
        <button className="btn-accion pista" onClick={usarPista}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 16v-4M12 8h.01"/>
          </svg>
          Pista
        </button>
        <button className="btn-accion nuevo" onClick={() => nuevaPartida(dificultad)}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
            <path d="M3 3v5h5"/>
          </svg>
          Nuevo
        </button>
      </div>

      {ganado && (
        <div className="splash ganaste-splash">
          <div className="splash-content">
            <div className="splash-grid">
              {Array.from({ length: 27 }, (_, i) => {
                // Llena la mini-grilla con la solución (primeras 3 filas)
                const r = Math.floor(i / 9)
                const c = i % 9
                const n = solucion[r][c]
                return (
                  <div key={i} className="splash-cell filled"
                    style={{ animationDelay: `${i * 0.03}s` }}>
                    {n}
                  </div>
                )
              })}
            </div>
            <div className="splash-titulo">¡Ganaste!</div>
            <div className="ganaste-stats">
              <div className="ganaste-stat-item">
                <span className="ganaste-stat-label">Tiempo</span>
                <span className="ganaste-stat-valor">⏱ {formatTiempo(tiempo)}</span>
              </div>
              <div className="ganaste-stat-item">
                <span className="ganaste-stat-label">Pistas</span>
                <span className="ganaste-stat-valor">💡 {pistasUsadas}</span>
              </div>
              <div className="ganaste-stat-item">
                <span className="ganaste-stat-label">Dificultad</span>
                <span className="ganaste-stat-valor">
                  {dificultad === 'facil' ? '🟢 Fácil' : dificultad === 'medio' ? '🟡 Medio' : '🔴 Difícil'}
                </span>
              </div>
            </div>
            <div className="ganaste-splash-btns">
              <button className="btn-accion nuevo" onClick={() => nuevaPartida(dificultad)}>🔄 Jugar de nuevo</button>
              <button className="btn-accion" onClick={() => setGanado(false)}>Ver tablero</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
