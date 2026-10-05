/**
 * Date du jour au format AAAA-MM-JJ (heure locale), le format attendu
 * par les DateField de l'API et par les <input type="date">.
 */
export function todayIso(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** Bornes AAAA-MM-JJ d'un <input type="date"> ; null = pas de borne. */
export interface DateRange {
  min: string | null;
  max: string | null;
}

// Les dates AAAA-MM-JJ se comparent directement en tant que chaînes
const latest = (...dates: (string | null | undefined)[]) =>
  dates.filter((d): d is string => !!d).sort().pop() ?? null;
const earliest = (...dates: (string | null | undefined)[]) =>
  dates.filter((d): d is string => !!d).sort().shift() ?? null;

/**
 * Dates acceptées par l'API pour une échéance : à partir d'aujourd'hui et
 * pendant le stage. `unchanged` (date actuelle d'une échéance modifiée) reste
 * sélectionnable même si elle est passée, comme le permet l'API.
 */
export function echeanceRange(dateDebut?: string | null, dateFin?: string | null, unchanged?: string | null): DateRange {
  const min = latest(todayIso(), dateDebut);
  return { min: earliest(min, unchanged), max: dateFin ?? null };
}

/** Dates acceptées par l'API pour le journal : pendant le stage, jusqu'à aujourd'hui. */
export function journalRange(dateDebut?: string | null, dateFin?: string | null): DateRange {
  return { min: dateDebut ?? null, max: earliest(todayIso(), dateFin) };
}

/** Ramène une date dans les bornes (sert de valeur par défaut d'un formulaire). */
export function clampDate(value: string, range: DateRange): string {
  if (range.min && value < range.min) return range.min;
  if (range.max && value > range.max) return range.max;
  return value;
}

/**
 * Avancement du stage à partir de ses dates (AAAA-MM-JJ) :
 * pourcentage écoulé (0-100) et jours restants jusqu'à la fin (0 minimum).
 */
export function stageProgress(dateDebut?: string | null, dateFin?: string | null): { pourcentage: number; joursRestants: number } {
  if (!dateDebut || !dateFin) return { pourcentage: 0, joursRestants: 0 };
  const debut = new Date(dateDebut + 'T00:00:00').getTime();
  const fin = new Date(dateFin + 'T00:00:00').getTime();
  const now = Date.now();
  const total = fin - debut;
  const pourcentage = total > 0 ? Math.round(((now - debut) / total) * 100) : 0;
  return {
    pourcentage: Math.min(100, Math.max(0, pourcentage)),
    joursRestants: Math.max(0, Math.ceil((fin - now) / 86_400_000)),
  };
}
