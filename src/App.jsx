import { useState, useEffect } from 'react'
import SudokuGame from './games/sudoku/SudokuGame.jsx'
import WordSearch from './games/wordsearch/WordSearch.jsx'
import Crossword from './games/crossword/Crossword.jsx'
import './index.css'

// ─── Splash principal "Games By Diego" ───────────────────────────────────────
function MainSplash({ onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 3000)
    return () => clearTimeout(t)
  }, [])

  const iconos = ['🧩','🔤','📝','🎮','🏆','⭐']

  return (
    <div className="splash main-splash">
      {/* Partículas de fondo */}
      {Array.from({ length: 14 }, (_, i) => (
        <div key={i} className="splash-particle" style={{
          left: `${5 + i * 7}%`,
          animationDelay: `${i * 0.15}s`,
          animationDuration: `${2.8 + (i % 4) * 0.4}s`,
          width: `${8 + (i % 3) * 6}px`,
          height: `${8 + (i % 3) * 6}px`,
        }}/>
      ))}

      <div className="splash-content">
        {/* Iconos de juegos orbitando */}
        <div className="ms-orbit-wrap">
          <div className="ms-orbit-ring"/>
          <div className="ms-orbit-ring ms-ring2"/>
          <div className="ms-center-icon">🎮</div>
          {iconos.map((ic, i) => (
            <div key={i} className="ms-orbit-icon" style={{
              '--angle': `${i * 60}deg`,
              animationDelay: `${i * 0.1}s`
            }}>{ic}</div>
          ))}
        </div>

        {/* Título animado letra a letra */}
        <div className="ms-titulo-wrap">
          {'GAMES'.split('').map((l, i) => (
            <span key={i} className="splash-letra ms-letra" style={{ animationDelay: `${0.5 + i * 0.09}s` }}>{l}</span>
          ))}
        </div>
        <div className="ms-by">
          {'BY DIEGO'.split('').map((l, i) => (
            <span key={i} className="ms-by-letra" style={{ animationDelay: `${0.9 + i * 0.07}s` }}>{l === ' ' ? '\u00A0' : l}</span>
          ))}
        </div>

        <div className="splash-subtitulo" style={{ animationDelay: '1.6s' }}>Your game collection</div>

        <div className="splash-loader" style={{ animationDelay: '1.7s' }}>
          <div className="splash-loader-bar" style={{ animationDelay: '1.75s' }}/>
          <div className="splash-loader-shine" style={{ animationDelay: '2.6s' }}/>
        </div>

        <div className="splash-credito" style={{ animationDelay: '1.9s' }}>Made by Diego</div>
      </div>
    </div>
  )
}

// ─── Home — selección de juegos ───────────────────────────────────────────────
const JUEGOS = [
  {
    id: 'sudoku',
    nombre: 'Sudoku',
    descripcion: 'Llena la grilla 9×9 sin repetir números',
    emoji: '🧩',
    color: '#7c3aed',
    color2: '#ec4899',
    disponible: true,
  },
  {
    id: 'wordsearch',
    nombre: 'Sopa de Letras',
    descripcion: 'Encuentra todas las palabras escondidas',
    emoji: '🔤',
    color: '#0ea5e9',
    color2: '#6366f1',
    disponible: true,
  },
  {
    id: 'crossword',
    nombre: 'Crucigrama',
    descripcion: 'Resuelve las pistas y completa las palabras',
    emoji: '📝',
    color: '#f59e0b',
    color2: '#ef4444',
    disponible: true,
  },
]

function Home({ onSelect, darkMode, toggleDarkMode }) {
  return (
    <div className="home">
      <header className="header">
        <div className="header-brand ms-header-brand">
          <span className="ms-header-icon">🎮</span>
          <div>
            <div className="ms-header-title">Games</div>
            <div className="ms-header-sub">by Diego</div>
          </div>
        </div>
        <button className="btn-tema" onClick={toggleDarkMode}>{darkMode ? '☀️' : '🌙'}</button>
      </header>

      <div className="home-content">
        <div className="home-saludo">Elige un juego</div>
        <div className="home-cards">
          {JUEGOS.map((j, i) => (
            <button
              key={j.id}
              className={`game-card ${!j.disponible ? 'pronto' : ''}`}
              style={{ '--c1': j.color, '--c2': j.color2, animationDelay: `${i * 0.12}s` }}
              onClick={() => j.disponible && onSelect(j.id)}
            >
              <div className="game-card-glow"/>
              <div className="game-card-emoji">{j.emoji}</div>
              <div className="game-card-info">
                <div className="game-card-nombre">{j.nombre}</div>
                <div className="game-card-desc">{j.descripcion}</div>
              </div>
              <div className="game-card-arrow">→</div>
              {!j.disponible && <div className="game-card-pronto">Próximamente</div>}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── App principal ─────────────────────────────────────────────────────────────
export default function App() {
  const [mainSplash, setMainSplash] = useState(true)
  const [juego, setJuego] = useState(null) // null = home
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('sudoku_tema') !== 'light')

  useEffect(() => {
    document.documentElement.setAttribute('data-tema', darkMode ? 'dark' : 'light')
    localStorage.setItem('sudoku_tema', darkMode ? 'dark' : 'light')
  }, [darkMode])

  if (mainSplash) return <MainSplash onDone={() => setMainSplash(false)} />

  if (juego === 'sudoku')     return <SudokuGame onBack={() => setJuego(null)} />
  if (juego === 'wordsearch') return <WordSearch onBack={() => setJuego(null)} />
  if (juego === 'crossword')  return <Crossword  onBack={() => setJuego(null)} />

  return (
    <Home
      onSelect={setJuego}
      darkMode={darkMode}
      toggleDarkMode={() => setDarkMode(d => !d)}
    />
  )
}
