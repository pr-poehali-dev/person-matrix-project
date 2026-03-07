import { useState } from "react";
import { Link } from "react-router-dom";
import Icon from "@/components/ui/icon";
import type { PersonDescription } from "@/lib/matrix";
import { DESCRIPTIONS } from "@/lib/matrix";
import { MATRIX_LABELS } from "@/lib/child-matrix";
import type { ChildProfile } from "@/lib/child-matrix";
import { getToken } from "@/lib/auth";
import { PRODUCT_PRICES } from "@/lib/payments";
import func2url from "../../../backend/func2url.json";
import { Card, SectionHeading, NumberCard, TALENT_STYLES } from "./ChildPrimitives";

type ChildPaidContentProps = {
  profile: ChildProfile;
  desc: PersonDescription | undefined;
  name: string;
  purchased: boolean;
  balance: number;
  spending: boolean;
  birthDate: string;
  motherDate: string;
  fatherDate: string;
  onBuy: () => void;
  onReset: () => void;
  onNavigateAuth: () => void;
};

function ProgressBar({
  value,
  color = "purple",
}: {
  value: number;
  color?: string;
}) {
  const colorMap: Record<string, string> = {
    purple: "bg-purple-500",
    amber: "bg-amber-500",
    emerald: "bg-emerald-500",
    sky: "bg-sky-500",
    rose: "bg-rose-500",
    indigo: "bg-indigo-500",
  };
  return (
    <div className="w-full bg-gray-100 rounded-full h-2.5">
      <div
        className={`h-2.5 rounded-full transition-all ${colorMap[color] || colorMap.purple}`}
        style={{ width: `${Math.max(4, value)}%` }}
      />
    </div>
  );
}

export default function ChildPaidContent({
  profile,
  desc,
  name,
  purchased,
  balance,
  spending,
  birthDate,
  motherDate,
  fatherDate,
  onBuy,
  onReset,
  onNavigateAuth,
}: ChildPaidContentProps) {
  const [pdfLoading, setPdfLoading] = useState(false);

  const onDownloadPdf = async () => {
    const token = getToken();
    if (!token) return;
    setPdfLoading(true);
    try {
      const res = await fetch((func2url as Record<string, string>)["child-pdf"], {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Auth-Token": token },
        body: JSON.stringify({
          action: "generate",
          child_date: birthDate,
          child_name: name,
          mother_date: motherDate || undefined,
          father_date: fatherDate || undefined,
        }),
      });
      if (res.status === 403) {
        setPdfLoading(false);
        return;
      }
      const data = await res.json();
      const parsed = typeof data === "string" ? JSON.parse(data) : data;
      if (parsed.pdf) {
        const bytes = Uint8Array.from(atob(parsed.pdf), (c) => c.charCodeAt(0));
        const blob = new Blob([bytes], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = parsed.filename || "child_profile.pdf";
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch {
      // ignore
    }
    setPdfLoading(false);
  };

  return (
    <>
      {purchased ? (
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
                subtitle="Отсутствующие цифры в матрице"
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
                        className="text-amber-500 shrink-0 mt-0.5"
                      />
                      <span className="text-sm text-gray-700">{risk.tip}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          <Card className="p-6 sm:p-8">
            <SectionHeading
              icon="TrendingUp"
              title="Индексы потенциала"
              subtitle="Обучаемость, успешность и будущее"
              iconBg="bg-amber-100"
              iconColor="text-amber-600"
            />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { label: "Обучаемость", value: profile.learningIndex, icon: "GraduationCap", color: "emerald" },
                { label: "Успешность", value: profile.successIndex, icon: "Trophy", color: "amber" },
                { label: "Будущий потенциал", value: profile.futureIndex, icon: "Rocket", color: "purple" },
              ].map((idx) => {
                const colorMap: Record<string, { bg: string; text: string; bar: string }> = {
                  emerald: { bg: "bg-emerald-100", text: "text-emerald-700", bar: "emerald" },
                  amber: { bg: "bg-amber-100", text: "text-amber-700", bar: "amber" },
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
                    <div className="text-2xl font-serif font-bold text-gray-900 mb-1">
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
                    <span className="text-lg font-serif font-bold text-sky-700">
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
              iconBg="bg-amber-100"
              iconColor="text-amber-600"
            />
            <div className="bg-amber-50/60 border border-amber-100 rounded-xl p-5 sm:p-6 text-center">
              <div className="text-4xl font-serif font-bold text-amber-700 mb-2">
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
                  subtitle="Энергетическая связь в семье"
                  iconBg="bg-rose-100"
                  iconColor="text-rose-600"
                />
                <div className="space-y-4">
                  <div className="bg-purple-50/60 border border-purple-100 rounded-xl p-4 text-center">
                    <div className="text-xs font-semibold text-purple-500 uppercase tracking-wider mb-1">
                      Семейный баланс
                    </div>
                    <div className="text-3xl font-serif font-bold text-purple-700 mb-2">
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
                <h3 className="font-serif text-lg text-gray-900 mb-4 flex items-center gap-2">
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
                <h3 className="font-serif text-lg text-gray-900 mb-4 flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center">
                    <Icon
                      name="Sprout"
                      size={15}
                      className="text-amber-600"
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
                        className="text-amber-500 shrink-0 mt-0.5"
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
            <h3 className="font-serif text-lg text-gray-900 mb-1">
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
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
            <Icon name="Lock" size={24} className="text-amber-600" />
          </div>
          <h3 className="font-serif text-2xl text-gray-900 mb-2">
            Полный профиль ребёнка
          </h3>
          <p className="text-sm text-gray-500 mb-2 max-w-md mx-auto">
            Матрица Пифагора, индексы развития, карьерные склонности, жизненные
            циклы, совместимость с родителями и советы
          </p>
          <div className="text-3xl font-serif font-bold text-amber-700 mb-4">
            {PRODUCT_PRICES.child_analysis} ₽
          </div>
          {getToken() ? (
            <div>
              <button
                onClick={onBuy}
                disabled={spending}
                className="px-8 py-3 rounded-xl text-sm font-semibold text-white transition-all"
                style={{
                  background: spending
                    ? "#d1d5db"
                    : "linear-gradient(135deg, #92400e, #d97706, #f59e0b)",
                }}
              >
                {spending
                  ? "Оплата..."
                  : balance >= PRODUCT_PRICES.child_analysis
                    ? "Оплатить с баланса"
                    : `Пополнить баланс (${balance} ₽)`}
              </button>
              {balance < PRODUCT_PRICES.child_analysis && (
                <p className="text-xs text-gray-400 mt-2">
                  На балансе {balance} ₽, нужно{" "}
                  {PRODUCT_PRICES.child_analysis} ₽
                </p>
              )}
            </div>
          ) : (
            <button
              onClick={onNavigateAuth}
              className="px-8 py-3 rounded-xl text-sm font-semibold text-white"
              style={{
                background:
                  "linear-gradient(135deg, #92400e, #d97706, #f59e0b)",
              }}
            >
              Войти для покупки
            </button>
          )}
        </div>
      )}

      <div className="text-center pt-4 pb-8 space-y-4">
        <p className="text-sm text-gray-400">
          Расчёт выполнен на основе классической нумерологии Пифагора
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={onReset}
            className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-xl px-6 py-3 transition-colors"
          >
            <Icon name="RotateCcw" size={16} />
            Рассчитать для другого ребёнка
          </button>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 font-medium transition-colors"
          >
            <Icon name="ArrowLeft" size={16} />
            На главную
          </Link>
        </div>
      </div>
    </>
  );
}