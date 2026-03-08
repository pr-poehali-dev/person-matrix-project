import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";
import { getToken } from "@/lib/auth";
import { getBalance, createPayment, getHistory } from "@/lib/payments";

type Transaction = {
  type: string;
  amount: number;
  description: string;
  created_at: string;
};

const PRESET_AMOUNTS = [300, 500, 1000, 2000, 5000];

export default function Balance() {
  const navigate = useNavigate();
  const [balance, setBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [customAmount, setCustomAmount] = useState("");
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    if (!getToken()) {
      navigate("/auth");
      return;
    }

    Promise.all([getBalance(), getHistory()])
      .then(([balRes, histRes]) => {
        if (balRes.status === 200 && balRes.data && typeof balRes.data === "object") {
          const d = balRes.data as Record<string, unknown>;
          setBalance(Number(d.balance ?? 0));
        }
        if (histRes.status === 200 && histRes.data && typeof histRes.data === "object") {
          const d = histRes.data as { transactions?: Transaction[] };
          setTransactions(d.transactions ?? []);
        }
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  const handleTopUp = async (amount: number) => {
    if (amount <= 0 || paying) return;
    setPaying(true);
    try {
      const res = await createPayment(amount, window.location.href);
      if (res.status === 200 && res.data && typeof res.data === "object") {
        const d = res.data as { url?: string };
        if (d.url) {
          window.location.href = d.url;
          return;
        }
      }
    } finally {
      setPaying(false);
    }
  };

  const handleCustomTopUp = () => {
    const amount = parseInt(customAmount, 10);
    if (!isNaN(amount) && amount > 0) {
      handleTopUp(amount);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-400 text-sm">Загрузка...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200/80 px-6 py-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#6C5BA7]/10 flex items-center justify-center">
              <span className="font-golos text-sm font-bold text-[#6C5BA7]">М</span>
            </div>
            <span className="font-golos text-lg font-semibold text-[#4A3D7A] tracking-tight">Матрица личности</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              to="/balance"
              className="flex items-center gap-1.5 text-sm font-medium text-[#6C5BA7] bg-[#F4F2FA] border border-[#E8E4F5] rounded-full px-3 py-1"
            >
              <Icon name="Wallet" size={14} />
              {balance} ₽
            </Link>
            <Link
              to="/cabinet"
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              <Icon name="User" size={15} />
              Кабинет
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8">
        <div className="mb-8">
          <h1 className="font-golos text-3xl font-semibold text-gray-900 mb-1">Баланс</h1>
          <p className="text-gray-400 text-sm">Управление балансом и история операций</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-[#F4F2FA] flex items-center justify-center">
                  <Icon name="Wallet" size={24} className="text-[#6C5BA7]" />
                </div>
                <div>
                  <div className="text-xs text-gray-400 uppercase tracking-wide font-medium">
                    Текущий баланс
                  </div>
                  <div className="font-golos text-3xl font-bold text-gray-900">
                    {balance} <span className="text-xl text-gray-400">₽</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="font-golos text-lg font-semibold text-gray-900 mb-4">Пополнить баланс</h2>

              <div className="grid grid-cols-3 gap-2 mb-4">
                {PRESET_AMOUNTS.map((amount) => (
                  <button
                    key={amount}
                    onClick={() => handleTopUp(amount)}
                    disabled={paying}
                    className="py-3 px-2 rounded-xl border border-gray-100 bg-gray-50 text-sm font-medium text-gray-700 hover:border-[#6C5BA7]/30 hover:bg-[#F4F2FA] hover:text-[#6C5BA7] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {amount} ₽
                  </button>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="number"
                  min="1"
                  placeholder="Другая сумма"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder:text-gray-300 focus:outline-none focus:border-[#6C5BA7]/50 focus:ring-1 focus:ring-[#6C5BA7]/10 transition-colors"
                />
                <button
                  onClick={handleCustomTopUp}
                  disabled={paying || !customAmount || parseInt(customAmount, 10) <= 0}
                  className="px-4 py-2.5 rounded-xl text-sm font-medium text-white bg-[#6C5BA7] hover:bg-[#5A4B95] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Icon name="ArrowRight" size={16} />
                </button>
              </div>

              {paying && (
                <div className="mt-3 text-xs text-[#6C5BA7] text-center">
                  Переход к оплате...
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
                <h2 className="font-semibold text-gray-800 text-sm">История операций</h2>
                <span className="text-xs bg-[#F4F2FA] text-[#6C5BA7] rounded-full px-2 py-0.5">
                  {transactions.length}
                </span>
              </div>

              {transactions.length === 0 ? (
                <div className="px-5 py-16 text-center">
                  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                    <Icon name="Receipt" size={24} className="text-gray-300" />
                  </div>
                  <p className="text-gray-400 text-sm mb-1">Операций пока нет</p>
                  <p className="text-gray-300 text-xs">
                    Пополните баланс, чтобы начать пользоваться сервисом
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {transactions.map((tx, idx) => {
                    const isTopup = tx.type === "topup";
                    return (
                      <div
                        key={idx}
                        className="px-5 py-4 flex items-center gap-4 hover:bg-gray-50 transition-colors"
                      >
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                            isTopup ? "bg-emerald-100" : "bg-[#F4F2FA]"
                          }`}
                        >
                          <Icon
                            name={isTopup ? "ArrowDownLeft" : "ArrowUpRight"}
                            size={16}
                            className={isTopup ? "text-emerald-600" : "text-[#6C5BA7]"}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm text-gray-800 font-medium truncate">
                            {tx.description || (isTopup ? "Пополнение" : "Покупка")}
                          </div>
                          <div className="text-xs text-gray-400">
                            {new Date(tx.created_at).toLocaleString("ru-RU", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </div>
                        <div
                          className={`text-sm font-semibold shrink-0 ${
                            isTopup ? "text-emerald-600" : "text-gray-700"
                          }`}
                        >
                          {isTopup ? "+" : "−"}{Math.abs(tx.amount)} ₽
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
