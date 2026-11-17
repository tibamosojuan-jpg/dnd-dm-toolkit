// Utilidades de aleatoriedad

export const DICE = [4, 6, 8, 10, 12, 20, 100]

// Entero aleatorio entre min y max (ambos incluidos)
export function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// Lanza un dado de N caras -> 1..N
export function rollDie(sides) {
  return randomInt(1, sides)
}

// Lanza varios dados iguales y devuelve cada resultado
export function rollDice(count, sides) {
  return Array.from({ length: count }, () => rollDie(sides))
}

// Suma de una tirada tipo "3d6" multiplicada (ej: 2d6 x 10)
export function rollFormula(count, sides, multiplier = 1) {
  return rollDice(count, sides).reduce((a, b) => a + b, 0) * multiplier
}

// Elige n elementos distintos al azar de un arreglo
export function pickRandom(array, n = 1) {
  const copy = [...array]
  const result = []
  while (result.length < n && copy.length > 0) {
    const i = randomInt(0, copy.length - 1)
    result.push(copy.splice(i, 1)[0])
  }
  return result
}
