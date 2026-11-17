import { useState } from 'react'
import { DICE, rollDice } from '../utils/dice'

const MAX_HISTORY = 10

export default function DiceTray() {
  const [sides, setSides] = useState(20)
  const [quantity, setQuantity] = useState(1)
  const [modifier, setModifier] = useState(0)
  const [result, setResult] = useState(null)
  const [history, setHistory] = useState([])
  const [rollId, setRollId] = useState(0) // fuerza la animación en cada lanzamiento

  const roll = () => {
    const values = rollDice(quantity, sides)
    const total = values.reduce((a, b) => a + b, 0) + modifier
    const newResult = {
      id: Date.now(),
      label: `${quantity}d${sides}${modifier ? (modifier > 0 ? `+${modifier}` : modifier) : ''}`,
      values,
      total,
      sides,
      critical: sides === 20 && quantity === 1 && values[0] === 20,
      fumble: sides === 20 && quantity === 1 && values[0] === 1,
    }
    setResult(newResult)
    setRollId((id) => id + 1)
    setHistory((prev) => [newResult, ...prev].slice(0, MAX_HISTORY))
  }

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value))

  return (
    <section className="page">
      <header className="page__header">
        <h2>Bandeja de Dados</h2>
        <p>Elige un dado, ajusta la cantidad y lanza.</p>
      </header>

      <div className="dice-picker">
        {DICE.map((d) => (
          <button
            key={d}
            className={`die-btn die-btn--d${d} ${sides === d ? 'is-active' : ''}`}
            onClick={() => setSides(d)}
          >
            <span className="die-btn__shape" />
            <span className="die-btn__label">d{d}</span>
          </button>
        ))}
      </div>

      <div className="dice-options">
        <div className="stepper">
          <span>Cantidad</span>
          <div>
            <button onClick={() => setQuantity((q) => clamp(q - 1, 1, 10))}>−</button>
            <strong>{quantity}</strong>
            <button onClick={() => setQuantity((q) => clamp(q + 1, 1, 10))}>+</button>
          </div>
        </div>
        <div className="stepper">
          <span>Modificador</span>
          <div>
            <button onClick={() => setModifier((m) => clamp(m - 1, -20, 20))}>−</button>
            <strong>{modifier >= 0 ? `+${modifier}` : modifier}</strong>
            <button onClick={() => setModifier((m) => clamp(m + 1, -20, 20))}>+</button>
          </div>
        </div>
      </div>

      <button className="btn btn--primary btn--block btn--roll" onClick={roll}>
        🎲 Lanzar {quantity}d{sides}
      </button>

      <div className="tray">
        {result ? (
          <div
            key={rollId}
            className={`tray__result ${result.critical ? 'is-critical' : ''} ${result.fumble ? 'is-fumble' : ''}`}
          >
            <span className="tray__label">{result.label}</span>
            <span className="tray__total">{result.total}</span>
            {result.critical && <span className="tray__badge">¡CRÍTICO!</span>}
            {result.fumble && <span className="tray__badge">Pifia...</span>}
            {result.values.length > 1 || modifier !== 0 ? (
              <div className="tray__values">
                {result.values.map((v, i) => (
                  <span key={i} className={v === result.sides ? 'is-max' : v === 1 ? 'is-min' : ''}>
                    {v}
                  </span>
                ))}
                {modifier !== 0 && <em>{modifier > 0 ? `+${modifier}` : modifier}</em>}
              </div>
            ) : null}
          </div>
        ) : (
          <p className="tray__empty">Los dados esperan...</p>
        )}
      </div>

      {history.length > 0 && (
        <div className="history">
          <div className="history__header">
            <h3 className="section-title">Historial</h3>
            <button className="btn btn--ghost btn--small" onClick={() => setHistory([])}>
              Limpiar
            </button>
          </div>
          <ul>
            {history.map((h) => (
              <li key={h.id}>
                <span>{h.label}</span>
                <span className="history__values">[{h.values.join(', ')}]</span>
                <strong>{h.total}</strong>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}
