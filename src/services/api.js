// Servicio para consumir la API pública de D&D 5e
// Documentación: https://www.dnd5eapi.co/docs

export const API_BASE = 'https://www.dnd5eapi.co'

// Caché en memoria para no repetir peticiones iguales
const cache = new Map()

async function request(path) {
  if (cache.has(path)) return cache.get(path)

  const response = await fetch(`${API_BASE}${path}`)
  if (!response.ok) {
    throw new Error(`Error ${response.status} al consultar ${path}`)
  }
  const data = await response.json()
  cache.set(path, data)
  return data
}

// ---------- Monstruos ----------
export function getMonsters(challengeRating) {
  const query = challengeRating !== '' && challengeRating != null
    ? `?challenge_rating=${challengeRating}`
    : ''
  return request(`/api/monsters${query}`)
}

export function getMonster(index) {
  return request(`/api/monsters/${index}`)
}

// ---------- Objetos ----------
export function getEquipmentList() {
  return request('/api/equipment')
}

export function getEquipment(index) {
  return request(`/api/equipment/${index}`)
}

export function getMagicItemList() {
  return request('/api/magic-items')
}

export function getMagicItem(index) {
  return request(`/api/magic-items/${index}`)
}

// Las imágenes vienen como ruta relativa: /api/images/monsters/aboleth.png
export function imageUrl(path) {
  return path ? `${API_BASE}${path}` : null
}
