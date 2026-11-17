import { useCallback, useEffect, useMemo, useState } from 'react'
import Card from '../components/Card'
import Loader from '../components/Loader'
import ErrorMessage from '../components/ErrorMessage'
import Modal from '../components/Modal'
import Pagination from '../components/Pagination'
import MonsterDetail from '../components/MonsterDetail'
import { getMonster, getMonsters, imageUrl } from '../services/api'
import { CHALLENGE_RATINGS, formatAC, formatCR } from '../utils/format'

const PAGE_SIZE = 12

export default function Bestiary({ onUseForLoot }) {
  const [monsters, setMonsters] = useState([])       // lista básica { index, name }
  const [details, setDetails] = useState({})         // detalles ya cargados por index
  const [search, setSearch] = useState('')
  const [crFilter, setCrFilter] = useState('')
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selected, setSelected] = useState(null)

  // 1. Cargar la lista de monstruos (filtrada por CR desde la API)
  const loadMonsters = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getMonsters(crFilter)
      setMonsters(data.results)
      setPage(1)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [crFilter])

  useEffect(() => {
    loadMonsters()
  }, [loadMonsters])

  // 2. Filtro por nombre en el cliente
  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    return term ? monsters.filter((m) => m.name.toLowerCase().includes(term)) : monsters
  }, [monsters, search])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  // 3. Pedir el detalle (CA, PG, CR) solo de los monstruos visibles
  useEffect(() => {
    const missing = pageItems.filter((m) => !details[m.index])
    if (missing.length === 0) return

    let cancelled = false
    Promise.all(missing.map((m) => getMonster(m.index).catch(() => null))).then((results) => {
      if (cancelled) return
      setDetails((prev) => {
        const next = { ...prev }
        results.forEach((monster) => monster && (next[monster.index] = monster))
        return next
      })
    })
    return () => {
      cancelled = true
    }
  }, [pageItems, details])

  const handleSearch = (e) => {
    setSearch(e.target.value)
    setPage(1)
  }

  const handleUseForLoot = (cr) => {
    setSelected(null)
    onUseForLoot(cr)
  }

  return (
    <section className="page">
      <header className="page__header">
        <h2>Bestiario</h2>
        <p>Consulta los monstruos de D&amp;D 5e y sus estadísticas.</p>
      </header>

      <div className="filters">
        <input
          type="search"
          className="input"
          placeholder="Buscar monstruo..."
          value={search}
          onChange={handleSearch}
        />
        <select className="input" value={crFilter} onChange={(e) => setCrFilter(e.target.value)}>
          <option value="">Todos los CR</option>
          {CHALLENGE_RATINGS.map((cr) => (
            <option key={cr} value={cr}>
              CR {formatCR(cr)}
            </option>
          ))}
        </select>
      </div>

      {loading && <Loader text="Invocando monstruos..." />}
      {error && <ErrorMessage message={error} onRetry={loadMonsters} />}

      {!loading && !error && (
        <>
          <p className="results-count">{filtered.length} monstruos encontrados</p>

          {filtered.length === 0 ? (
            <p className="empty">No hay monstruos que coincidan con la búsqueda.</p>
          ) : (
            <div className="grid">
              {pageItems.map((m) => {
                const detail = details[m.index]
                return (
                  <Card
                    key={m.index}
                    title={m.name}
                    subtitle={detail ? `${detail.size} ${detail.type}` : 'Cargando...'}
                    image={detail?.image ? imageUrl(detail.image) : null}
                    tag={detail ? `CR ${formatCR(detail.challenge_rating)}` : null}
                    onClick={detail ? () => setSelected(detail) : undefined}
                    stats={[
                      { label: 'CA', value: detail ? formatAC(detail.armor_class) : '…' },
                      { label: 'PG', value: detail ? detail.hit_points : '…' },
                      { label: 'CR', value: detail ? formatCR(detail.challenge_rating) : '…' },
                    ]}
                  />
                )
              })}
            </div>
          )}

          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        </>
      )}

      <Modal open={!!selected} onClose={() => setSelected(null)}>
        {selected && <MonsterDetail monster={selected} onUseForLoot={handleUseForLoot} />}
      </Modal>
    </section>
  )
}
