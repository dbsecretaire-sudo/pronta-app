export interface Call {
  id: number;
  name: string;
  phone: string;
  date: string;
  type: 'incoming' | 'outgoing' | 'missed';
  summary: string;
  duration?: number;
}

export interface CallFilter {
  byName: string;
  byPhone: string;
  userId?: string; // Optionnel si tu veux le passer dans le filtre
}

export interface CallStatsProps {
  totalToday: number;
  missedToday: number;
  answerRate: number;
}

