import { DoctorSidebar } from "@/components/doctor/sidebar";
import { ReactNode } from "react";

export default function DoctorDashboardLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen bg-gray-50">
            <DoctorSidebar />
            {/* Main content with left padding to account for fixed sidebar */}
            <main className="lg:pl-64 min-h-screen bg-gray-50">
                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
