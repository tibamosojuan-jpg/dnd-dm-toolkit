const TABS = [
  { id: 'bestiary', label: 'Bestiario', icon: '🐉' },
  { id: 'loot', label: 'Botín', icon: '💰' },
  { id: 'dice', label: 'Dados', icon: '🎲' },
]

export default function TabBar({ active, onChange }) {
  return (
    <nav className="tabbar">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          className={`tabbar__btn ${active === tab.id ? 'is-active' : ''}`}
          onClick={() => onChange(tab.id)}
        >
          <span className="tabbar__icon">{tab.icon}</span>
          <span>{tab.label}</span>
        </button>
      ))}
    </nav>
  )
}
