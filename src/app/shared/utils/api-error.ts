import { HttpErrorResponse } from '@angular/common/http';

/**
 * Construit un message lisible à partir d'une erreur de l'API Flask.
 *
 * L'API renvoie soit { msg: "..." }, soit { errors: { champ: ["..."] } }
 * (erreurs de validation WTForms). `labels` permet d'afficher un nom de champ
 * lisible à la place de la clé technique (ex. email_tuteur → "Email du tuteur").
 */
export function apiErrorMessage(
  error: HttpErrorResponse,
  fallback: string,
  labels: Record<string, string> = {}
): string {
  const body = error?.error;

  if (body?.errors && typeof body.errors === 'object') {
    const lines = Object.entries(body.errors as Record<string, string[] | string>)
      .map(([field, messages]) =>
        `${labels[field] ?? field} : ${(Array.isArray(messages) ? messages : [messages]).join(', ')}`);
    if (lines.length) return lines.join(' — ');
  }

  return body?.msg || body?.error || fallback;
}
