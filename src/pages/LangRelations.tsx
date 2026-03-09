import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getToken } from "@/lib/auth";
import Icon from "@/components/ui/icon";
import func2url from "../../backend/func2url.json";
import { checkPurchase, getBalance, spend } from "@/lib/payments";
import type { LRStep, LREntry } from "@/components/lang-relations/langRelationsTypes";
import { MIN_ENTRIES_FOR_REPORT } from "@/components/lang-relations/langRelationsTypes";
import LangRelationsPaywall from "@/components/lang-relations/LangRelationsPaywall";
import LangRelationsInputSteps from "@/components/lang-relations/LangRelationsInputSteps";
import LangRelationsReport from "@/components/lang-relations/LangRelationsReport";

const STEP_ORDER: LRStep[] = [
  "intro", "rel_type", "emotions", "user_reaction", "partner_reaction", "result", "saved", "report",
];

function calcProgress(step: LRStep, entries: number): number {
  if (step === "report") return 100;
  if (step === "intro") return entries > 0 ? Math.min((entries / MIN_ENTRIES_FOR_REPORT) * 90, 90) : 5;
  const idx = STEP_ORDER.indexOf(step);
  return idx < 0 ? 10 : Math.round(((idx + 1) / STEP_ORDER.length) * 100);
}

export default function LangRelations() {
  const navigate = useNavigate();

  // ─── Paywall ─────────────────────────────────────────────────────────────
  const [purchased, setPurchased] = useState(false);
  const [balance, setBalance] = useState(0);
  const [spending, setSpending] = useState(false);
  const [paywallLoading, setPaywallLoading] = useState(true);
  const [freeUsed, setFreeUsed] = useState(false);
  const isAuth = !!getToken();

  useEffect(() => {
    if (!isAuth) { setPaywallLoading(false); return; }
    Promise.all([
      checkPurchase("lang_relations"),
      getBalance(),
    ]).then(([purchaseRes, balanceRes]) => {
      if (purchaseRes.status === 200 && purchaseRes.data?.purchased) setPurchased(true);
      if (balanceRes.status === 200 && balanceRes.data?.balance !== undefined)
        setBalance(balanceRes.data.balance as number);
    }).finally(() => setPaywallLoading(false));
  }, []);

  const handleBuy = async () => {
    if (!isAuth) { navigate("/auth"); return; }
    setSpending(true);
    const res = await spend("lang_relations");
    if (res.status === 200) {
      setPurchased(true);
      setStep("rel_type");
    } else if (res.status === 402) {
      navigate("/balance");
    }
    setSpending(false);
  };

  // ─── Данные записи (черновик) ─────────────────────────────────────────────
  const [relType, setRelType] = useState<number | null>(null);
  const [emotions, setEmotions] = useState<number[]>([]);
  const [userReaction, setUserReaction] = useState<number[]>([]);
  const [partnerReaction, setPartnerReaction] = useState<number[]>([]);
  const [result, setResult] = useState<number | null>(null);

  // ─── Записи ──────────────────────────────────────────────────────────────
  const [entries, setEntries] = useState<LREntry[]>([]);
  const [saving, setSaving] = useState(false);

  // ─── Шаг ─────────────────────────────────────────────────────────────────
  const [step, setStepRaw] = useState<LRStep>("intro");

  const setStep = (s: LRStep) => {
    setStepRaw(s);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAddEntry = (entry: LREntry) => {
    const next = [...entries, entry];
    setEntries(next);
    if (!freeUsed) setFreeUsed(true);

    // Сохраняем в backend
    const token = getToken();
    if (token && "trainers" in func2url) {
      setSaving(true);
      fetch((func2url as Record<string, string>)["trainers"], {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Auth-Token": token },
        body: JSON.stringify({
          action: "save",
          trainer_type: "lang_relations",
          result_data: { entries: next },
        }),
      }).finally(() => setSaving(false));
    }
  };

  // Бесплатная логика: 1-я запись — без покупки, для остальных нужна покупка
  const canAddEntry = purchased || !freeUsed;

  // Показываем paywall при попытке добавить 2-ю+ запись без покупки
  const showPaywall = !paywallLoading && !purchased && freeUsed;

  const showProgress = !showPaywall || step === "report";

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] px-5 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Link
            to="/cabinet"
            className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors font-golos text-sm"
          >
            <Icon name="ArrowLeft" size={16} />
            Кабинет
          </Link>
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#6C5BA7]/10 flex items-center justify-center">
              <span className="font-golos text-sm font-bold text-[#6C5BA7]">М</span>
            </div>
            <span className="font-golos text-lg font-semibold text-[#4A3D7A] tracking-tight">Матрица личности</span>
          </Link>
        </div>
      </header>

      {showProgress && (
        <div className="max-w-2xl mx-auto w-full px-4 pt-6">
          <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-rose-400 to-rose-500 rounded-full transition-all duration-500"
              style={{ width: `${calcProgress(step, entries.length)}%` }}
            />
          </div>
          <div className="mt-3 mb-1">
            <h1 className="font-golos font-semibold text-gray-800 text-base">Язык отношений</h1>
          </div>
        </div>
      )}

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-6">
        {paywallLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-rose-400 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : showPaywall && step !== "report" ? (
          <LangRelationsPaywall
            balance={balance}
            spending={spending}
            isAuth={isAuth}
            onBuy={handleBuy}
          />
        ) : step === "report" ? (
          <LangRelationsReport
            entries={entries}
            saving={saving}
            onAddMore={() => {
              if (!canAddEntry) { handleBuy(); return; }
              setStep("rel_type");
            }}
            onCabinet={() => navigate("/cabinet")}
          />
        ) : (
          <LangRelationsInputSteps
            step={step}
            entries={entries}
            freeUsed={freeUsed}
            relType={relType}
            setRelType={setRelType}
            emotions={emotions}
            setEmotions={setEmotions}
            userReaction={userReaction}
            setUserReaction={setUserReaction}
            partnerReaction={partnerReaction}
            setPartnerReaction={setPartnerReaction}
            result={result}
            setResult={setResult}
            setStep={setStep}
            onAddEntry={handleAddEntry}
          />
        )}
      </main>
    </div>
  );
}