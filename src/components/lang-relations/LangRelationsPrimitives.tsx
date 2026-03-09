import Icon from "@/components/ui/icon";

// ─── StepCard ────────────────────────────────────────────────────────────────

type StepCardProps = {
  icon?: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
};

export function StepCard({ icon, title, subtitle, children }: StepCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      {(icon || title) && (
        <div className="mb-5">
          {icon && (
            <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center mb-3">
              <Icon name={icon} size={20} className="text-rose-500" />
            </div>
          )}
          {title && <h2 className="font-golos font-semibold text-gray-900 text-base leading-snug">{title}</h2>}
          {subtitle && <p className="font-golos text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>
      )}
      {children}
    </div>
  );
}

// ─── NextButton ───────────────────────────────────────────────────────────────

type NextBtnProps = {
  onClick: () => void;
  disabled?: boolean;
  label?: string;
};

export function NextButton({ onClick, disabled, label = "Продолжить" }: NextBtnProps) {
  return (
    <div className="flex justify-center mt-6">
      <button
        onClick={onClick}
        disabled={disabled}
        className="inline-flex items-center gap-2 bg-rose-500 hover:bg-rose-600 text-white font-golos text-sm font-medium px-6 py-2.5 rounded-xl transition-colors disabled:opacity-40"
      >
        {label}
        <Icon name="ArrowRight" size={15} />
      </button>
    </div>
  );
}

// ─── EmotionChip ─────────────────────────────────────────────────────────────

type ChipProps = {
  label: string;
  selected: boolean;
  onClick: () => void;
  variant?: "default" | "negative" | "positive";
};

export function Chip({ label, selected, onClick, variant = "default" }: ChipProps) {
  const base = "px-3.5 py-2 rounded-xl border text-sm font-golos transition-all cursor-pointer select-none";
  const variants = {
    negative: selected
      ? "bg-rose-500 border-rose-500 text-white"
      : "bg-white border-gray-200 text-gray-700 hover:border-rose-300",
    positive: selected
      ? "bg-emerald-500 border-emerald-500 text-white"
      : "bg-white border-gray-200 text-gray-700 hover:border-emerald-300",
    default: selected
      ? "bg-[#6C5BA7] border-[#6C5BA7] text-white"
      : "bg-white border-gray-200 text-gray-700 hover:border-[#6C5BA7]/40",
  };
  return (
    <button onClick={onClick} className={`${base} ${variants[variant]}`}>
      {label}
    </button>
  );
}

// ─── SingleSelect ────────────────────────────────────────────────────────────

type SingleSelectProps = {
  options: { value: number; label: string }[];
  value: number | null;
  onChange: (v: number) => void;
  variant?: "default" | "negative" | "positive";
};

export function SingleSelect({ options, value, onChange, variant = "default" }: SingleSelectProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(o => (
        <Chip
          key={o.value}
          label={o.label}
          selected={value === o.value}
          onClick={() => onChange(o.value)}
          variant={variant}
        />
      ))}
    </div>
  );
}

// ─── MultiSelect ─────────────────────────────────────────────────────────────

type MultiSelectProps = {
  options: { value: number; label: string }[];
  values: number[];
  onChange: (v: number[]) => void;
  variant?: "default" | "negative" | "positive";
};

export function MultiSelect({ options, values, onChange, variant = "default" }: MultiSelectProps) {
  const toggle = (v: number) => {
    if (values.includes(v)) onChange(values.filter(x => x !== v));
    else onChange([...values, v]);
  };
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(o => (
        <Chip
          key={o.value}
          label={o.label}
          selected={values.includes(o.value)}
          onClick={() => toggle(o.value)}
          variant={variant}
        />
      ))}
    </div>
  );
}

// ─── EntryCounter ────────────────────────────────────────────────────────────

type EntryCounterProps = {
  count: number;
  min: number;
};

export function EntryCounter({ count, min }: EntryCounterProps) {
  const pct = Math.min((count / min) * 100, 100);
  return (
    <div className="bg-[#F9F8FC] border border-[#E8E4F5] rounded-xl px-4 py-3 mb-5">
      <div className="flex items-center justify-between mb-2">
        <span className="font-golos text-xs text-gray-500">Записей добавлено</span>
        <span className="font-golos text-sm font-semibold text-[#6C5BA7]">{count} / {min}</span>
      </div>
      <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-rose-400 to-rose-500 rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      {count < min && (
        <p className="font-golos text-xs text-gray-400 mt-1.5">
          Ещё {min - count} {declEntry(min - count)} — и анализ будет готов
        </p>
      )}
    </div>
  );
}

function declEntry(n: number) {
  if (n % 10 === 1 && n % 100 !== 11) return "запись";
  if ([2, 3, 4].includes(n % 10) && ![12, 13, 14].includes(n % 100)) return "записи";
  return "записей";
}

// ─── ScoreBar ────────────────────────────────────────────────────────────────

type ScoreBarProps = {
  label: string;
  value: number;
  max: number;
  color?: string;
};

export function ScoreBar({ label, value, max, color = "bg-rose-400" }: ScoreBarProps) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div className="mb-3">
      <div className="flex justify-between mb-1">
        <span className="font-golos text-sm text-gray-700">{label}</span>
        <span className="font-golos text-sm font-medium text-gray-500">{Math.round(pct)}%</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all duration-700`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
