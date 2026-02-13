"use client";

import React from "react";
import { useRouter, useParams } from "next/navigation";
import AdminLayout from "@/components/admin/AdminLayout";
import { apiJson } from "@/utils/backend";

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

  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);
  const [user, setUser] = React.useState<User | null>(null);
  const [profile, setProfile] = React.useState<Profile | null>(null);

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

    setSuccess("User updated successfully!");
    setTimeout(() => {
      router.push("/admin/users");
    }, 1500);
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-8">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
            <div className="text-gray-500">Loading user...</div>
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
            <div className="text-red-600">User not found</div>
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
            <h1 className="text-gray-900 text-3xl font-bold">Edit User</h1>
            <p className="mt-2 text-gray-600">Update user information and permissions</p>
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
              <h2 className="text-gray-900 text-lg font-semibold mb-4">User Information</h2>
              
              <div className="space-y-4">
                <div>
                  <div className="text-gray-600 text-sm">User ID</div>
                  <div className="text-gray-900 text-sm font-mono mt-1">{user._id}</div>
                </div>
                
                <div>
                  <div className="text-gray-600 text-sm">Created</div>
                  <div className="text-gray-900 text-sm mt-1">
                    {new Date(user.createdAt).toLocaleString()}
                  </div>
                </div>

                {user.lastLoginAt && (
                  <div>
                    <div className="text-gray-600 text-sm">Last Login</div>
                    <div className="text-gray-900 text-sm mt-1">
                      {new Date(user.lastLoginAt).toLocaleString()}
                    </div>
                  </div>
                )}

                <div>
                  <div className="text-gray-600 text-sm">Email Verified</div>
                  <div className="mt-1">
                    {user.verifiedEmail ? (
                      <span className="inline-flex items-center gap-1 text-green-600 text-sm">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-orange-600 text-sm">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Not Verified
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Info */}
            {profile && (
              <div className="mt-6 bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <h2 className="text-gray-900 text-lg font-semibold mb-4">Profile</h2>
                
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
                      <span className="text-gray-600">Name:</span>{" "}
                      <span className="text-gray-900">{profile.name}</span>
                    </div>
                  )}
                  {profile.country && (
                    <div>
                      <span className="text-gray-600">Country:</span>{" "}
                      <span className="text-gray-900">{profile.country}</span>
                    </div>
                  )}
                  {profile.timezone && (
                    <div>
                      <span className="text-gray-600">Timezone:</span>{" "}
                      <span className="text-gray-900">{profile.timezone}</span>
                    </div>
                  )}
                  {profile.credits !== undefined && (
                    <div>
                      <span className="text-gray-600">Credits:</span>{" "}
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
              <h2 className="text-gray-900 text-lg font-semibold mb-6">Edit User Details</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Email Address
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
                    Role
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    required
                  >
                    <option value="student">Student</option>
                    <option value="teacher">Teacher</option>
                    <option value="admin">Admin</option>
                  </select>
                  <p className="mt-2 text-gray-500 text-xs">
                    Changing role will affect user permissions and access
                  </p>
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    required
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="banned">Banned</option>
                  </select>
                  <p className="mt-2 text-gray-500 text-xs">
                    Banned users cannot log in to the platform
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
                        Saving...
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Save Changes
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => router.back()}
                    className="px-6 py-3 rounded-lg bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-medium transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
