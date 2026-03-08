import Icon from "@/components/ui/icon";
import type { PersonDescription } from "@/lib/matrix";

export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
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
}: {
  icon: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="flex items-start gap-3 mb-5">
      <div className="w-10 h-10 rounded-xl bg-[#F4F2FA] flex items-center justify-center shrink-0 mt-0.5">
        <Icon name={icon} size={20} className="text-[#6C5BA7]" />
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

export function NumberBadge({
  num,
  label,
  desc,
}: {
  num: number;
  label: string;
  desc: PersonDescription | undefined;
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

export function formatDate(iso: string) {
  const [y, m, d] = iso.split("-");
  return `${d}.${m}.${y}`;
}

export const CYCLE_ICONS: Record<string, string> = {
  "Формирование": "Sprout",
  "Продуктивность": "Flame",
  "Урожай": "Crown",
};