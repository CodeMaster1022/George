export type SupportedLanguage = "en" | "es";

const translations: Record<SupportedLanguage, Record<string, string>> = {
  en: {
    // Header / main title
    historyHeading: "History",
    yourClassesHeading: "Your Classes",
    cancelledHeading: "Cancelled",
    loading: "Loading…",
    lessonHistoryTitle: "Your lesson history",
    noHistoryShort: "No history yet",
    hereAreYourClasses: "Here are your classes",
    noClassesBooked:
      "Oops! You haven't booked any classes yet…",

    // Empty states
    noCancelledClasses: "No cancelled classes.",
    noHistoryYet: "No history yet. Completed lessons will appear here.",
    noUpcomingClasses: "No upcoming classes yet.",
    noClassesYet: "No classes yet.",

    // Header controls
    refresh: "Refresh",
    filterLabel: "Filter",
    filtersTitle: "Filters",
    filterAll: "All",
    filterUpcoming: "Upcoming",
    filterHistory: "History",
    filterCancelled: "Cancelled",
    applyFilters: "Apply",

    // Card details
    teacherFallback: "Teacher",
    creditsWord: "credits",
    timeLabel: "Time:",
    meetingLabel: "Meeting:",
    openLink: "Open link",
    notAvailableYet: "Not available yet",
    calendarLabel: "Calendar:",
    loadingReport: "Loading report…",
    classReportTitle: "Class Report",
    summaryLabel: "Summary:",
    strengthsLabel: "Strengths:",
    homeworkLabel: "Homework:",
    noDetailsInReport: "No details in this report yet.",
    noReportYet: "No report yet for this class.",

    // Chat / messaging
    messageTeacher: "Message teacher",
    lessonChatTitle: "Message teacher",
    lessonChatOtherParty: "Teacher",
    unreadMessagesAriaSuffix: "unread messages",

    // Rating CTA on card
    giveFeedbackCta: "Give feedback to your teacher",
    ratedLabel: "Rated",
    cancelClass: "Cancel",
    cancelling: "Cancel…",
    cancelClassTitle: "Cancel this class",
    cancelClassDisabledTitle:
      "Only upcoming booked classes can be cancelled.",

    // Rating modal
    ratingModalTitle: "Give feedback to your teacher",
    ratingModalIntro:
      "How was your experience with {teacher}? Your feedback helps improve future lessons.",
    ratingErrorFallback:
      "Failed to submit feedback. Please try again.",
    ratingFeedbackLabel: "Your feedback (optional)",
    ratingFeedbackPlaceholder:
      "Share what went well or what could be better. Your teacher will see this.",
    ratingCancel: "Cancel",
    ratingSubmit: "Submit rating",
    ratingSubmitting: "Submitting…",
    ratingStarAriaSuffix: "star",
    ratingStarAriaPluralSuffix: "stars",
  },
  es: {
    // Header / main title
    historyHeading: "Historial",
    yourClassesHeading: "Tus clases",
    cancelledHeading: "Canceladas",
    loading: "Cargando…",
    lessonHistoryTitle: "Tu historial de clases",
    noHistoryShort: "Sin historial todavía",
    hereAreYourClasses: "Aquí están tus clases",
    noClassesBooked:
      "¡Ups! Aún no has reservado ninguna clase…",

    // Empty states
    noCancelledClasses: "No hay clases canceladas.",
    noHistoryYet:
      "Todavía no hay historial. Las clases completadas aparecerán aquí.",
    noUpcomingClasses: "Aún no tienes clases próximas.",
    noClassesYet: "Todavía no tienes clases.",

    // Header controls
    refresh: "Actualizar",
    filterLabel: "Filtro",
    filtersTitle: "Filtros",
    filterAll: "Todas",
    filterUpcoming: "Próximas",
    filterHistory: "Historial",
    filterCancelled: "Canceladas",
    applyFilters: "Aplicar",

    // Card details
    teacherFallback: "Profesor",
    creditsWord: "créditos",
    timeLabel: "Hora:",
    meetingLabel: "Reunión:",
    openLink: "Abrir enlace",
    notAvailableYet: "Aún no disponible",
    calendarLabel: "Calendario:",
    loadingReport: "Cargando informe…",
    classReportTitle: "Informe de la clase",
    summaryLabel: "Resumen:",
    strengthsLabel: "Fortalezas:",
    homeworkLabel: "Tarea:",
    noDetailsInReport: "Este informe aún no tiene detalles.",
    noReportYet: "Todavía no hay informe para esta clase.",

    // Chat / messaging
    messageTeacher: "Enviar mensaje al profesor",
    lessonChatTitle: "Enviar mensaje al profesor",
    lessonChatOtherParty: "Profesor",
    unreadMessagesAriaSuffix: "mensajes sin leer",

    // Rating CTA on card
    giveFeedbackCta: "Da tu opinión sobre tu profesor",
    ratedLabel: "Calificada",
    cancelClass: "Cancelar",
    cancelling: "Cancelando…",
    cancelClassTitle: "Cancelar esta clase",
    cancelClassDisabledTitle:
      "Solo se pueden cancelar las clases reservadas y futuras.",

    // Rating modal
    ratingModalTitle: "Da tu opinión sobre tu profesor",
    ratingModalIntro:
      "¿Cómo fue tu experiencia con {teacher}? Tus comentarios ayudan a mejorar las próximas clases.",
    ratingErrorFallback:
      "No se pudo enviar tu opinión. Por favor, inténtalo de nuevo.",
    ratingFeedbackLabel: "Tu opinión (opcional)",
    ratingFeedbackPlaceholder:
      "Comparte qué fue bien o qué se puede mejorar. Tu profesor verá este comentario.",
    ratingCancel: "Cancelar",
    ratingSubmit: "Enviar opinión",
    ratingSubmitting: "Enviando…",
    ratingStarAriaSuffix: "estrella",
    ratingStarAriaPluralSuffix: "estrellas",
  },
};

export function translate(key: string, language: SupportedLanguage = "en"): string {
  const table = translations[language];
  return (table && table[key]) || key;
}

