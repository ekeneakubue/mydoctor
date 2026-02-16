import { DoctorSidebar } from "@/components/doctor/sidebar";
import { ReactNode } from "react";

export default function DoctorProtectedLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen bg-slate-50">
            <DoctorSidebar />
            <main className="min-h-screen lg:ml-72">
                <div className="mx-auto w-full max-w-[1600px] p-4 sm:p-6 lg:p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
