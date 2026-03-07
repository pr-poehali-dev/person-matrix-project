import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Icon from "@/components/ui/icon";
import { getToken, saveDestinyCalc } from "@/lib/auth";
import { checkPurchase, spend, getBalance } from "@/lib/payments";
import { calcDestinyMap } from "@/lib/destiny-map";
import type { DestinyMapProfile } from "@/lib/destiny-map";
import DestinyForm from "@/components/destiny/DestinyForm";
import DestinyHero from "@/components/destiny/DestinyHero";
import DestinyPaidContent from "@/components/destiny/DestinyPaidContent";

export default function DestinyMap() {
  const [searchParams] = useSearchParams();
  const [birthDate, setBirthDate] = useState(searchParams.get("date") || "");
  const [birthTime, setBirthTime] = useState("");
  const [birthCity, setBirthCity] = useState("");
  const [error, setError] = useState("");

  const [profile, setProfile] = useState<DestinyMapProfile | null>(null);
  const navigate = useNavigate();
  const [purchased, setPurchased] = useState(false);
  const [balance, setBalance] = useState(0);
  const [spending, setSpending] = useState(false);

  function handleCalculate() {
    setError("");
    setProfile(null);

    if (!birthDate) {
      setError("Введите дату рождения");
      return;
    }

    const result = calcDestinyMap(birthDate);
    if (!result) {
      setError("Не удалось выполнить расчёт. Проверьте дату.");
      return;
    }

    setProfile(result);

    const token = getToken();
    if (token && birthDate) {
      saveDestinyCalc(birthDate, result.lifePath);
      Promise.all([
        checkPurchase("destiny_map", { birth_date: birthDate }),
        getBalance(),
      ]).then(([purchaseRes, balanceRes]) => {
        if (purchaseRes.status === 200 && purchaseRes.data && (purchaseRes.data as Record<string, unknown>).purchased)
          setPurchased(true);
        else setPurchased(false);
        if (balanceRes.status === 200 && balanceRes.data && (balanceRes.data as Record<string, unknown>).balance !== undefined)
          setBalance((balanceRes.data as Record<string, unknown>).balance as number);
      });
    } else {
      setPurchased(false);
    }
  }

  const [autoCalcDone, setAutoCalcDone] = useState(false);

  useEffect(() => {
    const d = searchParams.get("date");
    if (d && !autoCalcDone) {
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
    const res = await spend("destiny_map", { birth_date: birthDate });
    if (res.status === 200) setPurchased(true);
    else if (res.status === 402) navigate("/balance");
    setSpending(false);
  };

  function handleReset() {
    setProfile(null);
    setBirthDate("");
    setBirthTime("");
    setBirthCity("");
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-100 px-6 py-4 sticky top-0 z-30">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full border border-amber-400 flex items-center justify-center">
              <span className="font-serif text-sm font-bold text-amber-600">М</span>
            </div>
            <span className="font-serif text-lg text-gray-800">Матрица личности</span>
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
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4" style={{ background: "linear-gradient(135deg, #fef3c7, #fde68a)" }}>
            <Icon name="Map" size={28} className="text-amber-700" />
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-gray-900 mb-2">
            Полная карта судьбы
          </h1>
          <p className="text-gray-400 text-sm max-w-lg mx-auto">
            Самый глубокий анализ личности: 20 разделов, все индексы,
            карьера, предназначение, отношения, стратегия жизни
          </p>
        </div>

        {!profile && (
          <DestinyForm
            birthDate={birthDate}
            birthTime={birthTime}
            birthCity={birthCity}
            error={error}
            onBirthDateChange={setBirthDate}
            onBirthTimeChange={setBirthTime}
            onBirthCityChange={setBirthCity}
            onCalculate={handleCalculate}
          />
        )}

        {profile && (
          <>
            <DestinyHero profile={profile} />

            <DestinyPaidContent
              profile={profile}
              purchased={purchased}
              balance={balance}
              spending={spending}
              birthDate={birthDate}
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