export type SupportedLanguage = "en" | "es";

const translations: Record<SupportedLanguage, Record<string, string>> = {
  en: {
    // Header
    backToDashboard: "Back to Dashboard",
    sessionsTitle: "Sessions",
    sessionsSubtitle: "Create bookable time slots and manage meeting links",
    refresh: "Refresh",

    // Summary stats
    open: "Open",
    booked: "Booked",
    cancelled: "Cancelled",

    // Create single slot
    createSingleSlotTitle: "Create single slot",
    createSingleSlotDesc: "Add one bookable slot with custom time and price",
    start: "Start",
    end: "End",
    priceCredits: "Price (credits)",
    meetingLink: "Meeting link",
    meetingLinkPlaceholder: "https://...",
    presentationPdfUrls: "Presentation PDFs (BBB)",
    presentationPdfUrlsPlaceholder: "https://example.com/slides.pdf",
    presentationPdfHint: "Optional. Public HTTPS URLs. Shown when the student joins the BigBlueButton meeting. First PDF is shown by default.",
    addAnotherPdf: "Add another PDF URL",
    creating: "Creating...",
    createSlot: "Create slot",

    // Generate from availability
    generateFromAvailabilityTitle: "Generate from availability",
    generateFromAvailabilityDesc: "Create many slots from your weekly availability",
    fromDate: "From date",
    toDate: "To date",
    generateSlots: "Generate slots",
    generating: "Generating...",
    availabilityHint: "Uses your weekly availability (UTC). Set it under Availability if needed.",

    // List header & filters
    yourSessions: "Your sessions",
    allStatus: "All status",

    // Session row
    creditsSuffix: "credits",
    copyLink: "Copy link",
    toggleToOpenTitle: "Re-open this slot",
    toggleToCancelledTitle: "Cancel this slot (only open slots can be cancelled)",
    reopenSlot: "Re-open",
    cancelSlot: "Cancel slot",
    copy: "Copy",
    presentationPdfsCount: "{{count}} PDF(s)",
    editPresentationPdfs: "Edit presentation PDFs",
    save: "Save",
    cancel: "Cancel",

    // Empty state
    noSessionsTitle: "No sessions in this range",
    noSessionsDesc: "Create a single slot or generate from your weekly availability.",
    emptyCreateSingleSlot: "Create single slot",
    emptyGenerateFromAvailability: "Generate from availability",

    // Toasts / errors
    failedToLoadSessions: "Failed to load sessions",
    slotCreated: "Slot created",
    generated: "Generated",
    slotsWord: "slot(s)",
    noSlotsGenerated: "No slots generated. Set weekly availability first.",
    sessionUpdated: "Session updated",
    noMeetingLinkToCopy: "No meeting link to copy",
    linkCopied: "Link copied",
    couldNotCopy: "Could not copy",

    // Relative time
    today: "Today",
    tomorrow: "Tomorrow",
    yesterday: "Yesterday",
  },
  es: {
    // Header
    backToDashboard: "Volver al panel",
    sessionsTitle: "Sesiones",
    sessionsSubtitle: "Crea horarios reservables y gestiona enlaces de reunión",
    refresh: "Actualizar",

    // Summary stats
    open: "Abiertas",
    booked: "Reservadas",
    cancelled: "Canceladas",

    // Create single slot
    createSingleSlotTitle: "Crear turno único",
    createSingleSlotDesc: "Añade un turno reservable con horario y precio personalizados",
    start: "Inicio",
    end: "Fin",
    priceCredits: "Precio (créditos)",
    meetingLink: "Enlace de reunión",
    meetingLinkPlaceholder: "https://...",
    presentationPdfUrls: "PDFs de presentación (BBB)",
    presentationPdfUrlsPlaceholder: "https://ejemplo.com/diapositivas.pdf",
    presentationPdfHint: "Opcional. URLs públicas HTTPS. Se muestran cuando el estudiante entra a la reunión BigBlueButton. El primer PDF se muestra por defecto.",
    addAnotherPdf: "Añadir otro PDF",
    creating: "Creando...",
    createSlot: "Crear turno",

    // Generate from availability
    generateFromAvailabilityTitle: "Generar desde disponibilidad",
    generateFromAvailabilityDesc: "Crea muchos turnos desde tu disponibilidad semanal",
    fromDate: "Desde fecha",
    toDate: "Hasta fecha",
    generateSlots: "Generar turnos",
    generating: "Generando...",
    availabilityHint: "Usa tu disponibilidad semanal (UTC). Configúrala en Disponibilidad si es necesario.",

    // List header & filters
    yourSessions: "Tus sesiones",
    allStatus: "Todos los estados",

    // Session row
    creditsSuffix: "créditos",
    copyLink: "Copiar enlace",
    toggleToOpenTitle: "Reabrir este turno",
    toggleToCancelledTitle: "Cancelar este turno (solo se pueden cancelar turnos abiertos)",
    reopenSlot: "Reabrir",
    cancelSlot: "Cancelar turno",
    copy: "Copiar",
    presentationPdfsCount: "{{count}} PDF(s)",
    editPresentationPdfs: "Editar PDFs de presentación",
    save: "Guardar",
    cancel: "Cancelar",

    // Empty state
    noSessionsTitle: "No hay sesiones en este rango",
    noSessionsDesc: "Crea un turno único o genera desde tu disponibilidad semanal.",
    emptyCreateSingleSlot: "Crear turno único",
    emptyGenerateFromAvailability: "Generar desde disponibilidad",

    // Toasts / errors
    failedToLoadSessions: "No se pudieron cargar las sesiones",
    slotCreated: "Turno creado",
    generated: "Se generaron",
    slotsWord: "turno(s)",
    noSlotsGenerated: "No se generaron turnos. Configura primero tu disponibilidad semanal.",
    sessionUpdated: "Sesión actualizada",
    noMeetingLinkToCopy: "No hay enlace de reunión para copiar",
    linkCopied: "Enlace copiado",
    couldNotCopy: "No se pudo copiar",

    // Relative time
    today: "Hoy",
    tomorrow: "Mañana",
    yesterday: "Ayer",
  },
};

/**
 * Translates a string key into the requested language.
 * Falls back to the original key when no translation is found.
 */
export function translate(key: string, language: SupportedLanguage = "en"): string {
  const table = translations[language];
  return (table && table[key]) || key;
}

