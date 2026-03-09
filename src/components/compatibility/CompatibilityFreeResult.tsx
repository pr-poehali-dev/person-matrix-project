import Icon from "@/components/ui/icon";
import { Card, ScoreCircle, SectionHeading, ScoreBar } from "./CompatibilityPrimitives";
import { PRODUCT_PRICES } from "@/lib/payments";
import type { FullCompatibilityResult } from "@/lib/matrix";

type Props = {
  result: FullCompatibilityResult;
  purchased: boolean;
  balance: number;
  spending: boolean;
  isAuth: boolean;
  onBuy: () => void;
  onNavigateAuth: () => void;
};

export default function CompatibilityFreeResult({
  result,
  purchased,
  balance,
  spending,
  isAuth,
  onBuy,
  onNavigateAuth,
}: Props) {
  return (
    <>
      <Card className="p-6 sm:p-8">
        <div className="flex flex-col items-center text-center">
          <ScoreCircle score={result.overallIndex} size={120} />
          <div className="mt-4">
            <h2 className="font-golos font-semibold text-2xl sm:text-3xl text-gray-900">
              {result.unionType.name}
            </h2>
            <div className="mt-1 inline-flex items-center gap-1.5 text-sm text-[#6C5BA7] font-medium">
              <Icon name="Sparkle" size={14} />
              {result.pairArchetype}
            </div>
          </div>
          <p className="mt-3 text-sm text-gray-500 max-w-lg leading-relaxed">
            {result.unionType.description}
          </p>
        </div>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
              <Icon name="Zap" size={16} className="text-blue-500" />
            </div>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Динамика</span>
          </div>
          <p className="text-sm text-gray-700 leading-relaxed">{result.freeSummary.dynamic}</p>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
              <Icon name="Shield" size={16} className="text-green-500" />
            </div>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Сила</span>
          </div>
          <p className="text-sm text-gray-700 leading-relaxed">{result.freeSummary.strength}</p>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center">
              <Icon name="AlertTriangle" size={16} className="text-red-400" />
            </div>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Риск</span>
          </div>
          <p className="text-sm text-gray-700 leading-relaxed">{result.freeSummary.risk}</p>
        </Card>
      </div>

      <Card className="p-6 sm:p-8">
        <SectionHeading icon="BarChart3" title="Базовые показатели" subtitle="Доступно бесплатно" />
        <div className="space-y-4">
          <ScoreBar label="Жизненный путь" score={result.scores.lifePath} />
          <ScoreBar label="Характер" score={result.scores.character} />
        </div>
      </Card>

      {!purchased && (
        <Card className="p-6 sm:p-8 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gray-100 mb-4">
            <Icon name="Lock" size={28} className="text-gray-400" />
          </div>
          <h3 className="font-golos font-semibold text-xl sm:text-2xl text-gray-900 mb-2">
            Полный отчёт совместимости
          </h3>
          <p className="text-sm text-gray-500 max-w-md mx-auto mb-1">
            Откройте доступ к 8 показателям совместимости, анализу глубинной связи,
            сравнению психологических портретов, рекомендациям и конфликтному индексу.
          </p>
          <p className="text-xs text-gray-400 mb-6">
            Ваш баланс: {balance} руб.
          </p>
          {isAuth ? (
            <button
              onClick={onBuy}
              disabled={spending}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[#6C5BA7] hover:bg-[#5A4B95] text-white font-semibold text-sm transition-all shadow-md shadow-[#6C5BA7]/20 disabled:opacity-60"
            >
              <Icon name="Unlock" size={18} />
              {spending ? "Оплата..." : `Открыть за ${PRODUCT_PRICES.compatibility} ₽`}
            </button>
          ) : (
            <button
              onClick={onNavigateAuth}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[#6C5BA7] hover:bg-[#5A4B95] text-white font-semibold text-sm transition-all shadow-md shadow-[#6C5BA7]/20"
            >
              <Icon name="LogIn" size={18} />
              Войти для покупки
            </button>
          )}
        </Card>
      )}
    </>
  );
}
