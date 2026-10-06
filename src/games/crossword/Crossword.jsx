import { useState, useEffect } from 'react'
import { CRUCIGRAMAS, generarTablero } from './crossword'

function formatTiempo(s) { return `${Math.floor(s/60).toString().padStart(2,'0')}:${(s%60).toString().padStart(2,'0')}` }

export default function Crossword({ onBack }) {
  const cruci = CRUCIGRAMAS[0]
  const { grid: gridBase, numeradas } = generarTablero(cruci)

  const [respuestas, setRespuestas] = useState(() =>
    Array.from({ length: cruci.size }, () => Array(cruci.size).fill(''))
  )
  const [seleccionada, setSeleccionada] = useState(null) // [r, c]
  const [dir, setDir] = useState('H')
  const [tiempo, setTiempo] = useState(0)
  const [ganado, setGanado] = useState(false)
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('sudoku_tema') !== 'light')

  useEffect(() => {
    document.documentElement.setAttribute('data-tema', darkMode ? 'dark' : 'light')
    localStorage.setItem('sudoku_tema', darkMode ? 'dark' : 'light')
  }, [darkMode])

  useEffect(() => {
    if (!ganado) {
      const t = setInterval(() => setTiempo(p => p + 1), 1000)
      return () => clearInterval(t)
    }
  }, [ganado])

  // Teclado
  useEffect(() => {
    const handler = (e) => {
      if (!seleccionada) return
      const [r, c] = seleccionada
      if (e.key >= 'a' && e.key <= 'z' || e.key >= 'A' && e.key <= 'Z') {
        const letra = e.key.toUpperCase()
        const nuevo = respuestas.map(f => [...f])
        nuevo[r][c] = letra
        setRespuestas(nuevo)
        // Verificar victoria
        let correcto = true
        for (const p of cruci.palabras) {
          for (let i = 0; i < p.palabra.length; i++) {
            const pr = p.dir === 'H' ? p.fila : p.fila + i
            const pc = p.dir === 'H' ? p.col + i : p.col
            if (nuevo[pr]?.[pc] !== p.palabra[i]) { correcto = false; break }
          }
          if (!correcto) break
        }
        if (correcto) setGanado(true)
        // Avanzar cursor
        if (dir === 'H' && c + 1 < cruci.size && gridBase[r][c+1]) setSeleccionada([r, c+1])
        else if (dir === 'V' && r + 1 < cruci.size && gridBase[r+1]?.[c]) setSeleccionada([r+1, c])
      }
      if (e.key === 'Backspace') {
        const nuevo = respuestas.map(f => [...f])
        nuevo[r][c] = ''
        setRespuestas(nuevo)
        if (dir === 'H' && c - 1 >= 0 && gridBase[r][c-1]) setSeleccionada([r, c-1])
        else if (dir === 'V' && r - 1 >= 0 && gridBase[r-1]?.[c]) setSeleccionada([r-1, c])
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [seleccionada, respuestas, dir])

  const nuevaPartida = () => {
    setRespuestas(Array.from({ length: cruci.size }, () => Array(cruci.size).fill('')))
    setSeleccionada(null); setTiempo(0); setGanado(false)
  }

  // Palabras de la dirección actual según selección
  const palabraActiva = seleccionada ? cruci.palabras.find(p => {
    if (p.dir !== dir) return false
    const [r, c] = seleccionada
    for (let i = 0; i < p.palabra.length; i++) {
      const pr = p.dir === 'H' ? p.fila : p.fila + i
      const pc = p.dir === 'H' ? p.col + i : p.col
      if (pr === r && pc === c) return true
    }
    return false
  }) : null

  const esCeldaActiva = (r, c) => {
    if (!palabraActiva) return false
    const p = palabraActiva
    for (let i = 0; i < p.palabra.length; i++) {
      const pr = p.dir === 'H' ? p.fila : p.fila + i
      const pc = p.dir === 'H' ? p.col + i : p.col
      if (pr === r && pc === c) return true
    }
    return false
  }

  const esCeldaCorrecta = (r, c) => {
    const letra = respuestas[r]?.[c]
    return letra && gridBase[r]?.[c]?.letra === letra
  }

  return (
    <div className="cw-app">
      <header className="header">
        <button className="btn-back" onClick={onBack}>← Volver</button>
        <div className="header-brand ws-brand">
          <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
            <rect width="26" height="26" rx="7" fill="url(#cwg)"/>
            <rect x="3" y="3" width="9" height="9" rx="2" fill="white" fillOpacity="0.9"/>
            <rect x="14" y="3" width="9" height="9" rx="2" fill="white" fillOpacity="0.3"/>
            <rect x="3" y="14" width="9" height="9" rx="2" fill="white" fillOpacity="0.3"/>
            <rect x="14" y="14" width="9" height="9" rx="2" fill="white" fillOpacity="0.9"/>
            <defs><linearGradient id="cwg" x1="0" y1="0" x2="26" y2="26"><stop stopColor="#f59e0b"/><stop offset="1" stopColor="#ef4444"/></linearGradient></defs>
          </svg>
          <span>Crucigrama</span>
        </div>
        <div style={{display:'flex',gap:'8px',alignItems:'center'}}>
          <span className="stat">⏱ {formatTiempo(tiempo)}</span>
          <button className="btn-tema" onClick={() => setDarkMode(d=>!d)}>{darkMode?'☀️':'🌙'}</button>
        </div>
      </header>

      <div className="cw-layout">
        {/* Grilla */}
        <div className="cw-grid-wrap">
          <div className="cw-grid" style={{ gridTemplateColumns: `repeat(${cruci.size}, 1fr)` }}>
            {gridBase.map((fila, r) => fila.map((celda, c) => {
              if (!celda) return <div key={`${r}-${c}`} className="cw-black"/>
              const sel = seleccionada?.[0] === r && seleccionada?.[1] === c
              const activa = esCeldaActiva(r, c)
              const correcta = esCeldaCorrecta(r, c)
              const num = numeradas[`${r},${c}`]
              return (
                <div key={`${r}-${c}`}
                  className={`cw-cell ${sel ? 'cw-sel' : ''} ${activa ? 'cw-activa' : ''} ${correcta ? 'cw-correcta' : ''}`}
                  onClick={() => {
                    if (seleccionada?.[0]===r && seleccionada?.[1]===c) setDir(d => d==='H'?'V':'H')
                    else setSeleccionada([r, c])
                  }}
                >
                  {num && <span className="cw-num">{num}</span>}
                  <span className="cw-letra">{respuestas[r][c]}</span>
                </div>
              )
            }))}
          </div>
        </div>

        {/* Pistas */}
        <div className="cw-pistas">
          {palabraActiva && (
            <div className="cw-pista-activa">
              <span className="cw-pista-num">{palabraActiva.numero}{palabraActiva.dir === 'H' ? '→' : '↓'}</span>
              <span>{palabraActiva.pista}</span>
            </div>
          )}
          <div className="cw-pistas-grupo">
            <div className="cw-pistas-titulo">→ Horizontales</div>
            {cruci.palabras.filter(p=>p.dir==='H').map(p => (
              <div key={`h-${p.numero}`} className={`cw-pista-item ${palabraActiva?.numero===p.numero && dir==='H' ? 'activa' : ''}`}
                onClick={() => { setSeleccionada([p.fila, p.col]); setDir('H') }}>
                <strong>{p.numero}.</strong> {p.pista}
              </div>
            ))}
          </div>
          <div className="cw-pistas-grupo">
            <div className="cw-pistas-titulo">↓ Verticales</div>
            {cruci.palabras.filter(p=>p.dir==='V').map(p => (
              <div key={`v-${p.numero}`} className={`cw-pista-item ${palabraActiva?.numero===p.numero && dir==='V' ? 'activa' : ''}`}
                onClick={() => { setSeleccionada([p.fila, p.col]); setDir('V') }}>
                <strong>{p.numero}.</strong> {p.pista}
              </div>
            ))}
          </div>
          <button className="btn-accion nuevo" style={{marginTop:'12px'}} onClick={nuevaPartida}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
            Nuevo
          </button>
        </div>
      </div>

      {ganado && (
        <div className="splash" style={{animation:'none'}}>
          <div className="splash-content">
            <div className="splash-icon-wrap">
              <div className="splash-icon-ring"/>
              <div className="splash-icon-ring ring2"/>
              <span style={{fontSize:'72px'}}>🏆</span>
            </div>
            <div className="splash-titulo-wrap">
              {'¡GANASTE!'.split('').map((l,i) => (
                <span key={i} className="splash-letra" style={{animationDelay:`${i*0.06}s`,fontSize:'clamp(28px,8vw,42px)'}}>{l}</span>
              ))}
            </div>
            <div className="ganaste-stats">
              <div className="ganaste-stat-item"><span className="ganaste-stat-label">Tiempo</span><span className="ganaste-stat-valor">⏱ {formatTiempo(tiempo)}</span></div>
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
