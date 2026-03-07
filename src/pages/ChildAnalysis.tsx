import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";
import { getToken } from "@/lib/auth";
import { checkPurchase, spend, getBalance } from "@/lib/payments";
import {
  calcLifePath,
  calcCharacter,
  calcDestiny,
  calcSoulUrge,
  DESCRIPTIONS,
} from "@/lib/matrix";
import type { PersonDescription } from "@/lib/matrix";
import ChildForm from "@/components/child/ChildForm";
import ChildHero from "@/components/child/ChildHero";
import ChildPaidContent from "@/components/child/ChildPaidContent";

export default function ChildAnalysis() {
  const [childName, setChildName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [error, setError] = useState("");

  const [result, setResult] = useState<{
    lifePath: number;
    character: number;
    destiny: number;
    soulUrge: number;
    desc: PersonDescription;
    name: string;
  } | null>(null);
  const navigate = useNavigate();
  const [purchased, setPurchased] = useState(false);
  const [balance, setBalance] = useState(0);
  const [spending, setSpending] = useState(false);

  function handleCalculate() {
    setError("");
    setResult(null);

    if (!birthDate) {
      setError("Введите дату рождения ребёнка");
      return;
    }

    const lifePath = calcLifePath(birthDate);
    const character = calcCharacter(birthDate);
    const destiny = calcDestiny(birthDate);
    const soulUrge = calcSoulUrge(birthDate);

    if (!lifePath || !character || !destiny || !soulUrge) {
      setError("Не удалось выполнить расчёт. Проверьте дату.");
      return;
    }

    const desc = DESCRIPTIONS[lifePath];
    if (!desc) {
      setError("Описание для этого числа пока недоступно.");
      return;
    }

    setResult({
      lifePath,
      character,
      destiny,
      soulUrge,
      desc,
      name: childName.trim(),
    });

    const token = getToken();
    if (token && birthDate) {
      Promise.all([
        checkPurchase("child_analysis", { birth_date: birthDate }),
        getBalance()
      ]).then(([purchaseRes, balanceRes]) => {
        if (purchaseRes.status === 200 && purchaseRes.data?.purchased) setPurchased(true);
        else setPurchased(false);
        if (balanceRes.status === 200 && balanceRes.data?.balance !== undefined) setBalance(balanceRes.data.balance as number);
      });
    } else {
      setPurchased(false);
    }
  }

  const handleBuy = async () => {
    if (!getToken()) { navigate("/auth"); return; }
    setSpending(true);
    const res = await spend("child_analysis", { birth_date: birthDate, child_name: childName });
    if (res.status === 200) setPurchased(true);
    else if (res.status === 402) navigate("/balance");
    setSpending(false);
  };

  function handleReset() {
    setResult(null);
    setChildName("");
    setBirthDate("");
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-100 px-6 py-4 sticky top-0 z-30">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full border border-amber-400 flex items-center justify-center">
              <span className="font-serif text-sm font-bold text-amber-600">
                М
              </span>
            </div>
            <span className="font-serif text-lg text-gray-800">
              Матрица личности
            </span>
          </Link>
          <Link
            to="/"
            className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors"
          >
            <Icon name="ArrowLeft" size={15} />
            На главную
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8 sm:py-12 space-y-8">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-100 to-purple-200 mb-4">
            <Icon name="Baby" size={28} className="text-purple-700" />
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-gray-900 mb-2">
            Детский нумерологический профиль
          </h1>
          <p className="text-gray-400 text-sm max-w-lg mx-auto">
            Узнайте таланты, характер и потенциал вашего ребёнка по дате рождения
          </p>
        </div>

        {!result && (
          <ChildForm
            childName={childName}
            birthDate={birthDate}
            error={error}
            onChildNameChange={setChildName}
            onBirthDateChange={setBirthDate}
            onCalculate={handleCalculate}
          />
        )}

        {result && (
          <>
            <ChildHero result={result} />

            <ChildPaidContent
              result={result}
              purchased={purchased}
              balance={balance}
              spending={spending}
              onBuy={handleBuy}
              onReset={handleReset}
              onNavigateAuth={() => navigate("/auth")}
            />
          </>
        )}
      </main>
    </div>
  );
}
