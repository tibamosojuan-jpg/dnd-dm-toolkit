import { useState } from 'react'
import Card from '../components/Card'
import Loader from '../components/Loader'
import ErrorMessage from '../components/ErrorMessage'
import { getEquipment, getEquipmentList, getMagicItem, getMagicItemList } from '../services/api'
import { pickRandom } from '../utils/dice'
import { CHALLENGE_RATINGS, formatCR } from '../utils/format'
import { COINS, getTier, rollCoins, rollItemCount } from '../utils/loot'

const RARITY_COLORS = {
  Common: '#9aa0a6',
  Uncommon: '#4caf50',
  Rare: '#3d8bfd',
  'Very Rare': '#a55eea',
  Legendary: '#ff9f1a',
  Artifact: '#e74c3c',
}

const RARITY_ES = {
  Common: 'Común',
  Uncommon: 'Poco común',
  Rare: 'Raro',
  'Very Rare': 'Muy raro',
  Legendary: 'Legendario',
  Artifact: 'Artefacto',
  Varies: 'Variable',
}

// Busca objetos mágicos cuya rareza coincida con el nivel del monstruo
async function fetchMagicItems(count, rarities) {
  if (count === 0) return []
  const { results } = await getMagicItemList()

  // Se toma una muestra aleatoria y se consulta el detalle para conocer la rareza
  const sample = pickRandom(results, 25)
  const items = (await Promise.all(sample.map((i) => getMagicItem(i.index).catch(() => null)))).filter(Boolean)

  const matching = items.filter((item) => rarities.includes(item.rarity?.name))
  const fallback = items.filter((item) => !matching.includes(item))
  return [...matching, ...fallback].slice(0, count)
}

async function fetchMundaneItems(count) {
  if (count === 0) return []
  const { results } = await getEquipmentList()
  const picked = pickRandom(results, count)
  return Promise.all(picked.map((i) => getEquipment(i.index)))
}

export default function LootGenerator({ cr, onChangeCR }) {
  const [loot, setLoot] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const tier = getTier(cr)

  const generate = async () => {
    setLoading(true)
    setError(null)
    try {
      const coins = rollCoins(tier)
      const [magic, mundane] = await Promise.all([
        fetchMagicItems(rollItemCount(tier.magicItems), tier.rarities),
        fetchMundaneItems(rollItemCount(tier.mundaneItems)),
      ])
      setLoot({ cr, coins, magic, mundane })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const totalGold = loot
    ? loot.coins.reduce((sum, c) => sum + c.amount * { cp: 0.01, sp: 0.1, gp: 1, pp: 10 }[c.coin], 0)
    : 0

  return (
    <section className="page">
      <header className="page__header">
        <h2>Generador de Botín</h2>
        <p>Recompensas aleatorias según el nivel de desafío del monstruo derrotado.</p>
      </header>

      <div className="loot-controls">
        <label className="field">
          <span>Nivel de desafío (CR)</span>
          <select className="input" value={cr} onChange={(e) => onChangeCR(Number(e.target.value))}>
            {CHALLENGE_RATINGS.map((value) => (
              <option key={value} value={value}>
                CR {formatCR(value)}
              </option>
            ))}
          </select>
        </label>

        <div className="tier-info">
          <strong>Nivel: {tier.label}</strong>
          <span>
            Objetos mágicos: {tier.magicItems.join('–')} ·{' '}
            {tier.rarities.map((r) => RARITY_ES[r]).join(' / ')}
          </span>
        </div>

        <button className="btn btn--primary btn--block" onClick={generate} disabled={loading}>
          {loading ? 'Abriendo el cofre...' : '🗝️ Generar botín'}
        </button>
      </div>

      {loading && <Loader text="Buscando tesoros..." />}
      {error && <ErrorMessage message={error} onRetry={generate} />}

      {loot && !loading && (
        <div className="loot">
          <h3 className="section-title">Monedas · CR {formatCR(loot.cr)}</h3>
          <div className="coins">
            {loot.coins.map(({ coin, amount, formula }) => (
              <div key={coin} className="coin" style={{ '--coin': COINS[coin].color }}>
                <div className="coin__icon">{coin.toUpperCase()}</div>
                <strong>{amount.toLocaleString('es-CO')}</strong>
                <span>{COINS[coin].name}</span>
                <small>{formula}</small>
              </div>
            ))}
          </div>
          <p className="loot__total">≈ {totalGold.toLocaleString('es-CO', { maximumFractionDigits: 2 })} po en total</p>

          <h3 className="section-title">Objetos</h3>
          {loot.magic.length === 0 && loot.mundane.length === 0 ? (
            <p className="empty">Esta vez el monstruo no tenía objetos. Solo monedas.</p>
          ) : (
            <div className="grid">
              {loot.magic.map((item) => (
                <Card
                  key={item.index}
                  title={item.name}
                  subtitle={item.equipment_category?.name}
                  tag={RARITY_ES[item.rarity?.name] || item.rarity?.name}
                  accent={RARITY_COLORS[item.rarity?.name]}
                >
                  <p className="card__desc">{item.desc?.slice(1).join(' ') || item.desc?.[0]}</p>
                </Card>
              ))}
              {loot.mundane.map((item) => (
                <Card
                  key={item.index}
                  title={item.name}
                  subtitle={item.equipment_category?.name}
                  tag="Equipo"
                  stats={[
                    { label: 'Valor', value: item.cost ? `${item.cost.quantity} ${item.cost.unit}` : '—' },
                    { label: 'Peso', value: item.weight ? `${item.weight} lb` : '—' },
                  ]}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  )
}
