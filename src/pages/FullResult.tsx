import { useMemo, useState, useEffect } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { getToken } from "@/lib/auth";
import { checkPurchase, spend, getBalance } from "@/lib/payments";
import {
  calcLifePath,
  calcCharacter,
  calcDestiny,
  calcSoulUrge,
  calcMaturity,
  calcPersonalYear,
  calcLifeCycles,
  calcPinnaclesChallenges,
  DESCRIPTIONS,
} from "@/lib/matrix";
import Icon from "@/components/ui/icon";
import { Card } from "@/components/result/ResultPrimitives";
import ResultFreeContent from "@/components/result/ResultFreeContent";
import ResultPaidContent from "@/components/result/ResultPaidContent";

export default function FullResult() {
  const [params] = useSearchParams();
  const date = params.get("date") || "";

  const data = useMemo(() => {
    if (!date) return null;
    const lifePath = calcLifePath(date);
    if (!lifePath) return null;
    return {
      lifePath,
      character: calcCharacter(date)!,
      destiny: calcDestiny(date)!,
      soulUrge: calcSoulUrge(date)!,
      maturity: calcMaturity(date)!,
      personalYear: calcPersonalYear(date)!,
      lifeCycles: calcLifeCycles(date)!,
      pinnacles: calcPinnaclesChallenges(date)!,
    };
  }, [date]);

  const navigate = useNavigate();
  const [purchased, setPurchased] = useState(false);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [spending, setSpending] = useState(false);

  useEffect(() => {
    if (!date) { setLoading(false); return; }
    const token = getToken();
    if (!token) { setLoading(false); return; }
    Promise.all([
      checkPurchase("full_analysis", { birth_date: date }),
      getBalance()
    ]).then(([purchaseRes, balanceRes]) => {
      if (purchaseRes.status === 200 && purchaseRes.data?.purchased) setPurchased(true);
      if (balanceRes.status === 200 && balanceRes.data?.balance !== undefined) setBalance(balanceRes.data.balance as number);
    }).finally(() => setLoading(false));
  }, [date]);

  const handleBuy = async () => {
    if (!getToken()) { navigate("/auth"); return; }
    setSpending(true);
    const res = await spend("full_analysis", { birth_date: date });
    if (res.status === 200) {
      setPurchased(true);
    } else if (res.status === 402) {
      navigate("/balance");
    }
    setSpending(false);
  };

  if (!date || !data) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
        <Card className="p-10 text-center max-w-md">
          <div className="w-14 h-14 rounded-full bg-[#F4F2FA] flex items-center justify-center mx-auto mb-5">
            <Icon name="AlertTriangle" size={28} className="text-[#6C5BA7]" />
          </div>
          <h1 className="font-golos font-semibold text-2xl text-gray-900 mb-2">
            Данные не указаны
          </h1>
          <p className="text-gray-400 text-sm mb-6">
            Перейдите на главную страницу для прохождения анализа.
          </p>
          <Link
            to={getToken() ? "/cabinet" : "/"}
            className="inline-flex items-center gap-2 bg-[#6C5BA7] hover:bg-[#5A4B95] text-white text-sm font-medium rounded-xl px-6 py-3 transition-colors"
          >
            <Icon name="ArrowLeft" size={16} />
            {getToken() ? "В кабинет" : "На главную"}
          </Link>
        </Card>
      </div>
    );
  }

  const desc = DESCRIPTIONS[data.lifePath];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-100 px-6 py-4 sticky top-0 z-30">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link to={getToken() ? "/cabinet" : "/"} className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#6C5BA7]/10 flex items-center justify-center">
              <span className="font-golos text-sm font-bold text-[#6C5BA7]">
                М
              </span>
            </div>
            <span className="font-golos font-semibold text-lg text-[#4A3D7A] tracking-tight">
              Матрица личности
            </span>
          </Link>
          <Link
            to={getToken() ? "/cabinet" : "/"}
            className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors"
          >
            <Icon name="ArrowLeft" size={15} />
            {getToken() ? "В кабинет" : "На главную"}
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8 sm:py-12 space-y-8">
        <ResultFreeContent data={data} date={date} desc={desc} />

        <ResultPaidContent
          data={data}
          desc={desc}
          purchased={purchased}
          balance={balance}
          spending={spending}
          onBuy={handleBuy}
          onNavigateAuth={() => navigate("/auth")}
        />
      </main>
    </div>
  );
}