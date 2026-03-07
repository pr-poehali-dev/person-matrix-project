import Icon from "@/components/ui/icon";
import { DESCRIPTIONS } from "@/lib/matrix";
import { MATRIX_LABELS } from "@/lib/child-matrix";
import type { ChildProfile } from "@/lib/child-matrix";
import { Card, SectionHeading, NumberCard, ProgressBar } from "./ChildPrimitives";

export default function ChildAnalysisCore({ profile }: { profile: ChildProfile }) {
  return (
    <>
      <Card className="p-6 sm:p-8">
        <SectionHeading
          icon="Hash"
          title="Все числа профиля"
          subtitle="6 ключевых нумерологических показателей"
          iconBg="bg-amber-100"
          iconColor="text-amber-600"
        />
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <NumberCard num={profile.lifePath} label="Жизненный путь" desc={DESCRIPTIONS[profile.lifePath]} />
          <NumberCard num={profile.character} label="Характер" desc={DESCRIPTIONS[profile.character]} />
          <NumberCard num={profile.destiny} label="Судьба" desc={DESCRIPTIONS[profile.destiny]} />
          <NumberCard num={profile.talent} label="Талант" desc={DESCRIPTIONS[profile.talent]} />
          <NumberCard num={profile.thinking} label="Мышление" desc={DESCRIPTIONS[profile.thinking]} />
          <NumberCard num={profile.energy} label="Энергия" />
        </div>
      </Card>

      <Card className="p-6 sm:p-8">
        <SectionHeading
          icon="Grid3x3"
          title="Матрица Пифагора"
          subtitle="Распределение энергий по 9 аспектам"
        />
        <div className="grid grid-cols-3 gap-2 sm:gap-3 max-w-md mx-auto">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((d) => {
            const count = profile.matrix[d] || 0;
            const filled = count > 0;
            return (
              <div
                key={d}
                className={`rounded-xl p-3 sm:p-4 text-center border ${
                  filled
                    ? "bg-purple-50/80 border-purple-100"
                    : "bg-gray-50 border-gray-100"
                }`}
              >
                <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
                  {MATRIX_LABELS[d]}
                </div>
                <div
                  className={`text-xl sm:text-2xl font-serif font-bold ${
                    filled ? "text-purple-700" : "text-gray-300"
                  }`}
                >
                  {count > 0 ? String(d).repeat(count) : "-"}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <Card className="p-6 sm:p-8">
        <SectionHeading
          icon="BarChart3"
          title="Индексы развития"
          subtitle="Количественная оценка потенциала"
          iconBg="bg-sky-100"
          iconColor="text-sky-600"
        />
        <div className="space-y-4">
          {[
            { label: "Энергия", value: profile.energyIndex, color: "amber", icon: "Zap" },
            { label: "Интеллект", value: profile.mindIndex, color: "sky", icon: "Brain" },
            { label: "Эмоции", value: profile.emotionIndex, color: "rose", icon: "Heart" },
            { label: "Лидерство", value: profile.leaderIndex, color: "purple", icon: "Crown" },
          ].map((idx) => (
            <div key={idx.label} className="space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon name={idx.icon} size={16} className="text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">
                    {idx.label}
                  </span>
                </div>
                <span className="text-sm font-semibold text-gray-900">
                  {idx.value}%
                </span>
              </div>
              <ProgressBar value={idx.value} color={idx.color} />
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}
