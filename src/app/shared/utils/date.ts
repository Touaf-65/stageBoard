/**
 * Date du jour au format AAAA-MM-JJ (heure locale), le format attendu
 * par les DateField de l'API et par les <input type="date">.
 */
export function todayIso(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
