import { useState, useEffect } from 'react'
import SudokuGame from './games/sudoku/SudokuGame.jsx'
import WordSearch from './games/wordsearch/WordSearch.jsx'
import Crossword from './games/crossword/Crossword.jsx'
import './index.css'

// SVG íconos personalizados para los juegos orbitantes
const OrbitIcons = [
  // Sudoku grilla
  <svg key="s" viewBox="0 0 24 24" fill="none"><rect x="2" y="2" width="9" height="9" rx="1.5" fill="white" fillOpacity="0.9"/><rect x="13" y="2" width="9" height="9" rx="1.5" fill="white" fillOpacity="0.5"/><rect x="2" y="13" width="9" height="9" rx="1.5" fill="white" fillOpacity="0.5"/><rect x="13" y="13" width="9" height="9" rx="1.5" fill="white" fillOpacity="0.9"/></svg>,
  // Letra A (sopa de letras)
  <svg key="a" viewBox="0 0 24 24" fill="none"><path d="M4 20L12 4L20 20" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M7 14h10" stroke="white" strokeWidth="2.5" strokeLinecap="round"/></svg>,
  // Cruz (crucigrama)
  <svg key="c" viewBox="0 0 24 24" fill="none"><rect x="9" y="2" width="6" height="6" rx="1" fill="white" fillOpacity="0.9"/><rect x="9" y="9" width="6" height="6" rx="1" fill="white" fillOpacity="0.9"/><rect x="2" y="9" width="6" height="6" rx="1" fill="white" fillOpacity="0.9"/><rect x="16" y="9" width="6" height="6" rx="1" fill="white" fillOpacity="0.9"/><rect x="9" y="16" width="6" height="6" rx="1" fill="white" fillOpacity="0.9"/></svg>,
  // Trofeo
  <svg key="t" viewBox="0 0 24 24" fill="none"><path d="M6 9H4a2 2 0 0 1 0-4h2" stroke="white" strokeWidth="2" strokeLinecap="round"/><path d="M18 9h2a2 2 0 0 0 0-4h-2" stroke="white" strokeWidth="2" strokeLinecap="round"/><path d="M6 5h12v7a6 6 0 0 1-12 0V5z" stroke="white" strokeWidth="2"/><path d="M12 18v3M9 21h6" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>,
  // Estrella
  <svg key="e" viewBox="0 0 24 24" fill="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="white" fillOpacity="0.9"/></svg>,
  // Controlador
  <svg key="g" viewBox="0 0 24 24" fill="none"><rect x="2" y="7" width="20" height="12" rx="4" stroke="white" strokeWidth="2"/><path d="M8 11v4M6 13h4" stroke="white" strokeWidth="2" strokeLinecap="round"/><circle cx="16" cy="12" r="1.2" fill="white"/><circle cx="16" cy="15" r="1.2" fill="white"/></svg>,
]

const ORBIT_COLORS = ['#7c3aed','#0ea5e9','#f59e0b','#10b981','#ec4899','#6366f1']

// SVG íconos para las cards del home
const CardIcons = {
  sudoku: (
    <svg viewBox="0 0 40 40" fill="none" width="44" height="44">
      <rect width="40" height="40" rx="10" fill="url(#si)"/>
      <rect x="5" y="5" width="10" height="10" rx="2" fill="white" fillOpacity="0.9"/>
      <rect x="17" y="5" width="10" height="10" rx="2" fill="white" fillOpacity="0.4"/>
      <rect x="25" y="5" width="10" height="10" rx="2" fill="white" fillOpacity="0.9"/>
      <rect x="5" y="17" width="10" height="10" rx="2" fill="white" fillOpacity="0.4"/>
      <rect x="17" y="17" width="10" height="10" rx="2" fill="white" fillOpacity="0.9"/>
      <rect x="25" y="17" width="10" height="10" rx="2" fill="white" fillOpacity="0.4"/>
      <rect x="5" y="25" width="10" height="10" rx="2" fill="white" fillOpacity="0.9"/>
      <rect x="17" y="25" width="10" height="10" rx="2" fill="white" fillOpacity="0.4"/>
      <rect x="25" y="25" width="10" height="10" rx="2" fill="white" fillOpacity="0.9"/>
      <defs><linearGradient id="si" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse"><stop stopColor="#7c3aed"/><stop offset="1" stopColor="#ec4899"/></linearGradient></defs>
    </svg>
  ),
  wordsearch: (
    <svg viewBox="0 0 40 40" fill="none" width="44" height="44">
      <rect width="40" height="40" rx="10" fill="url(#wi)"/>
      <path d="M10 28L20 8L30 28" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M13 22h14" stroke="white" strokeWidth="3" strokeLinecap="round"/>
      <defs><linearGradient id="wi" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse"><stop stopColor="#0ea5e9"/><stop offset="1" stopColor="#6366f1"/></linearGradient></defs>
    </svg>
  ),
  crossword: (
    <svg viewBox="0 0 40 40" fill="none" width="44" height="44">
      <rect width="40" height="40" rx="10" fill="url(#ci)"/>
      <rect x="15" y="5" width="10" height="10" rx="2" fill="white" fillOpacity="0.9"/>
      <rect x="15" y="15" width="10" height="10" rx="2" fill="white" fillOpacity="0.9"/>
      <rect x="5" y="15" width="10" height="10" rx="2" fill="white" fillOpacity="0.9"/>
      <rect x="25" y="15" width="10" height="10" rx="2" fill="white" fillOpacity="0.9"/>
      <rect x="15" y="25" width="10" height="10" rx="2" fill="white" fillOpacity="0.9"/>
      <defs><linearGradient id="ci" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse"><stop stopColor="#f59e0b"/><stop offset="1" stopColor="#ef4444"/></linearGradient></defs>
    </svg>
  ),
}

// ─── Splash principal "Games By Diego" ───────────────────────────────────────
function MainSplash({ onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 3000)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="splash main-splash">
      {Array.from({ length: 14 }, (_, i) => (
        <div key={i} className="splash-particle" style={{
          left: `${5 + i * 7}%`, animationDelay: `${i * 0.15}s`,
          animationDuration: `${2.8 + (i % 4) * 0.4}s`,
          width: `${8 + (i % 3) * 6}px`, height: `${8 + (i % 3) * 6}px`,
        }}/>
      ))}

      <div className="splash-content">
        <div className="ms-orbit-wrap">
          <div className="ms-orbit-ring"/>
          <div className="ms-orbit-ring ms-ring2"/>
          <div className="ms-center-icon">
            <svg viewBox="0 0 40 40" fill="none" width="52" height="52">
              <rect width="40" height="40" rx="10" fill="url(#mc)"/>
              <rect x="5" y="5" width="12" height="12" rx="2" fill="white" fillOpacity="0.9"/>
              <rect x="19" y="5" width="12" height="12" rx="2" fill="white" fillOpacity="0.4"/>
              <rect x="5" y="19" width="12" height="12" rx="2" fill="white" fillOpacity="0.4"/>
              <rect x="19" y="19" width="12" height="12" rx="2" fill="white" fillOpacity="0.9"/>
              <defs><linearGradient id="mc" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                <stop stopColor="#7c3aed"/><stop offset="1" stopColor="#ec4899"/>
              </linearGradient></defs>
            </svg>
          </div>
          {OrbitIcons.map((icon, i) => (
            <div key={i} className="ms-orbit-icon" style={{ '--angle': `${i * 60}deg`, animationDelay: `${i * 0.1}s` }}>
              <div className="ms-orbit-icon-inner" style={{ background: ORBIT_COLORS[i] }}>
                {icon}
              </div>
            </div>
          ))}
        </div>

        <div className="ms-titulo-wrap">
          {'GAMES'.split('').map((l, i) => (
            <span key={i} className="ms-letra" style={{ animationDelay: `${0.5 + i * 0.09}s` }}>{l}</span>
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

// ─── Home ─────────────────────────────────────────────────────────────────────
const JUEGOS = [
  { id: 'sudoku',     nombre: 'Sudoku',         descripcion: 'Llena la grilla 9×9 sin repetir números',    color: '#7c3aed', color2: '#ec4899', disponible: true },
  { id: 'wordsearch', nombre: 'Sopa de Letras', descripcion: 'Encuentra todas las palabras escondidas',     color: '#0ea5e9', color2: '#6366f1', disponible: true },
  { id: 'crossword',  nombre: 'Crucigrama',     descripcion: 'Resuelve las pistas y completa las palabras', color: '#f59e0b', color2: '#ef4444', disponible: true },
]

function Home({ onSelect, darkMode, toggleDarkMode }) {
  return (
    <div className="home">
      <header className="header">
        <div className="header-brand ms-header-brand">
          <svg viewBox="0 0 32 32" fill="none" width="32" height="32">
            <rect width="32" height="32" rx="8" fill="url(#hg)"/>
            <rect x="4" y="4" width="10" height="10" rx="2" fill="white" fillOpacity="0.9"/>
            <rect x="16" y="4" width="10" height="10" rx="2" fill="white" fillOpacity="0.4"/>
            <rect x="4" y="16" width="10" height="10" rx="2" fill="white" fillOpacity="0.4"/>
            <rect x="16" y="16" width="10" height="10" rx="2" fill="white" fillOpacity="0.9"/>
            <defs><linearGradient id="hg" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse"><stop stopColor="#7c3aed"/><stop offset="1" stopColor="#ec4899"/></linearGradient></defs>
          </svg>
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
            <button key={j.id} className={`game-card ${!j.disponible ? 'pronto' : ''}`}
              style={{ '--c1': j.color, '--c2': j.color2, animationDelay: `${i * 0.12}s` }}
              onClick={() => j.disponible && onSelect(j.id)}>
              <div className="game-card-glow"/>
              <div className="game-card-icon">{CardIcons[j.id]}</div>
              <div className="game-card-info">
                <div className="game-card-nombre">{j.nombre}</div>
                <div className="game-card-desc">{j.descripcion}</div>
              </div>
              <svg className="game-card-arrow" viewBox="0 0 24 24" fill="none" width="20" height="20">
                <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
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
  const [juego, setJuego] = useState(null)
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('sudoku_tema') !== 'light')

  useEffect(() => {
    document.documentElement.setAttribute('data-tema', darkMode ? 'dark' : 'light')
    localStorage.setItem('sudoku_tema', darkMode ? 'dark' : 'light')
  }, [darkMode])

  if (mainSplash) return <MainSplash onDone={() => setMainSplash(false)} />
  if (juego === 'sudoku')     return <SudokuGame onBack={() => setJuego(null)} />
  if (juego === 'wordsearch') return <WordSearch onBack={() => setJuego(null)} />
  if (juego === 'crossword')  return <Crossword  onBack={() => setJuego(null)} />

  return <Home onSelect={setJuego} darkMode={darkMode} toggleDarkMode={() => setDarkMode(d => !d)} />
}
