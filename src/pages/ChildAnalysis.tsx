import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Icon from "@/components/ui/icon";
import { getToken, saveChildCalc } from "@/lib/auth";
import { checkPurchase, spend, getBalance } from "@/lib/payments";
import { DESCRIPTIONS } from "@/lib/matrix";
import { calcFullChildProfile } from "@/lib/child-matrix";
import type { ChildProfile } from "@/lib/child-matrix";
import ChildForm from "@/components/child/ChildForm";
import ChildHero from "@/components/child/ChildHero";
import ChildPaidContent from "@/components/child/ChildPaidContent";

export default function ChildAnalysis() {
  const [searchParams] = useSearchParams();
  const [childName, setChildName] = useState(searchParams.get("name") || "");
  const [birthDate, setBirthDate] = useState(searchParams.get("date") || "");
  const [motherDate, setMotherDate] = useState("");
  const [fatherDate, setFatherDate] = useState("");
  const [error, setError] = useState("");

  const [profile, setProfile] = useState<ChildProfile | null>(null);
  const [displayName, setDisplayName] = useState("");
  const navigate = useNavigate();
  const [purchased, setPurchased] = useState(false);
  const [balance, setBalance] = useState(0);
  const [spending, setSpending] = useState(false);

  function handleCalculate() {
    setError("");
    setProfile(null);

    if (!birthDate) {
      setError("Введите дату рождения ребёнка");
      return;
    }

    const result = calcFullChildProfile(
      birthDate,
      motherDate || undefined,
      fatherDate || undefined,
    );

    if (!result) {
      setError("Не удалось выполнить расчёт. Проверьте дату.");
      return;
    }

    setProfile(result);
    setDisplayName(childName.trim());

    const token = getToken();
    if (token && birthDate) {
      saveChildCalc(
        birthDate,
        childName.trim(),
        result.lifePath,
        result.character,
        result.destiny,
        result.energy,
      );
      Promise.all([
        checkPurchase("child_analysis", { birth_date: birthDate }),
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
    const res = await spend("child_analysis", {
      birth_date: birthDate,
      child_name: childName,
    });
    if (res.status === 200) setPurchased(true);
    else if (res.status === 402) navigate("/balance");
    setSpending(false);
  };

  function handleReset() {
    setProfile(null);
    setChildName("");
    setBirthDate("");
    setMotherDate("");
    setFatherDate("");
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const desc = profile ? DESCRIPTIONS[profile.lifePath] : undefined;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-100 px-6 py-4 sticky top-0 z-30">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link to={getToken() ? "/cabinet" : "/"} className="flex items-center gap-2">
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
            to={getToken() ? "/cabinet" : "/"}
            className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors"
          >
            <Icon name="ArrowLeft" size={15} />
            {getToken() ? "В кабинет" : "На главную"}
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
            Узнайте таланты, характер и потенциал вашего ребёнка по дате
            рождения
          </p>
        </div>

        {!profile && (
          <ChildForm
            childName={childName}
            birthDate={birthDate}
            motherDate={motherDate}
            fatherDate={fatherDate}
            error={error}
            onChildNameChange={setChildName}
            onBirthDateChange={setBirthDate}
            onMotherDateChange={setMotherDate}
            onFatherDateChange={setFatherDate}
            onCalculate={handleCalculate}
          />
        )}

        {profile && (
          <>
            <ChildHero profile={profile} name={displayName} />

            <ChildPaidContent
              profile={profile}
              desc={desc}
              name={displayName}
              purchased={purchased}
              balance={balance}
              spending={spending}
              birthDate={birthDate}
              motherDate={motherDate}
              fatherDate={fatherDate}
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