import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Icon from "@/components/ui/icon";
import { getToken } from "@/lib/auth";
import { checkPurchase, spend, getBalance } from "@/lib/payments";
import { calcFamilyMatrix } from "@/lib/family-matrix";
import type { FamilyAnalysis } from "@/lib/family-matrix";
import FamilyForm from "@/components/family/FamilyForm";
import FamilyHero from "@/components/family/FamilyHero";
import FamilyPaidContent from "@/components/family/FamilyPaidContent";

export default function FamilyMatrix() {
  const [searchParams] = useSearchParams();
  const [parent1Date, setParent1Date] = useState(
    searchParams.get("date1") || "",
  );
  const [parent2Date, setParent2Date] = useState(
    searchParams.get("date2") || "",
  );
  const [childrenDates, setChildrenDates] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [analysis, setAnalysis] = useState<FamilyAnalysis | null>(null);
  const navigate = useNavigate();
  const [purchased, setPurchased] = useState(false);
  const [balance, setBalance] = useState(0);
  const [spending, setSpending] = useState(false);

  function handleCalculate() {
    setError("");
    setAnalysis(null);

    if (!parent1Date || !parent2Date) {
      setError("Введите даты рождения обоих партнёров");
      return;
    }

    const filteredChildrenDates = childrenDates.filter((d) => d.length > 0);

    const result = calcFamilyMatrix(
      parent1Date,
      parent2Date,
      filteredChildrenDates,
    );

    if (!result) {
      setError("Не удалось выполнить расчёт. Проверьте даты.");
      return;
    }

    setAnalysis(result);

    const token = getToken();
    if (token) {
      Promise.all([
        checkPurchase("family_matrix", {
          birth_date: parent1Date,
          birth_date2: parent2Date,
        }),
        getBalance(),
      ]).then(([purchaseRes, balanceRes]) => {
        if (purchaseRes.status === 200 && purchaseRes.data?.purchased)
          setPurchased(true);
        else setPurchased(false);
        if (
          balanceRes.status === 200 &&
          balanceRes.data?.balance !== undefined
        )
          setBalance(balanceRes.data.balance as number);
      });
    } else {
      setPurchased(false);
    }
  }

  const [autoCalcDone, setAutoCalcDone] = useState(false);

  useEffect(() => {
    const d1 = searchParams.get("date1");
    const d2 = searchParams.get("date2");
    if (d1 && d2 && !autoCalcDone) {
      setAutoCalcDone(true);
      setTimeout(() => handleCalculate(), 0);
    }
  }, [autoCalcDone]);

  const handleBuy = async () => {
    if (!getToken()) {
      navigate("/auth");
      return;
    }
    setSpending(true);
    const res = await spend("family_matrix", {
      birth_date: parent1Date,
      birth_date2: parent2Date,
    });
    if (res.status === 200) setPurchased(true);
    else if (res.status === 402) navigate("/balance");
    setSpending(false);
  };

  function handleReset() {
    setAnalysis(null);
    setParent1Date("");
    setParent2Date("");
    setChildrenDates([]);
    setError("");
    setPurchased(false);
    setBalance(0);
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
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-100 to-emerald-200 mb-4">
            <Icon name="Users" size={28} className="text-emerald-700" />
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-gray-900 mb-2">
            Матрица судьбы семьи
          </h1>
          <p className="text-gray-400 text-sm max-w-lg mx-auto">
            Глубокий анализ отношений, ролей и потенциала вашей семьи по датам
            рождения
          </p>
        </div>

        {!analysis && (
          <FamilyForm
            parent1Date={parent1Date}
            parent2Date={parent2Date}
            childrenDates={childrenDates}
            error={error}
            onParent1DateChange={setParent1Date}
            onParent2DateChange={setParent2Date}
            onChildrenDatesChange={setChildrenDates}
            onCalculate={handleCalculate}
          />
        )}

        {analysis && (
          <>
            <FamilyHero analysis={analysis} />

            <FamilyPaidContent
              analysis={analysis}
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
