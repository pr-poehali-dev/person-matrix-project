import Icon from "@/components/ui/icon";
import { Card } from "./FamilyPrimitives";
import { getToken } from "@/lib/auth";

type FamilyPaywallProps = {
  spending: boolean;
  balance: number;
  onBuy: () => void;
  onReset: () => void;
  onNavigateAuth: () => void;
};

const PRICE = 1990;

export default function FamilyPaywall({
  spending,
  balance,
  onBuy,
  onReset,
  onNavigateAuth,
}: FamilyPaywallProps) {
  return (
    <>
      <Card className="p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-[#F4F2FA] flex items-center justify-center mx-auto mb-4">
          <Icon name="Lock" size={24} className="text-[#6C5BA7]" />
        </div>
        <h3 className="font-golos font-semibold text-2xl text-gray-900 mb-2">
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

        <div className="text-3xl font-golos font-bold text-[#6C5BA7] mb-4">
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
                  ? `Оплатить ${PRICE.toLocaleString("ru-RU")} ₽`
                  : `Пополнить баланс (нужно ${(PRICE - balance).toLocaleString("ru-RU")} ₽)`}
            </button>
            <p className="text-xs text-gray-400 mt-3">
              Ваш баланс: {balance.toLocaleString("ru-RU")} ₽
            </p>
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
          Новый анализ
        </button>
      </div>
    </>
  );
}
