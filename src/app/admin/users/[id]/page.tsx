"use client";

import React from "react";
import { useRouter, useParams } from "next/navigation";
import AdminLayout from "@/components/admin/AdminLayout";
import { apiJson } from "@/utils/backend";
import { useLanguage } from "@/contexts/LanguageContext";
import { translate } from "../../translate";

type User = {
  _id: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
  verifiedEmail: boolean;
  lastLoginAt?: string;
};

type Profile = {
  name?: string;
  bio?: string;
  country?: string;
  timezone?: string;
  photoUrl?: string;
  credits?: number;
};

export default function EditUserPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params?.id as string;
  const { language } = useLanguage();
  const t = (key: string) => translate(key, language);

  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [actionLoading, setActionLoading] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);
  const [user, setUser] = React.useState<User | null>(null);
  const [profile, setProfile] = React.useState<Profile | null>(null);
  const [showCreditsModal, setShowCreditsModal] = React.useState(false);
  const [creditsAmount, setCreditsAmount] = React.useState(10);
  const [creditsReason, setCreditsReason] = React.useState("");

  const [formData, setFormData] = React.useState({
    email: "",
    role: "",
    status: "",
  });

  async function loadUser() {
    setLoading(true);
    setError(null);
    const r = await apiJson<{ user: User; profile: Profile | null }>(`/admin/users/${userId}`);
    setLoading(false);
    if (!r.ok) {
      setError(r.error);
      return;
    }
    setUser(r.data.user);
    setProfile(r.data.profile);
    setFormData({
      email: r.data.user.email,
      role: r.data.user.role,
      status: r.data.user.status,
    });
  }

  React.useEffect(() => {
    if (userId) {
      loadUser();
    }
  }, [userId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    const r = await apiJson(`/admin/users/${userId}`, {
      method: "PATCH",
      body: JSON.stringify(formData),
    });

    setSaving(false);

    if (!r.ok) {
      setError(r.error);
      return;
    }

    setSuccess(t("userUpdatedSuccess"));
    setTimeout(() => {
      router.push("/admin/users");
    }, 1500);
  }

  async function handleBan() {
    setActionLoading("ban");
    setError(null);
    setSuccess(null);
    const r = await apiJson<{ ok: boolean; user: { status: string } }>(`/admin/users/${userId}/ban`, { method: "POST" });
    setActionLoading(null);
    if (!r.ok) {
      setError(r.error ?? t("failedToBan"));
      return;
    }
    setFormData((prev) => ({ ...prev, status: "banned" }));
    if (user) setUser({ ...user, status: "banned" });
    setSuccess(t("userBannedSuccess"));
  }

  async function handleUnban() {
    setActionLoading("unban");
    setError(null);
    setSuccess(null);
    const r = await apiJson<{ ok: boolean; user: { status: string } }>(`/admin/users/${userId}/unban`, { method: "POST" });
    setActionLoading(null);
    if (!r.ok) {
      setError(r.error ?? t("failedToUnban"));
      return;
    }
    setFormData((prev) => ({ ...prev, status: "active" }));
    if (user) setUser({ ...user, status: "active" });
    setSuccess(t("userUnbannedSuccess"));
  }

  async function handleAwardCredits(e: React.FormEvent) {
    e.preventDefault();
    setActionLoading("credits");
    setError(null);
    setSuccess(null);
    const r = await apiJson<{ ok: boolean; credits: number }>(`/admin/users/${userId}/credits`, {
      method: "POST",
      body: JSON.stringify({ amount: creditsAmount, reason: creditsReason || undefined }),
    });
    setActionLoading(null);
    if (!r.ok) {
      setError(r.error ?? t("failedToAwardCredits"));
      return;
    }
    setShowCreditsModal(false);
    setCreditsAmount(10);
    setCreditsReason("");
    if (profile) setProfile({ ...profile, credits: r.data.credits });
    setSuccess(`${t("creditsAwardedSuccess")} ${r.data.credits}`);
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-8">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
            <div className="text-gray-500">{t("loadingUser")}</div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!user) {
    return (
      <AdminLayout>
        <div className="p-8">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
            <div className="text-red-600">{t("userNotFound")}</div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            type="button"
            onClick={() => router.back()}
            className="p-2 rounded-lg bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <div>
            <h1 className="text-gray-900 text-3xl font-bold">{t("editUser")}</h1>
            <p className="mt-2 text-gray-600">{t("updateUserDesc")}</p>
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

        {success && (
          <div className="mb-6 flex items-start gap-3 border border-green-300 bg-green-50 text-green-800 rounded-lg px-4 py-3 text-sm">
            <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{success}</span>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-3">
          {/* User Info Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <h2 className="text-gray-900 text-lg font-semibold mb-4">{t("userInformation")}</h2>
              
              <div className="space-y-4">
                <div>
                  <div className="text-gray-600 text-sm">{t("userId")}</div>
                  <div className="text-gray-900 text-sm font-mono mt-1">{user._id}</div>
                </div>
                
                <div>
                  <div className="text-gray-600 text-sm">{t("created")}</div>
                  <div className="text-gray-900 text-sm mt-1">
                    {new Date(user.createdAt).toLocaleString()}
                  </div>
                </div>

                {user.lastLoginAt && (
                  <div>
                    <div className="text-gray-600 text-sm">{t("lastLogin")}</div>
                    <div className="text-gray-900 text-sm mt-1">
                      {new Date(user.lastLoginAt).toLocaleString()}
                    </div>
                  </div>
                )}

                <div>
                  <div className="text-gray-600 text-sm">{t("emailVerified")}</div>
                  <div className="mt-1">
                    {user.verifiedEmail ? (
                      <span className="inline-flex items-center gap-1 text-green-600 text-sm">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {t("verified")}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-orange-600 text-sm">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {t("notVerified")}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Quick actions: Ban / Unban / Award credits */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <h3 className="text-gray-700 text-sm font-medium mb-3">{t("actionsLabel")}</h3>
                <div className="space-y-2">
                  {user.status === "banned" ? (
                    <button
                      type="button"
                      onClick={handleUnban}
                      disabled={!!actionLoading}
                      className="w-full px-3 py-2 rounded-lg border border-green-300 bg-green-50 text-green-700 text-sm font-medium hover:bg-green-100 disabled:opacity-60 transition-colors"
                    >
                      {actionLoading === "unban" ? "..." : t("unbanUser")}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleBan}
                      disabled={!!actionLoading}
                      className="w-full px-3 py-2 rounded-lg border border-red-300 bg-red-50 text-red-700 text-sm font-medium hover:bg-red-100 disabled:opacity-60 transition-colors"
                    >
                      {actionLoading === "ban" ? "..." : t("banUser")}
                    </button>
                  )}
                  {user.role === "student" && (
                    <button
                      type="button"
                      onClick={() => setShowCreditsModal(true)}
                      disabled={!!actionLoading}
                      className="w-full px-3 py-2 rounded-lg border border-blue-300 bg-blue-50 text-blue-700 text-sm font-medium hover:bg-blue-100 disabled:opacity-60 transition-colors"
                    >
                      {t("awardCredits")}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Profile Info */}
            {profile && (
              <div className="mt-6 bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <h2 className="text-gray-900 text-lg font-semibold mb-4">{t("profile")}</h2>
                
                {profile.photoUrl && (
                  <div className="mb-4">
                    <img
                      src={profile.photoUrl}
                      alt="Profile"
                      className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
                    />
                  </div>
                )}

                <div className="space-y-3 text-sm">
                  {profile.name && (
                    <div>
                      <span className="text-gray-600">{t("name")}:</span>{" "}
                      <span className="text-gray-900">{profile.name}</span>
                    </div>
                  )}
                  {profile.country && (
                    <div>
                      <span className="text-gray-600">{t("country")}:</span>{" "}
                      <span className="text-gray-900">{profile.country}</span>
                    </div>
                  )}
                  {profile.timezone && (
                    <div>
                      <span className="text-gray-600">{t("timezone")}:</span>{" "}
                      <span className="text-gray-900">{profile.timezone}</span>
                    </div>
                  )}
                  {profile.credits !== undefined && (
                    <div>
                      <span className="text-gray-600">{t("credits")}:</span>{" "}
                      <span className="text-gray-900 font-semibold">{profile.credits}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Edit Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <h2 className="text-gray-900 text-lg font-semibold mb-6">{t("editUserDetails")}</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    {t("emailAddress")}
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    {t("role")}
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    required
                  >
                    <option value="student">{t("student")}</option>
                    <option value="teacher">{t("teacher")}</option>
                    <option value="admin">{t("admin")}</option>
                  </select>
                  <p className="mt-2 text-gray-500 text-xs">
                    {t("changingRoleHint")}
                  </p>
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    {t("status")}
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    required
                  >
                    <option value="active">{t("active")}</option>
                    <option value="inactive">{t("inactive")}</option>
                    <option value="banned">{t("banned")}</option>
                  </select>
                  <p className="mt-2 text-gray-500 text-xs">
                    {t("bannedUsersHint")}
                  </p>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors disabled:opacity-60"
                  >
                    {saving ? (
                      <>
                        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        {t("saving")}
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {t("saveChanges")}
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => router.back()}
                    className="px-6 py-3 rounded-lg bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-medium transition-colors"
                  >
                    {t("cancel")}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Award credits modal */}
        {showCreditsModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
              <h3 className="text-gray-900 text-lg font-semibold mb-4">{t("awardCreditsTitle")}</h3>
              <form onSubmit={handleAwardCredits} className="space-y-4">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">{t("amountLabel")}</label>
                  <input
                    type="number"
                    min={1}
                    max={1000}
                    value={creditsAmount}
                    onChange={(e) => setCreditsAmount(Number(e.target.value) || 0)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 text-gray-900 text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">{t("reasonOptional")}</label>
                  <input
                    type="text"
                    value={creditsReason}
                    onChange={(e) => setCreditsReason(e.target.value)}
                    placeholder={t("reasonPlaceholder")}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 text-gray-900 text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={actionLoading === "credits"}
                    className="flex-1 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium disabled:opacity-60"
                  >
                    {actionLoading === "credits" ? t("sending") : t("award")}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setShowCreditsModal(false); setCreditsReason(""); }}
                    className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-medium"
                  >
                    {t("cancel")}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
