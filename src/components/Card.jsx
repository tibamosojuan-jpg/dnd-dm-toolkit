// Componente de tarjeta genérico y reutilizable.
// Se usa para monstruos y para los objetos del botín.
export default function Card({ title, subtitle, image, stats = [], tag, accent, onClick, children }) {
  const clickable = typeof onClick === 'function'

  return (
    <article
      className={`card ${clickable ? 'card--clickable' : ''}`}
      style={accent ? { '--accent': accent } : undefined}
      onClick={onClick}
      onKeyDown={(e) => clickable && e.key === 'Enter' && onClick()}
      tabIndex={clickable ? 0 : undefined}
      role={clickable ? 'button' : undefined}
    >
      {image && (
        <div className="card__image">
          <img src={image} alt={title} loading="lazy" />
        </div>
      )}

      <div className="card__body">
        <header className="card__header">
          <h3 className="card__title">{title}</h3>
          {tag && <span className="card__tag">{tag}</span>}
        </header>
        {subtitle && <p className="card__subtitle">{subtitle}</p>}

        {stats.length > 0 && (
          <ul className="card__stats">
            {stats.map((stat) => (
              <li key={stat.label} className="stat">
                <span className="stat__value">{stat.value}</span>
                <span className="stat__label">{stat.label}</span>
              </li>
            ))}
          </ul>
        )}

        {children}
      </div>
    </article>
  )
}
