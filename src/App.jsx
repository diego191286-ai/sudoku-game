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

export default function App() {
  const [puzzle, setPuzzle] = useState(null)
  const [solucion, setSolucion] = useState(null)
  const [fijas, setFijas] = useState(null)        // celdas originales del puzzle
  const [actual, setActual] = useState(null)       // estado actual del jugador
  const [seleccionada, setSeleccionada] = useState(null) // [fila, col]
  const [dificultad, setDificultad] = useState('medio')
  const [errores, setErrores] = useState(null)     // null = sin verificar
  const [ganado, setGanado] = useState(false)
  const [tiempo, setTiempo] = useState(0)
  const [corriendo, setCorriendo] = useState(false)
  const [pistasUsadas, setPistasUsadas] = useState(0)
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('sudoku_tema') !== 'light')
  const intervalRef = useRef(null)

  // Aplicar tema
  useEffect(() => {
    document.documentElement.setAttribute('data-tema', darkMode ? 'dark' : 'light')
    localStorage.setItem('sudoku_tema', darkMode ? 'dark' : 'light')
  }, [darkMode])

  // Temporizador
  useEffect(() => {
    if (corriendo && !ganado) {
      intervalRef.current = setInterval(() => setTiempo(t => t + 1), 1000)
    } else {
      clearInterval(intervalRef.current)
    }
    return () => clearInterval(intervalRef.current)
  }, [corriendo, ganado])

  // Guardar progreso automáticamente
  useEffect(() => {
    if (!puzzle) return
    guardarPartida({ puzzle, solucion, fijas, actual, dificultad, tiempo, pistasUsadas })
  }, [actual, tiempo])

  // Cargar partida guardada o iniciar nueva
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
    setErrores(null)
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
    setErrores(null)
    setPistasUsadas(p => p + 1)
    if (estaCompleto(nuevo, solucion)) {
      setCorriendo(false)
      setGanado(true)
      borrarPartida()
    }
  }, [actual, solucion, fijas, ganado])

  // Teclado físico
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

  if (!puzzle || !actual) return <div className="loading">Generando sudoku...</div>

  const getCeldaClase = (r, c) => {
    const clases = ['celda']
    if (fijas[r][c]) clases.push('fija')
    if (seleccionada) {
      const [sr, sc] = seleccionada
      if (r === sr && c === sc) clases.push('seleccionada')
      else if (r === sr || c === sc) clases.push('resaltada')
      else if (Math.floor(r / 3) === Math.floor(sr / 3) && Math.floor(c / 3) === Math.floor(sc / 3)) clases.push('resaltada')
      // Resaltar mismo número
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
      {/* Header */}
      <header className="header">
        <div className="header-brand">🧩 Sudoku</div>
        <button className="btn-tema" onClick={() => setDarkMode(d => !d)} title="Cambiar tema">
          {darkMode ? '☀️' : '🌙'}
        </button>
      </header>

      {/* Controles superiores */}
      <div className="controles-top">
        <div className="dificultad-btns">
          {['facil', 'medio', 'dificil'].map(d => (
            <button
              key={d}
              className={`btn-dif ${dificultad === d ? 'activo' : ''}`}
              onClick={() => nuevaPartida(d)}
            >
              {d === 'facil' ? 'Fácil' : d === 'medio' ? 'Medio' : 'Difícil'}
            </button>
          ))}
        </div>
        <div className="stats">
          <span className="stat">⏱ {formatTiempo(tiempo)}</span>
          <span className="stat">💡 {pistasUsadas}</span>
        </div>
      </div>

      {/* Tablero */}
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

      {/* Teclado numérico */}
      <div className="teclado">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
          <button key={n} className="btn-num" onClick={() => ingresarNumero(n)}>{n}</button>
        ))}
        <button className="btn-num borrar" onClick={() => ingresarNumero(0)}>✕</button>
      </div>

      {/* Acciones */}
      <div className="acciones">
        <button className="btn-accion" onClick={verificar}>🔍 Verificar</button>
        <button className="btn-accion pista" onClick={usarPista}>💡 Pista</button>
        <button className="btn-accion nuevo" onClick={() => nuevaPartida(dificultad)}>🔄 Nuevo</button>
      </div>

      {/* Modal ganaste */}
      {ganado && (
        <div className="overlay" onClick={() => setGanado(false)}>
          <div className="modal-ganaste" onClick={e => e.stopPropagation()}>
            <div className="ganaste-icon">🎉</div>
            <div className="ganaste-titulo">¡Felicidades!</div>
            <div className="ganaste-info">
              <span>⏱ Tiempo: <strong>{formatTiempo(tiempo)}</strong></span>
              <span>💡 Pistas usadas: <strong>{pistasUsadas}</strong></span>
              <span>📊 Dificultad: <strong>{dificultad === 'facil' ? 'Fácil' : dificultad === 'medio' ? 'Medio' : 'Difícil'}</strong></span>
            </div>
            <div className="ganaste-btns">
              <button className="btn-accion nuevo" onClick={() => nuevaPartida(dificultad)}>Jugar de nuevo</button>
              <button className="btn-accion" onClick={() => setGanado(false)}>Ver tablero</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
