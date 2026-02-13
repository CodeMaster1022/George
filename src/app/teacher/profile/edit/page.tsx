/* eslint-disable @next/next/no-img-element */
"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiJson } from "@/utils/backend";
import CloudinaryImageUpload from "@/components/CloudinaryImageUpload";

type TeacherProfile = {
  _id: string;
  userId: string;
  name: string;
  bio: string;
  timezone: string;
  country: string;
  photoUrl: string;
  phone: string;
  address: string;
  resumeUrl: string;
  social?: {
    linkedin?: string;
    facebook?: string;
    instagram?: string;
    whatsapp?: string;
  };
};

export default function TeacherProfileEditPage() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [profile, setProfile] = React.useState<TeacherProfile | null>(null);

  const [f, setF] = React.useState({
    name: "",
    bio: "",
    timezone: "",
    country: "",
    photoUrl: "",
    phone: "",
    address: "",
    resumeUrl: "",
    linkedin: "",
    facebook: "",
    instagram: "",
    whatsapp: "",
  });

  async function load() {
    setError(null);
    setLoading(true);
    const r = await apiJson<{ profile: TeacherProfile }>("/teacher/profile", { auth: true });
    setLoading(false);
    if (!r.ok) {
      setError(r.error);
      return;
    }
    const p = r.data?.profile;
    if (p) {
      setProfile(p);
      setF({
        name: p.name ?? "",
        bio: p.bio ?? "",
        timezone: p.timezone ?? "",
        country: p.country ?? "",
        photoUrl: p.photoUrl ?? "",
        phone: p.phone ?? "",
        address: p.address ?? "",
        resumeUrl: p.resumeUrl ?? "",
        linkedin: p.social?.linkedin ?? "",
        facebook: p.social?.facebook ?? "",
        instagram: p.social?.instagram ?? "",
        whatsapp: p.social?.whatsapp ?? "",
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
    const r = await apiJson<{ profile: TeacherProfile }>("/teacher/profile", {
      method: "PUT",
      auth: true,
      body: JSON.stringify({
        name: f.name,
        bio: f.bio,
        timezone: f.timezone,
        country: f.country,
        photoUrl: f.photoUrl,
        phone: f.phone,
        address: f.address,
        resumeUrl: f.resumeUrl,
        social: {
          linkedin: f.linkedin,
          facebook: f.facebook,
          instagram: f.instagram,
          whatsapp: f.whatsapp,
        },
      }),
    });
    setSaving(false);
    if (!r.ok) {
      setError(r.error);
      return;
    }
    setProfile(r.data?.profile ?? null);
    router.push("/teacher/profile");
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50">
        <section className="max-w-5xl mx-auto px-4 py-8">
          <div className="text-gray-600 text-center">Loading...</div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-gray-900 text-2xl font-bold">Edit Profile</h1>
            <p className="mt-1 text-gray-600 text-sm">Update your professional information</p>
          </div>

          <div className="flex gap-3">
            <Link
              href="/teacher/profile"
              className="inline-flex items-center justify-center gap-2 px-5 py-2 rounded-lg bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-medium transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Cancel
            </Link>
            <button
              type="button"
              onClick={save}
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 px-5 py-2 rounded-lg bg-[#0058C9] hover:bg-[#0046A3] text-white text-sm font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 flex items-start gap-3 border border-red-300 bg-red-50 text-red-800 rounded-lg px-4 py-3 text-sm">
            <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Main Content */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          {/* Profile Photo Section */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-start gap-2 mb-4">
              <svg className="w-5 h-5 text-gray-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <div>
                <h2 className="text-gray-900 text-lg font-semibold">Profile Photo</h2>
                <p className="text-gray-500 text-sm">Upload a professional photo</p>
              </div>
            </div>
            <div className="ml-7">
              <CloudinaryImageUpload
                currentImageUrl={f.photoUrl}
                onImageUploaded={(url) => setF((s) => ({ ...s, photoUrl: url }))}
                buttonText="Upload Photo"
                showPreview={true}
              />
            </div>
          </div>

          {/* Basic Information */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-start gap-2 mb-4">
              <svg className="w-5 h-5 text-gray-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h2 className="text-gray-900 text-lg font-semibold">Basic Information</h2>
                <p className="text-gray-500 text-sm">Your name and professional details</p>
              </div>
            </div>
            <div className="ml-7 grid gap-4 md:grid-cols-2">
              <Field label="Full Name" icon="user">
                <Input value={f.name} onChange={(v) => setF((s) => ({ ...s, name: v }))} placeholder="Your full name" />
              </Field>

              <Field label="Country" icon="globe">
                <Select value={f.country} onChange={(v) => setF((s) => ({ ...s, country: v }))}>
                  <option value="">Select country...</option>
                  <option value="United States">United States</option>
                  <option value="Canada">Canada</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Australia">Australia</option>
                  <option value="Germany">Germany</option>
                  <option value="France">France</option>
                  <option value="Spain">Spain</option>
                  <option value="Italy">Italy</option>
                  <option value="Mexico">Mexico</option>
                  <option value="Brazil">Brazil</option>
                  <option value="Argentina">Argentina</option>
                  <option value="Colombia">Colombia</option>
                  <option value="Chile">Chile</option>
                  <option value="Ecuador">Ecuador</option>
                  <option value="Peru">Peru</option>
                  <option value="Japan">Japan</option>
                  <option value="China">China</option>
                  <option value="India">India</option>
                  <option value="South Korea">South Korea</option>
                  <option value="Philippines">Philippines</option>
                  <option value="Other">Other</option>
                </Select>
              </Field>

              <Field label="Timezone" icon="clock">
                <Select value={f.timezone} onChange={(v) => setF((s) => ({ ...s, timezone: v }))}>
                  <option value="">Select timezone...</option>
                  <optgroup label="US & Canada">
                    <option value="America/New_York">Eastern Time (ET)</option>
                    <option value="America/Chicago">Central Time (CT)</option>
                    <option value="America/Denver">Mountain Time (MT)</option>
                    <option value="America/Los_Angeles">Pacific Time (PT)</option>
                    <option value="America/Anchorage">Alaska Time (AKT)</option>
                    <option value="Pacific/Honolulu">Hawaii Time (HT)</option>
                  </optgroup>
                  <optgroup label="Europe">
                    <option value="Europe/London">London (GMT)</option>
                    <option value="Europe/Paris">Paris (CET)</option>
                    <option value="Europe/Berlin">Berlin (CET)</option>
                    <option value="Europe/Madrid">Madrid (CET)</option>
                    <option value="Europe/Rome">Rome (CET)</option>
                    <option value="Europe/Athens">Athens (EET)</option>
                  </optgroup>
                  <optgroup label="Asia">
                    <option value="Asia/Tokyo">Tokyo (JST)</option>
                    <option value="Asia/Shanghai">Shanghai (CST)</option>
                    <option value="Asia/Hong_Kong">Hong Kong (HKT)</option>
                    <option value="Asia/Singapore">Singapore (SGT)</option>
                    <option value="Asia/Dubai">Dubai (GST)</option>
                    <option value="Asia/Kolkata">India (IST)</option>
                  </optgroup>
                  <optgroup label="Australia">
                    <option value="Australia/Sydney">Sydney (AEDT)</option>
                    <option value="Australia/Melbourne">Melbourne (AEDT)</option>
                    <option value="Australia/Perth">Perth (AWST)</option>
                  </optgroup>
                  <optgroup label="Latin America">
                    <option value="America/Mexico_City">Mexico City (CST)</option>
                    <option value="America/Sao_Paulo">São Paulo (BRT)</option>
                    <option value="America/Buenos_Aires">Buenos Aires (ART)</option>
                    <option value="America/Santiago">Santiago (CLT)</option>
                    <option value="America/Lima">Lima (PET)</option>
                    <option value="America/Bogota">Bogotá (COT)</option>
                    <option value="America/Guayaquil">Guayaquil (ECT)</option>
                  </optgroup>
                </Select>
              </Field>

              <Field label="Phone" icon="phone">
                <Input value={f.phone} onChange={(v) => setF((s) => ({ ...s, phone: v }))} placeholder="+1 (555) 000-0000" />
              </Field>

              <div className="md:col-span-2">
                <Field label="City" icon="location">
                  <Input
                    value={f.address}
                    onChange={(v) => setF((s) => ({ ...s, address: v }))}
                    placeholder="e.g. New York, Los Angeles, London"
                  />
                </Field>
              </div>
            </div>
          </div>

          {/* About Section */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-start gap-2 mb-4">
              <svg className="w-5 h-5 text-gray-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <div>
                <h2 className="text-gray-900 text-lg font-semibold">About You</h2>
                <p className="text-gray-500 text-sm">Tell students about your teaching experience and style</p>
              </div>
            </div>
            <div className="ml-7">
              <Textarea
                value={f.bio}
                onChange={(v) => setF((s) => ({ ...s, bio: v }))}
                placeholder="Share your teaching philosophy, experience, qualifications, and what makes your classes unique..."
                rows={6}
              />
            </div>
          </div>

          {/* Professional Links */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-start gap-2 mb-4">
              <svg className="w-5 h-5 text-gray-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              <div>
                <h2 className="text-gray-900 text-lg font-semibold">Professional Links</h2>
                <p className="text-gray-500 text-sm">Add your resume and portfolio</p>
              </div>
            </div>
            <div className="ml-7">
              <Field label="Resume URL" icon="document">
                <Input
                  value={f.resumeUrl}
                  onChange={(v) => setF((s) => ({ ...s, resumeUrl: v }))}
                  placeholder="https://..."
                />
              </Field>
            </div>
          </div>

          {/* Social Media */}
          <div className="p-6">
            <div className="flex items-start gap-2 mb-4">
              <svg className="w-5 h-5 text-gray-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <div>
                <h2 className="text-gray-900 text-lg font-semibold">Social Media</h2>
                <p className="text-gray-500 text-sm">Connect your social profiles</p>
              </div>
            </div>
            <div className="ml-7 grid gap-4 md:grid-cols-2">
              <Field label="LinkedIn" icon="linkedin">
                <Input
                  value={f.linkedin}
                  onChange={(v) => setF((s) => ({ ...s, linkedin: v }))}
                  placeholder="https://linkedin.com/in/..."
                />
              </Field>

              <Field label="Facebook" icon="facebook">
                <Input
                  value={f.facebook}
                  onChange={(v) => setF((s) => ({ ...s, facebook: v }))}
                  placeholder="https://facebook.com/..."
                />
              </Field>

              <Field label="Instagram" icon="instagram">
                <Input
                  value={f.instagram}
                  onChange={(v) => setF((s) => ({ ...s, instagram: v }))}
                  placeholder="https://instagram.com/..."
                />
              </Field>

              <Field label="WhatsApp" icon="whatsapp">
                <Input
                  value={f.whatsapp}
                  onChange={(v) => setF((s) => ({ ...s, whatsapp: v }))}
                  placeholder="https://wa.me/..."
                />
              </Field>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function Field({ label, icon, children }: { label: string; icon?: string; children: React.ReactNode }) {
  const getIcon = () => {
    switch (icon) {
      case "user":
        return (
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        );
      case "globe":
        return (
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case "clock":
        return (
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case "phone":
        return (
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
        );
      case "location":
        return (
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        );
      case "document":
        return (
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      case "linkedin":
      case "facebook":
      case "instagram":
      case "whatsapp":
        return (
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <label className="block text-gray-700 text-sm font-medium mb-1.5">{label}</label>
      <div className="relative">
        {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">{getIcon()}</div>}
        <div className={icon ? "pl-10" : ""}>{children}</div>
      </div>
    </div>
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
      className={`w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 text-sm focus:outline-none focus:border-[#0058C9] focus:ring-2 focus:ring-[#0058C9]/20 transition-all ${className || ""}`}
    >
      {children}
    </select>
  );
}

function Input({
  value,
  onChange,
  placeholder,
  className,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
}) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 text-sm placeholder:text-gray-400 focus:outline-none focus:border-[#0058C9] focus:ring-2 focus:ring-[#0058C9]/20 transition-all ${className || ""}`}
    />
  );
}

function Textarea({
  value,
  onChange,
  placeholder,
  rows = 4,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 text-sm placeholder:text-gray-400 focus:outline-none focus:border-[#0058C9] focus:ring-2 focus:ring-[#0058C9]/20 transition-all resize-none"
    />
  );
}
