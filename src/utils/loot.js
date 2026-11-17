// Lógica del generador de botín.
// Las tablas están basadas (simplificadas) en el "Individual Treasure"
// de la Guía del Dungeon Master: a mayor CR, más monedas y mejores objetos.

import { rollFormula, randomInt } from './dice'

export const TIERS = [
  {
    id: 1,
    label: 'CR 0 – 4',
    maxCR: 4,
    coins: { cp: [5, 6, 1], sp: [4, 6, 1], gp: [3, 6, 1] },
    magicItems: [0, 1],
    mundaneItems: [1, 2],
    rarities: ['Common', 'Uncommon'],
  },
  {
    id: 2,
    label: 'CR 5 – 10',
    maxCR: 10,
    coins: { sp: [4, 6, 10], gp: [4, 6, 10], pp: [1, 6, 1] },
    magicItems: [1, 2],
    mundaneItems: [1, 2],
    rarities: ['Uncommon', 'Rare'],
  },
  {
    id: 3,
    label: 'CR 11 – 16',
    maxCR: 16,
    coins: { gp: [4, 6, 100], pp: [1, 6, 10] },
    magicItems: [2, 3],
    mundaneItems: [0, 1],
    rarities: ['Rare', 'Very Rare'],
  },
  {
    id: 4,
    label: 'CR 17+',
    maxCR: Infinity,
    coins: { gp: [2, 6, 1000], pp: [8, 6, 100] },
    magicItems: [3, 4],
    mundaneItems: [0, 1],
    rarities: ['Very Rare', 'Legendary'],
  },
]

export const COINS = {
  cp: { name: 'Cobre', color: '#b87333' },
  sp: { name: 'Plata', color: '#c0c0c0' },
  gp: { name: 'Oro', color: '#e8c27a' },
  pp: { name: 'Platino', color: '#9fd3e0' },
}

export function getTier(cr) {
  return TIERS.find((tier) => cr <= tier.maxCR)
}

// Lanza las fórmulas de monedas del nivel correspondiente
export function rollCoins(tier) {
  return Object.entries(tier.coins).map(([coin, [count, sides, mult]]) => ({
    coin,
    amount: rollFormula(count, sides, mult),
    formula: `${count}d${sides}${mult > 1 ? ` × ${mult}` : ''}`,
  }))
}

// Cantidad aleatoria de objetos dentro del rango del nivel
export function rollItemCount([min, max]) {
  return randomInt(min, max)
}
