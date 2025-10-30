export type Call = {
  id: string;
  name: string;
  phone: string;
  type: "incoming" | "outgoing";
  date: string;
  summary: string;
  duration: number;
};

export type CalendarEvent = {
  id: string;
  title: string;
  start: string;
  end: string;
};
