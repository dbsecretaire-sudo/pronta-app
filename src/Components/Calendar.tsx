"use client";
import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "moment/locale/fr";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { CalendarEvent } from "@/src/Types/Calendar/index";

// Configurer moment en français
moment.locale("fr");

// Messages en français pour react-big-calendar
const messages = {
  allDay: "Toute la journée",
  previous: "Précédent",
  next: "Suivant",
  today: "Aujourd'hui",
  month: "Mois",
  week: "Semaine",
  day: "Jour",
  agenda: "Agenda",
  date: "Date",
  time: "Heure",
  event: "Événement",
  noEventsInRange: "Aucun événement dans cette période",
  showMore: (total: number) => `+${total} de plus`,
};

const localizer = momentLocalizer(moment);

function Calendar({ events }: { events: CalendarEvent[] }) {
  return (
    <div className="h-[600px]">
      <BigCalendar
        localizer={localizer}
        events={events}
        startAccessor="start_time"
        endAccessor="end_time"
        titleAccessor="title"
        messages={messages} // Ajout des messages en français
        culture="fr" // Définir la culture
        formats={{
          // Formats personnalisés pour la date et l'heure
          dateFormat: "DD/MM",
          dayFormat: "ddd DD/MM",
          dayRangeHeaderFormat: ({ start, end }: { start: Date; end: Date }) =>
            `${moment(start).format("DD/MM")} - ${moment(end).format("DD/MM")}`,
          timeGutterFormat: "HH:mm",
          eventTimeRangeFormat: ({ start, end }: { start: Date; end: Date }) =>
            `${moment(start).format("HH:mm")} - ${moment(end).format("HH:mm")}`,
          monthHeaderFormat: "MMMM YYYY",
          dayHeaderFormat: "dddd DD MMMM",
          agendaHeaderFormat: ({ start, end }: { start: Date; end: Date }) =>
            `${moment(start).format("DD/MM")} - ${moment(end).format("DD/MM")}`,
        }}
      />
    </div>
  );
}

export default Calendar;
