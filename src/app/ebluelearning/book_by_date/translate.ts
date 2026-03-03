export type SupportedLanguage = "en" | "es";

const translations: Record<SupportedLanguage, Record<string, string>> = {
  en: {
    bookingNote:
      "In order to assure the proper functioning of the booking system, please make sure the clock on your device is correct.",

    // Calendar
    selectDate: "Select Date",
    previousMonth: "Previous month",
    nextMonth: "Next month",
    sunShort: "SUN",
    monShort: "MON",
    tueShort: "TUE",
    wedShort: "WED",
    thuShort: "THU",
    friShort: "FRI",
    satShort: "SAT",
    selectTimeFirst: "Select a date first",
    loadingTimes: "Loading times…",
    selectTime: "Select Time",
    weekdayShortUnknown: "—",
    selectTimeForClass: "Now select a time for your class.",
    selectDateToContinue: "Select a date to continue.",
    loadingSessions: "Loading open sessions…",
    noOpenSlots: "No open slots on this date (next 30 days). Try another day.",

    // Teachers
    selectTimeHeader: "Select Time",
    selectYourTeacher: "Select Your Teacher",
    openSlots: "Open slots",
    bookedSlots: "Booked slots",
    availableTeachers: "Available teachers",
    selectTimeToSeeTeachers: "Select a time to see available teachers",
    searchTeacherPlaceholder: "Search teacher by name",
    selectTimeToSeeTeachersBody: "Select a time to see available teachers.",
    loadingTeachers: "Loading teachers…",
    noTeachersForTime: "No teachers available for this time.",

    // Cart
    cart: "CART",
    purchasing: "Purchasing:",
    yourCredits: "Your credits:",
    joinClass: "Join class",
    bookingBusy: "Booking…",
    confirmBooking: "Confirm booking",
    cartEmptyHint: "Select a date, then a time, then a teacher to add to cart.",
    refreshAvailability: "Refresh availability",
  },
  es: {
    bookingNote:
      "Para asegurar el correcto funcionamiento del sistema de reservas, por favor verifica que el reloj de tu dispositivo sea correcto.",

    // Calendar
    selectDate: "Seleccionar fecha",
    previousMonth: "Mes anterior",
    nextMonth: "Mes siguiente",
    sunShort: "DOM",
    monShort: "LUN",
    tueShort: "MAR",
    wedShort: "MIÉ",
    thuShort: "JUE",
    friShort: "VIE",
    satShort: "SÁB",
    selectTimeFirst: "Primero selecciona una fecha",
    loadingTimes: "Cargando horarios…",
    selectTime: "Seleccionar hora",
    weekdayShortUnknown: "—",
    selectTimeForClass: "Ahora selecciona una hora para tu clase.",
    selectDateToContinue: "Selecciona una fecha para continuar.",
    loadingSessions: "Cargando sesiones disponibles…",
    noOpenSlots: "No hay turnos disponibles en esta fecha (próximos 30 días). Prueba otro día.",

    // Teachers
    selectTimeHeader: "Seleccionar hora",
    selectYourTeacher: "Selecciona tu profesor",
    openSlots: "Turnos abiertos",
    bookedSlots: "Turnos reservados",
    availableTeachers: "Profesores disponibles",
    selectTimeToSeeTeachers: "Selecciona una hora para ver profesores disponibles",
    searchTeacherPlaceholder: "Buscar profesor por nombre",
    selectTimeToSeeTeachersBody: "Selecciona una hora para ver profesores disponibles.",
    loadingTeachers: "Cargando profesores…",
    noTeachersForTime: "No hay profesores disponibles para esta hora.",

    // Cart
    cart: "CARRITO",
    purchasing: "Comprando:",
    yourCredits: "Tus créditos:",
    joinClass: "Unirse a la clase",
    bookingBusy: "Reservando…",
    confirmBooking: "Confirmar reserva",
    cartEmptyHint: "Selecciona una fecha, luego una hora y después un profesor para añadir al carrito.",
    refreshAvailability: "Actualizar disponibilidad",
  },
};

export function translate(key: string, language: SupportedLanguage = "en"): string {
  const table = translations[language];
  return (table && table[key]) || key;
}

