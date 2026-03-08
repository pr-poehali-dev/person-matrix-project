import Icon from "@/components/ui/icon";
import { DESCRIPTIONS } from "@/lib/matrix";
import type { FamilyAnalysis } from "@/lib/family-matrix";
import { Card, SectionHeading, ScoreCircle } from "./FamilyPrimitives";

type FamilyHeroProps = {
  analysis: FamilyAnalysis;
};

export default function FamilyHero({ analysis }: FamilyHeroProps) {
  const { freeSummary, familyType, parent1, parent2, children, balanceIndex } =
    analysis;

  const allMembers = [
    parent1,
    parent2,
    ...children.map((c) => c.member),
  ];

  return (
    <>
      <Card className="relative overflow-hidden p-8 sm:p-10">
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-emerald-50 rounded-full opacity-60 pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-36 h-36 bg-[#F4F2FA] rounded-full opacity-50 pointer-events-none" />
        <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-emerald-100 rounded-full opacity-30 pointer-events-none" />

        <div className="relative flex flex-col sm:flex-row sm:items-center gap-6">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-br from-emerald-100 to-emerald-200 flex items-center justify-center shrink-0 mx-auto sm:mx-0">
            <Icon
              name={familyType.icon}
              size={48}
              className="text-emerald-700"
            />
          </div>

          <div className="text-center sm:text-left">
            <p className="text-xs font-semibold text-emerald-600 uppercase tracking-widest mb-1">
              {freeSummary.familyTypeName}
            </p>
            <h2 className="font-golos font-semibold text-3xl sm:text-4xl text-gray-900 mb-1">
              Анализ вашей семьи
            </h2>
            <p className="text-gray-500 text-base leading-relaxed max-w-lg">
              {freeSummary.shortDescription}
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-6 sm:p-8">
        <SectionHeading
          icon="Activity"
          title="Ключевые показатели"
          subtitle="Общая картина семейной динамики"
        />
        <div className="grid grid-cols-3 gap-4 sm:gap-6">
          <div className="flex flex-col items-center gap-2">
            <ScoreCircle score={freeSummary.harmonyScore} size={90} />
            <span className="text-xs sm:text-sm font-medium text-gray-600 text-center">
              Гармония семьи
            </span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <ScoreCircle score={freeSummary.coupleScore} size={90} />
            <span className="text-xs sm:text-sm font-medium text-gray-600 text-center">
              Совместимость пары
            </span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <ScoreCircle score={balanceIndex} size={90} />
            <span className="text-xs sm:text-sm font-medium text-gray-600 text-center">
              Баланс ролей
            </span>
          </div>
        </div>
      </Card>

      <Card className="p-6 sm:p-8">
        <SectionHeading
          icon={familyType.icon}
          title="Тип вашей семьи"
          subtitle={familyType.name}
        />
        <p className="text-gray-700 text-sm leading-relaxed mb-4">
          {familyType.description}
        </p>
        <div className="bg-emerald-50/60 border border-emerald-100 rounded-xl p-5">
          <div className="flex items-start gap-2.5">
            <Icon
              name="Lightbulb"
              size={18}
              className="text-emerald-600 shrink-0 mt-0.5"
            />
            <p className="text-gray-700 text-sm leading-relaxed">
              {familyType.advice}
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-6 sm:p-8">
        <SectionHeading
          icon="Users"
          title="Члены семьи"
          subtitle="Обзор ролей и жизненных путей"
          iconBg="bg-[#F4F2FA]"
          iconColor="text-[#6C5BA7]"
        />
        <div className="space-y-3">
          {allMembers.map((member, idx) => {
            const desc = DESCRIPTIONS[member.lifePath];
            const primaryRole =
              member.roles.length > 0 ? member.roles[0] : null;

            return (
              <div
                key={idx}
                className="flex items-center gap-4 bg-gray-50 rounded-xl p-4"
              >
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-emerald-100 to-emerald-200 flex items-center justify-center shrink-0">
                  <span className="font-golos text-lg font-bold text-emerald-700">
                    {member.lifePath}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-gray-900">
                      {member.label}
                    </span>
                    {primaryRole && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                        <Icon name={primaryRole.icon} size={11} />
                        {primaryRole.name}
                      </span>
                    )}
                  </div>
                  {desc && (
                    <p className="text-xs text-gray-500 mt-0.5 truncate">
                      {desc.title} — {desc.tagline}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl p-6 sm:p-8 text-center text-white">
        <Icon name="Lock" size={28} className="mx-auto mb-3 opacity-80" />
        <h3 className="font-golos font-semibold text-xl sm:text-2xl mb-2">
          Получите полный анализ семьи
        </h3>
        <p className="text-emerald-100 text-sm max-w-md mx-auto">
          Роли каждого члена, совместимость с детьми, баланс энергий,
          рекомендации по развитию и укреплению отношений
        </p>
      </div>
    </>
  );
}