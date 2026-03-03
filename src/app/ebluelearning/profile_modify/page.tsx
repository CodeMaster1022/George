/* eslint-disable @next/next/no-img-element */
"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiJson } from "@/utils/backend";
import CloudinaryImageUpload from "@/components/CloudinaryImageUpload";
import { useLanguage } from "@/contexts/LanguageContext";
import { translate } from "../translate";

type StudentProfile = {
  _id: string;
  userId: string;
  nickname: string;
  birthdate: string;
  spanishLevel: string;
  canRead: string;
  homeschoolFunding: string;
  questionnaire: string;
  photoUrl: string;
  parentContact?: {
    name?: string;
    phone?: string;
  };
};

export default function ProfileModifyPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const t = (key: string) => translate(key, language);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [profile, setProfile] = React.useState<StudentProfile | null>(null);

  const [f, setF] = React.useState({
    nickname: "",
    birthdate: "",
    spanishLevel: "",
    canRead: "",
    homeschoolFunding: "",
    questionnaire: "",
    photoUrl: "",
    parentName: "",
    parentPhone: "",
  });

  async function load() {
    setError(null);
    setLoading(true);
    const r = await apiJson<{ profile: StudentProfile }>("/student/profile", { auth: true });
    setLoading(false);
    if (!r.ok) {
      setError(r.error);
      return;
    }
    const p = r.data?.profile;
    if (p) {
      setProfile(p);
      setF({
        nickname: p.nickname ?? "",
        birthdate: p.birthdate ?? "",
        spanishLevel: p.spanishLevel ?? "",
        canRead: p.canRead ?? "",
        homeschoolFunding: p.homeschoolFunding ?? "",
        questionnaire: p.questionnaire ?? "",
        photoUrl: p.photoUrl ?? "",
        parentName: p.parentContact?.name ?? "",
        parentPhone: p.parentContact?.phone ?? "",
      });
    }
  }

  React.useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function save() {
    setError(null);
    setSaving(true);
    const r = await apiJson<{ profile: StudentProfile }>("/student/profile", {
      method: "PUT",
      auth: true,
      body: JSON.stringify({
        nickname: f.nickname,
        birthdate: f.birthdate,
        spanishLevel: f.spanishLevel,
        canRead: f.canRead,
        homeschoolFunding: f.homeschoolFunding,
        questionnaire: f.questionnaire,
        photoUrl: f.photoUrl,
        parentContact: {
          name: f.parentName,
          phone: f.parentPhone,
        },
      }),
    });
    setSaving(false);
    if (!r.ok) {
      setError(r.error);
      return;
    }
    setProfile(r.data?.profile ?? null);
    
    // Save photo URL to localStorage for immediate display
    if (f.photoUrl) {
      localStorage.setItem("student_profile_image", f.photoUrl);
    }
    
    router.push("/ebluelearning/profile");
  }

  if (loading) {
    return (
      <main className="min-h-screen">
        <section className="relative z-10 max-w-[1200px] mx-auto p-left p-right py-8">
          <div className="text-white text-center">{t("loading")}</div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <section className="relative z-10 max-w-[1200px] mx-auto p-left p-right py-8">
        <div className="mars-content border-[5px] border-[#2D2D2D] rounded-[26px] overflow-hidden">
          <div className="space1 bg-[url('/img/mars-bg.png')] bg-cover bg-center">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
              <div>
                <h1 className="text-white text-2xl md:text-5xl font-extrabold leading-none">{t("editProfileTitle")}</h1>
                <div className="mt-3 text-white/85 text-sm md:text-base font-semibold">
                  {t("updateProfileInfo")}
                </div>
              </div>

              <button
                type="button"
                onClick={save}
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-[#0058C9] hover:bg-[#0046A3] text-white text-sm font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>{t("saving")}</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{t("saveChanges")}</span>
                  </>
                )}
              </button>
            </div>

            {error && (
              <div className="mb-6 border border-red-300 bg-red-50 text-red-800 rounded-lg px-4 py-3 text-sm">
                {error}
              </div>
            )}

            <div className="grid gap-6 md:grid-cols-2">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-6 grid gap-5">
                  <Field label={t("profilePhoto")}>
                    <CloudinaryImageUpload
                      currentImageUrl={f.photoUrl}
                      onImageUploaded={(url) => setF((s) => ({ ...s, photoUrl: url }))}
                      buttonText={t("uploadPhoto")}
                      showPreview={true}
                    />
                  </Field>

                  <Field label={t("nickname")}>
                    <Input
                      value={f.nickname}
                      onChange={(v) => setF((s) => ({ ...s, nickname: v }))}
                      placeholder={t("yourNickname")}
                    />
                  </Field>

                  <Field label={t("birthdate")}>
                    <Input
                      type="date"
                      value={f.birthdate}
                      onChange={(v) => setF((s) => ({ ...s, birthdate: v }))}
                    />
                  </Field>

                  <Field label={t("spanishLevel")}>
                    <Select
                      value={f.spanishLevel}
                      onChange={(v) => setF((s) => ({ ...s, spanishLevel: v }))}
                    >
                      <option value="">{t("selectLevel")}</option>
                      <option value="Absolute beginner">{t("absoluteBeginner")}</option>
                      <option value="Beginner">{t("beginner")}</option>
                      <option value="Elementary">{t("elementary")}</option>
                      <option value="Intermediate">{t("intermediate")}</option>
                      <option value="Upper Intermediate">{t("upperIntermediate")}</option>
                      <option value="Advanced">{t("advanced")}</option>
                      <option value="Native/Fluent">{t("nativeFluent")}</option>
                    </Select>
                  </Field>

                  <Field label={t("canRead")}>
                    <Select
                      value={f.canRead}
                      onChange={(v) => setF((s) => ({ ...s, canRead: v }))}
                    >
                      <option value="">{t("select")}</option>
                      <option value="Yes">{t("yes")}</option>
                      <option value="No">{t("no")}</option>
                    </Select>
                  </Field>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-6 grid gap-5">
                  <Field label={t("homeschoolFunding")}>
                    <Select
                      value={f.homeschoolFunding}
                      onChange={(v) => setF((s) => ({ ...s, homeschoolFunding: v }))}
                    >
                      <option value="">{t("select")}</option>
                      <option value="Yes">{t("yes")}</option>
                      <option value="No">{t("no")}</option>
                    </Select>
                  </Field>

                  <Field label={t("learningObjectives")}>
                    <Textarea
                      value={f.questionnaire}
                      onChange={(v) => setF((s) => ({ ...s, questionnaire: v }))}
                      placeholder={t("learningObjectivesPlaceholder")}
                    />
                  </Field>

                  <Field label={t("parentName")}>
                    <Input
                      value={f.parentName}
                      onChange={(v) => setF((s) => ({ ...s, parentName: v }))}
                      placeholder={t("parentGuardianName")}
                    />
                  </Field>

                  <Field label={t("telephoneNumber")}>
                    <Input
                      value={f.parentPhone}
                      onChange={(v) => setF((s) => ({ ...s, parentPhone: v }))}
                      placeholder={t("parentPhonePlaceholder")}
                    />
                  </Field>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/ebluelearning/profile"
                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                {t("cancel")}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="block text-gray-700 text-sm font-semibold mb-2">{label}</div>
      {children}
    </div>
  );
}

function Input({
  value,
  onChange,
  placeholder,
  className,
  type = "text",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
  type?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#0058C9] focus:ring-1 focus:ring-[#0058C9] transition-colors ${className || ""}`}
    />
  );
}

function Select({
  value,
  onChange,
  children,
  className,
}: {
  value: string;
  onChange: (v: string) => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:border-[#0058C9] focus:ring-1 focus:ring-[#0058C9] transition-colors ${className || ""}`}
    >
      {children}
    </select>
  );
}

function Textarea({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={4}
      className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#0058C9] focus:ring-1 focus:ring-[#0058C9] transition-colors resize-none"
    />
  );
}
