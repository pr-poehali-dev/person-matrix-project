import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Icon from "@/components/ui/icon";
import { getToken, saveCompatibilityCalc } from "@/lib/auth";
import { checkPurchase, spend, getBalance } from "@/lib/payments";
import { calcFullCompatibility } from "@/lib/matrix";
import type { FullCompatibilityResult } from "@/lib/matrix";
import func2url from "../../backend/func2url.json";
import CompatibilityForm from "@/components/compatibility/CompatibilityForm";
import CompatibilityFreeResult from "@/components/compatibility/CompatibilityFreeResult";
import CompatibilityPaidResult from "@/components/compatibility/CompatibilityPaidResult";

export default function Compatibility() {
  const [searchParams] = useSearchParams();
  const [date1, setDate1] = useState(searchParams.get("date1") || "");
  const [date2, setDate2] = useState(searchParams.get("date2") || "");
  const [result, setResult] = useState<FullCompatibilityResult | null>(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [purchased, setPurchased] = useState(false);
  const [balance, setBalance] = useState(0);
  const [spending, setSpending] = useState(false);
  const [autoCalcDone, setAutoCalcDone] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);

  function handleCalculate() {
    setError("");
    setResult(null);

    if (!date1 || !date2) {
      setError("Введите данные обоих партнёров");
      return;
    }

    const r = calcFullCompatibility(date1, date2);
    if (!r) {
      setError("Не удалось выполнить анализ. Проверьте данные.");
      return;
    }

    setResult(r);

    const token = getToken();
    if (token && date1 && date2) {
      saveCompatibilityCalc(date1, date2, r.person1.lifePath, r.person1.character, r.person1.destiny, r.overall);
      Promise.all([
        checkPurchase("compatibility", { birth_date: date1, birth_date2: date2 }),
        getBalance(),
      ]).then(([purchaseRes, balanceRes]) => {
        if (purchaseRes.status === 200 && purchaseRes.data?.purchased) setPurchased(true);
        else setPurchased(false);
        if (balanceRes.status === 200 && balanceRes.data?.balance !== undefined)
          setBalance(balanceRes.data.balance as number);
      });
    } else {
      setPurchased(false);
    }
  }

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
    const res = await spend("compatibility", { birth_date: date1, birth_date2: date2 });
    if (res.status === 200) setPurchased(true);
    else if (res.status === 402) navigate("/balance");
    setSpending(false);
  };

  const onDownloadPdf = async () => {
    const token = getToken();
    if (!token) {
      navigate("/auth");
      return;
    }
    setPdfLoading(true);
    try {
      const res = await fetch((func2url as Record<string, string>)["compat-pdf"], {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Auth-Token": token },
        body: JSON.stringify({ date1, date2 }),
      });
      if (res.status === 403) {
        alert("Отчёт не оплачен");
        setPdfLoading(false);
        return;
      }
      const data = await res.json();
      const parsed = typeof data === "string" ? JSON.parse(data) : data;
      if (parsed.pdf) {
        const bytes = Uint8Array.from(atob(parsed.pdf), (c) => c.charCodeAt(0));
        const blob = new Blob([bytes], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = parsed.filename || "compatibility_report.pdf";
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch {
      alert("Не удалось скачать PDF. Попробуйте позже.");
    }
    setPdfLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-100 px-6 py-4 sticky top-0 z-30">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link to={getToken() ? "/cabinet" : "/"} className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#6C5BA7]/10 flex items-center justify-center">
              <span className="font-golos text-sm font-bold text-[#6C5BA7]">М</span>
            </div>
            <span className="font-golos font-semibold text-lg text-[#4A3D7A] tracking-tight">Матрица личности</span>
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
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-[#F4F2FA] to-[#E8E4F5] mb-4">
            <Icon name="Heart" size={28} className="text-[#6C5BA7]" />
          </div>
          <h1 className="font-golos font-semibold text-3xl sm:text-4xl text-gray-900 mb-2">
            Анализ совместимости пары
          </h1>
          <p className="text-gray-400 text-sm max-w-md mx-auto">
            Узнайте, насколько гармоничен ваш союз и в чём ваша сила как пары
          </p>
        </div>

        <CompatibilityForm
          date1={date1}
          date2={date2}
          error={error}
          onDate1Change={setDate1}
          onDate2Change={setDate2}
          onCalculate={handleCalculate}
        />

        {result && (
          <>
            <CompatibilityFreeResult
              result={result}
              purchased={purchased}
              balance={balance}
              spending={spending}
              isAuth={!!getToken()}
              onBuy={handleBuy}
              onNavigateAuth={() => navigate("/auth")}
            />

            {purchased && (
              <CompatibilityPaidResult
                result={result}
                pdfLoading={pdfLoading}
                onDownloadPdf={onDownloadPdf}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}
