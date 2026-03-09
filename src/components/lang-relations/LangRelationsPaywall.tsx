import { Link } from "react-router-dom";
import Icon from "@/components/ui/icon";
import { PRODUCT_PRICES } from "@/lib/payments";

type Props = {
  balance: number;
  spending: boolean;
  isAuth: boolean;
  onBuy: () => void;
};

const price = PRODUCT_PRICES["lang_relations"] ?? 390;

export default function LangRelationsPaywall({ balance, spending, isAuth, onBuy }: Props) {
  const canAfford = balance >= price;

  return (
    <div className="space-y-5">
      {/* Hero */}
      <div className="bg-gradient-to-br from-rose-500 to-rose-600 rounded-2xl p-6 text-white">
        <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mb-4">
          <Icon name="Heart" size={24} className="text-white" />
        </div>
        <h1 className="font-golos font-bold text-2xl leading-tight mb-2">
          Язык отношений
        </h1>
        <p className="font-golos text-white/85 text-sm leading-relaxed">
          Тренажёр, который показывает реальные паттерны ваших отношений — на основе ваших же ситуаций, без ИИ и субъективности.
        </p>
      </div>

      {/* Как работает */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
        <h3 className="font-golos font-semibold text-gray-900 text-sm">Как это работает</h3>

        {[
          { icon: "PenLine", step: "1", text: "Описываете 5 реальных ситуаций из ваших отношений" },
          { icon: "BarChart3", step: "2", text: "Алгоритм рассчитывает эмоциональный индекс, стиль поведения и индекс конфликтности" },
          { icon: "FileText", step: "3", text: "Получаете персональный отчёт со сценарием и рекомендациями" },
        ].map(item => (
          <div key={item.step} className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center shrink-0">
              <Icon name={item.icon} size={16} className="text-rose-500" />
            </div>
            <p className="font-golos text-sm text-gray-700 leading-relaxed pt-1">{item.text}</p>
          </div>
        ))}
      </div>

      {/* Что входит в отчёт */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h3 className="font-golos font-semibold text-gray-900 text-sm mb-3">Что входит в отчёт</h3>
        <ul className="space-y-2">
          {[
            "Эмоциональный фон отношений",
            "Ваш стиль реакции (избегание / конструктив / эмоциональность)",
            "Стиль второго человека",
            "Индекс конфликтности",
            "Сценарий ваших отношений",
            "Конкретные рекомендации",
          ].map(item => (
            <li key={item} className="flex items-start gap-2">
              <Icon name="Check" size={14} className="text-emerald-500 mt-0.5 shrink-0" />
              <span className="font-golos text-sm text-gray-700">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Бесплатно */}
      <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4">
        <div className="flex items-start gap-3">
          <Icon name="Info" size={16} className="text-amber-600 mt-0.5 shrink-0" />
          <div>
            <p className="font-golos text-sm font-semibold text-amber-800 mb-0.5">Бесплатно — 1 запись</p>
            <p className="font-golos text-xs text-amber-700">Полный анализ открывается после 5 записей. Одноразовая покупка доступа.</p>
          </div>
        </div>
      </div>

      {/* Кнопка */}
      {isAuth ? (
        <div className="space-y-2">
          <button
            onClick={onBuy}
            disabled={spending}
            className="w-full bg-rose-500 hover:bg-rose-600 text-white font-golos font-medium text-sm rounded-xl py-3.5 transition-colors disabled:opacity-50"
          >
            {spending ? "Открываю..." : `Открыть доступ — ${price} ₽`}
          </button>
          {!canAfford && (
            <Link
              to="/balance"
              className="block text-center font-golos text-sm text-gray-400 hover:text-gray-600 underline underline-offset-2"
            >
              Пополнить баланс (сейчас {balance} ₽)
            </Link>
          )}
        </div>
      ) : (
        <Link
          to="/auth"
          className="block text-center w-full bg-rose-500 hover:bg-rose-600 text-white font-golos font-medium text-sm rounded-xl py-3.5 transition-colors"
        >
          Войти и открыть доступ
        </Link>
      )}
    </div>
  );
}
