// Convierte valores de CR como 0.125 a "1/8"
export function formatCR(cr) {
  if (cr === 0.125) return '1/8'
  if (cr === 0.25) return '1/4'
  if (cr === 0.5) return '1/2'
  return String(cr)
}

// La API devuelve armor_class como arreglo: [{ type, value }]
export function formatAC(armorClass) {
  if (Array.isArray(armorClass)) return armorClass[0]?.value ?? '—'
  return armorClass ?? '—'
}

// Modificador de característica: 14 -> +2
export function abilityMod(score) {
  const mod = Math.floor((score - 10) / 2)
  return mod >= 0 ? `+${mod}` : `${mod}`
}

export const CHALLENGE_RATINGS = [
  0, 0.125, 0.25, 0.5,
  ...Array.from({ length: 30 }, (_, i) => i + 1),
]
