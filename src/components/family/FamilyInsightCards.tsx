import Icon from "@/components/ui/icon";
import type { FamilyAnalysis } from "@/lib/family-matrix";
import { Card, SectionHeading, ScoreCircle, ScoreBar } from "./FamilyPrimitives";

type FamilyInsightCardsProps = {
  analysis: FamilyAnalysis;
  onReset: () => void;
};

export default function FamilyInsightCards({ analysis, onReset }: FamilyInsightCardsProps) {
  const {
    parent1,
    parent2,
    children,
    balanceIndex,
    avgLeadership,
    avgEmotion,
    avgMind,
    conflictIndex,
    growthPotential,
    strengths,
    challenges,
    recommendations,
  } = analysis;

  return (
    <>
      <Card className="p-6 sm:p-8">
        <SectionHeading
          icon="Smile"
          title="Эмоциональная атмосфера семьи"
          subtitle="Средний эмоциональный фон и вклад каждого"
          iconBg="bg-rose-100"
          iconColor="text-rose-600"
        />

        <div className="flex flex-col items-center mb-6">
          <ScoreCircle score={avgEmotion} size={90} />
          <span className="text-xs font-medium text-gray-500 mt-2">
            Средний эмоциональный индекс семьи
          </span>
        </div>

        <div className="space-y-3">
          <ScoreBar label={parent1.label} score={parent1.emotionIndex} />
          <ScoreBar label={parent2.label} score={parent2.emotionIndex} />
          {children.map((child, i) => (
            <ScoreBar
              key={i}
              label={child.member.label}
              score={child.member.emotionIndex}
            />
          ))}
        </div>
      </Card>

      <Card className="p-6 sm:p-8">
        <SectionHeading
          icon="Scale"
          title="Баланс ролей"
          subtitle="Распределение лидерства, эмоций и интеллекта"
          iconBg="bg-indigo-100"
          iconColor="text-indigo-600"
        />

        <div className="flex flex-col items-center mb-6">
          <ScoreCircle score={balanceIndex} size={90} />
          <span className="text-xs font-medium text-gray-500 mt-2">
            Индекс баланса семьи
          </span>
        </div>

        <div className="space-y-3">
          <ScoreBar label="Среднее лидерство" score={avgLeadership} />
          <ScoreBar label="Средние эмоции" score={avgEmotion} />
          <ScoreBar label="Средний интеллект" score={avgMind} />
        </div>

        <div className="mt-5 grid grid-cols-3 gap-3">
          <div className="bg-[#F4F2FA]/60 border border-[#E8E4F5] rounded-xl p-3 text-center">
            <div className="text-2xl font-golos font-bold text-[#6C5BA7]">
              {avgLeadership}%
            </div>
            <div className="text-[10px] text-gray-500 uppercase tracking-wider mt-0.5">
              Лидерство
            </div>
          </div>
          <div className="bg-rose-50/60 border border-rose-100 rounded-xl p-3 text-center">
            <div className="text-2xl font-golos font-bold text-rose-700">
              {avgEmotion}%
            </div>
            <div className="text-[10px] text-gray-500 uppercase tracking-wider mt-0.5">
              Эмоции
            </div>
          </div>
          <div className="bg-sky-50/60 border border-sky-100 rounded-xl p-3 text-center">
            <div className="text-2xl font-golos font-bold text-sky-700">
              {avgMind}%
            </div>
            <div className="text-[10px] text-gray-500 uppercase tracking-wider mt-0.5">
              Интеллект
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6 sm:p-8">
        <SectionHeading
          icon="AlertTriangle"
          title="Возможные конфликты"
          subtitle="Зоны напряжения и точки роста"
          iconBg="bg-[#F4F2FA]"
          iconColor="text-[#6C5BA7]"
        />

        <div className="flex items-center gap-4 mb-5 bg-[#F4F2FA]/60 border border-[#E8E4F5] rounded-xl p-4">
          <ScoreCircle score={conflictIndex} size={72} />
          <div>
            <div className="text-sm font-semibold text-gray-900">
              Индекс конфликтности: {conflictIndex}%
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              {conflictIndex >= 60
                ? "Высокий уровень — необходима осознанная работа над отношениями"
                : conflictIndex >= 35
                  ? "Средний уровень — есть точки напряжения, но они управляемы"
                  : "Низкий уровень — семья обладает хорошей устойчивостью"}
            </p>
          </div>
        </div>

        <div className="space-y-2.5">
          {challenges.map((item, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-[#F4F2FA] flex items-center justify-center shrink-0 mt-0.5">
                <Icon name="AlertTriangle" size={12} className="text-[#6C5BA7]" />
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">{item}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6 sm:p-8">
        <SectionHeading
          icon="Rocket"
          title="Потенциал семьи"
          subtitle="Сильные стороны и возможности роста"
          iconBg="bg-emerald-100"
          iconColor="text-emerald-600"
        />

        <div className="flex items-center gap-4 mb-5 bg-emerald-50/60 border border-emerald-100 rounded-xl p-4">
          <ScoreCircle score={growthPotential} size={72} />
          <div>
            <div className="text-sm font-semibold text-gray-900">
              Потенциал роста: {growthPotential}%
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              {growthPotential >= 70
                ? "Высокий потенциал — семья способна на значительные достижения"
                : growthPotential >= 40
                  ? "Хороший потенциал — есть ресурсы для развития во многих направлениях"
                  : "Есть потенциал — сосредоточьтесь на укреплении базовых связей"}
            </p>
          </div>
        </div>

        <div className="space-y-2.5">
          {strengths.map((item, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                <Icon name="CheckCircle" size={12} className="text-emerald-600" />
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">{item}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6 sm:p-8">
        <SectionHeading
          icon="Lightbulb"
          title="Рекомендации по развитию семьи"
          subtitle="Практические советы для укрепления связей"
          iconBg="bg-emerald-100"
          iconColor="text-emerald-600"
        />
        <div className="space-y-3">
          {recommendations.map((item, i) => (
            <div
              key={i}
              className="bg-emerald-50/60 border border-emerald-100 rounded-xl p-4 flex items-start gap-3"
            >
              <Icon
                name="Lightbulb"
                size={16}
                className="text-emerald-600 shrink-0 mt-0.5"
              />
              <p className="text-sm text-gray-700 leading-relaxed">{item}</p>
            </div>
          ))}
        </div>
      </Card>

      <div className="text-center pt-4 pb-8 space-y-4">
        <p className="text-sm text-gray-400">
          Результаты основаны на психологическом анализе личности
        </p>
        <button
          onClick={onReset}
          className="inline-flex items-center gap-2 border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-xl px-6 py-3 transition-colors"
        >
          <Icon name="RotateCcw" size={16} />
          Новый анализ
        </button>
      </div>
    </>
  );
}