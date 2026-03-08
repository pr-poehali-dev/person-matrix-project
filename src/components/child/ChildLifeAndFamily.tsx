import Icon from "@/components/ui/icon";
import type { PersonDescription } from "@/lib/matrix";
import type { ChildProfile } from "@/lib/child-matrix";
import { Card, SectionHeading, ProgressBar, TALENT_STYLES } from "./ChildPrimitives";

type ChildLifeAndFamilyProps = {
  profile: ChildProfile;
  desc: PersonDescription | undefined;
  name: string;
  pdfLoading: boolean;
  onDownloadPdf: () => void;
};

export default function ChildLifeAndFamily({
  profile,
  desc,
  name,
  pdfLoading,
  onDownloadPdf,
}: ChildLifeAndFamilyProps) {
  return (
    <>
      <Card className="p-6 sm:p-8">
        <SectionHeading
          icon="TrendingUp"
          title="Индексы потенциала"
          subtitle="Обучаемость, успешность и будущее"
          iconBg="bg-[#F4F2FA]"
          iconColor="text-[#6C5BA7]"
        />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { label: "Обучаемость", value: profile.learningIndex, icon: "GraduationCap", color: "emerald" },
            { label: "Успешность", value: profile.successIndex, icon: "Trophy", color: "purple" },
            { label: "Будущий потенциал", value: profile.futureIndex, icon: "Rocket", color: "purple" },
          ].map((idx) => {
            const colorMap: Record<string, { bg: string; text: string; bar: string }> = {
              emerald: { bg: "bg-emerald-100", text: "text-emerald-700", bar: "emerald" },
              purple: { bg: "bg-purple-100", text: "text-purple-700", bar: "purple" },
            };
            const c = colorMap[idx.color] || colorMap.purple;
            return (
              <div
                key={idx.label}
                className="bg-gray-50/80 border border-gray-100 rounded-xl p-4 text-center"
              >
                <div className={`w-10 h-10 rounded-xl ${c.bg} flex items-center justify-center mx-auto mb-2`}>
                  <Icon name={idx.icon} size={20} className={c.text} />
                </div>
                <div className="text-2xl font-golos font-bold text-gray-900 mb-1">
                  {idx.value}%
                </div>
                <div className="text-xs font-medium text-gray-500 mb-2">
                  {idx.label}
                </div>
                <ProgressBar value={idx.value} color={idx.color} />
              </div>
            );
          })}
        </div>
      </Card>

      <Card className="p-6 sm:p-8">
        <SectionHeading
          icon="Clock"
          title="Жизненные циклы"
          subtitle="Три ключевых периода развития"
          iconBg="bg-sky-100"
          iconColor="text-sky-600"
        />
        <div className="space-y-3">
          {profile.lifeCycles.map((cycle, i) => (
            <div
              key={i}
              className="flex items-start gap-4 bg-gray-50/80 border border-gray-100 rounded-xl p-4"
            >
              <div className="w-12 h-12 rounded-xl bg-sky-100 flex items-center justify-center shrink-0">
                <span className="text-lg font-golos font-bold text-sky-700">
                  {cycle.number}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold text-gray-800">
                    {cycle.period}
                  </span>
                  <span className="text-xs text-gray-400 bg-gray-100 rounded px-2 py-0.5">
                    {cycle.ages}
                  </span>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {cycle.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6 sm:p-8">
        <SectionHeading
          icon="CalendarCheck"
          title="Переломный возраст"
          subtitle="Ключевой рубеж трансформации"
          iconBg="bg-[#F4F2FA]"
          iconColor="text-[#6C5BA7]"
        />
        <div className="bg-[#F4F2FA]/60 border border-[#E8E4F5] rounded-xl p-5 sm:p-6 text-center">
          <div className="text-4xl font-golos font-bold text-[#6C5BA7] mb-2">
            {profile.turningAge} лет
          </div>
          <p className="text-sm text-gray-600 max-w-md mx-auto">
            В этом возрасте ребёнок пройдёт через значимую трансформацию.
            Это период переосмысления, смены приоритетов и выхода на новый
            уровень самосознания.
          </p>
        </div>
      </Card>

      {profile.parentCompat &&
        (profile.parentCompat.motherScore !== null ||
          profile.parentCompat.fatherScore !== null) && (
          <Card className="p-6 sm:p-8">
            <SectionHeading
              icon="Users"
              title="Совместимость с родителями"
              subtitle="Психологическая связь в семье"
              iconBg="bg-rose-100"
              iconColor="text-rose-600"
            />
            <div className="space-y-4">
              <div className="bg-purple-50/60 border border-purple-100 rounded-xl p-4 text-center">
                <div className="text-xs font-semibold text-purple-500 uppercase tracking-wider mb-1">
                  Семейный баланс
                </div>
                <div className="text-3xl font-golos font-bold text-purple-700 mb-2">
                  {profile.parentCompat.familyBalance}%
                </div>
                <ProgressBar
                  value={profile.parentCompat.familyBalance}
                  color="purple"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {profile.parentCompat.motherScore !== null && (
                  <div className="bg-rose-50/50 border border-rose-100 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon
                        name="Heart"
                        size={16}
                        className="text-rose-500"
                      />
                      <span className="text-sm font-semibold text-gray-800">
                        Мама
                      </span>
                      <span className="ml-auto text-sm font-bold text-rose-600">
                        {profile.parentCompat.motherScore}%
                      </span>
                    </div>
                    <ProgressBar
                      value={profile.parentCompat.motherScore}
                      color="rose"
                    />
                    {profile.parentCompat.motherInsight && (
                      <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                        {profile.parentCompat.motherInsight}
                      </p>
                    )}
                  </div>
                )}

                {profile.parentCompat.fatherScore !== null && (
                  <div className="bg-sky-50/50 border border-sky-100 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon
                        name="Shield"
                        size={16}
                        className="text-sky-500"
                      />
                      <span className="text-sm font-semibold text-gray-800">
                        Папа
                      </span>
                      <span className="ml-auto text-sm font-bold text-sky-600">
                        {profile.parentCompat.fatherScore}%
                      </span>
                    </div>
                    <ProgressBar
                      value={profile.parentCompat.fatherScore}
                      color="sky"
                    />
                    {profile.parentCompat.fatherInsight && (
                      <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                        {profile.parentCompat.fatherInsight}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </Card>
        )}

      {desc && (
        <>
          <Card className="p-6 sm:p-8">
            <SectionHeading
              icon="BookOpen"
              title="О вашем ребёнке"
              subtitle="Характер и особенности с рождения"
            />
            <div className="bg-purple-50/60 border border-purple-100 rounded-xl p-5 sm:p-6">
              <p className="text-gray-700 text-[15px] leading-relaxed">
                {desc.childProfile}
              </p>
            </div>
          </Card>

          <Card className="p-6 sm:p-8">
            <SectionHeading
              icon="Star"
              title="Таланты и способности"
              subtitle="Природные дарования, которые стоит развивать"
            />
            <div className="flex flex-wrap gap-3">
              {desc.childTalents.map((talent, i) => {
                const style = TALENT_STYLES[i % TALENT_STYLES.length];
                return (
                  <div
                    key={i}
                    className={`inline-flex items-center gap-2 ${style.bg} border ${style.border} rounded-xl px-4 py-2.5`}
                  >
                    <Icon
                      name="Star"
                      size={15}
                      className={style.icon}
                    />
                    <span
                      className={`text-sm font-medium ${style.text}`}
                    >
                      {talent}
                    </span>
                  </div>
                );
              })}
            </div>
          </Card>

          <Card className="p-6 sm:p-8">
            <SectionHeading
              icon="Heart"
              title="Советы для родителей"
              subtitle="Как помочь ребёнку раскрыть потенциал"
              iconBg="bg-rose-100"
              iconColor="text-rose-600"
            />
            <div className="space-y-3">
              {desc.childParentTips.map((tip, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3.5 bg-gray-50/80 border border-gray-100 rounded-xl p-4"
                >
                  <div className="w-8 h-8 rounded-lg bg-rose-100 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-rose-600">
                      {i + 1}
                    </span>
                  </div>
                  <div className="flex items-start gap-2 min-w-0 pt-1">
                    <Icon
                      name="Heart"
                      size={14}
                      className="text-rose-400 shrink-0 mt-0.5"
                    />
                    <span className="text-[15px] text-gray-700 leading-relaxed">
                      {tip}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </>
      )}

      {desc && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="font-golos font-semibold text-lg text-gray-900 mb-4 flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center">
                <Icon
                  name="ThumbsUp"
                  size={15}
                  className="text-emerald-600"
                />
              </div>
              Сильные стороны характера
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
                <Icon
                  name="Sprout"
                  size={15}
                  className="text-[#6C5BA7]"
                />
              </div>
              Над чем работать
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

      <Card className="p-6 sm:p-8 text-center">
        <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center mx-auto mb-3">
          <Icon name="Download" size={22} className="text-purple-600" />
        </div>
        <h3 className="font-golos font-semibold text-lg text-gray-900 mb-1">
          Скачать PDF-отчёт
        </h3>
        <p className="text-sm text-gray-400 mb-4">
          Полный профиль {name || "ребёнка"} в удобном формате
        </p>
        <button
          onClick={onDownloadPdf}
          disabled={pdfLoading}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white text-sm font-semibold rounded-xl px-6 py-3 transition-all disabled:opacity-60"
        >
          <Icon name="Download" size={16} />
          {pdfLoading ? "Генерация PDF..." : "Скачать PDF-отчёт"}
        </button>
      </Card>
    </>
  );
}