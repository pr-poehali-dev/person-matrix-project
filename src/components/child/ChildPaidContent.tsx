import { Link } from "react-router-dom";
import Icon from "@/components/ui/icon";
import type { PersonDescription } from "@/lib/matrix";
import { getToken } from "@/lib/auth";
import { PRODUCT_PRICES } from "@/lib/payments";
import { Card, SectionHeading, TALENT_STYLES } from "./ChildPrimitives";

type ChildResult = {
  lifePath: number;
  character: number;
  destiny: number;
  soulUrge: number;
  desc: PersonDescription;
  name: string;
};

type ChildPaidContentProps = {
  result: ChildResult;
  purchased: boolean;
  balance: number;
  spending: boolean;
  onBuy: () => void;
  onReset: () => void;
  onNavigateAuth: () => void;
};

export default function ChildPaidContent({
  result,
  purchased,
  balance,
  spending,
  onBuy,
  onReset,
  onNavigateAuth,
}: ChildPaidContentProps) {
  return (
    <>
      {purchased ? (
        <>
          <Card className="p-6 sm:p-8">
            <SectionHeading
              icon="BookOpen"
              title="О вашем ребёнке"
              subtitle="Характер и особенности с рождения"
            />
            <div className="bg-purple-50/60 border border-purple-100 rounded-xl p-5 sm:p-6">
              <p className="text-gray-700 text-[15px] leading-relaxed">
                {result.desc.childProfile}
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
              {result.desc.childTalents.map((talent, i) => {
                const style = TALENT_STYLES[i % TALENT_STYLES.length];
                return (
                  <div
                    key={i}
                    className={`inline-flex items-center gap-2 ${style.bg} border ${style.border} rounded-xl px-4 py-2.5`}
                  >
                    <Icon name="Star" size={15} className={style.icon} />
                    <span className={`text-sm font-medium ${style.text}`}>
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
              {result.desc.childParentTips.map((tip, i) => (
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="font-serif text-lg text-gray-900 mb-4 flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <Icon name="ThumbsUp" size={15} className="text-emerald-600" />
                </div>
                Сильные стороны характера
              </h3>
              <ul className="space-y-2.5">
                {result.desc.strengths.map((s, i) => (
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
                  <Icon name="Sprout" size={15} className="text-amber-600" />
                </div>
                Над чем работать
              </h3>
              <ul className="space-y-2.5">
                {result.desc.challenges.map((c, i) => (
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
        </>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
            <Icon name="Lock" size={24} className="text-amber-600" />
          </div>
          <h3 className="font-serif text-2xl text-gray-900 mb-2">Полный профиль ребёнка</h3>
          <p className="text-sm text-gray-500 mb-2 max-w-md mx-auto">
            Характер, таланты, советы для родителей, сильные стороны и зоны роста
          </p>
          <div className="text-3xl font-serif font-bold text-amber-700 mb-4">{PRODUCT_PRICES.child_analysis} ₽</div>
          {getToken() ? (
            <div>
              <button onClick={onBuy} disabled={spending}
                className="px-8 py-3 rounded-xl text-sm font-semibold text-white transition-all"
                style={{ background: spending ? "#d1d5db" : "linear-gradient(135deg, #92400e, #d97706, #f59e0b)" }}>
                {spending ? "Оплата..." : balance >= PRODUCT_PRICES.child_analysis ? "Оплатить с баланса" : `Пополнить баланс (${balance} ₽)`}
              </button>
              {balance < PRODUCT_PRICES.child_analysis && (
                <p className="text-xs text-gray-400 mt-2">На балансе {balance} ₽, нужно {PRODUCT_PRICES.child_analysis} ₽</p>
              )}
            </div>
          ) : (
            <button onClick={onNavigateAuth} className="px-8 py-3 rounded-xl text-sm font-semibold text-white"
              style={{ background: "linear-gradient(135deg, #92400e, #d97706, #f59e0b)" }}>
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
