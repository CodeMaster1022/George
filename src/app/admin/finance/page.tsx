"use client";

import React from "react";
import AdminLayout from "@/components/admin/AdminLayout";

export default function AdminFinancePage() {
  return (
    <AdminLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-gray-900 text-3xl font-bold">Finance</h1>
          <p className="mt-2 text-gray-600">Revenue, payouts, and financial overview</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 text-center">
          <div className="inline-flex p-4 rounded-full bg-amber-100 text-amber-600 mb-4">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-gray-900 text-xl font-semibold mb-2">Finance module coming soon</h2>
          <p className="text-gray-600 text-sm max-w-md mx-auto">
            This page will show revenue summaries, teacher payouts, and transaction history once the backend finance APIs are available.
          </p>
          <p className="text-gray-500 text-xs mt-4">
            In the meantime, you can view bookings in the Bookings section for session-related data.
          </p>
        </div>
      </div>
    </AdminLayout>
  );
}
