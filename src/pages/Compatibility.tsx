import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";
import { getToken } from "@/lib/auth";
import { checkPurchase, spend, getBalance, PRODUCT_PRICES } from "@/lib/payments";
import { calcFullCompatibility, DESCRIPTIONS } from "@/lib/matrix";
import type { FullCompatibilityResult, PythagorasMatrix } from "@/lib/matrix";
import func2url from "../../backend/func2url.json";

function ScoreCircle({ score, size = 80 }: { score: number; size?: number }) {
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 70 ? "#22c55e" : score >= 40 ? "#f59e0b" : "#ef4444";
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#f3f4f6" strokeWidth={4} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={4}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="font-serif font-bold text-gray-900" style={{ fontSize: size * 0.28 }}>
          {score}%
        </span>
      </div>
    </div>
  );
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm ${className}`}>
      {children}
    </div>
  );
}

function SectionHeading({ icon, title, subtitle }: { icon: string; title: string; subtitle?: string }) {
  return (
    <div className="flex items-start gap-3 mb-5">
      <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0 mt-0.5">
        <Icon name={icon} size={20} className="text-amber-600" />
      </div>
      <div>
        <h2 className="font-serif text-xl sm:text-2xl text-gray-900 leading-tight">{title}</h2>
        {subtitle && <p className="text-sm text-gray-400 mt-0.5">{subtitle}</p>}
      </div>
    </div>
  );
}

function scoreColor(score: number): string {
  if (score >= 70) return "#22c55e";
  if (score >= 40) return "#f59e0b";
  return "#ef4444";
}

function ScoreBar({ label, score }: { label: string; score: number }) {
  const color = scoreColor(score);
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span
          className="text-xs font-semibold px-2 py-0.5 rounded-full"
          style={{ backgroundColor: color + "18", color }}
        >
          {score}%
        </span>
      </div>
      <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{ width: `${score}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

function MatrixGrid({ matrix }: { matrix: PythagorasMatrix }) {
  return (
    <div className="grid grid-cols-3 gap-1.5">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
        <div
          key={digit}
          className="aspect-square rounded-lg bg-amber-50 border border-amber-100 flex flex-col items-center justify-center"
        >
          <span className="text-[10px] text-gray-400">{digit}</span>
          <span className="font-serif font-bold text-amber-700 text-lg leading-none">
            {matrix[digit] || 0}
          </span>
        </div>
      ))}
    </div>
  );
}

function PersonCard({
  label,
  person,
}: {
  label: string;
  person: { lifePath: number; character: number; destiny: number; soulUrge: number; matrix: PythagorasMatrix };
}) {
  const rows = [
    { name: "Жизненный путь", value: person.lifePath },
    { name: "Характер", value: person.character },
    { name: "Судьба", value: person.destiny },
    { name: "Душевное число", value: person.soulUrge },
  ];
  return (
    <div className="flex-1 min-w-0">
      <div className="text-xs font-semibold text-amber-600 uppercase tracking-widest mb-3 text-center">
        {label}
      </div>
      <div className="space-y-2">
        {rows.map((r) => (
          <div key={r.name} className="bg-amber-50/60 border border-amber-100 rounded-xl p-3 text-center">
            <div className="font-serif text-2xl font-bold text-amber-700">{r.value}</div>
            <div className="text-[11px] text-gray-500 mt-0.5">{r.name}</div>
            <div className="text-[11px] text-gray-400">{DESCRIPTIONS[r.value > 9 ? r.value : r.value]?.title}</div>
          </div>
        ))}
      </div>
      <div className="mt-4">
        <div className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2 text-center">
          Матрица Пифагора
        </div>
        <MatrixGrid matrix={person.matrix} />
      </div>
    </div>
  );
}

function DimensionCard({ icon, label, score }: { icon: string; label: string; score: number }) {
  return (
    <Card className="p-4 flex flex-col items-center text-center gap-3">
      <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center">
        <Icon name={icon} size={18} className="text-amber-600" />
      </div>
      <ScoreCircle score={score} size={72} />
      <span className="text-sm font-medium text-gray-700 leading-tight">{label}</span>
    </Card>
  );
}

export default function Compatibility() {
  const [date1, setDate1] = useState("");
  const [date2, setDate2] = useState("");
  const [result, setResult] = useState<FullCompatibilityResult | null>(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [purchased, setPurchased] = useState(false);
  const [balance, setBalance] = useState(0);
  const [spending, setSpending] = useState(false);

  function handleCalculate() {
    setError("");
    setResult(null);

    if (!date1 || !date2) {
      setError("Введите обе даты рождения");
      return;
    }

    const r = calcFullCompatibility(date1, date2);
    if (!r) {
      setError("Не удалось выполнить расчёт. Проверьте даты.");
      return;
    }

    setResult(r);

    const token = getToken();
    if (token && date1 && date2) {
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

  const [pdfLoading, setPdfLoading] = useState(false);

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
        body: JSON.stringify({ action: "generate", date1, date2 }),
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
          <Link to="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full border border-amber-400 flex items-center justify-center">
              <span className="font-serif text-sm font-bold text-amber-600">M</span>
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
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-100 to-amber-200 mb-4">
            <Icon name="Heart" size={28} className="text-amber-700" />
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-gray-900 mb-2">
            Совместимость по дате рождения
          </h1>
          <p className="text-gray-400 text-sm max-w-md mx-auto">
            Узнайте, насколько гармоничен ваш союз с точки зрения нумерологии
          </p>
        </div>

        <Card className="p-6 sm:p-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Дата рождения — Партнёр 1
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <Icon name="User" size={16} className="text-gray-400" />
                </div>
                <input
                  type="date"
                  value={date1}
                  onChange={(e) => setDate1(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-400 transition-colors"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Дата рождения — Партнёр 2
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <Icon name="UserPlus" size={16} className="text-gray-400" />
                </div>
                <input
                  type="date"
                  value={date2}
                  onChange={(e) => setDate2(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-400 transition-colors"
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="mt-4 flex items-center gap-2 text-sm text-red-600 bg-red-50 px-4 py-2.5 rounded-xl">
              <Icon name="AlertCircle" size={16} />
              {error}
            </div>
          )}

          <button
            onClick={handleCalculate}
            className="mt-6 w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-white font-semibold text-sm hover:from-amber-600 hover:to-amber-700 transition-all shadow-md shadow-amber-200/50 flex items-center justify-center gap-2"
          >
            <Icon name="Sparkles" size={18} />
            Рассчитать совместимость
          </button>
        </Card>

        {result && (
          <>
            <Card className="p-6 sm:p-8">
              <div className="flex flex-col items-center text-center">
                <ScoreCircle score={result.overallIndex} size={120} />
                <div className="mt-4">
                  <h2 className="font-serif text-2xl sm:text-3xl text-gray-900">
                    {result.unionType.name}
                  </h2>
                  <div className="mt-1 inline-flex items-center gap-1.5 text-sm text-amber-600 font-medium">
                    <Icon name="Sparkle" size={14} />
                    {result.pairArchetype}
                  </div>
                </div>
                <p className="mt-3 text-sm text-gray-500 max-w-lg leading-relaxed">
                  {result.unionType.description}
                </p>
              </div>
            </Card>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card className="p-5">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                    <Icon name="Zap" size={16} className="text-blue-500" />
                  </div>
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Динамика</span>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">{result.freeSummary.dynamic}</p>
              </Card>
              <Card className="p-5">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
                    <Icon name="Shield" size={16} className="text-green-500" />
                  </div>
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Сила</span>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">{result.freeSummary.strength}</p>
              </Card>
              <Card className="p-5">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center">
                    <Icon name="AlertTriangle" size={16} className="text-red-400" />
                  </div>
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Риск</span>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">{result.freeSummary.risk}</p>
              </Card>
            </div>

            <Card className="p-6 sm:p-8">
              <SectionHeading icon="BarChart3" title="Базовые показатели" subtitle="Доступно бесплатно" />
              <div className="space-y-4">
                <ScoreBar label="Жизненный путь" score={result.scores.lifePath} />
                <ScoreBar label="Характер" score={result.scores.character} />
              </div>
            </Card>

            {!purchased && (
              <Card className="p-6 sm:p-8 text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gray-100 mb-4">
                  <Icon name="Lock" size={28} className="text-gray-400" />
                </div>
                <h3 className="font-serif text-xl sm:text-2xl text-gray-900 mb-2">
                  Полный отчёт совместимости
                </h3>
                <p className="text-sm text-gray-500 max-w-md mx-auto mb-1">
                  Откройте доступ к 8 показателям совместимости, анализу кармической связи,
                  сравнению матриц Пифагора, рекомендациям и конфликтному индексу.
                </p>
                <p className="text-xs text-gray-400 mb-6">
                  Ваш баланс: {balance} руб.
                </p>
                {getToken() ? (
                  <button
                    onClick={handleBuy}
                    disabled={spending}
                    className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-white font-semibold text-sm hover:from-amber-600 hover:to-amber-700 transition-all shadow-md shadow-amber-200/50 disabled:opacity-60"
                  >
                    <Icon name="CreditCard" size={18} />
                    {spending ? "Оплата..." : `Открыть за ${PRODUCT_PRICES.compatibility} руб.`}
                  </button>
                ) : (
                  <button
                    onClick={() => navigate("/auth")}
                    className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-white font-semibold text-sm hover:from-amber-600 hover:to-amber-700 transition-all shadow-md shadow-amber-200/50"
                  >
                    <Icon name="LogIn" size={18} />
                    Войти для покупки
                  </button>
                )}
              </Card>
            )}

            {purchased && (
              <>
                <Card className="p-6 sm:p-8">
                  <SectionHeading
                    icon="Users"
                    title="Числа партнёров"
                    subtitle="Сравнение нумерологических профилей"
                  />
                  <div className="flex flex-col sm:flex-row gap-6">
                    <PersonCard label="Партнёр 1" person={result.person1} />
                    <div className="hidden sm:flex items-center">
                      <div className="w-px h-full bg-gray-100" />
                    </div>
                    <div className="sm:hidden h-px bg-gray-100" />
                    <PersonCard label="Партнёр 2" person={result.person2} />
                  </div>
                </Card>

                <div>
                  <SectionHeading
                    icon="Radar"
                    title="8 измерений совместимости"
                    subtitle="Детальный анализ вашего союза"
                  />
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <DimensionCard icon="Brain" label="Психологическая" score={result.scores.psychological} />
                    <DimensionCard icon="Heart" label="Эмоциональная" score={result.scores.emotional} />
                    <DimensionCard icon="Compass" label="Ценности" score={result.scores.values} />
                    <DimensionCard icon="Wallet" label="Финансовая" score={result.scores.financial} />
                    <DimensionCard icon="Lightbulb" label="Интеллектуальная" score={result.scores.intellectual} />
                    <DimensionCard icon="Flame" label="Интимная" score={result.scores.intimacy} />
                    <DimensionCard icon="Home" label="Семейный потенциал" score={result.scores.family} />
                    <DimensionCard icon="RefreshCcw" label="Совместимость циклов" score={result.lifeCycleCompat} />
                  </div>
                </div>

                <Card className="p-6 sm:p-8">
                  <SectionHeading icon="Swords" title="Индекс конфликтности" />
                  <div className="flex items-center gap-6">
                    <ScoreCircle score={result.scores.conflict} size={90} />
                    <div className="flex-1">
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {result.scores.conflict >= 60
                          ? "Высокий уровень потенциальных разногласий. Осознанность и работа над отношениями критически важны для гармонии."
                          : result.scores.conflict >= 30
                            ? "Умеренный уровень трения. Конфликты возможны, но они решаемы при взаимном уважении и открытом диалоге."
                            : "Низкий уровень конфликтности. Вы хорошо ладите и естественно находите компромиссы."}
                      </p>
                    </div>
                  </div>
                </Card>

                {result.karmic.isKarmic && (
                  <Card className="p-6 sm:p-8 border-amber-200 bg-amber-50/30">
                    <SectionHeading
                      icon="Infinity"
                      title="Кармическая связь"
                      subtitle="Обнаружены признаки глубинной связи"
                    />
                    <div className="space-y-3">
                      {result.karmic.reasons.map((reason, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center shrink-0 mt-0.5">
                            <Icon name="Star" size={12} className="text-amber-600" />
                          </div>
                          <p className="text-sm text-gray-700">{reason}</p>
                        </div>
                      ))}
                    </div>
                  </Card>
                )}

                <Card className="p-6 sm:p-8">
                  <SectionHeading
                    icon="BookOpen"
                    title="Рекомендации"
                    subtitle="Практические советы для вашей пары"
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-7 h-7 rounded-lg bg-green-50 flex items-center justify-center">
                          <Icon name="ThumbsUp" size={14} className="text-green-500" />
                        </div>
                        <span className="text-sm font-semibold text-gray-700">Сильные стороны</span>
                      </div>
                      <ul className="space-y-2">
                        {result.recommendations.strengths.map((s, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-400 shrink-0 mt-1.5" />
                            <span className="text-sm text-gray-600">{s}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center">
                          <Icon name="AlertTriangle" size={14} className="text-red-400" />
                        </div>
                        <span className="text-sm font-semibold text-gray-700">Риски</span>
                      </div>
                      <ul className="space-y-2">
                        {result.recommendations.risks.map((r, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0 mt-1.5" />
                            <span className="text-sm text-gray-600">{r}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center">
                          <Icon name="MessageCircle" size={14} className="text-amber-500" />
                        </div>
                        <span className="text-sm font-semibold text-gray-700">Советы</span>
                      </div>
                      <ul className="space-y-2">
                        {result.recommendations.advice.map((a, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 mt-1.5" />
                            <span className="text-sm text-gray-600">{a}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </Card>

                <div className="flex justify-center">
                  <button
                    onClick={onDownloadPdf}
                    disabled={pdfLoading}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-60"
                  >
                    <Icon name="Download" size={18} className="text-gray-500" />
                    {pdfLoading ? "Генерация PDF..." : "Скачать PDF-отчёт"}
                  </button>
                </div>
              </>
            )}
          </>
        )}
      </main>
    </div>
  );
}