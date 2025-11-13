export type { Call } from "@/src/Types/Calls/index";
import { CallFilter } from "@/src/lib/schemas/calls";

export interface CallFilterProps {
  onFilterChange: (filters: CallFilter) => void;
  userId: number;
}

export interface CallStatsProps {
  totalToday: number;
  missedToday: number;
  answerRate: number;
}