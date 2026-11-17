import { imageUrl } from '../services/api'
import { abilityMod, formatAC, formatCR } from '../utils/format'

const ABILITIES = [
  ['strength', 'FUE'],
  ['dexterity', 'DES'],
  ['constitution', 'CON'],
  ['intelligence', 'INT'],
  ['wisdom', 'SAB'],
  ['charisma', 'CAR'],
]

function ActionList({ title, items }) {
  if (!items || items.length === 0) return null
  return (
    <section className="detail__section">
      <h4>{title}</h4>
      {items.map((item) => (
        <p key={item.name}>
          <strong>{item.name}.</strong> {item.desc}
        </p>
      ))}
    </section>
  )
}

export default function MonsterDetail({ monster, onUseForLoot }) {
  const speed = Object.entries(monster.speed || {})
    .map(([type, value]) => `${type} ${value}`)
    .join(', ')

  return (
    <div className="detail">
      {monster.image && (
        <img className="detail__image" src={imageUrl(monster.image)} alt={monster.name} />
      )}
      <h2>{monster.name}</h2>
      <p className="detail__meta">
        {monster.size} {monster.type} · {monster.alignment}
      </p>

      <div className="detail__grid">
        <div><span>CA</span><strong>{formatAC(monster.armor_class)}</strong></div>
        <div><span>PG</span><strong>{monster.hit_points}</strong><small>{monster.hit_points_roll || monster.hit_dice}</small></div>
        <div><span>CR</span><strong>{formatCR(monster.challenge_rating)}</strong><small>{monster.xp} XP</small></div>
      </div>

      <p className="detail__speed"><strong>Velocidad:</strong> {speed || '—'}</p>

      <div className="abilities">
        {ABILITIES.map(([key, label]) => (
          <div key={key} className="ability">
            <span>{label}</span>
            <strong>{monster[key]}</strong>
            <small>{abilityMod(monster[key])}</small>
          </div>
        ))}
      </div>

      <ActionList title="Rasgos especiales" items={monster.special_abilities} />
      <ActionList title="Acciones" items={monster.actions} />
      <ActionList title="Acciones legendarias" items={monster.legendary_actions} />

      <button className="btn btn--primary btn--block" onClick={() => onUseForLoot(monster.challenge_rating)}>
        💰 Derrotado: generar botín (CR {formatCR(monster.challenge_rating)})
      </button>
    </div>
  )
}
