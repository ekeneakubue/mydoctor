"use client"

import Image from "next/image";
import Link from "next/link";
import { Loader2, Stethoscope, ArrowLeft } from "lucide-react";
import { login } from "@/app/actions/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DoctorLoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await login(formData);

    if (result.success) {
      const userRole = "role" in result ? result.role : undefined;
      const userType = "userType" in result ? result.userType : undefined;
      
      if (userRole === 'ADMIN' || userRole === 'STAFF') {
        router.push("/admin");
      } else if (userType === 'doctor') {
        router.push("/doctor/dashboard");
      } else {
        router.push("/");
      }
      router.refresh();
    } else {
      setError(result.error || "An error occurred");
      setLoading(false);
    }
  }

  return (
    <main className="relative h-screen overflow-hidden bg-gradient-to-b from-blue-50 via-white to-white p-3 sm:p-4">
      <div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-blue-200/50 blur-3xl" />
      <div className="absolute -right-20 bottom-10 h-72 w-72 rounded-full bg-cyan-200/50 blur-3xl" />

      <div className="relative z-10 mx-auto grid h-full w-full max-w-6xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl lg:grid-cols-2">
        <section className="relative hidden bg-blue-900 p-8 text-white lg:flex lg:h-full lg:flex-col">
          <Link href="/" className="inline-flex items-center gap-2 text-blue-100 transition hover:text-white">
            <ArrowLeft size={18} />
            <span className="text-sm font-semibold">Back to Home</span>
          </Link>
          <div className="mt-8 space-y-3">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-200">Doctor portal</p>
            <h1 className="text-3xl font-black leading-tight">A focused workspace for every consultation</h1>
            <p className="max-w-md text-blue-100">
              Access schedules, patient history, and record tools from a cleaner doctor interface designed for fast clinical workflows.
            </p>
          </div>
          <div className="relative mt-auto h-64 overflow-hidden rounded-2xl border border-white/20 bg-white/10">
            <Image src="/images/login-doctor.svg" alt="Doctor portal illustration" fill className="object-cover" />
          </div>
        </section>

        <section className="flex h-full items-center p-4 sm:p-6 lg:p-8">
          <div className="mx-auto w-full max-w-md">
            <div className="mb-4 flex items-center justify-between lg:hidden">
              <Link href="/" className="inline-flex items-center gap-2 text-slate-600 transition hover:text-slate-900">
                <ArrowLeft size={18} />
                <span className="text-sm font-semibold">Back</span>
              </Link>
              <span className="text-xs font-bold uppercase tracking-[0.14em] text-blue-700">Doctor portal</span>
            </div>

            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
              <Stethoscope className="text-white" size={24} />
            </div>

            <div className="mb-4">
              <h2 className="text-2xl font-black tracking-tight text-slate-900">Doctor Login</h2>
              <p className="mt-1.5 text-sm text-slate-600">Manage patient care, schedules, and records in one dashboard.</p>
            </div>

            {error && (
              <div className="mb-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="grid gap-3">
              <div className="grid gap-1.5">
                <label htmlFor="email" className="text-sm font-semibold text-slate-700">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="doctor@mydoctor.com"
                  className="h-10 rounded-xl border border-slate-300 bg-white px-3 text-slate-800 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  disabled={loading}
                />
              </div>
              <div className="grid gap-1.5">
                <label htmlFor="password" className="text-sm font-semibold text-slate-700">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  className="h-10 rounded-xl border border-slate-300 bg-white px-3 text-slate-800 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  disabled={loading}
                />
              </div>
              <button
                type="submit"
                className="mt-1 inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 font-semibold text-white shadow-md transition-all hover:from-blue-700 hover:to-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={loading}
              >
                {loading && <Loader2 className="animate-spin" size={16} />}
                {loading ? "Signing in..." : "Sign in as Doctor"}
              </button>
            </form>

            <div className="mt-4 space-y-2 text-center">
              <div className="flex items-center justify-center gap-2 border-t border-slate-200 pt-2 text-xs text-slate-500">
                <span>Login as:</span>
                <Link href="/patient/login" className="font-semibold text-green-600 hover:underline">
                  Patient
                </Link>
                <span>•</span>
                <Link href="/admin-login" className="font-semibold text-purple-600 hover:underline">
                  Admin
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
