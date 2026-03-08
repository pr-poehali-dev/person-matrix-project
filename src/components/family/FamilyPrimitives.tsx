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
  iconBg = "bg-emerald-100",
  iconColor = "text-emerald-600",
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
  color = "emerald",
}: {
  value: number;
  color?: string;
}) {
  const colorMap: Record<string, string> = {
    emerald: "bg-emerald-500",
    violet: "bg-[#6C5BA7]",
    purple: "bg-purple-500",
    sky: "bg-sky-500",
    rose: "bg-rose-500",
    indigo: "bg-indigo-500",
  };
  return (
    <div className="w-full bg-gray-100 rounded-full h-2.5">
      <div
        className={`h-2.5 rounded-full transition-all ${colorMap[color] || colorMap.emerald}`}
        style={{ width: `${Math.max(4, value)}%` }}
      />
    </div>
  );
}

function scoreColor(score: number): string {
  if (score >= 70) return "#22c55e";
  if (score >= 40) return "#f59e0b";
  return "#ef4444";
}

export function ScoreCircle({
  score,
  size = 80,
}: {
  score: number;
  size?: number;
}) {
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = scoreColor(score);
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#f3f4f6"
          strokeWidth={4}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={4}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span
          className="font-golos font-bold text-gray-900"
          style={{ fontSize: size * 0.28 }}
        >
          {score}%
        </span>
      </div>
    </div>
  );
}

export function ScoreBar({
  label,
  score,
}: {
  label: string;
  score: number;
}) {
  const color = scoreColor(score);
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span
          className="text-xs font-semibold px-2 py-0.5 rounded-full"
          style={{ backgroundColor: color + "18", color }}
        >
          {score}%
        </span>
      </div>
      <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{ width: `${score}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

export function StatCard({
  icon,
  label,
  value,
  suffix = "",
}: {
  icon: string;
  label: string;
  value: number;
  suffix?: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center">
          <Icon name={icon} size={18} className="text-emerald-700" />
        </div>
        <span className="text-sm text-gray-500">{label}</span>
      </div>
      <div className="font-golos text-3xl text-gray-900 font-bold">
        {value}
        {suffix && (
          <span className="text-lg font-normal text-gray-400 ml-0.5">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}

export default Card;