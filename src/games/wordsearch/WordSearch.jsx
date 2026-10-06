import { useState, useEffect, useCallback } from 'react'
import { generarSopa } from './wordsearch'

const STORAGE_KEY = 'wordsearch_partida'

function cargar() { try { const r = localStorage.getItem(STORAGE_KEY); return r ? JSON.parse(r) : null } catch { return null } }
function guardar(e) { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(e)) } catch {} }
function borrar() { try { localStorage.removeItem(STORAGE_KEY) } catch {} }
function formatTiempo(s) { return `${Math.floor(s/60).toString().padStart(2,'0')}:${(s%60).toString().padStart(2,'0')}` }

export default function WordSearch({ onBack }) {
  const [grid, setGrid] = useState(null)
  const [palabras, setPalabras] = useState([])
  const [encontradas, setEncontradas] = useState([])
  const [seleccion, setSeleccion] = useState([]) // celdas seleccionadas actualmente
  const [inicio, setInicio] = useState(null)
  const [tiempo, setTiempo] = useState(0)
  const [corriendo, setCorriendo] = useState(true)
  const [ganado, setGanado] = useState(false)
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('sudoku_tema') !== 'light')

  useEffect(() => {
    document.documentElement.setAttribute('data-tema', darkMode ? 'dark' : 'light')
    localStorage.setItem('sudoku_tema', darkMode ? 'dark' : 'light')
  }, [darkMode])

  useEffect(() => {
    if (corriendo && !ganado) {
      const t = setInterval(() => setTiempo(p => p + 1), 1000)
      return () => clearInterval(t)
    }
  }, [corriendo, ganado])

  useEffect(() => {
    const guardada = cargar()
    if (guardada) {
      setGrid(guardada.grid); setPalabras(guardada.palabras)
      setEncontradas(guardada.encontradas); setTiempo(0)
    } else { nuevaPartida() }
  }, [])

  useEffect(() => {
    if (!grid) return
    guardar({ grid, palabras, encontradas, tiempo })
  }, [encontradas, tiempo])

  const nuevaPartida = () => {
    const { grid: g, palabras: p } = generarSopa(14)
    setGrid(g); setPalabras(p); setEncontradas([])
    setTiempo(0); setGanado(false); setCorriendo(true); borrar()
  }

  // Calcula celdas entre inicio y celda actual (línea recta)
  const celdasEntre = useCallback((a, b) => {
    if (!a || !b) return []
    const dr = Math.sign(b[0] - a[0]), dc = Math.sign(b[1] - a[1])
    if (dr === 0 && dc === 0) return [a]
    // Solo permitir 8 direcciones
    const distR = Math.abs(b[0] - a[0]), distC = Math.abs(b[1] - a[1])
    if (dr !== 0 && dc !== 0 && distR !== distC) return [a]
    const celdas = []
    let r = a[0], c = a[1]
    while (true) {
      celdas.push([r, c])
      if (r === b[0] && c === b[1]) break
      r += dr; c += dc
    }
    return celdas
  }, [])

  const esCeldaSeleccionada = (r, c) => seleccion.some(([sr, sc]) => sr === r && sc === c)
  const esCeldaEncontrada = (r, c) => encontradas.some(e => e.celdas.some(([er, ec]) => er === r && ec === c))

  const onMouseDown = (r, c) => { setInicio([r, c]); setSeleccion([[r, c]]) }
  const onMouseEnter = (r, c) => { if (inicio) setSeleccion(celdasEntre(inicio, [r, c])) }
  const onMouseUp = () => {
    if (seleccion.length < 2) { setInicio(null); setSeleccion([]); return }
    // Ver si la selección coincide con alguna palabra
    for (const p of palabras) {
      if (encontradas.find(e => e.palabra === p.palabra)) continue
      const sel = seleccion.map(([r,c]) => `${r},${c}`).join('|')
      const fwd = p.celdas.map(([r,c]) => `${r},${c}`).join('|')
      const bwd = [...p.celdas].reverse().map(([r,c]) => `${r},${c}`).join('|')
      if (sel === fwd || sel === bwd) {
        const nuevas = [...encontradas, p]
        setEncontradas(nuevas)
        if (nuevas.length === palabras.length) { setGanado(true); setCorriendo(false); borrar() }
        break
      }
    }
    setInicio(null); setSeleccion([])
  }

  if (!grid) return <div className="loading">Generando sopa de letras...</div>

  return (
    <div className="ws-app">
      <header className="header">
        <button className="btn-back" onClick={onBack}>← Volver</button>
        <div className="header-brand ws-brand">
          <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
            <rect width="26" height="26" rx="7" fill="url(#wg)"/>
            <text x="4" y="19" fontSize="15" fontWeight="900" fill="white" fontFamily="monospace">Az</text>
            <defs><linearGradient id="wg" x1="0" y1="0" x2="26" y2="26"><stop stopColor="#0ea5e9"/><stop offset="1" stopColor="#6366f1"/></linearGradient></defs>
          </svg>
          <span>Sopa de Letras</span>
        </div>
        <div style={{display:'flex',gap:'8px',alignItems:'center'}}>
          <span className="stat">⏱ {formatTiempo(tiempo)}</span>
          <button className="btn-tema" onClick={() => setDarkMode(d=>!d)}>{darkMode?'☀️':'🌙'}</button>
        </div>
      </header>

      <div className="ws-layout">
        {/* Grilla */}
        <div className="ws-grid-wrap">
          <div className="ws-grid" style={{ gridTemplateColumns: `repeat(${grid[0].length}, 1fr)` }}
            onMouseLeave={() => { if (inicio) onMouseUp() }}>
            {grid.map((fila, r) => fila.map((letra, c) => {
              const sel = esCeldaSeleccionada(r, c)
              const found = esCeldaEncontrada(r, c)
              return (
                <div key={`${r}-${c}`}
                  className={`ws-cell ${sel ? 'ws-sel' : ''} ${found ? 'ws-found' : ''}`}
                  onMouseDown={() => onMouseDown(r, c)}
                  onMouseEnter={() => onMouseEnter(r, c)}
                  onMouseUp={onMouseUp}
                  onTouchStart={() => onMouseDown(r, c)}
                  onTouchMove={e => { const t = e.touches[0]; const el = document.elementFromPoint(t.clientX, t.clientY); if (el?.dataset?.r) onMouseEnter(+el.dataset.r, +el.dataset.c) }}
                  onTouchEnd={onMouseUp}
                  data-r={r} data-c={c}
                >
                  {letra}
                </div>
              )
            }))}
          </div>
        </div>

        {/* Lista de palabras */}
        <div className="ws-palabras">
          <div className="ws-palabras-titulo">Encuentra estas palabras</div>
          {palabras.map(p => (
            <div key={p.palabra} className={`ws-palabra ${encontradas.find(e=>e.palabra===p.palabra) ? 'encontrada' : ''}`}>
              {p.palabra}
            </div>
          ))}
          <button className="btn-accion nuevo" style={{marginTop:'12px'}} onClick={nuevaPartida}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
            Nueva
          </button>
        </div>
      </div>

      {/* Victoria */}
      {ganado && (
        <div className="splash" style={{animation:'none'}}>
          <div className="splash-content">
            <div className="splash-icon-wrap">
              <div className="splash-icon-ring"/>
              <div className="splash-icon-ring ring2"/>
              <span style={{fontSize:'72px'}}>🔤</span>
            </div>
            <div className="splash-titulo-wrap">
              {'¡GANASTE!'.split('').map((l,i) => (
                <span key={i} className="splash-letra" style={{animationDelay:`${i*0.06}s`,fontSize:'clamp(28px,8vw,42px)'}}>{l}</span>
              ))}
            </div>
            <div className="ganaste-stats">
              <div className="ganaste-stat-item"><span className="ganaste-stat-label">Tiempo</span><span className="ganaste-stat-valor">⏱ {formatTiempo(tiempo)}</span></div>
              <div className="ganaste-stat-item"><span className="ganaste-stat-label">Palabras</span><span className="ganaste-stat-valor">📝 {palabras.length}</span></div>
            </div>
            <div className="ganaste-splash-btns">
              <button className="btn-accion nuevo" onClick={nuevaPartida}>🔄 Jugar de nuevo</button>
              <button className="btn-accion" onClick={() => setGanado(false)}>Ver tablero</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
