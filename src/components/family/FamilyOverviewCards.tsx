import Icon from "@/components/ui/icon";
import type { FamilyAnalysis } from "@/lib/family-matrix";
import { Card, SectionHeading, ScoreCircle, ScoreBar } from "./FamilyPrimitives";
import { MemberCard, ChildInfluenceCard } from "./FamilyMemberCards";

type FamilyOverviewCardsProps = {
  analysis: FamilyAnalysis;
};

export default function FamilyOverviewCards({ analysis }: FamilyOverviewCardsProps) {
  const {
    parent1,
    parent2,
    children,
    coupleCompatibility,
    familyType,
    harmonyIndex,
    conflictIndex,
    growthPotential,
  } = analysis;

  const hasChildren = children.length > 0;
  const compat = coupleCompatibility;

  return (
    <>
      <Card className="p-6 sm:p-8">
        <SectionHeading
          icon="LayoutGrid"
          title="Общая карта семьи"
          subtitle="Состав, тип и ключевые показатели"
        />

        <div className="bg-emerald-50/60 border border-emerald-100 rounded-xl p-5 mb-5">
          <div className="flex items-center gap-3 mb-2">
            <Icon
              name={familyType.icon}
              size={20}
              className="text-emerald-600"
            />
            <span className="text-sm font-semibold text-emerald-800">
              {familyType.name}
            </span>
          </div>
          <p className="text-sm text-gray-700 leading-relaxed">
            {familyType.description}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="flex flex-col items-center gap-2 bg-gray-50 border border-gray-100 rounded-xl p-4">
            <ScoreCircle score={harmonyIndex} size={72} />
            <span className="text-xs font-medium text-gray-600 text-center">
              Гармония
            </span>
          </div>
          <div className="flex flex-col items-center gap-2 bg-gray-50 border border-gray-100 rounded-xl p-4">
            <ScoreCircle score={conflictIndex} size={72} />
            <span className="text-xs font-medium text-gray-600 text-center">
              Конфликтность
            </span>
          </div>
          <div className="flex flex-col items-center gap-2 bg-gray-50 border border-gray-100 rounded-xl p-4">
            <ScoreCircle score={growthPotential} size={72} />
            <span className="text-xs font-medium text-gray-600 text-center">
              Потенциал роста
            </span>
          </div>
        </div>
      </Card>

      <Card className="p-6 sm:p-8">
        <SectionHeading
          icon="Users"
          title="Роли каждого члена семьи"
          subtitle="Индексы, числа и распределение ролей"
          iconBg="bg-[#F4F2FA]"
          iconColor="text-[#6C5BA7]"
        />
        <div className="space-y-4">
          <MemberCard member={parent1} />
          <MemberCard member={parent2} />
          {children.map((child, i) => (
            <MemberCard key={i} member={child.member} />
          ))}
        </div>
      </Card>

      <Card className="p-6 sm:p-8">
        <SectionHeading
          icon="Heart"
          title="Совместимость родителей"
          subtitle={compat.pairArchetype}
          iconBg="bg-rose-100"
          iconColor="text-rose-600"
        />

        <div className="flex flex-col items-center mb-6">
          <ScoreCircle score={compat.overallIndex} size={110} />
          <div className="mt-3 text-center">
            <div className="text-sm font-semibold text-gray-900">
              {compat.unionType.name}
            </div>
            <p className="text-xs text-gray-500 mt-1 max-w-sm">
              {compat.unionType.description}
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <ScoreBar label="Эмоциональная связь" score={compat.scores.emotional} />
          <ScoreBar label="Общие ценности" score={compat.scores.values} />
          <ScoreBar label="Финансовая совместимость" score={compat.scores.financial} />
          <ScoreBar label="Интеллектуальная связь" score={compat.scores.intellectual} />
          <ScoreBar label="Интимная совместимость" score={compat.scores.intimacy} />
          <ScoreBar label="Семейный потенциал" score={compat.scores.family} />
        </div>

        {compat.karmic.isKarmic && (
          <div className="mt-5 bg-indigo-50/60 border border-indigo-100 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="Sparkles" size={16} className="text-indigo-600" />
              <span className="text-sm font-semibold text-indigo-800">
                Глубинная связь
              </span>
            </div>
            <ul className="space-y-1">
              {compat.karmic.reasons.map((reason, i) => (
                <li key={i} className="text-xs text-gray-600 flex items-start gap-2">
                  <Icon
                    name="Star"
                    size={12}
                    className="text-indigo-400 shrink-0 mt-0.5"
                  />
                  {reason}
                </li>
              ))}
            </ul>
          </div>
        )}
      </Card>

      {hasChildren && (
        <Card className="p-6 sm:p-8">
          <SectionHeading
            icon="Baby"
            title="Влияние родителей на детей"
            subtitle="Совместимость и поддержка каждого ребёнка"
            iconBg="bg-sky-100"
            iconColor="text-sky-600"
          />
          <div className="space-y-4">
            {children.map((child, i) => (
              <ChildInfluenceCard
                key={i}
                child={child}
                parent1Label="Партнёром 1"
                parent2Label="Партнёром 2"
              />
            ))}
          </div>
        </Card>
      )}

      {hasChildren && (
        <Card className="p-6 sm:p-8">
          <SectionHeading
            icon="GitCompare"
            title="Совместимость каждого ребёнка с родителями"
            subtitle="Визуальное сравнение связей"
            iconBg="bg-purple-100"
            iconColor="text-purple-600"
          />
          <div className="space-y-5">
            {children.map((child, i) => (
              <div
                key={i}
                className="bg-gray-50 border border-gray-100 rounded-xl p-5"
              >
                <div className="text-sm font-semibold text-gray-900 mb-4 text-center">
                  {child.member.label}
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex flex-col items-center gap-2">
                    <ScoreCircle score={child.compatWithParent1} size={72} />
                    <span className="text-xs font-medium text-gray-500 text-center">
                      Партнёр 1
                    </span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <ScoreCircle score={child.compatWithParent2} size={72} />
                    <span className="text-xs font-medium text-gray-500 text-center">
                      Партнёр 2
                    </span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <ScoreCircle score={child.supportIndex} size={72} />
                    <span className="text-xs font-medium text-gray-500 text-center">
                      Поддержка
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </>
  );
}
