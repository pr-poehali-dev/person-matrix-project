import Icon from "@/components/ui/icon";
import { DESCRIPTIONS } from "@/lib/matrix";
import type { FamilyAnalysis, FamilyMember, ChildFamilyProfile } from "@/lib/family-matrix";
import { Card, SectionHeading, ScoreCircle, ScoreBar, ProgressBar } from "./FamilyPrimitives";
import { getToken } from "@/lib/auth";

type FamilyPaidContentProps = {
  analysis: FamilyAnalysis;
  purchased: boolean;
  balance: number;
  spending: boolean;
  onBuy: () => void;
  onReset: () => void;
  onNavigateAuth: () => void;
};

const PRICE = 1990;

function MemberIndices({ member }: { member: FamilyMember }) {
  return (
    <div className="space-y-3">
      {[
        { label: "Лидерство", value: member.leaderIndex, icon: "Crown", color: "amber" },
        { label: "Эмоции", value: member.emotionIndex, icon: "Heart", color: "rose" },
        { label: "Интеллект", value: member.mindIndex, icon: "Brain", color: "sky" },
        { label: "Энергия", value: member.energyIndex, icon: "Zap", color: "emerald" },
      ].map((idx) => (
        <div key={idx.label} className="space-y-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon name={idx.icon} size={14} className="text-gray-400" />
              <span className="text-xs font-medium text-gray-600">
                {idx.label}
              </span>
            </div>
            <span className="text-xs font-semibold text-gray-800">
              {idx.value}%
            </span>
          </div>
          <ProgressBar value={idx.value} color={idx.color} />
        </div>
      ))}
    </div>
  );
}

function MemberCard({ member }: { member: FamilyMember }) {
  const desc = DESCRIPTIONS[member.lifePath];
  return (
    <div className="bg-gray-50 border border-gray-100 rounded-xl p-5">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-emerald-100 to-emerald-200 flex items-center justify-center shrink-0">
          <span className="font-serif text-lg font-bold text-emerald-700">
            {member.lifePath}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-gray-900">
            {member.label}
          </div>
          {desc && (
            <div className="text-xs text-gray-500">
              {desc.title} — {desc.tagline}
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {member.roles.map((role, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full"
          >
            <Icon name={role.icon} size={12} />
            {role.name}
          </span>
        ))}
      </div>

      <MemberIndices member={member} />

      <div className="grid grid-cols-4 gap-2 mt-4">
        <div className="bg-white border border-gray-100 rounded-lg p-2 text-center">
          <div className="text-lg font-serif font-bold text-amber-700">
            {member.lifePath}
          </div>
          <div className="text-[9px] text-gray-400 uppercase tracking-wider">
            Путь
          </div>
        </div>
        <div className="bg-white border border-gray-100 rounded-lg p-2 text-center">
          <div className="text-lg font-serif font-bold text-amber-700">
            {member.character}
          </div>
          <div className="text-[9px] text-gray-400 uppercase tracking-wider">
            Характер
          </div>
        </div>
        <div className="bg-white border border-gray-100 rounded-lg p-2 text-center">
          <div className="text-lg font-serif font-bold text-amber-700">
            {member.destiny}
          </div>
          <div className="text-[9px] text-gray-400 uppercase tracking-wider">
            Судьба
          </div>
        </div>
        <div className="bg-white border border-gray-100 rounded-lg p-2 text-center">
          <div className="text-lg font-serif font-bold text-amber-700">
            {member.soulUrge}
          </div>
          <div className="text-[9px] text-gray-400 uppercase tracking-wider">
            Душа
          </div>
        </div>
      </div>
    </div>
  );
}

function ChildInfluenceCard({ child, parent1Label, parent2Label }: { child: ChildFamilyProfile; parent1Label: string; parent2Label: string }) {
  return (
    <div className="bg-gray-50 border border-gray-100 rounded-xl p-5">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center shrink-0">
          <span className="font-serif text-base font-bold text-amber-700">
            {child.member.lifePath}
          </span>
        </div>
        <div>
          <div className="text-sm font-semibold text-gray-900">
            {child.member.label}
          </div>
          <div className="text-xs text-gray-500">
            Роль в семье: {child.roleInFamily}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <ScoreBar
          label={`Совместимость с ${parent1Label}`}
          score={child.compatWithParent1}
        />
        <ScoreBar
          label={`Совместимость с ${parent2Label}`}
          score={child.compatWithParent2}
        />
        <ScoreBar label="Влияние родителей" score={child.parentInfluence} />
        <ScoreBar label="Индекс поддержки" score={child.supportIndex} />
      </div>
    </div>
  );
}

export default function FamilyPaidContent({
  analysis,
  purchased,
  balance,
  spending,
  onBuy,
  onReset,
  onNavigateAuth,
}: FamilyPaidContentProps) {
  const {
    parent1,
    parent2,
    children,
    coupleCompatibility,
    balanceIndex,
    familyType,
    harmonyIndex,
    conflictIndex,
    growthPotential,
    avgLeadership,
    avgEmotion,
    avgMind,
    strengths,
    challenges,
    recommendations,
  } = analysis;

  const hasChildren = children.length > 0;
  const compat = coupleCompatibility;

  if (!purchased) {
    return (
      <>
        <Card className="p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
            <Icon name="Lock" size={24} className="text-amber-600" />
          </div>
          <h3 className="font-serif text-2xl text-gray-900 mb-2">
            Полный анализ семьи
          </h3>
          <p className="text-sm text-gray-500 mb-5 max-w-md mx-auto">
            Получите детальный разбор семейной динамики, совместимость каждого
            члена семьи, роли, энергии и персональные рекомендации
          </p>

          <div className="max-w-sm mx-auto mb-6">
            <div className="space-y-2.5">
              {[
                "Роли каждого члена семьи с описанием",
                "Детальная совместимость родителей",
                "Влияние родителей на каждого ребёнка",
                "Эмоциональная атмосфера и баланс ролей",
                "Анализ конфликтов и потенциал семьи",
                "Персональные рекомендации по развитию",
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <Icon
                    name="CheckCircle"
                    size={16}
                    className="text-emerald-500 shrink-0"
                  />
                  <span className="text-sm text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="text-3xl font-serif font-bold text-amber-700 mb-4">
            {PRICE.toLocaleString("ru-RU")} ₽
          </div>

          {getToken() ? (
            <div>
              <button
                onClick={onBuy}
                disabled={spending}
                className="px-8 py-3.5 rounded-xl text-sm font-semibold text-white transition-all shadow-md"
                style={{
                  background: spending
                    ? "#d1d5db"
                    : "linear-gradient(135deg, #059669, #10b981, #34d399)",
                }}
              >
                {spending
                  ? "Оплата..."
                  : balance >= PRICE
                    ? "Оплатить с баланса"
                    : `Пополнить баланс (${balance} ₽)`}
              </button>
              {balance < PRICE && (
                <p className="text-xs text-gray-400 mt-2">
                  На балансе {balance} ₽, нужно {PRICE.toLocaleString("ru-RU")} ₽
                </p>
              )}
            </div>
          ) : (
            <button
              onClick={onNavigateAuth}
              className="px-8 py-3.5 rounded-xl text-sm font-semibold text-white shadow-md"
              style={{
                background: "linear-gradient(135deg, #059669, #10b981, #34d399)",
              }}
            >
              Войти для покупки
            </button>
          )}
        </Card>

        <div className="text-center pt-2 pb-8">
          <button
            onClick={onReset}
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 font-medium transition-colors"
          >
            <Icon name="RotateCcw" size={16} />
            Новый расчёт
          </button>
        </div>
      </>
    );
  }

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
          iconBg="bg-amber-100"
          iconColor="text-amber-600"
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
                Кармическая связь
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
          <div className="bg-amber-50/60 border border-amber-100 rounded-xl p-3 text-center">
            <div className="text-2xl font-serif font-bold text-amber-700">
              {avgLeadership}%
            </div>
            <div className="text-[10px] text-gray-500 uppercase tracking-wider mt-0.5">
              Лидерство
            </div>
          </div>
          <div className="bg-rose-50/60 border border-rose-100 rounded-xl p-3 text-center">
            <div className="text-2xl font-serif font-bold text-rose-700">
              {avgEmotion}%
            </div>
            <div className="text-[10px] text-gray-500 uppercase tracking-wider mt-0.5">
              Эмоции
            </div>
          </div>
          <div className="bg-sky-50/60 border border-sky-100 rounded-xl p-3 text-center">
            <div className="text-2xl font-serif font-bold text-sky-700">
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
          iconBg="bg-amber-100"
          iconColor="text-amber-600"
        />

        <div className="flex items-center gap-4 mb-5 bg-amber-50/60 border border-amber-100 rounded-xl p-4">
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
              <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center shrink-0 mt-0.5">
                <Icon name="AlertTriangle" size={12} className="text-amber-600" />
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
          Расчёт выполнен на основе классической нумерологии Пифагора
        </p>
        <button
          onClick={onReset}
          className="inline-flex items-center gap-2 border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-xl px-6 py-3 transition-colors"
        >
          <Icon name="RotateCcw" size={16} />
          Новый расчёт
        </button>
      </div>
    </>
  );
}