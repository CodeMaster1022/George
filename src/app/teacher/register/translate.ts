export type SupportedLanguage = "en" | "es";

const translations: Record<SupportedLanguage, Record<string, string>> = {
  en: {
    teacherRegister: "Teacher Register",
    teacherRegisterDesc: "Create a teacher account and verify your email.",
    alreadyHaveTeacherAccount: "Already have a teacher account?",
    login: "Login",
    account: "Account",
    verifyEmail: "Verify email",
    email: "Email",
    emailPlaceholder: "you@example.com",
    weSendVerificationCode: "We'll send a verification code.",
    password: "Password",
    passwordPlaceholder: "At least 6 characters",
    creatingAccount: "Creating account...",
    continue: "Continue",
    verifyYourEmail: "Verify your email",
    weSentCodeTo: "We sent a 6-digit code to",
    resendCode: "Resend code",
    sending: "Sending...",
    verificationCode: "Verification code",
    verificationCodePlaceholder: "123456",
    back: "Back",
    verifying: "Verifying...",
    verifyAndContinue: "Verify & Continue",
    registrationFailed: "Registration failed.",
    verificationFailed: "Verification failed.",
    notTeacherAccount: "This email is not registered as a teacher account.",
    couldNotResendCode: "Could not resend code.",
  },
  es: {
    teacherRegister: "Registro de profesor",
    teacherRegisterDesc: "Crea una cuenta de profesor y verifica tu correo.",
    alreadyHaveTeacherAccount: "¿Ya tienes una cuenta de profesor?",
    login: "Iniciar sesión",
    account: "Cuenta",
    verifyEmail: "Verificar correo",
    email: "Correo electrónico",
    emailPlaceholder: "tu@ejemplo.com",
    weSendVerificationCode: "Enviaremos un código de verificación.",
    password: "Contraseña",
    passwordPlaceholder: "Al menos 6 caracteres",
    creatingAccount: "Creando cuenta...",
    continue: "Continuar",
    verifyYourEmail: "Verifica tu correo electrónico",
    weSentCodeTo: "Enviamos un código de 6 dígitos a",
    resendCode: "Reenviar código",
    sending: "Enviando...",
    verificationCode: "Código de verificación",
    verificationCodePlaceholder: "123456",
    back: "Atrás",
    verifying: "Verificando...",
    verifyAndContinue: "Verificar y continuar",
    registrationFailed: "Error en el registro.",
    verificationFailed: "Error en la verificación.",
    notTeacherAccount: "Este correo no está registrado como cuenta de profesor.",
    couldNotResendCode: "No se pudo reenviar el código.",
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
