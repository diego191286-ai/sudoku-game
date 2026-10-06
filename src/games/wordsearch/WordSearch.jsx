import { useState, useEffect, useCallback } from 'react'
import { generarSopa } from './wordsearch'

const STORAGE_KEY = 'wordsearch_partida'
function cargar() { try { const r = localStorage.getItem(STORAGE_KEY); return r ? JSON.parse(r) : null } catch { return null } }
function guardar(e) { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(e)) } catch {} }
function borrar() { try { localStorage.removeItem(STORAGE_KEY) } catch {} }
function formatTiempo(s) { return `${Math.floor(s/60).toString().padStart(2,'0')}:${(s%60).toString().padStart(2,'0')}` }

function WordSearchSplash({ onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 3000); return () => clearTimeout(t) }, [])
  const bgLetras = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const bg = Array.from({ length: 81 }, (_, i) => bgLetras[i % bgLetras.length])
  return (
    <div className="splash ws-splash">
      {Array.from({ length: 12 }, (_, i) => (
        <div key={i} className="splash-particle" style={{
          left: `${6 + i * 8}%`, animationDelay: `${i * 0.17}s`,
          animationDuration: `${2.6 + (i % 3) * 0.5}s`,
          width: `${6 + (i % 3) * 5}px`, height: `${6 + (i % 3) * 5}px`,
          background: 'linear-gradient(135deg,#0ea5e9,#6366f1)'
        }}/>
      ))}
      <div className="ws-splash-bg">
        {bg.map((l, i) => (
          <div key={i} className="ws-splash-bg-cell" style={{ animationDelay: `${i * 0.012}s` }}>{l}</div>
        ))}
      </div>
      <div className="splash-content">
        <div className="splash-icon-wrap">
          <div className="splash-icon-ring ws-ring"/>
          <div className="splash-icon-ring ring2 ws-ring"/>
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none" className="splash-icon-svg ws-icon-svg">
            <rect width="80" height="80" rx="20" fill="url(#wsg)"/>
            <text x="10" y="52" fontSize="42" fontWeight="900" fill="white" fontFamily="monospace" opacity="0.95">Az</text>
            <defs><linearGradient id="wsg" x1="0" y1="0" x2="80" y2="80" gradientUnits="userSpaceOnUse">
              <stop stopColor="#0ea5e9"/><stop offset="1" stopColor="#6366f1"/>
            </linearGradient></defs>
          </svg>
        </div>
        <div className="ws-splash-titulo-wrap">
          {'SOPA DE'.split('').map((l, i) => (
            <span key={i} className="ws-splash-letra" style={{ animationDelay: `${0.4 + i * 0.07}s` }}>{l === ' ' ? '\u00A0' : l}</span>
          ))}
        </div>
        <div className="ws-splash-titulo-wrap" style={{ marginTop: '-8px' }}>
          {'LETRAS'.split('').map((l, i) => (
            <span key={i} className="ws-splash-letra" style={{ animationDelay: `${0.85 + i * 0.07}s` }}>{l}</span>
          ))}
        </div>
        <div className="splash-subtitulo ws-subtitulo">Find all the hidden words</div>
        <div className="splash-loader ws-loader">
          <div className="splash-loader-bar ws-loader-bar"/>
          <div className="splash-loader-shine"/>
        </div>
        <div className="splash-credito" style={{ animationDelay: '1.4s' }}>Made by Diego</div>
      </div>
    </div>
  )
}

export default function WordSearch({ onBack }) {
  const [splash, setSplash] = useState(true)
  const [grid, setGrid] = useState(null)
  const [palabras, setPalabras] = useState([])
  const [encontradas, setEncontradas] = useState([])
  const [seleccion, setSeleccion] = useState([])
  const [inicio, setInicio] = useState(null)
  const [tiempo, setTiempo] = useState(0)
  const [corriendo, setCorriendo] = useState(false)
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

  // Cargar o generar al montar
  useEffect(() => {
    const guardada = cargar()
    if (guardada && guardada.grid) {
      setGrid(guardada.grid)
      setPalabras(guardada.palabras)
      setEncontradas(guardada.encontradas || [])
      setTiempo(0)
    } else {
      const { grid: g, palabras: p } = generarSopa(14)
      setGrid(g)
      setPalabras(p)
    }
  }, [])

  useEffect(() => {
    if (!grid) return
    guardar({ grid, palabras, encontradas, tiempo })
  }, [encontradas, tiempo])

  const nuevaPartida = useCallback(() => {
    const { grid: g, palabras: p } = generarSopa(14)
    setGrid(g); setPalabras(p); setEncontradas([])
    setTiempo(0); setGanado(false); setCorriendo(true); borrar()
  }, [])

  const celdasEntre = useCallback((a, b) => {
    if (!a || !b) return []
    const dr = Math.sign(b[0] - a[0]), dc = Math.sign(b[1] - a[1])
    if (dr === 0 && dc === 0) return [a]
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

  const esCeldaSeleccionada = useCallback((r, c) => seleccion.some(([sr, sc]) => sr === r && sc === c), [seleccion])
  const esCeldaEncontrada = useCallback((r, c) => encontradas.some(e => e.celdas.some(([er, ec]) => er === r && ec === c)), [encontradas])

  const onMouseDown = useCallback((r, c) => { setInicio([r, c]); setSeleccion([[r, c]]) }, [])
  const onMouseEnter = useCallback((r, c) => { if (inicio) setSeleccion(celdasEntre(inicio, [r, c])) }, [inicio, celdasEntre])
  const onMouseUp = useCallback(() => {
    if (seleccion.length < 2) { setInicio(null); setSeleccion([]); return }
    setPalabras(prev => {
      for (const p of prev) {
        if (encontradas.find(e => e.palabra === p.palabra)) continue
        const sel = seleccion.map(([r, c]) => `${r},${c}`).join('|')
        const fwd = p.celdas.map(([r, c]) => `${r},${c}`).join('|')
        const bwd = [...p.celdas].reverse().map(([r, c]) => `${r},${c}`).join('|')
        if (sel === fwd || sel === bwd) {
          const nuevas = [...encontradas, p]
          setEncontradas(nuevas)
          if (nuevas.length === prev.length) { setGanado(true); setCorriendo(false); borrar() }
          break
        }
      }
      return prev
    })
    setInicio(null); setSeleccion([])
  }, [seleccion, encontradas])

  if (splash) return <WordSearchSplash onDone={() => { setSplash(false); setCorriendo(true) }} />
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
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span className="stat">⏱ {formatTiempo(tiempo)}</span>
          <button className="btn-tema" onClick={() => setDarkMode(d => !d)}>{darkMode ? '☀️' : '🌙'}</button>
        </div>
      </header>

      <div className="ws-layout">
        <div className="ws-grid-wrap">
          <div className="ws-grid" style={{ gridTemplateColumns: `repeat(${grid[0].length}, 1fr)` }}
            onMouseLeave={() => { if (inicio) onMouseUp() }}>
            {grid.map((fila, r) => fila.map((letra, c) => (
              <div key={`${r}-${c}`}
                className={`ws-cell ${esCeldaSeleccionada(r, c) ? 'ws-sel' : ''} ${esCeldaEncontrada(r, c) ? 'ws-found' : ''}`}
                onMouseDown={() => onMouseDown(r, c)}
                onMouseEnter={() => onMouseEnter(r, c)}
                onMouseUp={onMouseUp}
                onTouchStart={e => { e.preventDefault(); onMouseDown(r, c) }}
                onTouchMove={e => {
                  e.preventDefault()
                  const t = e.touches[0]
                  const el = document.elementFromPoint(t.clientX, t.clientY)
                  if (el?.dataset?.r !== undefined) onMouseEnter(+el.dataset.r, +el.dataset.c)
                }}
                onTouchEnd={e => { e.preventDefault(); onMouseUp() }}
                data-r={r} data-c={c}
              >{letra}</div>
            )))}
          </div>
        </div>

        <div className="ws-palabras">
          <div className="ws-palabras-titulo">Encuentra estas palabras</div>
          {palabras.map(p => (
            <div key={p.palabra} className={`ws-palabra ${encontradas.find(e => e.palabra === p.palabra) ? 'encontrada' : ''}`}>
              {p.palabra}
            </div>
          ))}
          <button className="btn-accion nuevo" style={{ marginTop: '12px' }} onClick={nuevaPartida}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>
            </svg>
            Nueva
          </button>
        </div>
      </div>

      {ganado && (
        <div className="splash" style={{ animation: 'none' }}>
          <div className="splash-content">
            <div className="splash-icon-wrap">
              <div className="splash-icon-ring ws-ring"/>
              <div className="splash-icon-ring ring2 ws-ring"/>
              <svg width="80" height="80" viewBox="0 0 80 80" fill="none" className="splash-icon-svg ws-icon-svg">
                <rect width="80" height="80" rx="20" fill="url(#wsg2)"/>
                <text x="10" y="52" fontSize="42" fontWeight="900" fill="white" fontFamily="monospace">Az</text>
                <defs><linearGradient id="wsg2" x1="0" y1="0" x2="80" y2="80" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#0ea5e9"/><stop offset="1" stopColor="#6366f1"/>
                </linearGradient></defs>
              </svg>
            </div>
            <div className="ws-splash-titulo-wrap">
              {'¡GANASTE!'.split('').map((l, i) => (
                <span key={i} className="ws-splash-letra" style={{ animationDelay: `${i * 0.06}s`, fontSize: 'clamp(24px,7vw,38px)' }}>{l}</span>
              ))}
            </div>
            <div className="ganaste-stats">
              <div className="ganaste-stat-item"><span className="ganaste-stat-label">Tiempo</span><span className="ganaste-stat-valor">⏱ {formatTiempo(tiempo)}</span></div>
              <div className="ganaste-stat-item"><span className="ganaste-stat-label">Palabras</span><span className="ganaste-stat-valor">✓ {palabras.length}</span></div>
            </div>
            <div className="ganaste-splash-btns">
              <button className="btn-accion nuevo" onClick={nuevaPartida}>Jugar de nuevo</button>
              <button className="btn-accion" onClick={() => setGanado(false)}>Ver tablero</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
