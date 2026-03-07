import { DESCRIPTIONS } from "@/lib/matrix";
import type { PersonDescription } from "@/lib/matrix";
import { Card, SectionHeading, NumberCard } from "./ChildPrimitives";

type ChildResult = {
  lifePath: number;
  character: number;
  destiny: number;
  soulUrge: number;
  desc: PersonDescription;
  name: string;
};

type ChildHeroProps = {
  result: ChildResult;
};

export default function ChildHero({ result }: ChildHeroProps) {
  const displayName = result.name || "вашего ребёнка";

  return (
    <>
      <Card className="relative overflow-hidden p-8 sm:p-10">
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-purple-50 rounded-full opacity-60 pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-36 h-36 bg-amber-50 rounded-full opacity-50 pointer-events-none" />

        <div className="relative flex flex-col sm:flex-row sm:items-center gap-6">
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
    </>
  );
}
