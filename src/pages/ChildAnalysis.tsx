import { useState } from "react";
import { Link } from "react-router-dom";
import Icon from "@/components/ui/icon";
import {
  calcLifePath,
  calcCharacter,
  calcDestiny,
  calcSoulUrge,
  DESCRIPTIONS,
} from "@/lib/matrix";
import type { PersonDescription } from "@/lib/matrix";

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

function NumberCard({
  num,
  label,
  desc,
}: {
  num: number;
  label: string;
  desc: PersonDescription | undefined;
}) {
  return (
    <div className="bg-amber-50/60 border border-amber-100 rounded-xl p-4 flex flex-col gap-1 text-center">
      <div className="text-3xl font-serif font-bold text-amber-700">{num}</div>
      <div className="text-[11px] font-semibold text-amber-600 uppercase tracking-widest">
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

/* ─── talent badge colors (cycle through) ─── */
const TALENT_STYLES = [
  { bg: "bg-purple-50", border: "border-purple-100", text: "text-purple-700", icon: "text-purple-500" },
  { bg: "bg-amber-50", border: "border-amber-100", text: "text-amber-700", icon: "text-amber-500" },
  { bg: "bg-emerald-50", border: "border-emerald-100", text: "text-emerald-700", icon: "text-emerald-500" },
  { bg: "bg-sky-50", border: "border-sky-100", text: "text-sky-700", icon: "text-sky-500" },
  { bg: "bg-rose-50", border: "border-rose-100", text: "text-rose-700", icon: "text-rose-500" },
  { bg: "bg-indigo-50", border: "border-indigo-100", text: "text-indigo-700", icon: "text-indigo-500" },
];

/* ═══════════════════ MAIN PAGE ═══════════════════ */

export default function ChildAnalysis() {
  const [childName, setChildName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [error, setError] = useState("");

  const [result, setResult] = useState<{
    lifePath: number;
    character: number;
    destiny: number;
    soulUrge: number;
    desc: PersonDescription;
    name: string;
  } | null>(null);

  function handleCalculate() {
    setError("");
    setResult(null);

    if (!birthDate) {
      setError("Введите дату рождения ребёнка");
      return;
    }

    const lifePath = calcLifePath(birthDate);
    const character = calcCharacter(birthDate);
    const destiny = calcDestiny(birthDate);
    const soulUrge = calcSoulUrge(birthDate);

    if (!lifePath || !character || !destiny || !soulUrge) {
      setError("Не удалось выполнить расчёт. Проверьте дату.");
      return;
    }

    const desc = DESCRIPTIONS[lifePath];
    if (!desc) {
      setError("Описание для этого числа пока недоступно.");
      return;
    }

    setResult({
      lifePath,
      character,
      destiny,
      soulUrge,
      desc,
      name: childName.trim(),
    });
  }

  function handleReset() {
    setResult(null);
    setChildName("");
    setBirthDate("");
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const displayName = result?.name || "вашего ребёнка";

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
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-100 to-purple-200 mb-4">
            <Icon name="Baby" size={28} className="text-purple-700" />
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-gray-900 mb-2">
            Детский нумерологический профиль
          </h1>
          <p className="text-gray-400 text-sm max-w-lg mx-auto">
            Узнайте таланты, характер и потенциал вашего ребёнка по дате рождения
          </p>
        </div>

        {/* ── Input form ── */}
        {!result && (
          <Card className="p-6 sm:p-8 max-w-lg mx-auto">
            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Имя ребёнка
                  <span className="text-gray-400 font-normal ml-1">(необязательно)</span>
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <Icon name="Smile" size={16} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={childName}
                    onChange={(e) => setChildName(e.target.value)}
                    placeholder="Например, Алиса"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 text-sm placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-400 transition-colors"
                  />
                </div>
              </div>

              {/* Birth date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Дата рождения ребёнка
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <Icon name="Calendar" size={16} className="text-gray-400" />
                  </div>
                  <input
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-400 transition-colors"
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
              className="mt-6 w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white text-sm font-semibold rounded-xl px-8 py-3.5 transition-all shadow-md shadow-purple-200/50 hover:shadow-lg hover:shadow-purple-300/50"
            >
              <Icon name="Sparkles" size={18} />
              Рассчитать профиль ребёнка
            </button>
          </Card>
        )}

        {/* ═══════════════════ RESULTS ═══════════════════ */}
        {result && (
          <>
            {/* ── 1. Hero ── */}
            <Card className="relative overflow-hidden p-8 sm:p-10">
              {/* decorative shapes */}
              <div className="absolute -top-16 -right-16 w-48 h-48 bg-purple-50 rounded-full opacity-60 pointer-events-none" />
              <div className="absolute -bottom-12 -left-12 w-36 h-36 bg-amber-50 rounded-full opacity-50 pointer-events-none" />

              <div className="relative flex flex-col sm:flex-row sm:items-center gap-6">
                {/* big number */}
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center shrink-0 mx-auto sm:mx-0">
                  <span className="font-serif text-5xl sm:text-6xl font-bold text-purple-700">
                    {result.lifePath}
                  </span>
                </div>

                <div className="text-center sm:text-left">
                  <p className="text-xs font-semibold text-purple-600 uppercase tracking-widest mb-1">
                    Число жизненного пути
                  </p>
                  <h2 className="font-serif text-3xl sm:text-4xl text-gray-900 mb-1">
                    {`Профиль ${displayName}`}
                  </h2>
                  <p className="text-gray-500 text-base leading-relaxed">
                    {result.desc.title} — {result.desc.tagline}
                  </p>
                </div>
              </div>
            </Card>

            {/* ── 2. Numbers grid ── */}
            <Card className="p-6 sm:p-8">
              <SectionHeading
                icon="Hash"
                title="Ключевые числа"
                subtitle="Нумерологический портрет ребёнка"
                iconBg="bg-amber-100"
                iconColor="text-amber-600"
              />
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <NumberCard num={result.lifePath} label="Жизненный путь" desc={DESCRIPTIONS[result.lifePath]} />
                <NumberCard num={result.character} label="Характер" desc={DESCRIPTIONS[result.character]} />
                <NumberCard num={result.destiny} label="Судьба" desc={DESCRIPTIONS[result.destiny]} />
                <NumberCard num={result.soulUrge} label="Душа" desc={DESCRIPTIONS[result.soulUrge]} />
              </div>
            </Card>

            {/* ── 3. Child profile description ── */}
            <Card className="p-6 sm:p-8">
              <SectionHeading
                icon="BookOpen"
                title="О вашем ребёнке"
                subtitle="Характер и особенности с рождения"
              />
              <div className="bg-purple-50/60 border border-purple-100 rounded-xl p-5 sm:p-6">
                <p className="text-gray-700 text-[15px] leading-relaxed">
                  {result.desc.childProfile}
                </p>
              </div>
            </Card>

            {/* ── 4. Talents ── */}
            <Card className="p-6 sm:p-8">
              <SectionHeading
                icon="Star"
                title="Таланты и способности"
                subtitle="Природные дарования, которые стоит развивать"
              />
              <div className="flex flex-wrap gap-3">
                {result.desc.childTalents.map((talent, i) => {
                  const style = TALENT_STYLES[i % TALENT_STYLES.length];
                  return (
                    <div
                      key={i}
                      className={`inline-flex items-center gap-2 ${style.bg} border ${style.border} rounded-xl px-4 py-2.5`}
                    >
                      <Icon name="Star" size={15} className={style.icon} />
                      <span className={`text-sm font-medium ${style.text}`}>
                        {talent}
                      </span>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* ── 5. Tips for parents ── */}
            <Card className="p-6 sm:p-8">
              <SectionHeading
                icon="Heart"
                title="Советы для родителей"
                subtitle="Как помочь ребёнку раскрыть потенциал"
                iconBg="bg-rose-100"
                iconColor="text-rose-600"
              />
              <div className="space-y-3">
                {result.desc.childParentTips.map((tip, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3.5 bg-gray-50/80 border border-gray-100 rounded-xl p-4"
                  >
                    <div className="w-8 h-8 rounded-lg bg-rose-100 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-rose-600">
                        {i + 1}
                      </span>
                    </div>
                    <div className="flex items-start gap-2 min-w-0 pt-1">
                      <Icon
                        name="Heart"
                        size={14}
                        className="text-rose-400 shrink-0 mt-0.5"
                      />
                      <span className="text-[15px] text-gray-700 leading-relaxed">
                        {tip}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* ── 6. Strengths & Challenges ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* strengths */}
              <Card className="p-6">
                <h3 className="font-serif text-lg text-gray-900 mb-4 flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center">
                    <Icon name="ThumbsUp" size={15} className="text-emerald-600" />
                  </div>
                  Сильные стороны характера
                </h3>
                <ul className="space-y-2.5">
                  {result.desc.strengths.map((s, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <Icon
                        name="CircleCheck"
                        size={18}
                        className="text-emerald-500 shrink-0 mt-0.5"
                      />
                      <span className="text-sm text-gray-700">{s}</span>
                    </li>
                  ))}
                </ul>
              </Card>

              {/* challenges */}
              <Card className="p-6">
                <h3 className="font-serif text-lg text-gray-900 mb-4 flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center">
                    <Icon name="Sprout" size={15} className="text-amber-600" />
                  </div>
                  Над чем работать
                </h3>
                <ul className="space-y-2.5">
                  {result.desc.challenges.map((c, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <Icon
                        name="ArrowUpRight"
                        size={18}
                        className="text-amber-500 shrink-0 mt-0.5"
                      />
                      <span className="text-sm text-gray-700">{c}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>

            {/* ── 7. CTA ── */}
            <div className="text-center pt-4 pb-8 space-y-4">
              <p className="text-sm text-gray-400">
                Расчёт выполнен на основе классической нумерологии Пифагора
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={handleReset}
                  className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-xl px-6 py-3 transition-colors"
                >
                  <Icon name="RotateCcw" size={16} />
                  Рассчитать для другого ребёнка
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
