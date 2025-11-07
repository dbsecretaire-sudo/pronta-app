export type CallType = 'incoming' | 'outgoing' | 'missed';

export interface Call {
  id: number;
  user_id: number;
  phoneNumber: string;
  contactName: string | null;
  name: string;
  phone: string;
  date: Date;          // Changé de `string` à `Date` pour plus de précision
  type: CallType;
  summary: string;
  duration?: number;
  client_id: number;
}

export interface CallFilter {
  userId: number;
  byName?: string;
  byPhone?: string;
}