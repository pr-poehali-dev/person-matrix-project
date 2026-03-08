import Icon from "@/components/ui/icon";
import type { PersonDescription } from "@/lib/matrix";

export function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`bg-white rounded-2xl border border-gray-100 shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}

export function SectionHeading({
  icon,
  title,
  subtitle,
  iconBg = "bg-purple-100",
  iconColor = "text-purple-600",
}: {
  icon: string;
  title: string;
  subtitle?: string;
  iconBg?: string;
  iconColor?: string;
}) {
  return (
    <div className="flex items-start gap-3 mb-5">
      <div
        className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center shrink-0 mt-0.5`}
      >
        <Icon name={icon} size={20} className={iconColor} />
      </div>
      <div>
        <h2 className="font-golos font-semibold text-xl sm:text-2xl text-gray-900 leading-tight">
          {title}
        </h2>
        {subtitle && (
          <p className="text-sm text-gray-400 mt-0.5">{subtitle}</p>
        )}
      </div>
    </div>
  );
}

export function NumberCard({
  num,
  label,
  desc,
}: {
  num: number;
  label: string;
  desc?: PersonDescription | undefined;
}) {
  return (
    <div className="bg-[#F4F2FA]/60 border border-[#E8E4F5] rounded-xl p-4 flex flex-col gap-1 text-center">
      <div className="text-3xl font-golos font-bold text-[#6C5BA7]">{num}</div>
      <div className="text-[11px] font-semibold text-[#6C5BA7]/70 uppercase tracking-widest">
        {label}
      </div>
      {desc && (
        <div className="text-xs text-gray-500 mt-1 leading-snug">
          {desc.title}
        </div>
      )}
    </div>
  );
}

export function ProgressBar({
  value,
  color = "purple",
}: {
  value: number;
  color?: string;
}) {
  const colorMap: Record<string, string> = {
    purple: "bg-purple-500",
    violet: "bg-[#6C5BA7]",
    emerald: "bg-emerald-500",
    sky: "bg-sky-500",
    rose: "bg-rose-500",
    indigo: "bg-indigo-500",
  };
  return (
    <div className="w-full bg-gray-100 rounded-full h-2.5">
      <div
        className={`h-2.5 rounded-full transition-all ${colorMap[color] || colorMap.purple}`}
        style={{ width: `${Math.max(4, value)}%` }}
      />
    </div>
  );
}

export const TALENT_STYLES = [
  { bg: "bg-purple-50", border: "border-purple-100", text: "text-purple-700", icon: "text-purple-500" },
  { bg: "bg-[#F4F2FA]", border: "border-[#E8E4F5]", text: "text-[#4A3D7A]", icon: "text-[#6C5BA7]" },
  { bg: "bg-emerald-50", border: "border-emerald-100", text: "text-emerald-700", icon: "text-emerald-500" },
  { bg: "bg-sky-50", border: "border-sky-100", text: "text-sky-700", icon: "text-sky-500" },
  { bg: "bg-rose-50", border: "border-rose-100", text: "text-rose-700", icon: "text-rose-500" },
  { bg: "bg-indigo-50", border: "border-indigo-100", text: "text-indigo-700", icon: "text-indigo-500" },
];