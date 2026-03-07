import { useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import {
  calcLifePath,
  calcCharacter,
  calcDestiny,
  calcSoulUrge,
  calcMaturity,
  calcPersonalYear,
  calcLifeCycles,
  calcPinnaclesChallenges,
  DESCRIPTIONS,
  PERSONAL_YEAR_DESC,
} from "@/lib/matrix";
import type { PersonDescription, LifeCycle, PinnacleChallenge } from "@/lib/matrix";
import Icon from "@/components/ui/icon";

/* ─── tiny helpers ─── */
function formatDate(iso: string) {
  const [y, m, d] = iso.split("-");
  return `${d}.${m}.${y}`;
}

const CYCLE_ICONS: Record<string, string> = {
  "Формирование": "Sprout",
  "Продуктивность": "Flame",
  "Урожай": "Crown",
};

/* ─── sub-components ─── */

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

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`bg-white rounded-2xl border border-gray-100 shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}

function NumberBadge({
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

/* ─── main page ─── */

export default function FullResult() {
  const [params] = useSearchParams();
  const date = params.get("date") || "";

  const data = useMemo(() => {
    if (!date) return null;
    const lifePath = calcLifePath(date);
    if (!lifePath) return null;
    return {
      lifePath,
      character: calcCharacter(date)!,
      destiny: calcDestiny(date)!,
      soulUrge: calcSoulUrge(date)!,
      maturity: calcMaturity(date)!,
      personalYear: calcPersonalYear(date)!,
      lifeCycles: calcLifeCycles(date)!,
      pinnacles: calcPinnaclesChallenges(date)!,
    };
  }, [date]);

  /* ── error state ── */
  if (!date || !data) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
        <Card className="p-10 text-center max-w-md">
          <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-5">
            <Icon name="AlertTriangle" size={28} className="text-amber-600" />
          </div>
          <h1 className="font-serif text-2xl text-gray-900 mb-2">
            Дата не указана
          </h1>
          <p className="text-gray-400 text-sm mb-6">
            Перейдите на главную страницу и введите дату рождения для расчёта.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium rounded-xl px-6 py-3 transition-colors"
          >
            <Icon name="ArrowLeft" size={16} />
            На главную
          </Link>
        </Card>
      </div>
    );
  }

  const desc: PersonDescription | undefined = DESCRIPTIONS[data.lifePath];
  const pyDesc = PERSONAL_YEAR_DESC[data.personalYear > 9 ? 9 : data.personalYear];

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
        {/* ═══════════════════  1. HERO  ═══════════════════ */}
        <Card className="relative overflow-hidden p-8 sm:p-10">
          {/* decorative circle */}
          <div className="absolute -top-20 -right-20 w-56 h-56 bg-amber-50 rounded-full opacity-60 pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-amber-50 rounded-full opacity-40 pointer-events-none" />

          <div className="relative flex flex-col sm:flex-row sm:items-center gap-6">
            {/* big number */}
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center shrink-0 mx-auto sm:mx-0">
              <span className="font-serif text-5xl sm:text-6xl font-bold text-amber-700">
                {data.lifePath}
              </span>
            </div>

            <div className="text-center sm:text-left">
              <p className="text-xs font-semibold text-amber-600 uppercase tracking-widest mb-1">
                Число жизненного пути
              </p>
              <h1 className="font-serif text-3xl sm:text-4xl text-gray-900 mb-1">
                {desc?.title || `Число ${data.lifePath}`}
              </h1>
              <p className="text-gray-500 text-base leading-relaxed">
                {desc?.tagline}
              </p>
              <p className="text-gray-400 text-sm mt-3">
                Дата рождения: <span className="text-gray-600 font-medium">{formatDate(date)}</span>
              </p>
            </div>
          </div>
        </Card>

        {/* ═══════════════════  2. NUMBERS GRID  ═══════════════════ */}
        <Card className="p-6 sm:p-8">
          <SectionHeading
            icon="Hash"
            title="Ваши ключевые числа"
            subtitle="Пять фундаментальных вибраций вашей личности"
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            <NumberBadge num={data.lifePath} label="Жизненный путь" desc={DESCRIPTIONS[data.lifePath]} />
            <NumberBadge num={data.character} label="Характер" desc={DESCRIPTIONS[data.character]} />
            <NumberBadge num={data.destiny} label="Судьба" desc={DESCRIPTIONS[data.destiny]} />
            <NumberBadge num={data.soulUrge} label="Душа" desc={DESCRIPTIONS[data.soulUrge]} />
            <NumberBadge num={data.maturity} label="Зрелость" desc={DESCRIPTIONS[data.maturity]} />
          </div>
        </Card>

        {/* ═══════════════════  3. CHARACTER DESCRIPTION  ═══════════════════ */}
        {desc && (
          <Card className="p-6 sm:p-8">
            <SectionHeading
              icon="User"
              title="Характер и личность"
              subtitle={`${desc.title} — ${desc.tagline}`}
            />
            <p className="text-gray-700 leading-relaxed text-[15px]">
              {desc.character}
            </p>
          </Card>
        )}

        {/* ═══════════════════  4. STRENGTHS & CHALLENGES  ═══════════════════ */}
        {desc && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* strengths */}
            <Card className="p-6">
              <h3 className="font-serif text-lg text-gray-900 mb-4 flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <Icon name="Check" size={16} className="text-emerald-600" />
                </div>
                Сильные стороны
              </h3>
              <ul className="space-y-2.5">
                {desc.strengths.map((s, i) => (
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
                  <Icon name="ArrowUpRight" size={16} className="text-amber-600" />
                </div>
                Зоны роста
              </h3>
              <ul className="space-y-2.5">
                {desc.challenges.map((c, i) => (
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
        )}

        {/* ═══════════════════  5. CAREER  ═══════════════════ */}
        {desc && (
          <Card className="p-6 sm:p-8">
            <SectionHeading
              icon="Briefcase"
              title="Карьера и призвание"
              subtitle={`Профессиональная реализация числа ${data.lifePath}`}
            />
            <p className="text-gray-700 leading-relaxed text-[15px]">
              {desc.career}
            </p>
          </Card>
        )}

        {/* ═══════════════════  6. RELATIONSHIPS  ═══════════════════ */}
        {desc && (
          <Card className="p-6 sm:p-8">
            <SectionHeading
              icon="Heart"
              title="Отношения и любовь"
              subtitle="Что важно в партнёрстве"
            />
            <p className="text-gray-700 leading-relaxed text-[15px]">
              {desc.relationships}
            </p>
          </Card>
        )}

        {/* ═══════════════════  7. HEALTH  ═══════════════════ */}
        {desc && (
          <Card className="p-6 sm:p-8">
            <SectionHeading
              icon="Activity"
              title="Здоровье и энергия"
              subtitle="Уязвимые зоны и рекомендации"
            />
            <p className="text-gray-700 leading-relaxed text-[15px]">
              {desc.health}
            </p>
          </Card>
        )}

        {/* ═══════════════════  8. FINANCES  ═══════════════════ */}
        {desc && (
          <Card className="p-6 sm:p-8">
            <SectionHeading
              icon="DollarSign"
              title="Финансы и благосостояние"
              subtitle="Стратегия изобилия"
            />
            <p className="text-gray-700 leading-relaxed text-[15px]">
              {desc.finances}
            </p>
          </Card>
        )}

        {/* ═══════════════════  9. PERSONAL YEAR  ═══════════════════ */}
        {pyDesc && (
          <Card className="p-6 sm:p-8">
            <SectionHeading
              icon="CalendarDays"
              title="Персональный год"
              subtitle={`${new Date().getFullYear()} год для вас`}
            />

            <div className="flex items-start gap-5">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center shrink-0">
                <span className="font-serif text-3xl font-bold text-amber-700">
                  {data.personalYear}
                </span>
              </div>
              <div className="space-y-3 min-w-0">
                <h3 className="font-serif text-lg text-gray-900">
                  {pyDesc.title}
                </h3>
                <p className="text-gray-700 text-[15px] leading-relaxed">
                  {pyDesc.meaning}
                </p>
                <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Icon name="Lightbulb" size={16} className="text-amber-600" />
                    <span className="text-xs font-semibold text-amber-700 uppercase tracking-wide">
                      Совет года
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {pyDesc.advice}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* ═══════════════════  10. LIFE CYCLES  ═══════════════════ */}
        {data.lifeCycles && data.lifeCycles.length > 0 && (
          <Card className="p-6 sm:p-8">
            <SectionHeading
              icon="Repeat"
              title="Жизненные циклы"
              subtitle="Три великих периода вашей жизни"
            />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {data.lifeCycles.map((cycle: LifeCycle, i: number) => (
                <div
                  key={i}
                  className="relative bg-gradient-to-b from-amber-50/80 to-white border border-amber-100/80 rounded-xl p-5 text-center"
                >
                  <div className="w-10 h-10 rounded-full bg-white border border-amber-200 flex items-center justify-center mx-auto mb-3 shadow-sm">
                    <Icon
                      name={CYCLE_ICONS[cycle.period] || "Circle"}
                      size={20}
                      className="text-amber-600"
                    />
                  </div>
                  <div className="text-xs font-semibold text-amber-600 uppercase tracking-widest mb-1">
                    {cycle.period}
                  </div>
                  <div className="font-serif text-3xl font-bold text-gray-900 mb-1">
                    {cycle.number}
                  </div>
                  <div className="text-xs text-gray-400">
                    {DESCRIPTIONS[cycle.number]?.title}
                  </div>
                  <div className="mt-3 inline-block bg-white border border-gray-100 rounded-lg px-3 py-1 text-xs text-gray-500 font-medium">
                    {cycle.ages} лет
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* ═══════════════════  11. PINNACLES & CHALLENGES  ═══════════════════ */}
        {data.pinnacles && data.pinnacles.length > 0 && (
          <Card className="p-6 sm:p-8">
            <SectionHeading
              icon="Mountain"
              title="Вершины и испытания"
              subtitle="Четыре этапа пути: пиковые возможности и уроки"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {data.pinnacles.map((pc: PinnacleChallenge, i: number) => (
                <div
                  key={i}
                  className="border border-gray-100 rounded-xl p-5 flex flex-col gap-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
                      {pc.period}
                    </span>
                    <span className="text-xs text-gray-400 bg-gray-50 rounded-lg px-2.5 py-1 font-medium">
                      {pc.ages} лет
                    </span>
                  </div>

                  <div className="flex gap-3">
                    {/* pinnacle */}
                    <div className="flex-1 bg-amber-50 border border-amber-100 rounded-lg p-3 text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Icon name="TrendingUp" size={14} className="text-amber-600" />
                        <span className="text-[10px] font-semibold text-amber-600 uppercase tracking-wider">
                          Вершина
                        </span>
                      </div>
                      <div className="font-serif text-2xl font-bold text-amber-700">
                        {pc.pinnacle}
                      </div>
                      <div className="text-[11px] text-gray-500 mt-0.5">
                        {DESCRIPTIONS[pc.pinnacle]?.title}
                      </div>
                    </div>

                    {/* challenge */}
                    <div className="flex-1 bg-gray-50 border border-gray-100 rounded-lg p-3 text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Icon name="Shield" size={14} className="text-gray-500" />
                        <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                          Испытание
                        </span>
                      </div>
                      <div className="font-serif text-2xl font-bold text-gray-700">
                        {pc.challenge}
                      </div>
                      <div className="text-[11px] text-gray-500 mt-0.5">
                        {DESCRIPTIONS[pc.challenge]?.title || "Универсальный урок"}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* ── Footer CTA ── */}
        <div className="text-center pt-4 pb-8 space-y-4">
          <p className="text-sm text-gray-400">
            Расчёт выполнен на основе классической нумерологии Пифагора
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium rounded-xl px-6 py-3 transition-colors"
            >
              <Icon name="RotateCcw" size={16} />
              Новый расчёт
            </Link>
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 font-medium transition-colors"
            >
              <Icon name="ArrowLeft" size={16} />
              На главную
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}