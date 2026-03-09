import { ReactNode } from "react";
import Icon from "@/components/ui/icon";
import { DESCRIPTIONS } from "@/lib/matrix";
import type { PythagorasMatrix } from "@/lib/matrix";

// ── ScoreCircle ───────────────────────────────────────────────────────────────
export function ScoreCircle({ score, size = 80 }: { score: number; size?: number }) {
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 70 ? "#22c55e" : score >= 40 ? "#f59e0b" : "#ef4444";
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#f3f4f6" strokeWidth={4} />
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
        <span className="font-golos font-bold text-gray-900" style={{ fontSize: size * 0.28 }}>
          {score}%
        </span>
      </div>
    </div>
  );
}

// ── Card ──────────────────────────────────────────────────────────────────────
export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm ${className}`}>
      {children}
    </div>
  );
}

// ── SectionHeading ────────────────────────────────────────────────────────────
export function SectionHeading({ icon, title, subtitle }: { icon: string; title: string; subtitle?: string }) {
  return (
    <div className="flex items-start gap-3 mb-5">
      <div className="w-10 h-10 rounded-xl bg-[#F4F2FA] flex items-center justify-center shrink-0 mt-0.5">
        <Icon name={icon} size={20} className="text-[#6C5BA7]" />
      </div>
      <div>
        <h2 className="font-golos font-semibold text-xl sm:text-2xl text-gray-900 leading-tight">{title}</h2>
        {subtitle && <p className="text-sm text-gray-400 mt-0.5">{subtitle}</p>}
      </div>
    </div>
  );
}

// ── scoreColor ────────────────────────────────────────────────────────────────
export function scoreColor(score: number): string {
  if (score >= 70) return "#22c55e";
  if (score >= 40) return "#f59e0b";
  return "#ef4444";
}

// ── ScoreBar ──────────────────────────────────────────────────────────────────
export function ScoreBar({ label, score }: { label: string; score: number }) {
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

// ── MatrixGrid ────────────────────────────────────────────────────────────────
export function MatrixGrid({ matrix }: { matrix: PythagorasMatrix }) {
  return (
    <div className="grid grid-cols-3 gap-1.5">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
        <div
          key={digit}
          className="aspect-square rounded-lg bg-[#F4F2FA] border border-[#E8E4F5] flex flex-col items-center justify-center"
        >
          <span className="text-[10px] text-gray-400">{digit}</span>
          <span className="font-golos font-bold text-[#6C5BA7] text-lg leading-none">
            {matrix[digit] || 0}
          </span>
        </div>
      ))}
    </div>
  );
}

// ── PersonCard ────────────────────────────────────────────────────────────────
export function PersonCard({
  label,
  person,
}: {
  label: string;
  person: { lifePath: number; character: number; destiny: number; soulUrge: number; matrix: PythagorasMatrix };
}) {
  const rows = [
    { name: "Жизненный путь", value: person.lifePath },
    { name: "Характер", value: person.character },
    { name: "Судьба", value: person.destiny },
    { name: "Душевное число", value: person.soulUrge },
  ];
  return (
    <div className="flex-1 min-w-0">
      <div className="text-xs font-semibold text-[#6C5BA7] uppercase tracking-widest mb-3 text-center">
        {label}
      </div>
      <div className="space-y-2">
        {rows.map((r) => (
          <div key={r.name} className="bg-[#F4F2FA]/60 border border-[#E8E4F5] rounded-xl p-3 text-center">
            <div className="font-golos font-bold text-2xl text-[#6C5BA7]">{r.value}</div>
            <div className="text-[11px] text-gray-500 mt-0.5">{r.name}</div>
            <div className="text-[11px] text-gray-400">{DESCRIPTIONS[r.value]?.title}</div>
          </div>
        ))}
      </div>
      <div className="mt-4">
        <div className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2 text-center">
          Психологический портрет
        </div>
        <MatrixGrid matrix={person.matrix} />
      </div>
    </div>
  );
}

// ── DimensionCard ─────────────────────────────────────────────────────────────
export function DimensionCard({ icon, label, score }: { icon: string; label: string; score: number }) {
  return (
    <Card className="p-4 flex flex-col items-center text-center gap-3">
      <div className="w-9 h-9 rounded-lg bg-[#F4F2FA] flex items-center justify-center">
        <Icon name={icon} size={18} className="text-[#6C5BA7]" />
      </div>
      <ScoreCircle score={score} size={72} />
      <span className="text-sm font-medium text-gray-700 leading-tight">{label}</span>
    </Card>
  );
}
