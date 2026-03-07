import { useState } from "react";
import { Link } from "react-router-dom";
import Icon from "@/components/ui/icon";
import {
  calcCompatibility,
  DESCRIPTIONS,
  LEVEL_LABELS,
} from "@/lib/matrix";
import type { CompatibilityResult } from "@/lib/matrix";

/* ─── helpers ─── */

function formatDate(iso: string) {
  const [y, m, d] = iso.split("-");
  return `${d}.${m}.${y}`;
}

/* ─── reusable primitives ─── */

function Card({
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

function SectionHeading({
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
      <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0 mt-0.5">
        <Icon name={icon} size={20} className="text-amber-600" />
      </div>
      <div>
        <h2 className="font-serif text-xl sm:text-2xl text-gray-900 leading-tight">
          {title}
        </h2>
        {subtitle && (
          <p className="text-sm text-gray-400 mt-0.5">{subtitle}</p>
        )}
      </div>
    </div>
  );
}

/* ─── person number column ─── */

function PersonNumbers({
  label,
  nums,
}: {
  label: string;
  nums: { lifePath: number; character: number; destiny: number };
}) {
  const rows: { key: string; value: number; name: string }[] = [
    { key: "lifePath", value: nums.lifePath, name: "Жизненный путь" },
    { key: "character", value: nums.character, name: "Характер" },
    { key: "destiny", value: nums.destiny, name: "Судьба" },
  ];

  return (
    <div className="flex-1 min-w-0">
      <div className="text-xs font-semibold text-amber-600 uppercase tracking-widest mb-3 text-center">
        {label}
      </div>
      <div className="space-y-2.5">
        {rows.map((r) => (
          <div
            key={r.key}
            className="bg-amber-50/60 border border-amber-100 rounded-xl p-3 text-center"
          >
            <div className="font-serif text-2xl font-bold text-amber-700">
              {r.value}
            </div>
            <div className="text-[11px] text-gray-500 mt-0.5">{r.name}</div>
            <div className="text-[11px] text-gray-400">
              {DESCRIPTIONS[r.value]?.title}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── compatibility bar ─── */

function CompatBar({
  label,
  level,
}: {
  label: string;
  level: string;
}) {
  const info = LEVEL_LABELS[level] || LEVEL_LABELS["neutral"];
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span
          className="text-xs font-semibold px-2 py-0.5 rounded-full"
          style={{ backgroundColor: info.color + "18", color: info.color }}
        >
          {info.label} - {info.percent}%
        </span>
      </div>
      <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{ width: `${info.percent}%`, backgroundColor: info.color }}
        />
      </div>
    </div>
  );
}

/* ═══════════════════ MAIN PAGE ═══════════════════ */

export default function Compatibility() {
  const [date1, setDate1] = useState("");
  const [date2, setDate2] = useState("");
  const [result, setResult] = useState<CompatibilityResult | null>(null);
  const [error, setError] = useState("");

  function handleCalculate() {
    setError("");
    setResult(null);

    if (!date1 || !date2) {
      setError("Введите обе даты рождения");
      return;
    }

    const r = calcCompatibility(date1, date2);
    if (!r) {
      setError("Не удалось выполнить расчёт. Проверьте даты.");
      return;
    }

    setResult(r);
  }

  const overallInfo = result
    ? LEVEL_LABELS[result.overallLevel] || LEVEL_LABELS["neutral"]
    : null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* ── Header ── */}
      <header className="bg-white border-b border-gray-100 px-6 py-4 sticky top-0 z-30">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full border border-amber-400 flex items-center justify-center">
              <span className="font-serif text-sm font-bold text-amber-600">
                М
              </span>
            </div>
            <span className="font-serif text-lg text-gray-800">
              Матрица личности
            </span>
          </Link>
          <Link
            to="/"
            className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors"
          >
            <Icon name="ArrowLeft" size={15} />
            На главную
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8 sm:py-12 space-y-8">
        {/* ── Page title ── */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-100 to-amber-200 mb-4">
            <Icon name="Heart" size={28} className="text-amber-700" />
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-gray-900 mb-2">
            Совместимость по дате рождения
          </h1>
          <p className="text-gray-400 text-sm max-w-md mx-auto">
            Узнайте, насколько гармоничен ваш союз с точки зрения нумерологии
          </p>
        </div>

        {/* ── Input form ── */}
        <Card className="p-6 sm:p-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Date 1 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Дата рождения — Партнёр 1
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <Icon name="User" size={16} className="text-gray-400" />
                </div>
                <input
                  type="date"
                  value={date1}
                  onChange={(e) => setDate1(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-400 transition-colors"
                />
              </div>
            </div>

            {/* Date 2 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Дата рождения — Партнёр 2
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <Icon name="User" size={16} className="text-gray-400" />
                </div>
                <input
                  type="date"
                  value={date2}
                  onChange={(e) => setDate2(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-400 transition-colors"
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="mt-4 flex items-center gap-2 text-sm text-red-500">
              <Icon name="AlertCircle" size={16} />
              {error}
            </div>
          )}

          <button
            onClick={handleCalculate}
            className="mt-6 w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-sm font-semibold rounded-xl px-8 py-3.5 transition-all shadow-md shadow-amber-200/50 hover:shadow-lg hover:shadow-amber-300/50"
          >
            <Icon name="Sparkles" size={18} />
            Рассчитать совместимость
          </button>
        </Card>

        {/* ═══════════════════ RESULTS ═══════════════════ */}
        {result && overallInfo && (
          <>
            {/* ── 1. Overall badge ── */}
            <Card className="relative overflow-hidden p-6 sm:p-8">
              {/* decorative circles */}
              <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full opacity-20 pointer-events-none" style={{ backgroundColor: overallInfo.color }} />
              <div className="absolute -bottom-12 -left-12 w-36 h-36 rounded-full opacity-10 pointer-events-none" style={{ backgroundColor: overallInfo.color }} />

              <div className="relative flex flex-col sm:flex-row items-center gap-6">
                {/* circle */}
                <div className="relative w-32 h-32 sm:w-36 sm:h-36 shrink-0">
                  <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                    <circle
                      cx="60"
                      cy="60"
                      r="52"
                      fill="none"
                      stroke="#f3f4f6"
                      strokeWidth="10"
                    />
                    <circle
                      cx="60"
                      cy="60"
                      r="52"
                      fill="none"
                      stroke={overallInfo.color}
                      strokeWidth="10"
                      strokeLinecap="round"
                      strokeDasharray={`${(overallInfo.percent / 100) * 2 * Math.PI * 52} ${2 * Math.PI * 52}`}
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span
                      className="font-serif text-3xl sm:text-4xl font-bold"
                      style={{ color: overallInfo.color }}
                    >
                      {overallInfo.percent}%
                    </span>
                  </div>
                </div>

                {/* text */}
                <div className="text-center sm:text-left">
                  <div
                    className="inline-block text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-2"
                    style={{
                      backgroundColor: overallInfo.color + "18",
                      color: overallInfo.color,
                    }}
                  >
                    {overallInfo.label} совместимость
                  </div>
                  <h2 className="font-serif text-2xl sm:text-3xl text-gray-900 mb-2">
                    Ваш результат
                  </h2>
                  <p className="text-gray-600 text-[15px] leading-relaxed max-w-lg">
                    {result.overallDesc}
                  </p>
                  <p className="text-gray-400 text-xs mt-3">
                    {formatDate(date1)} + {formatDate(date2)}
                  </p>
                </div>
              </div>
            </Card>

            {/* ── 2. Side-by-side comparison ── */}
            <Card className="p-6 sm:p-8">
              <SectionHeading
                icon="Users"
                title="Сравнение чисел"
                subtitle="Нумерологические портреты обоих партнёров"
              />

              <div className="flex gap-4 sm:gap-6 items-start">
                <PersonNumbers label="Партнёр 1" nums={result.person1} />

                {/* divider */}
                <div className="flex flex-col items-center pt-8 shrink-0">
                  <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                    <Icon name="Heart" size={18} className="text-amber-600" />
                  </div>
                  <div className="w-px flex-1 bg-amber-200 mt-2 min-h-[80px]" />
                </div>

                <PersonNumbers label="Партнёр 2" nums={result.person2} />
              </div>
            </Card>

            {/* ── 3. Compatibility bars ── */}
            <Card className="p-6 sm:p-8">
              <SectionHeading
                icon="BarChart3"
                title="Детальная совместимость"
                subtitle="Три аспекта вашей нумерологической связи"
              />

              <div className="space-y-5">
                <CompatBar label="Жизненный путь" level={result.lifePathCompat} />
                <CompatBar label="Характер" level={result.characterCompat} />
                <CompatBar label="Судьба" level={result.destinyCompat} />
              </div>
            </Card>

            {/* ── 4. Tips ── */}
            {result.tips.length > 0 && (
              <Card className="p-6 sm:p-8">
                <SectionHeading
                  icon="Lightbulb"
                  title="Рекомендации для вашей пары"
                  subtitle="Как сделать отношения лучше"
                />

                <ul className="space-y-3">
                  {result.tips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                        <Icon
                          name="Check"
                          size={14}
                          className="text-emerald-600"
                        />
                      </div>
                      <span className="text-[15px] text-gray-700 leading-relaxed">
                        {tip}
                      </span>
                    </li>
                  ))}
                </ul>
              </Card>
            )}

            {/* ── 5. CTA ── */}
            <div className="text-center pt-4 pb-8 space-y-4">
              <p className="text-sm text-gray-400">
                Расчёт выполнен на основе классической нумерологии Пифагора
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={() => {
                    setResult(null);
                    setDate1("");
                    setDate2("");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium rounded-xl px-6 py-3 transition-colors"
                >
                  <Icon name="RotateCcw" size={16} />
                  Новый расчёт
                </button>
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 font-medium transition-colors"
                >
                  <Icon name="ArrowLeft" size={16} />
                  На главную
                </Link>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
