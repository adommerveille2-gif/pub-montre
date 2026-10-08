/** Calendrier de l'étudiant : « aujourd'hui » et séries se calculent dans son fuseau horaire. */

const DAY_MS = 24 * 60 * 60 * 1000;

function partsIn(instant: Date, timeZone: string) {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  });
  const map = Object.fromEntries(formatter.formatToParts(instant).map((p) => [p.type, p.value]));
  return {
    year: Number(map.year),
    month: Number(map.month),
    day: Number(map.day),
    hour: Number(map.hour),
    minute: Number(map.minute),
    second: Number(map.second),
  };
}

/** Décalage (ms) entre l'heure murale du fuseau et UTC, à cet instant. */
function offsetMs(instant: Date, timeZone: string): number {
  const p = partsIn(instant, timeZone);
  const wallAsUtc = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second);
  return wallAsUtc - instant.getTime();
}

/** Clé de jour « AAAA-MM-JJ » dans le fuseau donné. */
export function dayKey(instant: Date, timeZone: string): string {
  const p = partsIn(instant, timeZone);
  return `${p.year}-${String(p.month).padStart(2, "0")}-${String(p.day).padStart(2, "0")}`;
}

/** Instant du début du jour courant dans le fuseau donné (minuit local). */
export function startOfDayIn(now: Date, timeZone: string): Date {
  const p = partsIn(now, timeZone);
  const midnightUtc = Date.UTC(p.year, p.month - 1, p.day);
  return new Date(midnightUtc - offsetMs(new Date(midnightUtc), timeZone));
}

/**
 * Nombre de jours consécutifs d'activité se terminant aujourd'hui
 * (ou hier, pour ne pas casser la série avant que l'étudiant ne s'entraîne dans la journée).
 */
export function currentStreak(activityDates: readonly Date[], now: Date, timeZone: string): number {
  const days = new Set(activityDates.map((date) => dayKey(date, timeZone)));
  let cursor = now;
  if (!days.has(dayKey(cursor, timeZone))) {
    cursor = new Date(now.getTime() - DAY_MS);
  }
  let streak = 0;
  while (days.has(dayKey(cursor, timeZone))) {
    streak += 1;
    cursor = new Date(cursor.getTime() - DAY_MS);
  }
  return streak;
}
