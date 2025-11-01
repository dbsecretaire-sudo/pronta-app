export type { Call } from "@/src/Types/Calls/index";
import { CallFilter } from "@/src/Types/Calls/index";

export interface CallFilterProps {
  onFilterChange: (filters: CallFilter) => void;  // Utilise CallFilter complet
  userId: number;
}

export interface CallStatsProps {
  totalToday: number;
  missedToday: number;
  answerRate: number;
}