import { useState, useEffect } from 'react'
import { CATEGORIAS_CW, generarTablero } from './crossword'

function formatTiempo(s) { return `${Math.floor(s/60).toString().padStart(2,'0')}:${(s%60).toString().padStart(2,'0')}` }

const PATRON_BG = [1,0,1,0,1,0,1,0,1,0,1, 0,1,0,1,0,1,0,1,0,1,0, 1,0,1,0,1,0,1,0,1,0,1,
                   0,1,0,1,0,1,0,1,0,1,0, 1,0,1,0,1,0,1,0,1,0,1, 0,1,0,1,0,1,0,1,0,1,0,
                   1,0,1,0,1,0,1,0,1,0,1, 0,1,0,1,0,1,0,1,0,1,0, 1,0,1,0,1,0,1,0,1,0,1,
                   0,1,0,1,0,1,0,1,0,1,0, 1,0,1,0,1,0,1,0,1,0,1]

// ─── Splash ───────────────────────────────────────────────────────────────────
function CrosswordSplash({ onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 3000); return () => clearTimeout(t) }, [])
  return (
    <div className="splash cw-splash">
      {Array.from({ length: 12 }, (_, i) => (
        <div key={i} className="splash-particle" style={{
          left: `${6 + i * 8}%`, animationDelay: `${i * 0.16}s`,
          animationDuration: `${2.5 + (i % 3) * 0.5}s`,
          width: `${6 + (i % 3) * 5}px`, height: `${6 + (i % 3) * 5}px`,
          background: 'linear-gradient(135deg,#f59e0b,#ef4444)'
        }}/>
      ))}
      <div className="cw-splash-bg">
        {PATRON_BG.map((v, i) => (
          <div key={i} className={`cw-splash-bg-cell ${v ? 'blanca' : 'negra'}`} style={{ animationDelay: `${i * 0.01}s` }}/>
        ))}
      </div>
      <div className="splash-content">
        <div className="splash-icon-wrap">
          <div className="splash-icon-ring cw-ring"/>
          <div className="splash-icon-ring ring2 cw-ring"/>
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none" className="splash-icon-svg cw-icon-svg">
            <rect width="80" height="80" rx="20" fill="url(#cwsg)"/>
            <rect x="8"  y="8"  width="28" height="28" rx="5" fill="white" fillOpacity="0.9"/>
            <rect x="44" y="8"  width="28" height="28" rx="5" fill="white" fillOpacity="0.3"/>
            <rect x="8"  y="44" width="28" height="28" rx="5" fill="white" fillOpacity="0.3"/>
            <rect x="44" y="44" width="28" height="28" rx="5" fill="white" fillOpacity="0.9"/>
            <text x="14" y="32" fontSize="18" fontWeight="900" fill="url(#cwsg)" fontFamily="monospace">1</text>
            <text x="50" y="68" fontSize="18" fontWeight="900" fill="url(#cwsg)" fontFamily="monospace">2</text>
            <defs><linearGradient id="cwsg" x1="0" y1="0" x2="80" y2="80" gradientUnits="userSpaceOnUse">
              <stop stopColor="#f59e0b"/><stop offset="1" stopColor="#ef4444"/>
            </linearGradient></defs>
          </svg>
        </div>
        <div className="cw-splash-titulo-wrap">
          {'CRUCI'.split('').map((l, i) => (
            <span key={i} className="cw-splash-letra" style={{ animationDelay: `${0.4 + i * 0.07}s` }}>{l}</span>
          ))}
        </div>
        <div className="cw-splash-titulo-wrap" style={{ marginTop: '-8px' }}>
          {'GRAMA'.split('').map((l, i) => (
            <span key={i} className="cw-splash-letra" style={{ animationDelay: `${0.78 + i * 0.07}s` }}>{l}</span>
          ))}
        </div>
        <div className="splash-subtitulo cw-subtitulo">Solve the clues, fill the grid</div>
        <div className="splash-loader cw-loader">
          <div className="splash-loader-bar cw-loader-bar"/>
          <div className="splash-loader-shine"/>
        </div>
        <div className="splash-credito" style={{ animationDelay: '1.4s' }}>Made by Diego</div>
      </div>
    </div>
  )
}

// ─── Selección de categoría ────────────────────────────────────────────────────
function SeleccionCategoria({ onSelect, onBack, darkMode, toggleDarkMode }) {
  return (
    <div className="cat-screen">
      <header className="header">
        <button className="btn-back" onClick={onBack}>← Volver</button>
        <div className="header-brand ws-brand">
          <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
            <rect width="26" height="26" rx="7" fill="url(#cwgh)"/>
            <rect x="3" y="3" width="9" height="9" rx="2" fill="white" fillOpacity="0.9"/>
            <rect x="14" y="3" width="9" height="9" rx="2" fill="white" fillOpacity="0.3"/>
            <rect x="3" y="14" width="9" height="9" rx="2" fill="white" fillOpacity="0.3"/>
            <rect x="14" y="14" width="9" height="9" rx="2" fill="white" fillOpacity="0.9"/>
            <defs><linearGradient id="cwgh" x1="0" y1="0" x2="26" y2="26"><stop stopColor="#f59e0b"/><stop offset="1" stopColor="#ef4444"/></linearGradient></defs>
          </svg>
          <span>Crucigrama</span>
        </div>
        <button className="btn-tema" onClick={toggleDarkMode}>{darkMode ? '☀️' : '🌙'}</button>
      </header>
      <div className="cat-content">
        <div className="cat-titulo">Elige una categoría</div>
        <div className="cat-grid">
          {CATEGORIAS_CW.map((cat, i) => (
            <button
              key={cat.id}
              className="cat-card"
              style={{ '--c1': cat.color, '--c2': cat.color2, animationDelay: `${i * 0.08}s` }}
              onClick={() => onSelect(cat)}
            >
              <div className="cat-card-glow"/>
              <div className="cat-card-emoji">{cat.emoji}</div>
              <div className="cat-card-nombre">{cat.nombre}</div>
              <div className="cat-card-count">{cat.palabras.length} pistas</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Juego ────────────────────────────────────────────────────────────────────
export default function Crossword({ onBack }) {
  const [splash, setSplash] = useState(true)
  const [categoria, setCategoria] = useState(null)
  const [cruci, setCruci] = useState(null)
  const [gridBase, setGridBase] = useState(null)
  const [numeradas, setNumeradas] = useState({})
  const [respuestas, setRespuestas] = useState(null)
  const [seleccionada, setSeleccionada] = useState(null)
  const [dir, setDir] = useState('H')
  const [tiempo, setTiempo] = useState(0)
  const [ganado, setGanado] = useState(false)
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('sudoku_tema') !== 'light')

  useEffect(() => {
    document.documentElement.setAttribute('data-tema', darkMode ? 'dark' : 'light')
    localStorage.setItem('sudoku_tema', darkMode ? 'dark' : 'light')
  }, [darkMode])

  // Timer
  useEffect(() => {
    if (!cruci || ganado) return
    const t = setInterval(() => setTiempo(p => p + 1), 1000)
    return () => clearInterval(t)
  }, [cruci, ganado])

  const iniciarCategoria = (cat) => {
    const { grid: g, numeradas: n } = generarTablero(cat)
    setCruci(cat)
    setGridBase(g)
    setNumeradas(n)
    setRespuestas(Array.from({ length: cat.size }, () => Array(cat.size).fill('')))
    setSeleccionada(null); setTiempo(0); setGanado(false)
    setCategoria(cat)
  }

  const cambiarCategoria = () => {
    setCategoria(null); setCruci(null); setGridBase(null)
    setRespuestas(null); setTiempo(0); setGanado(false)
  }

  const nuevaPartida = () => {
    if (!cruci) return
    setRespuestas(Array.from({ length: cruci.size }, () => Array(cruci.size).fill('')))
    setSeleccionada(null); setTiempo(0); setGanado(false)
  }

  // Teclado
  useEffect(() => {
    if (!cruci || !respuestas) return
    const handler = (e) => {
      if (!seleccionada) return
      const [r, c] = seleccionada
      if ((e.key >= 'a' && e.key <= 'z') || (e.key >= 'A' && e.key <= 'Z')) {
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
  }, [seleccionada, respuestas, dir, cruci, gridBase])

  const palabraActiva = (cruci && seleccionada) ? cruci.palabras.find(p => {
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
    if (!respuestas) return false
    const letra = respuestas[r]?.[c]
    return letra && gridBase[r]?.[c]?.letra === letra
  }

  // ── Pantallas ──
  if (splash) return <CrosswordSplash onDone={() => setSplash(false)} />

  if (!categoria) return (
    <SeleccionCategoria
      onBack={onBack}
      darkMode={darkMode}
      toggleDarkMode={() => setDarkMode(d => !d)}
      onSelect={iniciarCategoria}
    />
  )

  return (
    <div className="cw-app">
      <header className="header">
        <button className="btn-back" onClick={cambiarCategoria}>← Categorías</button>
        <div className="header-brand ws-brand" style={{ '--c1': categoria.color }}>
          <span style={{ fontSize: '20px' }}>{categoria.emoji}</span>
          <span>{categoria.nombre}</span>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span className="stat">⏱ {formatTiempo(tiempo)}</span>
          <button className="btn-tema" onClick={() => setDarkMode(d => !d)}>{darkMode ? '☀️' : '🌙'}</button>
        </div>
      </header>

      <div className="cw-layout">
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
                    if (seleccionada?.[0] === r && seleccionada?.[1] === c) setDir(d => d === 'H' ? 'V' : 'H')
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

        <div className="cw-pistas">
          {palabraActiva && (
            <div className="cw-pista-activa">
              <span className="cw-pista-num">{palabraActiva.numero}{palabraActiva.dir === 'H' ? '→' : '↓'}</span>
              <span>{palabraActiva.pista}</span>
            </div>
          )}
          <div className="cw-pistas-grupo">
            <div className="cw-pistas-titulo">→ Horizontales</div>
            {cruci.palabras.filter(p => p.dir === 'H').map(p => (
              <div key={`h-${p.numero}`}
                className={`cw-pista-item ${palabraActiva?.numero === p.numero && dir === 'H' ? 'activa' : ''}`}
                onClick={() => { setSeleccionada([p.fila, p.col]); setDir('H') }}>
                <strong>{p.numero}.</strong> {p.pista}
              </div>
            ))}
          </div>
          <div className="cw-pistas-grupo">
            <div className="cw-pistas-titulo">↓ Verticales</div>
            {cruci.palabras.filter(p => p.dir === 'V').map(p => (
              <div key={`v-${p.numero}`}
                className={`cw-pista-item ${palabraActiva?.numero === p.numero && dir === 'V' ? 'activa' : ''}`}
                onClick={() => { setSeleccionada([p.fila, p.col]); setDir('V') }}>
                <strong>{p.numero}.</strong> {p.pista}
              </div>
            ))}
          </div>
          <button className="btn-accion nuevo" style={{ marginTop: '12px' }} onClick={nuevaPartida}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>
            </svg>
            Nuevo
          </button>
          <button className="btn-accion" style={{ marginTop: '6px' }} onClick={cambiarCategoria}>
            🗂 Categorías
          </button>
        </div>
      </div>

      {ganado && (
        <div className="splash" style={{ animation: 'none' }}>
          <div className="splash-content">
            <div className="splash-icon-wrap">
              <div className="splash-icon-ring cw-ring"/>
              <div className="splash-icon-ring ring2 cw-ring"/>
              <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                <rect width="80" height="80" rx="20" fill="url(#cwsg3)"/>
                <rect x="8"  y="8"  width="28" height="28" rx="5" fill="white" fillOpacity="0.9"/>
                <rect x="44" y="44" width="28" height="28" rx="5" fill="white" fillOpacity="0.9"/>
                <defs><linearGradient id="cwsg3" x1="0" y1="0" x2="80" y2="80" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#f59e0b"/><stop offset="1" stopColor="#ef4444"/>
                </linearGradient></defs>
              </svg>
            </div>
            <div className="cw-splash-titulo-wrap">
              {'¡GANASTE!'.split('').map((l, i) => (
                <span key={i} className="cw-splash-letra" style={{ animationDelay: `${i * 0.06}s`, fontSize: 'clamp(24px,7vw,38px)' }}>{l}</span>
              ))}
            </div>
            <div className="ganaste-stats">
              <div className="ganaste-stat-item"><span className="ganaste-stat-label">Tiempo</span><span className="ganaste-stat-valor">⏱ {formatTiempo(tiempo)}</span></div>
            </div>
            <div className="ganaste-splash-btns">
              <button className="btn-accion nuevo" onClick={nuevaPartida}>Jugar de nuevo</button>
              <button className="btn-accion" onClick={cambiarCategoria}>🗂 Categorías</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
