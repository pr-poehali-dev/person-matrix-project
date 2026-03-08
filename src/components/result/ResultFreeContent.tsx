import Icon from "@/components/ui/icon";
import { DESCRIPTIONS } from "@/lib/matrix";
import type { PersonDescription, LifeCycle, PinnacleChallenge } from "@/lib/matrix";
import { Card, SectionHeading, NumberBadge, formatDate } from "./ResultPrimitives";

type ResultData = {
  lifePath: number;
  character: number;
  destiny: number;
  soulUrge: number;
  maturity: number;
  personalYear: number;
  lifeCycles: LifeCycle[];
  pinnacles: PinnacleChallenge[];
};

type ResultFreeContentProps = {
  data: ResultData;
  date: string;
  desc: PersonDescription | undefined;
};

export default function ResultFreeContent({ data, date, desc }: ResultFreeContentProps) {
  return (
    <>
      {/* 1. HERO */}
      <Card className="relative overflow-hidden p-8 sm:p-10">
        <div className="absolute -top-20 -right-20 w-56 h-56 bg-[#F4F2FA] rounded-full opacity-60 pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-[#F4F2FA] rounded-full opacity-40 pointer-events-none" />

        <div className="relative flex flex-col sm:flex-row sm:items-center gap-6">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-br from-[#F4F2FA] to-[#E8E4F5] flex items-center justify-center shrink-0 mx-auto sm:mx-0">
            <span className="font-golos text-5xl sm:text-6xl font-bold text-[#6C5BA7]">
              {data.lifePath}
            </span>
          </div>

          <div className="text-center sm:text-left">
            <p className="text-xs font-semibold text-[#6C5BA7] uppercase tracking-widest mb-1">
              Ключевой тип личности
            </p>
            <h1 className="font-golos font-semibold text-3xl sm:text-4xl text-gray-900 mb-1">
              {desc?.title || `Число ${data.lifePath}`}
            </h1>
            <p className="text-gray-500 text-base leading-relaxed">
              {desc?.tagline}
            </p>
            <p className="text-gray-400 text-sm mt-3">
              Дата анализа: <span className="text-gray-600 font-medium">{formatDate(date)}</span>
            </p>
          </div>
        </div>
      </Card>

      {/* 2. NUMBERS GRID */}
      <Card className="p-6 sm:p-8">
        <SectionHeading
          icon="Hash"
          title="Ваши ключевые числа"
          subtitle="Пять ключевых аспектов вашей личности"
        />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          <NumberBadge num={data.lifePath} label="Жизненный путь" desc={DESCRIPTIONS[data.lifePath]} />
          <NumberBadge num={data.character} label="Характер" desc={DESCRIPTIONS[data.character]} />
          <NumberBadge num={data.destiny} label="Судьба" desc={DESCRIPTIONS[data.destiny]} />
          <NumberBadge num={data.soulUrge} label="Душа" desc={DESCRIPTIONS[data.soulUrge]} />
          <NumberBadge num={data.maturity} label="Зрелость" desc={DESCRIPTIONS[data.maturity]} />
        </div>
      </Card>

      {/* 3. CHARACTER */}
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

      {/* 4. STRENGTHS & CHALLENGES */}
      {desc && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="font-golos font-semibold text-lg text-gray-900 mb-4 flex items-center gap-2">
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

          <Card className="p-6">
            <h3 className="font-golos font-semibold text-lg text-gray-900 mb-4 flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#F4F2FA] flex items-center justify-center">
                <Icon name="ArrowUpRight" size={16} className="text-[#6C5BA7]" />
              </div>
              Зоны роста
            </h3>
            <ul className="space-y-2.5">
              {desc.challenges.map((c, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <Icon
                    name="ArrowUpRight"
                    size={18}
                    className="text-[#6C5BA7] shrink-0 mt-0.5"
                  />
                  <span className="text-sm text-gray-700">{c}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      )}

      {/* 5. CAREER */}
      {desc && (
        <Card className="p-6 sm:p-8">
          <SectionHeading
            icon="Briefcase"
            title="Карьера и призвание"
            subtitle="Профессиональная реализация вашего типа личности"
          />
          <p className="text-gray-700 leading-relaxed text-[15px]">
            {desc.career}
          </p>
        </Card>
      )}

      {/* 6. RELATIONSHIPS */}
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
    </>
  );
}