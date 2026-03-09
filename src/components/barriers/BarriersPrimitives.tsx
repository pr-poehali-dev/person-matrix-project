import { ReactNode } from "react";
import Icon from "@/components/ui/icon";
import type { StepEntry } from "./barriersTypes";

// ── StepCard ──────────────────────────────────────────────────────────────────
type StepCardProps = {
  icon: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
};

export function StepCard({ icon, title, subtitle, children }: StepCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.07)] p-6 md:p-8">
      <div className="flex flex-col items-center text-center mb-6">
        <div className="w-12 h-12 rounded-xl bg-[#FFF3EC] flex items-center justify-center mb-4">
          <Icon name={icon} size={22} className="text-[#E06B2E]" />
        </div>
        {title && (
          <h2 className="font-golos font-semibold text-gray-900 text-lg leading-snug max-w-sm">
            {title}
          </h2>
        )}
        {subtitle && (
          <p className="font-golos text-sm text-gray-400 mt-1">{subtitle}</p>
        )}
      </div>
      {children}
    </div>
  );
}

// ── OptionButton ──────────────────────────────────────────────────────────────
type OptionButtonProps = {
  label: string;
  selected: boolean;
  onClick: () => void;
  disabled?: boolean;
};

export function OptionButton({ label, selected, onClick, disabled }: OptionButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full text-left px-4 py-3 rounded-xl border font-golos text-sm transition-all
        ${selected
          ? "bg-[#FFF3EC] border-[#E06B2E] text-[#C45520] font-medium"
          : "bg-white border-gray-200 text-gray-700 hover:border-[#E06B2E] hover:bg-[#FFF8F4]"}
        disabled:opacity-50`}
    >
      {label}
    </button>
  );
}

// ── OptionsGrid ───────────────────────────────────────────────────────────────
type OptionsGridProps = {
  options: string[];
  selected: string[];
  max?: number;
  onToggle: (v: string) => void;
  customValue?: string;
  onCustomChange?: (v: string) => void;
};

export function OptionsGrid({ options, selected, max = 1, onToggle, customValue, onCustomChange }: OptionsGridProps) {
  const hasCustom = options.includes("Свой вариант");
  const isCustomSelected = selected.includes("Свой вариант");
  return (
    <div className="flex flex-col gap-2">
      {options.map(opt => {
        if (opt === "Свой вариант") return null;
        const sel = selected.includes(opt);
        return (
          <OptionButton
            key={opt}
            label={opt}
            selected={sel}
            disabled={!sel && max !== undefined && selected.filter(s => s !== "Свой вариант").length >= max}
            onClick={() => onToggle(opt)}
          />
        );
      })}
      {hasCustom && (
        <div>
          <OptionButton
            label={isCustomSelected && customValue ? customValue : "Свой вариант"}
            selected={isCustomSelected}
            onClick={() => onToggle("Свой вариант")}
          />
          {isCustomSelected && onCustomChange && (
            <input
              autoFocus
              value={customValue}
              onChange={e => onCustomChange(e.target.value)}
              placeholder="Введите свой вариант..."
              className="mt-2 w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-golos outline-none focus:border-[#E06B2E]"
            />
          )}
        </div>
      )}
    </div>
  );
}

// ── SliderInput ───────────────────────────────────────────────────────────────
type SliderInputProps = {
  value: number;
  min?: number;
  max?: number;
  onChange: (v: number) => void;
  colorClass?: string;
};

export function SliderInput({ value, min = 0, max = 10, onChange, colorClass = "accent-[#E06B2E]" }: SliderInputProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-between text-xs font-golos text-gray-400">
        <span>{min}</span>
        <span className={`text-2xl font-bold font-golos ${value >= 7 ? "text-rose-500" : value >= 4 ? "text-amber-500" : "text-emerald-500"}`}>
          {value}
        </span>
        <span>{max}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className={`w-full h-2 rounded-full cursor-pointer ${colorClass}`}
      />
      <div className="flex justify-between text-xs font-golos text-gray-300">
        <span>{min === 0 ? "Нет" : "Низкий"}</span>
        <span>Высокий</span>
      </div>
    </div>
  );
}

// ── XYChart ───────────────────────────────────────────────────────────────────
type XYChartProps = {
  steps: StepEntry[];
  breakIdx: number | null;
  newYSteps?: StepEntry[];
};

export function XYChart({ steps, breakIdx, newYSteps }: XYChartProps) {
  if (steps.length === 0) return null;

  const W = 320;
  const H = 200;
  const PAD = { top: 16, right: 16, bottom: 32, left: 28 };
  const chartW = W - PAD.left - PAD.right;
  const chartH = H - PAD.top - PAD.bottom;

  const xScale = (i: number) => PAD.left + (i / (steps.length - 1 || 1)) * chartW;
  const yScale = (v: number) => PAD.top + chartH - (v / 10) * chartH;

  const polyline = (arr: number[], vals: (s: StepEntry) => number) =>
    arr.map(i => `${xScale(i)},${yScale(vals(steps[i]))}`).join(" ");

  const idxs = steps.map((_, i) => i);

  const xPoints = polyline(idxs, s => s.x);
  const yPoints = polyline(idxs, s => s.y);
  const newYPoints = newYSteps ? idxs.map(i => `${xScale(i)},${yScale(newYSteps[i].y)}`).join(" ") : null;

  return (
    <div className="w-full overflow-x-auto">
      <svg width={W} height={H} className="mx-auto block font-golos">
        {/* grid */}
        {[0, 5, 10].map(v => (
          <line key={v} x1={PAD.left} x2={W - PAD.right} y1={yScale(v)} y2={yScale(v)}
            stroke="#f0f0f0" strokeWidth="1" />
        ))}
        {/* axis labels */}
        {[0, 5, 10].map(v => (
          <text key={v} x={PAD.left - 6} y={yScale(v) + 4} textAnchor="end" fontSize={9} fill="#aaa">{v}</text>
        ))}
        {steps.map((_, i) => (
          <text key={i} x={xScale(i)} y={H - 6} textAnchor="middle" fontSize={9} fill="#aaa">{i + 1}</text>
        ))}

        {/* break zone */}
        {breakIdx !== null && breakIdx < steps.length && (
          <rect
            x={xScale(breakIdx) - 12}
            y={PAD.top}
            width={24}
            height={chartH}
            fill="rgba(239,68,68,0.07)"
            rx={4}
          />
        )}

        {/* new Y line */}
        {newYPoints && (
          <polyline points={newYPoints} fill="none" stroke="#22c55e" strokeWidth={2} strokeDasharray="4 3" />
        )}

        {/* X line */}
        <polyline points={xPoints} fill="none" stroke="#6C5BA7" strokeWidth={2.5} />
        {/* Y line */}
        <polyline points={yPoints} fill="none" stroke="#E06B2E" strokeWidth={2.5} />

        {/* dots */}
        {idxs.map(i => (
          <g key={i}>
            <circle cx={xScale(i)} cy={yScale(steps[i].x)} r={3.5} fill="#6C5BA7" />
            <circle cx={xScale(i)} cy={yScale(steps[i].y)} r={3.5}
              fill={breakIdx === i ? "#ef4444" : "#E06B2E"} />
          </g>
        ))}

        {/* break marker */}
        {breakIdx !== null && breakIdx < steps.length && (
          <text x={xScale(breakIdx)} y={PAD.top - 4} textAnchor="middle" fontSize={9} fill="#ef4444">срыв</text>
        )}

        {/* legend */}
        <g>
          <line x1={PAD.left} y1={H - PAD.bottom + 14} x2={PAD.left + 14} y2={H - PAD.bottom + 14} stroke="#6C5BA7" strokeWidth={2} />
          <text x={PAD.left + 18} y={H - PAD.bottom + 17} fontSize={9} fill="#6C5BA7">Прогресс (X)</text>
          <line x1={PAD.left + 80} y1={H - PAD.bottom + 14} x2={PAD.left + 94} y2={H - PAD.bottom + 14} stroke="#E06B2E" strokeWidth={2} />
          <text x={PAD.left + 98} y={H - PAD.bottom + 17} fontSize={9} fill="#E06B2E">Тревога (Y)</text>
          {newYPoints && (
            <>
              <line x1={PAD.left + 160} y1={H - PAD.bottom + 14} x2={PAD.left + 174} y2={H - PAD.bottom + 14} stroke="#22c55e" strokeWidth={2} strokeDasharray="4 3" />
              <text x={PAD.left + 178} y={H - PAD.bottom + 17} fontSize={9} fill="#22c55e">Новая Y</text>
            </>
          )}
        </g>
      </svg>
    </div>
  );
}
