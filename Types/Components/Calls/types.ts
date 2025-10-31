export type { Call } from "@/Types/Calls/index";
import { CallFilter } from "@/Types/Calls/index";

export interface CallFilterProps {
  onFilterChange: (filters: CallFilter) => void;  // Utilise CallFilter complet
  userId: number;
}

export interface CallStatsProps {
  totalToday: number;
  missedToday: number;
  answerRate: number;
}