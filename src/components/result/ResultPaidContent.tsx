import { Link } from "react-router-dom";
import Icon from "@/components/ui/icon";
import { DESCRIPTIONS, PERSONAL_YEAR_DESC } from "@/lib/matrix";
import type { PersonDescription, LifeCycle, PinnacleChallenge } from "@/lib/matrix";
import { getToken } from "@/lib/auth";
import { PRODUCT_PRICES } from "@/lib/payments";
import { Card, SectionHeading, CYCLE_ICONS } from "./ResultPrimitives";

type ResultData = {
  lifePath: number;
  character: number;
  destiny: number;
  soulUrge: number;
  maturity: number;
  personalYear: number;
  lifeCycles: LifeCycle[];
  pinnacles: PinnacleChallenge[];
};

type ResultPaidContentProps = {
  data: ResultData;
  desc: PersonDescription | undefined;
  purchased: boolean;
  balance: number;
  spending: boolean;
  onBuy: () => void;
  onNavigateAuth: () => void;
};

export default function ResultPaidContent({
  data,
  desc,
  purchased,
  balance,
  spending,
  onBuy,
  onNavigateAuth,
}: ResultPaidContentProps) {
  const pyDesc = PERSONAL_YEAR_DESC[data.personalYear > 9 ? 9 : data.personalYear];

  return (
    <>
      {purchased ? (
        <>
          {/* 7. HEALTH */}
          {desc && (
            <Card className="p-6 sm:p-8">
              <SectionHeading
                icon="Activity"
                title="Здоровье и энергия"
                subtitle="Уязвимые зоны и рекомендации"
              />
              <p className="text-gray-700 leading-relaxed text-[15px]">
                {desc.health}
              </p>
            </Card>
          )}

          {/* 8. FINANCES */}
          {desc && (
            <Card className="p-6 sm:p-8">
              <SectionHeading
                icon="DollarSign"
                title="Финансы и благосостояние"
                subtitle="Стратегия изобилия"
              />
              <p className="text-gray-700 leading-relaxed text-[15px]">
                {desc.finances}
              </p>
            </Card>
          )}

          {/* 9. PERSONAL YEAR */}
          {pyDesc && (
            <Card className="p-6 sm:p-8">
              <SectionHeading
                icon="CalendarDays"
                title="Персональный год"
                subtitle={`${new Date().getFullYear()} год для вас`}
              />
              <div className="flex items-start gap-5">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#F4F2FA] to-[#E8E4F5] flex items-center justify-center shrink-0">
                  <span className="font-golos text-3xl font-bold text-[#6C5BA7]">
                    {data.personalYear}
                  </span>
                </div>
                <div className="space-y-3 min-w-0">
                  <h3 className="font-golos font-semibold text-lg text-gray-900">
                    {pyDesc.title}
                  </h3>
                  <p className="text-gray-700 text-[15px] leading-relaxed">
                    {pyDesc.meaning}
                  </p>
                  <div className="bg-[#F4F2FA] border border-[#E8E4F5] rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-1.5">
                      <Icon name="Lightbulb" size={16} className="text-[#6C5BA7]" />
                      <span className="text-xs font-semibold text-[#6C5BA7] uppercase tracking-wide">
                        Совет года
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {pyDesc.advice}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* 10. LIFE CYCLES */}
          {data.lifeCycles && data.lifeCycles.length > 0 && (
            <Card className="p-6 sm:p-8">
              <SectionHeading
                icon="Repeat"
                title="Жизненные циклы"
                subtitle="Три ключевых периода вашей жизни"
              />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {data.lifeCycles.map((cycle: LifeCycle, i: number) => (
                  <div
                    key={i}
                    className="relative bg-gradient-to-b from-[#F4F2FA]/80 to-white border border-[#E8E4F5]/80 rounded-xl p-5 text-center"
                  >
                    <div className="w-10 h-10 rounded-full bg-white border border-[#E8E4F5] flex items-center justify-center mx-auto mb-3 shadow-sm">
                      <Icon
                        name={CYCLE_ICONS[cycle.period] || "Circle"}
                        size={20}
                        className="text-[#6C5BA7]"
                      />
                    </div>
                    <div className="text-xs font-semibold text-[#6C5BA7] uppercase tracking-widest mb-1">
                      {cycle.period}
                    </div>
                    <div className="font-golos font-semibold text-3xl font-bold text-gray-900 mb-1">
                      {cycle.number}
                    </div>
                    <div className="text-xs text-gray-400">
                      {DESCRIPTIONS[cycle.number]?.title}
                    </div>
                    <div className="mt-3 inline-block bg-white border border-gray-100 rounded-lg px-3 py-1 text-xs text-gray-500 font-medium">
                      {cycle.ages} лет
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* 11. PINNACLES & CHALLENGES */}
          {data.pinnacles && data.pinnacles.length > 0 && (
            <Card className="p-6 sm:p-8">
              <SectionHeading
                icon="Mountain"
                title="Вершины и испытания"
                subtitle="Четыре этапа пути: пиковые возможности и уроки"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {data.pinnacles.map((pc: PinnacleChallenge, i: number) => (
                  <div
                    key={i}
                    className="border border-gray-100 rounded-xl p-5 flex flex-col gap-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-gray-800 uppercase tracking-wider">
                        {pc.period}
                      </span>
                      <span className="text-xs text-gray-400 bg-gray-50 rounded-lg px-2.5 py-1 font-medium">
                        {pc.ages} лет
                      </span>
                    </div>

                    <div className="flex gap-3">
                      <div className="flex-1 bg-[#F4F2FA] border border-[#E8E4F5] rounded-lg p-3 text-center">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <Icon name="TrendingUp" size={14} className="text-[#6C5BA7]" />
                          <span className="text-[10px] font-semibold text-[#6C5BA7] uppercase tracking-wider">
                            Вершина
                          </span>
                        </div>
                        <div className="font-golos font-semibold text-2xl font-bold text-[#4A3D7A]">
                          {pc.pinnacle}
                        </div>
                        <div className="text-[11px] text-gray-500 mt-0.5">
                          {DESCRIPTIONS[pc.pinnacle]?.title}
                        </div>
                      </div>

                      <div className="flex-1 bg-gray-50 border border-gray-100 rounded-lg p-3 text-center">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <Icon name="Shield" size={14} className="text-gray-500" />
                          <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                            Испытание
                          </span>
                        </div>
                        <div className="font-golos font-semibold text-2xl font-bold text-gray-700">
                          {pc.challenge}
                        </div>
                        <div className="text-[11px] text-gray-500 mt-0.5">
                          {DESCRIPTIONS[pc.challenge]?.title || "Универсальный урок"}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-[#F4F2FA] flex items-center justify-center mx-auto mb-4">
            <Icon name="Lock" size={24} className="text-[#6C5BA7]" />
          </div>
          <h3 className="font-golos font-semibold text-2xl text-gray-900 mb-2">Полный анализ личности</h3>
          <p className="text-sm text-gray-500 mb-2 max-w-md mx-auto">
            Здоровье, финансы, личный год, жизненные циклы, вершины и испытания
          </p>
          <div className="text-3xl font-golos font-bold text-[#6C5BA7] mb-4">{PRODUCT_PRICES.full_analysis} ₽</div>
          {getToken() ? (
            <div>
              <button onClick={onBuy} disabled={spending}
                className="px-8 py-3 rounded-xl text-sm font-semibold text-white transition-all"
                style={{ background: spending ? "#d1d5db" : "linear-gradient(135deg, #6C5BA7, #8B7EC8)" }}>
                {spending ? "Оплата..." : balance >= PRODUCT_PRICES.full_analysis ? "Оплатить с баланса" : `Пополнить баланс (${balance} ₽)`}
              </button>
              {balance < PRODUCT_PRICES.full_analysis && (
                <p className="text-xs text-gray-400 mt-2">На балансе {balance} ₽, нужно {PRODUCT_PRICES.full_analysis} ₽</p>
              )}
            </div>
          ) : (
            <button onClick={onNavigateAuth} className="px-8 py-3 rounded-xl text-sm font-semibold text-white"
              style={{ background: "linear-gradient(135deg, #6C5BA7, #8B7EC8)" }}>
              Войти для покупки
            </button>
          )}
        </div>
      )}

      {/* Footer CTA */}
      <div className="text-center pt-4 pb-8 space-y-4">
        <p className="text-sm text-gray-400">
          Результаты основаны на психологическом анализе личности
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/catalog"
            className="inline-flex items-center gap-2 bg-[#6C5BA7] hover:bg-[#5A4B95] text-white text-sm font-medium rounded-xl px-6 py-3 transition-colors"
          >
            <Icon name="RotateCcw" size={16} />
            Другие тесты
          </Link>
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