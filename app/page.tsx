import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/navbar";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main id="home" className="flex-1">
        {/* Hero - full width background carousel with overlay and content */}
        <section className="relative w-full min-h-screen overflow-hidden">
          {/* Sliding images background */}
          <div className="absolute inset-0 flex w-[100%] cc-carousel-track">
            <div className="relative w-full shrink-0 grow-0">
              <Image src="/images/1.jpeg" alt="Telemedicine" fill className="object-cover" />
            </div>
            <div className="relative w-full shrink-0 grow-0">
              <Image src="/images/2.jpg" alt="Global access" fill className="object-cover" />
            </div>
            <div className="relative w-full shrink-0 grow-0">
              <Image src="/images/3.avif" alt="Records management" fill className="object-cover" />
            </div>
          </div>

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />

          {/* Content */}
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-4 text-center">
            <div className="max-w-4xl w-full text-white mx-auto">
              <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight">Your Health, Our Priority</h1>
              <p className="mt-6 text-lg sm:text-xl text-white/90 max-w-2xl mx-auto">Connect with certified doctors, book online consultations, and manage records securely in one place.</p>
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link id="get-started" href="#about" className="inline-flex items-center rounded-full bg-white text-black px-8 py-4 text-base font-bold hover:opacity-90 transition shadow-lg hover:shadow-xl hover:-translate-y-0.5">Get Started</Link>
                <Link href="#services" className="inline-flex items-center rounded-full border-2 border-white/30 text-white px-8 py-4 text-base font-bold hover:bg-white/10 transition backdrop-blur-sm">Explore Services</Link>
              </div>
            </div>
          </div>
        </section>

        {/* About */}
        <section id="about" className="min-h-screen flex items-center border-t border-black/10 dark:border-white/10 bg-black/[.02] dark:bg-white/[.03]">
          <div className="mx-auto max-w-screen-2xl w-full px-4 py-20 grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">About CityCare</h2>
              <p className="text-lg text-black/70 dark:text-white/70 leading-relaxed">
                CityCare is a modern health consultation platform offering virtual visits, prescription refills, and specialist referrals. Our mission is to make quality healthcare accessible and convenient.
              </p>
              <p className="text-lg text-black/70 dark:text-white/70 leading-relaxed">
                We are dedicated to revolutionizing the patient experience through technology and compassion. Whether you need a quick consultation or long-term care management, our team of certified professionals is here to support your journey to better health.
              </p>
            </div>
            <div className="relative w-full h-[400px] md:h-[600px] rounded-2xl overflow-hidden shadow-xl">
              <Image
                src="/images/4.jpg"
                alt="About CityCare Team"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </section>

        {/* Services */}
        <section id="services" className="min-h-screen flex flex-col justify-center py-20 bg-gray-50 dark:bg-zinc-900/50">
          <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">World-Class Services</h2>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
                Comprehensive care tailored to your needs. Connect with experienced professionals anytime, anywhere through our integrated platform.
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
                <div key={idx} className="group relative bg-white dark:bg-zinc-800 p-8 rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-300 border border-black/5 dark:border-white/5 hover:-translate-y-1">
                  <div className="flex flex-col h-full">
                    <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                      {card.icon}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{card.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{card.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-black/10 dark:border-white/10">
        <div className="mx-auto max-w-screen-2xl px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
          <p className="text-black/60 dark:text-white/60">© {new Date().getFullYear()} CityCare. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="#about" className="hover:underline underline-offset-4">About</Link>
            <Link href="#services" className="hover:underline underline-offset-4">Services</Link>
            <Link href="#home" className="hover:underline underline-offset-4">Home</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
