import { LucideIcon } from "lucide-react";

interface StatCardProps {
    label: string;
    value: string;
    icon: LucideIcon;
    trend?: string;
    trendUp?: boolean;
}

export function StatCard({ label, value, icon: Icon, trend, trendUp }: StatCardProps) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-violet-300 hover:shadow-lg">
            <div className="flex items-center justify-between mb-4">
                <div className="rounded-xl bg-violet-100 p-2.5">
                    <Icon className="h-6 w-6 text-violet-700" />
                </div>
                {trend && (
                    <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${trendUp
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-red-100 text-red-700"
                            }`}
                    >
                        {trend}
                    </span>
                )}
            </div>
            <h3 className="mb-1 text-sm font-semibold text-slate-500">{label}</h3>
            <p className="text-3xl font-black tracking-tight text-slate-900">{value}</p>
        </div>
    );
}
