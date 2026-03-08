import Icon from "@/components/ui/icon";
import type { ChildProfile } from "@/lib/child-matrix";
import { Card, SectionHeading, ProgressBar } from "./ChildPrimitives";

export default function ChildAbilities({ profile }: { profile: ChildProfile }) {
  return (
    <>
      <Card className="p-6 sm:p-8">
        <SectionHeading
          icon="Brain"
          title="Тип мышления"
          subtitle={profile.thinkingType.label}
        />
        <div className="bg-purple-50/60 border border-purple-100 rounded-xl p-5 sm:p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-purple-200 flex items-center justify-center">
              <Icon name="Lightbulb" size={20} className="text-purple-700" />
            </div>
            <div>
              <div className="text-sm font-semibold text-purple-800">
                {profile.thinkingType.label} тип
              </div>
              <div className="text-xs text-purple-500">
                Доминирующий стиль обработки информации
              </div>
            </div>
          </div>
          <p className="text-gray-700 text-[15px] leading-relaxed">
            {profile.thinkingType.description}
          </p>
        </div>
      </Card>

      <Card className="p-6 sm:p-8">
        <SectionHeading
          icon="BookOpen"
          title="Стиль обучения"
          subtitle="Как ребёнок лучше усваивает информацию"
          iconBg="bg-emerald-100"
          iconColor="text-emerald-600"
        />
        <div className="bg-emerald-50/60 border border-emerald-100 rounded-xl p-5 sm:p-6">
          <div className="flex flex-wrap gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-lg px-3 py-1.5">
              <Icon name="Star" size={12} />
              {profile.learningStyle.primary}
            </span>
            <span className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-600 text-xs font-medium rounded-lg px-3 py-1.5">
              {profile.learningStyle.secondary}
            </span>
          </div>
          <p className="text-gray-700 text-[15px] leading-relaxed">
            {profile.learningStyle.description}
          </p>
        </div>
      </Card>

      <Card className="p-6 sm:p-8">
        <SectionHeading
          icon="Briefcase"
          title="Карьерные склонности"
          subtitle="Направления с наибольшим потенциалом"
          iconBg="bg-indigo-100"
          iconColor="text-indigo-600"
        />
        <div className="space-y-3">
          {profile.careers.slice(0, 8).map((career) => (
            <div
              key={career.title}
              className="flex items-center gap-3 bg-gray-50/80 border border-gray-100 rounded-xl p-3.5"
            >
              <div className="w-9 h-9 rounded-lg bg-indigo-100 flex items-center justify-center shrink-0">
                <Icon name={career.icon} size={18} className="text-indigo-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-800 mb-1">
                  {career.title}
                </div>
                <ProgressBar value={career.score} color="indigo" />
              </div>
              <span className="text-sm font-semibold text-gray-600 shrink-0">
                {career.score}%
              </span>
            </div>
          ))}
        </div>
      </Card>

      {profile.risks.length > 0 && (
        <Card className="p-6 sm:p-8">
          <SectionHeading
            icon="AlertTriangle"
            title="Зоны риска"
            subtitle="Области, требующие внимания"
            iconBg="bg-rose-100"
            iconColor="text-rose-600"
          />
          <div className="space-y-3">
            {profile.risks.map((risk) => (
              <div
                key={risk.digit}
                className="bg-rose-50/50 border border-rose-100 rounded-xl p-4"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 rounded-lg bg-rose-200 flex items-center justify-center">
                    <span className="text-xs font-bold text-rose-700">
                      {risk.digit}
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-rose-800">
                    {risk.label}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  {risk.description}
                </p>
                <div className="flex items-start gap-2 bg-white/80 rounded-lg p-3">
                  <Icon
                    name="Lightbulb"
                    size={14}
                    className="text-[#6C5BA7] shrink-0 mt-0.5"
                  />
                  <span className="text-sm text-gray-700">{risk.tip}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </>
  );
}