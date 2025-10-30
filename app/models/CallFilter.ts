export interface CallFilter {
  byName: string;
  byPhone: string;
  userId?: string; // Optionnel si tu veux le passer dans le filtre
}