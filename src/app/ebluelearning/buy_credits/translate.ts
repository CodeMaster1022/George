export type SupportedLanguage = "en" | "es";

const translations: Record<SupportedLanguage, Record<string, string>> = {
  en: {
    // Header
    buyCreditsTitle: "Buy credits",
    buyCreditsSubtitle:
      "Each credit = one 25-minute class. Choose a package and pay with PayPal.",

    // Packages
    choosePackage: "Choose a package",
    singleClassTitle: "Single class",
    singleClassSub: "$20 per class",
    fiveClassesTitle: "5 classes",
    fiveClassesSub: "$19 per class",
    tenClassesTitle: "10 classes",
    tenClassesSub: "$18 per class",
    bestValueBadge: "Best value",

    // Sidebar / balance
    yourCreditsLabel: "Your credits",
    referralCodeLabel: "Referral code",
    referralHint: "Enter a code if someone referred you.",
    referralPlaceholder: "Optional",

    // Payment section
    payHeadingPrefix: "Pay",
    agreeTextPrefix: "I agree to the",
    agreeTerms: "Terms",
    agreeAnd: "and",
    agreePrivacy: "Privacy Policy",
    agreeHint: "Check the box above to enable payment.",
    paypalAriaLabel: "Pay with PayPal",
    paypalNotConfigured:
      "PayPal is not configured. Set PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET in the backend .env to accept payments.",
    processingPayment: "Processing your payment…",
    usdNote: "Prices are in USD. Exact charge may vary with exchange rates.",
    selectPackageForPayment: "Select a package above to see payment options.",

    // Info / error messages
    addedCreditsPrefix: "Added",
    addedCreditsSuffix: "credits.",
    newBalancePrefix: "New balance:",
    failedToCreateOrder: "Failed to create order",
    invalidServerResponse: "Invalid response from server",
    paymentCaptureFailed: "Payment capture failed",
    paypalUnavailable:
      "PayPal is not available. Try again or check your connection.",
    paypalFailedToLoad: "PayPal failed to load",
  },
  es: {
    // Header
    buyCreditsTitle: "Comprar créditos",
    buyCreditsSubtitle:
      "Cada crédito = una clase de 25 minutos. Elige un paquete y paga con PayPal.",

    // Packages
    choosePackage: "Elige un paquete",
    singleClassTitle: "Clase individual",
    singleClassSub: "20 USD por clase",
    fiveClassesTitle: "5 clases",
    fiveClassesSub: "19 USD por clase",
    tenClassesTitle: "10 clases",
    tenClassesSub: "18 USD por clase",
    bestValueBadge: "Mejor valor",

    // Sidebar / balance
    yourCreditsLabel: "Tus créditos",
    referralCodeLabel: "Código de referido",
    referralHint: "Ingresa un código si alguien te recomendó.",
    referralPlaceholder: "Opcional",

    // Payment section
    payHeadingPrefix: "Pagar",
    agreeTextPrefix: "Acepto los",
    agreeTerms: "Términos",
    agreeAnd: "y",
    agreePrivacy: "Política de Privacidad",
    agreeHint: "Marca la casilla de arriba para habilitar el pago.",
    paypalAriaLabel: "Pagar con PayPal",
    paypalNotConfigured:
      "PayPal no está configurado. Define PAYPAL_CLIENT_ID y PAYPAL_CLIENT_SECRET en el .env del backend para aceptar pagos.",
    processingPayment: "Procesando tu pago…",
    usdNote:
      "Los precios están en USD. El cargo exacto puede variar según el tipo de cambio.",
    selectPackageForPayment:
      "Selecciona un paquete arriba para ver las opciones de pago.",

    // Info / error messages
    addedCreditsPrefix: "Se añadieron",
    addedCreditsSuffix: "créditos.",
    newBalancePrefix: "Nuevo saldo:",
    failedToCreateOrder: "Error al crear la orden",
    invalidServerResponse: "Respuesta no válida del servidor",
    paymentCaptureFailed: "Error al capturar el pago",
    paypalUnavailable:
      "PayPal no está disponible. Intenta de nuevo o revisa tu conexión.",
    paypalFailedToLoad: "Error al cargar PayPal",
  },
};

export function translate(key: string, language: SupportedLanguage = "en"): string {
  const table = translations[language];
  return (table && table[key]) || key;
}

