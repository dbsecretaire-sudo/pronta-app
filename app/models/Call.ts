export interface Call {
  id: number;
  name: string;
  phone: string;
  date: string;
  type: 'incoming' | 'outgoing' | 'missed';
  summary: string;
  duration?: number;
}