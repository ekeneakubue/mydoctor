import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/navbar";

export default function Home() {
  const heroSlides = [
    {
      src: "/images/black-doctor-consultation-1.svg",
      alt: "Black doctor consulting with a patient",
      tag: "Telehealth",
      title: "Care that meets you anywhere",
      description:
        "MyDoctor brings doctors, records, and appointments together in one secure place so your next consultation is always within reach.",
    },
    {
      src: "/images/black-doctor-consultation-2.svg",
      alt: "Black medical team collaborating in clinic",
      tag: "Connected Team",
      title: "One platform for patients and clinicians",
      description:
        "Patients, doctors, and admins stay aligned with real-time scheduling, streamlined communication, and consistent records.",
    },
    {
      src: "/images/black-doctor-consultation-3.svg",
      alt: "Black doctor reviewing patient data",
      tag: "Secure Records",
      title: "Health data that stays protected",
      description:
        "View histories, lab results, and treatment plans in a privacy-first dashboard built for modern healthcare operations.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Navbar />

      <main id="home" className="flex-1">
        <section className="relative min-h-screen overflow-hidden border-b border-slate-200 bg-gradient-to-b from-sky-50 via-white to-white">
          <div className="absolute -left-40 top-10 h-96 w-96 rounded-full bg-sky-200/40 blur-3xl" />
          <div className="absolute -right-40 top-10 h-96 w-96 rounded-full bg-indigo-200/40 blur-3xl" />
          <div className="mx-auto max-w-7xl py-14 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
            <div className="grid items-center gap-10 lg:grid-cols-2">
              <div className="space-y-7">
                <span className="inline-flex items-center rounded-full border border-sky-200 bg-sky-100 px-4 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">
                  Smart healthcare platform
                </span>
                <h1 className="font-black leading-tight tracking-tight text-slate-900 sm:text-5xl">
                  Redefined healthcare interfaces for every role
                </h1>
                <p className="max-w-2xl text-lg text-slate-600">
                  Explore a cleaner, more modern MyDoctor experience with role-specific flows, improved readability, and updated visuals.
                </p>
                <div className="flex flex-wrap items-center gap-4">
                  <Link
                    id="get-started"
                    href="/patient/login"
                    className="inline-flex items-center rounded-full bg-slate-900 px-7 py-3.5 text-sm font-bold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-slate-800"
                  >
                    Patient Portal
                  </Link>
                  <Link
                    href="#services"
                    className="inline-flex items-center rounded-full border border-slate-300 bg-white px-7 py-3.5 text-sm font-bold text-slate-800 transition hover:border-slate-400 hover:bg-slate-100"
                  >
                    Explore Services
                  </Link>
                </div>
              </div>
              <div className="relative rounded-3xl border border-slate-200 bg-white p-4 shadow-2xl">
                <div className="grid gap-4">
                  {heroSlides.map((slide) => (
                    <article
                      key={slide.src}
                      className="group grid gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:-translate-y-0.5 hover:border-sky-300 hover:bg-white sm:grid-cols-[180px_1fr]"
                    >
                      <div className="relative h-32 overflow-hidden rounded-xl border border-slate-200 bg-white">
                        <Image src={slide.src} alt={slide.alt} fill className="object-cover transition duration-500 group-hover:scale-105" />
                      </div>
                      <div className="space-y-2">
                        <p className="text-xs font-bold uppercase tracking-[0.14em] text-sky-700">{slide.tag}</p>
                        <h2 className="text-lg font-bold text-slate-900">{slide.title}</h2>
                        <p className="text-sm leading-relaxed text-slate-600">{slide.description}</p>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="border-b border-slate-200 bg-white">
          <div className="mx-auto grid max-w-screen-2xl items-center gap-12 px-5 py-14 sm:px-8 sm:py-20 lg:grid-cols-2 lg:px-12 lg:py-24">
            <div className="space-y-5">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-sky-700">About MyDoctor</p>
              <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-5xl">
                Meeat and book appointment with proffesional Doctors in your area
              </h2>
              <p className="text-lg leading-relaxed text-slate-600">
                MyDoctor supports video consultations, referrals, lab workflows, and long-term follow-up in one connected experience.
              </p>
              <p className="text-lg leading-relaxed text-slate-600">
                This redesign focuses on easier scanning, clearer hierarchy, and role-aware entry points so patients and healthcare teams reach the right tools faster.
              </p>
            </div>
            <div className="relative h-[360px] overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 shadow-xl sm:h-[480px]">
              <Image src="/images/about-clinic.svg" alt="MyDoctor clinic environment" fill className="object-cover" />
            </div>
          </div>
        </section>

        <section id="services" className="bg-slate-50 py-16 sm:py-24">
          <div className="mx-auto max-w-screen-2xl px-5 sm:px-8 lg:px-12">
            <div className="mx-auto mb-14 max-w-3xl text-center">
              <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">World-class services with a modern visual system</h2>
              <p className="mt-4 text-lg text-slate-600">
                Every block is redesigned for clarity with compact descriptions, stronger contrast, and cleaner action flow.
              </p>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  title: "Online Consultations",
                  desc: "Connect with doctors via high-quality video calls for immediate advice and primary care.",
                  icon: (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                  )
                },
                {
                  title: "Specialist Referrals",
                  desc: "Get referred to top-tier specialists seamlessly within our extensive network.",
                  icon: (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                  )
                },
                {
                  title: "Instant Prescriptions",
                  desc: "Receive digital prescriptions instantly sent to your preferred pharmacy.",
                  icon: (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                  )
                },
                {
                  title: "Lab Integration",
                  desc: "Book lab tests easily and view your results directly in your secure dashboard.",
                  icon: (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                  )
                },
                {
                  title: "Mental Health",
                  desc: "Confidential therapy sessions with licensed counselors and psychiatrists.",
                  icon: (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                  )
                },
                {
                  title: "Secure Records",
                  desc: "Your medical history is encrypted and stored securely, accessible only by you.",
                  icon: (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                  )
                },
              ].map((card, idx) => (
                <div key={idx} className="group relative rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-sky-300 hover:shadow-2xl">
                  <div className="flex flex-col h-full">
                    <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-100 text-sky-700 transition-colors duration-300 group-hover:bg-sky-600 group-hover:text-white">
                      {card.icon}
                    </div>
                    <h3 className="mb-3 text-xl font-bold text-slate-900">{card.title}</h3>
                    <p className="leading-relaxed text-slate-600">{card.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="mt-auto border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-screen-2xl flex-col items-center justify-between gap-4 px-5 py-7 text-sm sm:flex-row sm:px-8 lg:px-12">
          <p className="text-slate-500">© {new Date().getFullYear()} MyDoctor. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="#about" className="text-slate-600 transition hover:text-slate-900 hover:underline underline-offset-4">About</Link>
            <Link href="#services" className="text-slate-600 transition hover:text-slate-900 hover:underline underline-offset-4">Services</Link>
            <Link href="#home" className="text-slate-600 transition hover:text-slate-900 hover:underline underline-offset-4">Home</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
