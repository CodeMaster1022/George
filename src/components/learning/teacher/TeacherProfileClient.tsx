"use client";

import React from "react";
import { useRouter } from "next/navigation";
import TeacherShell from "./TeacherShell";
import { apiJson, getAuthUser } from "@/utils/backend";
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
  social?: { linkedin?: string; facebook?: string; instagram?: string; whatsapp?: string };
};

export default function TeacherProfileClient() {
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

  React.useEffect(() => {
    const u: any = getAuthUser();
    const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : "";
    if (!token) {
      router.replace("/teacher/login");
      return;
    }
    if (u?.role && u.role !== "teacher") {
      router.replace("/ebluelearning");
      return;
    }
  }, [router]);

  async function load() {
    setError(null);
    setLoading(true);
    const r = await apiJson<{ profile: TeacherProfile }>("/teacher/profile", { auth: true });
    setLoading(false);
    if (!r.ok) {
      setError(r.error);
      return;
    }
    const p = (r.data as any)?.profile as TeacherProfile;
    setProfile(p);
    setF({
      name: p?.name ?? "",
      bio: p?.bio ?? "",
      timezone: p?.timezone ?? "",
      country: p?.country ?? "",
      photoUrl: p?.photoUrl ?? "",
      phone: p?.phone ?? "",
      address: p?.address ?? "",
      resumeUrl: p?.resumeUrl ?? "",
      linkedin: p?.social?.linkedin ?? "",
      facebook: p?.social?.facebook ?? "",
      instagram: p?.social?.instagram ?? "",
      whatsapp: p?.social?.whatsapp ?? "",
    });
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
    setProfile((r.data as any)?.profile ?? null);
  }

  return (
    <TeacherShell
      title="Teacher profile"
      subtitle="Update your public information. Students will see this when booking."
      right={
        <button
          type="button"
          onClick={save}
          disabled={saving || loading}
          className="px-5 py-2.5 rounded-full border-2 border-[#2D2D2D] bg-[#CB4913] hover:bg-[#cb6c13f1] text-white text-xs font-extrabold uppercase disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save"}
        </button>
      }
    >
      {error ? (
        <div className="border-2 border-[#2D2D2D] bg-[#B4005A]/40 text-white rounded-xl px-4 py-3 text-sm">
          {error}
        </div>
      ) : null}

      <div className="mt-4 grid gap-6 md:grid-cols-2">
        <div className="rounded-[18px] border-[5px] border-[#2D2D2D] bg-white/10 overflow-hidden">
          <div className="p-5 md:p-6 grid gap-4">
            <Field label="Name">
              <Input value={f.name} onChange={(v) => setF((s) => ({ ...s, name: v }))} placeholder="Your name" />
            </Field>
            <Field label="Bio">
              <Textarea
                value={f.bio}
                onChange={(v) => setF((s) => ({ ...s, bio: v }))}
                placeholder="A short bio about you and your teaching style."
              />
            </Field>
            <Field label="Timezone">
              <Input
                value={f.timezone}
                onChange={(v) => setF((s) => ({ ...s, timezone: v }))}
                placeholder="e.g. America/New_York"
              />
            </Field>
            <Field label="Country">
              <Input value={f.country} onChange={(v) => setF((s) => ({ ...s, country: v }))} placeholder="e.g. USA" />
            </Field>
          </div>
        </div>

        <div className="rounded-[18px] border-[5px] border-[#2D2D2D] bg-white/10 overflow-hidden">
          <div className="p-5 md:p-6 grid gap-4">
            <Field label="Photo">
              <CloudinaryImageUpload
                currentImageUrl={f.photoUrl}
                onImageUploaded={(url) => setF((s) => ({ ...s, photoUrl: url }))}
                buttonText="Upload Photo"
                showPreview={true}
              />
            </Field>
            <Field label="Phone">
              <Input value={f.phone} onChange={(v) => setF((s) => ({ ...s, phone: v }))} placeholder="+1..." />
            </Field>
            <Field label="Address">
              <Input value={f.address} onChange={(v) => setF((s) => ({ ...s, address: v }))} placeholder="City, State" />
            </Field>
            <Field label="Resume URL">
              <Input
                value={f.resumeUrl}
                onChange={(v) => setF((s) => ({ ...s, resumeUrl: v }))}
                placeholder="https://..."
              />
            </Field>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-[18px] border-[5px] border-[#2D2D2D] bg-white/10 overflow-hidden">
        <div className="p-5 md:p-6">
          <div className="text-white font-extrabold text-lg">Social</div>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <Field label="LinkedIn">
              <Input value={f.linkedin} onChange={(v) => setF((s) => ({ ...s, linkedin: v }))} placeholder="https://..." />
            </Field>
            <Field label="Facebook">
              <Input value={f.facebook} onChange={(v) => setF((s) => ({ ...s, facebook: v }))} placeholder="https://..." />
            </Field>
            <Field label="Instagram">
              <Input value={f.instagram} onChange={(v) => setF((s) => ({ ...s, instagram: v }))} placeholder="https://..." />
            </Field>
            <Field label="WhatsApp">
              <Input value={f.whatsapp} onChange={(v) => setF((s) => ({ ...s, whatsapp: v }))} placeholder="https://..." />
            </Field>
          </div>
          <div className="mt-4 text-white/60 text-xs">
            Teacher id: <span className="text-white/80">{profile?._id ?? (loading ? "Loading..." : "N/A")}</span>
          </div>
        </div>
      </div>
    </TeacherShell>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="block text-white/90 text-sm mb-1">{label}</div>
      {children}
    </div>
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
      className={`w-full px-4 py-3 rounded-xl border-2 border-[#2D2D2D] bg-white/90 text-[#212429] placeholder:text-[#212429]/50 focus:outline-none focus:ring-2 focus:ring-[#0058C9] ${className || ""}`}
    />
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
      rows={6}
      className="w-full px-4 py-3 rounded-xl border-2 border-[#2D2D2D] bg-white/90 text-[#212429] placeholder:text-[#212429]/50 focus:outline-none focus:ring-2 focus:ring-[#0058C9]"
    />
  );
}

