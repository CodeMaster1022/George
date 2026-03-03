export type SupportedLanguage = "en" | "es";

const translations: Record<SupportedLanguage, Record<string, string>> = {
  en: {
    bookingNote:
      "In order to assure the proper functioning of the booking system, please make sure the clock on your device is correct.",

    // Header + search
    bookByTeacherTitle: "Book by Teacher",
    bookByTeacherSubtitle: "Choose a teacher, then pick an open time slot (next 30 days).",
    searchTeacherPlaceholder: "Search teacher by name",
    loadingTeachers: "Loading teachers...",
    noTeachersMatch: "No teachers match your search.",

    // Cart / booking panel
    bookHeading: "BOOK",
    purchasing: "Purchasing:",
    yourCredits: "Your credits:",
    selectedPrefix: "Selected:",
    openSlots30Label: "Open slots (30 days):",
    chooseDateTimeHint: "Choose a date/time in the calendar below.",
    noSlotsForTeacherHint:
      "No open slots found for this teacher (next 30 days). The teacher must create/generate sessions in the teacher dashboard.",
    selectedTimeHeading: "Selected time",
    priceLabel: "Price:",
    creditsWord: "credits",
    meetingLinkLabel: "Meeting link",
    copyLink: "Copy link",
    bookingBusy: "Booking...",
    bookSelectedTime: "Book selected time",
    clearSelection: "Clear selection",
    selectTeacherHint: "Select a teacher to book a class.",
    bookingInfoShort: "Booked successfully.",
    bookingToast: "Meeting booked successfully. Your class is confirmed.",

    // Calendar + times
    calendarTitle: "Calendar",
    showingSlotsFor: "Showing open slots for",
    selectTeacherForAvailability: "Select a teacher above to see their availability.",
    refresh: "Refresh",
    timesHeading: "Times",
    selectedDayLabel: "Selected day:",
    pickDayHint: "Pick a day on the calendar.",
    loadingTimes: "Loading…",
    noOpenTimes: "No open times on this day.",
    selectDayToSeeTimes: "Select a day to see times.",

    // Month calendar
    previousMonth: "Previous month",
    nextMonth: "Next month",
    sunShort: "Sun",
    monShort: "Mon",
    tueShort: "Tue",
    wedShort: "Wed",
    thuShort: "Thu",
    friShort: "Fri",
    satShort: "Sat",
    noOpenSlots: "No open slots",
    openSlotsTitle: "open slot(s)",
    slotsLabel: "slot(s)",
  },
  es: {
    bookingNote:
      "Para asegurar el correcto funcionamiento del sistema de reservas, por favor verifica que el reloj de tu dispositivo sea correcto.",

    // Header + search
    bookByTeacherTitle: "Reservar por profesor",
    bookByTeacherSubtitle:
      "Elige un profesor y luego selecciona un horario disponible (próximos 30 días).",
    searchTeacherPlaceholder: "Buscar profesor por nombre",
    loadingTeachers: "Cargando profesores...",
    noTeachersMatch: "Ningún profesor coincide con tu búsqueda.",

    // Cart / booking panel
    bookHeading: "RESERVA",
    purchasing: "Comprando:",
    yourCredits: "Tus créditos:",
    selectedPrefix: "Seleccionado:",
    openSlots30Label: "Turnos abiertos (30 días):",
    chooseDateTimeHint: "Elige fecha y hora en el calendario de abajo.",
    noSlotsForTeacherHint:
      "No se encontraron turnos abiertos para este profesor (próximos 30 días). El profesor debe crear/generar sesiones en su panel.",
    selectedTimeHeading: "Horario seleccionado",
    priceLabel: "Precio:",
    creditsWord: "créditos",
    meetingLinkLabel: "Enlace de la reunión",
    copyLink: "Copiar enlace",
    bookingBusy: "Reservando...",
    bookSelectedTime: "Reservar horario seleccionado",
    clearSelection: "Limpiar selección",
    selectTeacherHint: "Selecciona un profesor para reservar una clase.",
    bookingInfoShort: "Reserva realizada correctamente.",
    bookingToast: "Clase reservada correctamente. Tu clase está confirmada.",

    // Calendar + times
    calendarTitle: "Calendario",
    showingSlotsFor: "Mostrando turnos abiertos para",
    selectTeacherForAvailability:
      "Selecciona un profesor arriba para ver su disponibilidad.",
    refresh: "Actualizar",
    timesHeading: "Horarios",
    selectedDayLabel: "Día seleccionado:",
    pickDayHint: "Elige un día en el calendario.",
    loadingTimes: "Cargando…",
    noOpenTimes: "No hay horarios disponibles en este día.",
    selectDayToSeeTimes: "Selecciona un día para ver horarios.",

    // Month calendar
    previousMonth: "Mes anterior",
    nextMonth: "Mes siguiente",
    sunShort: "Dom",
    monShort: "Lun",
    tueShort: "Mar",
    wedShort: "Mié",
    thuShort: "Jue",
    friShort: "Vie",
    satShort: "Sáb",
    noOpenSlots: "Sin turnos abiertos",
    openSlotsTitle: "turno(s) abierto(s)",
    slotsLabel: "turno(s)",
  },
};

export function translate(key: string, language: SupportedLanguage = "en"): string {
  const table = translations[language];
  return (table && table[key]) || key;
}

