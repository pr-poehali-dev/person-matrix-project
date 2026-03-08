import Icon from "@/components/ui/icon";
import { DESCRIPTIONS } from "@/lib/matrix";
import { MATRIX_LABELS } from "@/lib/child-matrix";
import type { ChildProfile } from "@/lib/child-matrix";
import { Card, SectionHeading, NumberCard } from "./ChildPrimitives";

type ChildHeroProps = {
  profile: ChildProfile;
  name: string;
};

export default function ChildHero({ profile, name }: ChildHeroProps) {
  const displayName = name || "вашего ребёнка";
  const desc = DESCRIPTIONS[profile.lifePath];

  const topQualities = Object.entries(profile.matrix)
    .map(([digit, count]) => ({
      digit: Number(digit),
      count: count as number,
      label: MATRIX_LABELS[Number(digit)] || "",
    }))
    .filter((q) => q.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);

  return (
    <>
      <Card className="relative overflow-hidden p-8 sm:p-10">
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-purple-50 rounded-full opacity-60 pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-36 h-36 bg-[#F4F2FA] rounded-full opacity-50 pointer-events-none" />

        <div className="relative flex flex-col sm:flex-row sm:items-center gap-6">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center shrink-0 mx-auto sm:mx-0">
            <span className="font-golos text-5xl sm:text-6xl font-bold text-purple-700">
              {profile.lifePath}
            </span>
          </div>

          <div className="text-center sm:text-left">
            <p className="text-xs font-semibold text-purple-600 uppercase tracking-widest mb-1">
              Ключевой тип личности
            </p>
            <h2 className="font-golos font-semibold text-3xl sm:text-4xl text-gray-900 mb-1">
              {`Профиль ${displayName}`}
            </h2>
            {desc && (
              <p className="text-gray-500 text-base leading-relaxed">
                {desc.title} — {desc.tagline}
              </p>
            )}
          </div>
        </div>
      </Card>

      <Card className="p-6 sm:p-8">
        <SectionHeading
          icon="Hash"
          title="Ключевые числа"
          subtitle="Психологический портрет ребёнка"
          iconBg="bg-[#F4F2FA]"
          iconColor="text-[#6C5BA7]"
        />
        <div className="grid grid-cols-3 gap-3">
          <NumberCard
            num={profile.lifePath}
            label="Жизненный путь"
            desc={DESCRIPTIONS[profile.lifePath]}
          />
          <NumberCard
            num={profile.character}
            label="Характер"
            desc={DESCRIPTIONS[profile.character]}
          />
          <NumberCard
            num={profile.destiny}
            label="Судьба"
            desc={DESCRIPTIONS[profile.destiny]}
          />
        </div>
      </Card>

      <Card className="p-6 sm:p-8">
        <SectionHeading
          icon="Brain"
          title="Тип мышления"
          subtitle={profile.thinkingType.label}
        />
        <div className="bg-purple-50/60 border border-purple-100 rounded-xl p-5">
          <p className="text-gray-700 text-sm leading-relaxed">
            {profile.thinkingType.description}
          </p>
        </div>
      </Card>

      {topQualities.length > 0 && (
        <Card className="p-6 sm:p-8">
          <SectionHeading
            icon="Zap"
            title="Сильнейшие качества"
            subtitle="Наиболее выраженные качества"
            iconBg="bg-[#F4F2FA]"
            iconColor="text-[#6C5BA7]"
          />
          <div className="grid grid-cols-3 gap-3">
            {topQualities.map((q) => (
              <div
                key={q.digit}
                className="bg-gradient-to-br from-purple-50 to-purple-100/60 border border-purple-100 rounded-xl p-4 text-center"
              >
                <div className="text-2xl font-golos font-bold text-purple-700 mb-1">
                  {q.digit}
                </div>
                <div className="text-xs font-semibold text-purple-600 uppercase tracking-wider">
                  {q.label}
                </div>
                <div className="flex items-center justify-center gap-0.5 mt-2">
                  {Array.from({ length: q.count }).map((_, i) => (
                    <Icon
                      key={i}
                      name="Star"
                      size={12}
                      className="text-[#6C5BA7] fill-[#6C5BA7]"
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl p-6 sm:p-8 text-center text-white">
        <Icon name="Lock" size={28} className="mx-auto mb-3 opacity-80" />
        <h3 className="font-golos font-semibold text-xl sm:text-2xl mb-2">
          Получите полный профиль ребёнка
        </h3>
        <p className="text-purple-100 text-sm max-w-md mx-auto">
          Психологический портрет, индексы развития, карьерные склонности, риски,
          жизненные циклы, совместимость с родителями и рекомендации
        </p>
      </div>
    </>
  );
}