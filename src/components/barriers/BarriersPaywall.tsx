import { useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";

type Props = {
  balance: number;
  spending: boolean;
  isAuth: boolean;
  onBuy: () => void;
};

const FEATURES = [
  "Координатная модель X–Y: прогресс и тревога",
  "Восстановление шагов прошлого провала",
  "Автоматическое определение точки срыва",
  "Визуальный график вашего пути",
  "Добавление второй опоры и пересчёт тревоги",
  "Ваш психологический профиль реакций",
];

export default function BarriersPaywall({ balance, spending, isAuth, onBuy }: Props) {
  const navigate = useNavigate();
  const price = 290;
  const hasEnough = balance >= price;

  return (
    <div className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.07)] overflow-hidden">
      <div className="bg-gradient-to-br from-[#E06B2E] to-[#F08C56] px-6 py-8 text-white text-center">
        <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-4">
          <Icon name="BarChart2" size={26} className="text-white" />
        </div>
        <h2 className="font-golos font-bold text-2xl mb-2">Барьеры, тревоги и стресс</h2>
        <p className="font-golos text-white/80 text-sm leading-relaxed max-w-sm mx-auto">
          Пошаговый коучинговый тест с координатной моделью X–Y
        </p>
        <div className="mt-5 inline-flex items-baseline gap-1">
          <span className="font-golos font-bold text-4xl">290</span>
          <span className="font-golos text-white/80 text-lg">₽</span>
          <span className="font-golos text-white/60 text-sm ml-1">· разовая оплата</span>
        </div>
      </div>

      <div className="px-6 py-6">
        <p className="font-golos text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
          Что входит:
        </p>
        <ul className="space-y-2.5 mb-6">
          {FEATURES.map((f, i) => (
            <li key={i} className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Icon name="Check" size={12} className="text-emerald-500" />
              </div>
              <span className="font-golos text-sm text-gray-700">{f}</span>
            </li>
          ))}
        </ul>

        {isAuth ? (
          <>
            <div className="flex items-center justify-between mb-4 px-4 py-3 bg-gray-50 rounded-xl">
              <span className="font-golos text-sm text-gray-500">Ваш баланс</span>
              <span className={`font-golos text-sm font-semibold ${hasEnough ? "text-emerald-600" : "text-rose-500"}`}>
                {balance} ₽
              </span>
            </div>

            {hasEnough ? (
              <button
                onClick={onBuy}
                disabled={spending}
                className="w-full py-3.5 rounded-xl bg-[#E06B2E] text-white font-golos font-semibold text-base transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50"
              >
                {spending ? "Оплачиваем..." : `Начать за ${price} ₽`}
              </button>
            ) : (
              <div className="space-y-3">
                <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
                  <p className="font-golos text-sm text-amber-700">
                    Не хватает <span className="font-semibold">{price - balance} ₽</span>. Пополните баланс.
                  </p>
                </div>
                <button
                  onClick={() => navigate("/balance")}
                  className="w-full py-3.5 rounded-xl bg-[#E06B2E] text-white font-golos font-semibold text-base transition-all hover:opacity-90 active:scale-[0.98]"
                >
                  Пополнить баланс
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="space-y-3">
            <p className="font-golos text-sm text-gray-500 text-center">
              Войдите, чтобы оплатить и начать
            </p>
            <button
              onClick={() => navigate("/auth")}
              className="w-full py-3.5 rounded-xl bg-[#E06B2E] text-white font-golos font-semibold text-base transition-all hover:opacity-90 active:scale-[0.98]"
            >
              Войти / Зарегистрироваться
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
