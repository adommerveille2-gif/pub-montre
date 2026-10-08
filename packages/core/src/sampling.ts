/**
 * Tire `count` éléments distincts au hasard (Fisher-Yates partiel).
 * `random` est injectable pour des tests déterministes.
 */
export function sampleWithoutReplacement<T>(
  items: readonly T[],
  count: number,
  random: () => number = Math.random,
): T[] {
  const pool = [...items];
  const take = Math.min(Math.max(0, count), pool.length);
  for (let i = 0; i < take; i++) {
    const j = i + Math.floor(random() * (pool.length - i));
    [pool[i], pool[j]] = [pool[j] as T, pool[i] as T];
  }
  return pool.slice(0, take);
}

/** Vrai si les deux ensembles d'identifiants contiennent exactement les mêmes éléments. */
export function sameSelection(a: readonly string[], b: readonly string[]): boolean {
  const setA = new Set(a);
  const setB = new Set(b);
  if (setA.size !== setB.size) return false;
  for (const value of setA) {
    if (!setB.has(value)) return false;
  }
  return true;
}
