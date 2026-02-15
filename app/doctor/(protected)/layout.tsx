import { DoctorSidebar } from "@/components/doctor/sidebar";
import { ReactNode } from "react";

export default function DoctorProtectedLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen bg-gray-50">
            <DoctorSidebar />
            <main className="lg:ml-64 min-h-screen bg-gray-50">
                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
