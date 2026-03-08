import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getMe, logout, getToken } from "@/lib/auth";
import { getBalance } from "@/lib/payments";
import { DESCRIPTIONS } from "@/lib/matrix";
import Icon from "@/components/ui/icon";

type User = {
  id: number;
  email: string;
  name: string | null;
  birth_date: string | null;
  created_at: string;
};

type Calculation = {
  id: number;
  birth_date: string;
  life_path: number;
  character_num: number;
  destiny: number;
  created_at: string;
  calc_type: "personal" | "compatibility" | "child" | "destiny" | "family";
  birth_date2: string | null;
  child_name: string | null;
  soul_urge: number | null;
  overall_score: number | null;
};

type Purchase = {
  id: number;
  product: string;
  birth_date: string | null;
  birth_date2: string | null;
  child_name: string | null;
  amount: number;
  created_at: string;
};

type CalcTab = "all" | "personal" | "compatibility" | "child" | "destiny" | "family";
type Segment = "personal" | "couple" | "child" | null;

const TAB_CONFIG: Record<CalcTab, { label: string; icon: string }> = {
  all: { label: "Все", icon: "LayoutGrid" },
  personal: { label: "Персональные анализы", icon: "User" },
  destiny: { label: "Анализ предназначения", icon: "Map" },
  compatibility: { label: "Анализ отношений", icon: "Heart" },
  child: { label: "Анализ ребёнка", icon: "Baby" },
  family: { label: "Анализ семьи", icon: "Users" },
};

const TYPE_LABELS: Record<string, { label: string; icon: string; color: string; bg: string }> = {
  personal: { label: "Персональный", icon: "User", color: "text-[#6C5BA7]", bg: "bg-[#F4F2FA]" },
  destiny: { label: "Предназначение", icon: "Map", color: "text-[#6C5BA7]", bg: "bg-[#F4F2FA]" },
  compatibility: { label: "Отношения", icon: "Heart", color: "text-rose-500", bg: "bg-rose-50" },
  child: { label: "Ребёнок", icon: "Baby", color: "text-[#6C5BA7]", bg: "bg-[#F4F2FA]" },
  family: { label: "Семья", icon: "Users", color: "text-emerald-600", bg: "bg-emerald-50" },
};

function isPurchased(calc: Calculation, purchases: Purchase[]): boolean {
  if (calc.calc_type === "personal") {
    return purchases.some(
      p => p.product === "full_analysis" && p.birth_date === calc.birth_date
    );
  }
  if (calc.calc_type === "compatibility") {
    return purchases.some(
      p => p.product === "compatibility" && p.birth_date === calc.birth_date && p.birth_date2 === calc.birth_date2
    );
  }
  if (calc.calc_type === "child") {
    return purchases.some(
      p => p.product === "child_analysis" && p.birth_date === calc.birth_date
    );
  }
  if (calc.calc_type === "destiny") {
    return purchases.some(
      p => p.product === "destiny_map" && p.birth_date === calc.birth_date
    );
  }
  if (calc.calc_type === "family") {
    return purchases.some(
      p => p.product === "family_matrix" && p.birth_date === calc.birth_date && p.birth_date2 === calc.birth_date2
    );
  }
  return false;
}

function getCalcLink(calc: Calculation): string {
  if (calc.calc_type === "personal") {
    return `/result?date=${calc.birth_date}`;
  }
  if (calc.calc_type === "compatibility" && calc.birth_date2) {
    return `/compatibility?date1=${calc.birth_date}&date2=${calc.birth_date2}`;
  }
  if (calc.calc_type === "child") {
    const nameParam = calc.child_name ? `&name=${encodeURIComponent(calc.child_name)}` : "";
    return `/child?date=${calc.birth_date}${nameParam}`;
  }
  if (calc.calc_type === "destiny") {
    return `/destiny?date=${calc.birth_date}`;
  }
  if (calc.calc_type === "family" && calc.birth_date2) {
    return `/family?date1=${calc.birth_date}&date2=${calc.birth_date2}`;
  }
  return "/";
}

function formatDate(d: string): string {
  try {
    return new Date(d).toLocaleDateString("ru-RU");
  } catch {
    return d;
  }
}

function NumBadge({ num, label }: { num: number; label: string }) {
  const desc = DESCRIPTIONS[num];
  return (
    <div className="bg-[#F4F2FA] border border-[#E8E4F5] rounded-xl p-4 flex flex-col gap-1">
      <div className="text-2xl font-golos font-bold text-[#6C5BA7]">{num}</div>
      <div className="text-xs font-medium text-[#6C5BA7]/70 uppercase tracking-wide">{label}</div>
      {desc && <div className="text-xs text-gray-500 mt-1">{desc.title}</div>}
    </div>
  );
}

function ScoreCircle({ score }: { score: number }) {
  const size = 64;
  const radius = (size - 6) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 70 ? "#22c55e" : score >= 40 ? "#f59e0b" : "#ef4444";
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#f3f4f6" strokeWidth={3} />
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={color} strokeWidth={3} strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset} />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="font-golos font-bold text-gray-900 text-sm">{score}%</span>
      </div>
    </div>
  );
}

export default function Cabinet() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [calculations, setCalculations] = useState<Calculation[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCalc, setActiveCalc] = useState<Calculation | null>(null);
  const [balance, setBalance] = useState<number>(0);
  const [tab, setTab] = useState<CalcTab>("all");
  const [openSegment, setOpenSegment] = useState<Segment>(null);

  useEffect(() => {
    if (!getToken()) { navigate("/auth"); return; }
    getMe().then(res => {
      if (res.status === 200 && typeof res.data === "object" && res.data !== null && "user" in res.data) {
        const d = res.data as { user: User; calculations: Calculation[]; purchases: Purchase[] };
        setUser(d.user);
        setCalculations(d.calculations);
        setPurchases(d.purchases || []);
        if (d.calculations.length > 0) setActiveCalc(d.calculations[0]);
        getBalance().then(res => { if (res.status === 200 && res.data?.balance !== undefined) setBalance(res.data.balance as number); });
      } else {
        navigate("/auth");
      }
    }).finally(() => setLoading(false));
  }, [navigate]);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const filtered = tab === "all" ? calculations : calculations.filter(c => c.calc_type === tab);

  const counts = {
    all: calculations.length,
    personal: calculations.filter(c => c.calc_type === "personal").length,
    destiny: calculations.filter(c => c.calc_type === "destiny").length,
    compatibility: calculations.filter(c => c.calc_type === "compatibility").length,
    child: calculations.filter(c => c.calc_type === "child").length,
    family: calculations.filter(c => c.calc_type === "family").length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-400 text-sm font-golos">Загрузка...</div>
      </div>
    );
  }

  const renderCalcTitle = (calc: Calculation) => {
    if (calc.calc_type === "compatibility" || calc.calc_type === "family") {
      return `${formatDate(calc.birth_date)} + ${formatDate(calc.birth_date2 || "")}`;
    }
    if (calc.calc_type === "child" && calc.child_name) {
      return calc.child_name;
    }
    return formatDate(calc.birth_date);
  };

  const renderCalcSubtitle = (calc: Calculation) => {
    if (calc.calc_type === "child" && calc.child_name) {
      return formatDate(calc.birth_date);
    }
    return formatDate(calc.created_at);
  };

  const renderCalcBadges = (calc: Calculation) => {
    if (calc.calc_type === "compatibility" && calc.overall_score !== null) {
      return (
        <span
          className="text-xs font-bold px-2 py-1 rounded-full"
          style={{
            backgroundColor: calc.overall_score >= 70 ? "#dcfce7" : calc.overall_score >= 40 ? "#fef3c7" : "#fecaca",
            color: calc.overall_score >= 70 ? "#16a34a" : calc.overall_score >= 40 ? "#d97706" : "#dc2626",
          }}
        >
          {calc.overall_score}%
        </span>
      );
    }
    if (calc.calc_type === "family") {
      return (
        <span className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-600 text-xs flex items-center justify-center">
          <Icon name="Users" size={12} />
        </span>
      );
    }
    return (
      <div className="flex gap-1">
        {[calc.life_path, calc.character_num, calc.destiny].filter(Boolean).map((n, i) => (
          <span key={i} className="w-6 h-6 rounded-full bg-[#F4F2FA] text-[#6C5BA7] text-xs flex items-center justify-center font-bold">
            {n}
          </span>
        ))}
      </div>
    );
  };

  const renderDetail = (calc: Calculation) => {
    const paid = isPurchased(calc, purchases);
    const type = TYPE_LABELS[calc.calc_type] || TYPE_LABELS.personal;
    const link = getCalcLink(calc);

    if (calc.calc_type === "compatibility") {
      return (
        <div className="space-y-5">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg ${type.bg} flex items-center justify-center`}>
                  <Icon name={type.icon} size={16} className={type.color} />
                </div>
                <div>
                  <h2 className="font-golos font-semibold text-xl text-gray-900">Анализ отношений</h2>
                  <p className="text-xs text-gray-400">{formatDate(calc.birth_date)} и {formatDate(calc.birth_date2 || "")}</p>
                </div>
              </div>
              <span className="text-xs text-gray-400">{formatDate(calc.created_at)}</span>
            </div>

            <div className="flex items-center justify-center mb-5">
              {calc.overall_score !== null && <ScoreCircle score={calc.overall_score} />}
            </div>

            <div className="grid grid-cols-3 gap-3 mb-5">
              <NumBadge num={calc.life_path} label="Путь 1" />
              <NumBadge num={calc.character_num} label="Характер 1" />
              <NumBadge num={calc.destiny} label="Судьба 1" />
            </div>

            {paid ? (
              <Link to={link}
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-medium transition-colors text-white"
                style={{ background: "linear-gradient(135deg, #e11d48, #f43f5e, #fb7185)" }}>
                <Icon name="ArrowRight" size={14} />
                Открыть полный отчёт
              </Link>
            ) : (
              <Link to={link}
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-medium transition-colors border-2 border-rose-200 text-rose-600 hover:bg-rose-50">
                <Icon name="Lock" size={14} />
                Получить полный отчёт
              </Link>
            )}
          </div>

          {paid && (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-4 flex items-center gap-3">
              <Icon name="CheckCircle" size={18} className="text-green-500 shrink-0" />
              <span className="text-sm text-green-700">Полный отчёт оплачен и доступен</span>
            </div>
          )}
        </div>
      );
    }

    if (calc.calc_type === "family") {
      return (
        <div className="space-y-5">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg ${type.bg} flex items-center justify-center`}>
                  <Icon name={type.icon} size={16} className={type.color} />
                </div>
                <div>
                  <h2 className="font-golos font-semibold text-xl text-gray-900">Анализ семьи</h2>
                  <p className="text-xs text-gray-400">{formatDate(calc.birth_date)} и {formatDate(calc.birth_date2 || "")}</p>
                </div>
              </div>
              <span className="text-xs text-gray-400">{formatDate(calc.created_at)}</span>
            </div>

            {paid ? (
              <Link to={link}
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-medium transition-colors text-white"
                style={{ background: "linear-gradient(135deg, #047857, #059669, #34d399)" }}>
                <Icon name="ArrowRight" size={14} />
                Открыть полный отчёт
              </Link>
            ) : (
              <Link to={link}
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-medium transition-colors border-2 border-emerald-200 text-emerald-600 hover:bg-emerald-50">
                <Icon name="Lock" size={14} />
                Получить полный отчёт
              </Link>
            )}
          </div>

          {paid && (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-4 flex items-center gap-3">
              <Icon name="CheckCircle" size={18} className="text-green-500 shrink-0" />
              <span className="text-sm text-green-700">Полный отчёт оплачен и доступен</span>
            </div>
          )}
        </div>
      );
    }

    if (calc.calc_type === "child") {
      return (
        <div className="space-y-5">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg ${type.bg} flex items-center justify-center`}>
                  <Icon name={type.icon} size={16} className={type.color} />
                </div>
                <div>
                  <h2 className="font-golos font-semibold text-xl text-gray-900">
                    {calc.child_name ? `Анализ: ${calc.child_name}` : "Анализ личности ребёнка"}
                  </h2>
                  <p className="text-xs text-gray-400">{formatDate(calc.birth_date)}</p>
                </div>
              </div>
              <span className="text-xs text-gray-400">{formatDate(calc.created_at)}</span>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-4">
              <NumBadge num={calc.life_path} label="Жизненный путь" />
              <NumBadge num={calc.character_num} label="Характер" />
              <NumBadge num={calc.destiny} label="Судьба" />
            </div>
            {calc.soul_urge && (
              <div className="mb-5">
                <NumBadge num={calc.soul_urge} label="Душевное число" />
              </div>
            )}

            {paid ? (
              <Link to={link}
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-medium transition-colors text-white bg-[#6C5BA7] hover:bg-[#5A4B95]">
                <Icon name="ArrowRight" size={14} />
                Открыть полный анализ
              </Link>
            ) : (
              <Link to={link}
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-medium transition-colors border-2 border-[#E8E4F5] text-[#6C5BA7] hover:bg-[#F4F2FA]">
                <Icon name="Lock" size={14} />
                Получить полный отчёт
              </Link>
            )}
          </div>

          {paid && (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-4 flex items-center gap-3">
              <Icon name="CheckCircle" size={18} className="text-green-500 shrink-0" />
              <span className="text-sm text-green-700">Полный отчёт оплачен и доступен</span>
            </div>
          )}

          {DESCRIPTIONS[calc.life_path] && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-[#F4F2FA] flex items-center justify-center">
                  <span className="font-golos text-lg font-bold text-[#6C5BA7]">{calc.life_path}</span>
                </div>
                <div>
                  <div className="font-golos font-semibold text-gray-900">{DESCRIPTIONS[calc.life_path].title}</div>
                  <div className="text-xs text-[#6C5BA7]">{DESCRIPTIONS[calc.life_path].tagline}</div>
                </div>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">{DESCRIPTIONS[calc.life_path].character}</p>
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="space-y-5">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg ${type.bg} flex items-center justify-center`}>
                <Icon name={type.icon} size={16} className={type.color} />
              </div>
              <div>
                <h2 className="font-golos font-semibold text-xl text-gray-900">Персональный анализ</h2>
                <p className="text-xs text-gray-400">{formatDate(calc.birth_date)}</p>
              </div>
            </div>
            <span className="text-xs text-gray-400">{formatDate(calc.created_at)}</span>
          </div>
          <div className="grid grid-cols-3 gap-3 mb-4">
            <NumBadge num={calc.life_path} label="Жизненный путь" />
            <NumBadge num={calc.character_num} label="Характер" />
            <NumBadge num={calc.destiny} label="Судьба" />
          </div>

          {paid ? (
            <Link to={link}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-medium transition-colors text-white bg-[#6C5BA7] hover:bg-[#5A4B95]">
              <Icon name="ArrowRight" size={14} />
              Открыть полный анализ
            </Link>
          ) : (
            <Link to={link}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-medium transition-colors border-2 border-[#E8E4F5] text-[#6C5BA7] hover:bg-[#F4F2FA]">
              <Icon name="Lock" size={14} />
              Получить полный отчёт
            </Link>
          )}
        </div>

        {paid && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-4 flex items-center gap-3">
            <Icon name="CheckCircle" size={18} className="text-green-500 shrink-0" />
            <span className="text-sm text-green-700">Полный отчёт оплачен и доступен</span>
          </div>
        )}

        {DESCRIPTIONS[calc.life_path] && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-[#F4F2FA] flex items-center justify-center">
                <span className="font-golos text-lg font-bold text-[#6C5BA7]">{calc.life_path}</span>
              </div>
              <div>
                <div className="font-golos font-semibold text-gray-900">{DESCRIPTIONS[calc.life_path].title}</div>
                <div className="text-xs text-[#6C5BA7]">{DESCRIPTIONS[calc.life_path].tagline}</div>
              </div>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed mb-4">
              {DESCRIPTIONS[calc.life_path].character}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="text-xs font-golos font-semibold text-gray-500 uppercase tracking-wide mb-2">Сильные стороны</div>
                <ul className="space-y-1.5">
                  {DESCRIPTIONS[calc.life_path].strengths.map(s => (
                    <li key={s} className="flex items-start gap-2 text-sm text-gray-700">
                      <Icon name="Check" size={14} className="text-green-500 mt-0.5 shrink-0" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="text-xs font-golos font-semibold text-gray-500 uppercase tracking-wide mb-2">Сферы роста</div>
                <ul className="space-y-1.5">
                  {DESCRIPTIONS[calc.life_path].challenges.map(c => (
                    <li key={c} className="flex items-start gap-2 text-sm text-gray-700">
                      <Icon name="ArrowUpRight" size={14} className="text-[#6C5BA7] mt-0.5 shrink-0" />
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {DESCRIPTIONS[calc.life_path] && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-3">
                <Icon name="Briefcase" size={16} className="text-[#6C5BA7]" />
                <span className="font-golos font-semibold text-gray-800 text-sm">Карьера</span>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">{DESCRIPTIONS[calc.life_path].career}</p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-3">
                <Icon name="Heart" size={16} className="text-rose-400" />
                <span className="font-golos font-semibold text-gray-800 text-sm">Отношения</span>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">{DESCRIPTIONS[calc.life_path].relationships}</p>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] px-5 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#6C5BA7]/10 flex items-center justify-center">
              <span className="font-golos text-sm font-bold text-[#6C5BA7]">М</span>
            </div>
            <span className="font-golos text-lg font-semibold text-[#4A3D7A] tracking-tight">Матрица личности</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500 hidden sm:block font-golos">{user?.email}</span>
            <Link to="/balance" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F4F2FA] border border-[#E8E4F5] text-[#6C5BA7] text-sm font-medium hover:bg-[#E8E4F5] transition-colors font-golos">
              <Icon name="Wallet" size={14} />
              {balance} ₽
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors font-golos"
            >
              <Icon name="LogOut" size={15} />
              Выйти
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8">
        <div className="mb-8">
          <h1 className="font-golos font-semibold text-3xl text-gray-900 mb-1">
            Привет, {user?.name || "друг"}
          </h1>
          <p className="text-gray-400 text-sm font-golos">Здесь хранятся ваши результаты</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100 flex gap-1 overflow-x-auto">
                {(Object.keys(TAB_CONFIG) as CalcTab[]).map(t => (
                  <button
                    key={t}
                    onClick={() => { setTab(t); setActiveCalc(null); }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors font-golos ${
                      tab === t ? "bg-[#F4F2FA] text-[#6C5BA7]" : "text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    <Icon name={TAB_CONFIG[t].icon} size={13} />
                    {TAB_CONFIG[t].label}
                    {counts[t] > 0 && (
                      <span className={`ml-0.5 text-[10px] rounded-full px-1.5 py-px ${
                        tab === t ? "bg-[#E8E4F5] text-[#6C5BA7]" : "bg-gray-100 text-gray-400"
                      }`}>{counts[t]}</span>
                    )}
                  </button>
                ))}
              </div>

              {filtered.length === 0 ? (
                <div className="px-5 py-10 text-center">
                  <div className="w-12 h-12 rounded-xl bg-[#F4F2FA] flex items-center justify-center mx-auto mb-3">
                    <Icon name="Inbox" size={22} className="text-[#6C5BA7]/50" />
                  </div>
                  <p className="text-gray-400 text-sm mb-4 font-golos">
                    {tab === "all" ? "Результатов пока нет" : `Нет результатов в категории «${TAB_CONFIG[tab].label}»`}
                  </p>
                  <Link to={tab === "compatibility" ? "/compatibility" : tab === "child" ? "/child" : tab === "family" ? "/family" : tab === "destiny" ? "/destiny" : "/"} className="text-sm text-[#6C5BA7] font-medium hover:underline font-golos">
                    Пройти анализ
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-gray-50 max-h-[480px] overflow-y-auto">
                  {filtered.map(calc => {
                    const type = TYPE_LABELS[calc.calc_type] || TYPE_LABELS.personal;
                    const paid = isPurchased(calc, purchases);
                    return (
                      <button
                        key={calc.id}
                        onClick={() => setActiveCalc(calc)}
                        className={`w-full px-4 py-3.5 flex items-center gap-3 text-left transition-colors hover:bg-[#F4F2FA]/50 ${
                          activeCalc?.id === calc.id ? "bg-[#F4F2FA]/70" : ""
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-lg ${type.bg} flex items-center justify-center shrink-0`}>
                          <Icon name={type.icon} size={14} className={type.color} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-800 truncate font-golos">{renderCalcTitle(calc)}</span>
                            {paid && <Icon name="CheckCircle" size={12} className="text-green-500 shrink-0" />}
                            {!paid && <Icon name="Lock" size={11} className="text-gray-300 shrink-0" />}
                          </div>
                          <div className="text-xs text-gray-400 mt-0.5 font-golos">{renderCalcSubtitle(calc)}</div>
                        </div>
                        <div className="shrink-0">
                          {renderCalcBadges(calc)}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="mt-4 space-y-2">
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setOpenSegment(openSegment === "personal" ? null : "personal")}
                  className={`flex flex-col items-center gap-1.5 py-3 rounded-xl border-2 text-xs font-medium transition-colors font-golos ${openSegment === "personal" ? "border-[#6C5BA7] bg-[#F4F2FA] text-[#6C5BA7]" : "border-dashed border-[#E8E4F5] text-[#6C5BA7]/70 hover:bg-[#F4F2FA]"}`}
                >
                  <Icon name="User" size={16} />
                  Личный
                  <Icon name={openSegment === "personal" ? "ChevronUp" : "ChevronDown"} size={12} />
                </button>
                <button
                  onClick={() => setOpenSegment(openSegment === "couple" ? null : "couple")}
                  className={`flex flex-col items-center gap-1.5 py-3 rounded-xl border-2 text-xs font-medium transition-colors font-golos ${openSegment === "couple" ? "border-rose-400 bg-rose-50 text-rose-600" : "border-dashed border-rose-200 text-rose-500 hover:bg-rose-50"}`}
                >
                  <Icon name="Heart" size={16} />
                  Семья
                  <Icon name={openSegment === "couple" ? "ChevronUp" : "ChevronDown"} size={12} />
                </button>
                <button
                  onClick={() => setOpenSegment(openSegment === "child" ? null : "child")}
                  className={`flex flex-col items-center gap-1.5 py-3 rounded-xl border-2 text-xs font-medium transition-colors font-golos ${openSegment === "child" ? "border-[#6C5BA7] bg-[#F4F2FA] text-[#6C5BA7]" : "border-dashed border-[#E8E4F5] text-[#6C5BA7]/70 hover:bg-[#F4F2FA]"}`}
                >
                  <Icon name="Baby" size={16} />
                  Ребёнок
                  <Icon name={openSegment === "child" ? "ChevronUp" : "ChevronDown"} size={12} />
                </button>
              </div>

              {openSegment === "personal" && (
                <div className="bg-[#F4F2FA] rounded-xl p-3 space-y-2 border border-[#E8E4F5] animate-in fade-in slide-in-from-top-2 duration-200">
                  <Link to="/result" className="flex items-center gap-3 p-3 bg-white rounded-lg hover:shadow-sm transition-shadow">
                    <div className="w-8 h-8 rounded-lg bg-[#F4F2FA] flex items-center justify-center">
                      <Icon name="Sparkles" size={14} className="text-[#6C5BA7]" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-800 font-golos">Персональный анализ личности</div>
                      <div className="text-xs text-gray-400 font-golos">Характер, судьба, таланты</div>
                    </div>
                    <span className="text-xs font-bold text-[#6C5BA7] font-golos">490 ₽</span>
                  </Link>
                  <Link to="/destiny" className="flex items-center gap-3 p-3 bg-white rounded-lg hover:shadow-sm transition-shadow">
                    <div className="w-8 h-8 rounded-lg bg-[#F4F2FA] flex items-center justify-center">
                      <Icon name="Map" size={14} className="text-[#6C5BA7]" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-800 font-golos">Анализ предназначения</div>
                      <div className="text-xs text-gray-400 font-golos">Глубокий разбор всех аспектов</div>
                    </div>
                    <span className="text-xs font-bold text-[#6C5BA7] font-golos">1 490 ₽</span>
                  </Link>
                </div>
              )}

              {openSegment === "couple" && (
                <div className="bg-rose-50 rounded-xl p-3 space-y-2 border border-rose-200 animate-in fade-in slide-in-from-top-2 duration-200">
                  <Link to="/compatibility" className="flex items-center gap-3 p-3 bg-white rounded-lg hover:shadow-sm transition-shadow">
                    <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center">
                      <Icon name="Heart" size={14} className="text-rose-500" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-800 font-golos">Анализ отношений</div>
                      <div className="text-xs text-gray-400 font-golos">Совместимость и динамика пары</div>
                    </div>
                    <span className="text-xs font-bold text-rose-500 font-golos">690 ₽</span>
                  </Link>
                  <Link to="/family" className="flex items-center gap-3 p-3 bg-white rounded-lg hover:shadow-sm transition-shadow">
                    <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center">
                      <Icon name="Users" size={14} className="text-rose-500" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-800 font-golos">Анализ семьи</div>
                      <div className="text-xs text-gray-400 font-golos">Полный анализ семейных связей</div>
                    </div>
                    <span className="text-xs font-bold text-rose-500 font-golos">1 990 ₽</span>
                  </Link>
                </div>
              )}

              {openSegment === "child" && (
                <div className="bg-[#F4F2FA] rounded-xl p-3 space-y-2 border border-[#E8E4F5] animate-in fade-in slide-in-from-top-2 duration-200">
                  <Link to="/child" className="flex items-center gap-3 p-3 bg-white rounded-lg hover:shadow-sm transition-shadow">
                    <div className="w-8 h-8 rounded-lg bg-[#F4F2FA] flex items-center justify-center">
                      <Icon name="Baby" size={14} className="text-[#6C5BA7]" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-800 font-golos">Анализ личности ребёнка</div>
                      <div className="text-xs text-gray-400 font-golos">Характер и потенциал ребёнка</div>
                    </div>
                    <span className="text-xs font-bold text-[#6C5BA7] font-golos">990 ₽</span>
                  </Link>
                  <Link to="/family" className="flex items-center gap-3 p-3 bg-white rounded-lg hover:shadow-sm transition-shadow">
                    <div className="w-8 h-8 rounded-lg bg-[#F4F2FA] flex items-center justify-center">
                      <Icon name="Users" size={14} className="text-[#6C5BA7]" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-800 font-golos">Анализ семьи</div>
                      <div className="text-xs text-gray-400 font-golos">Родители + дети — полная картина</div>
                    </div>
                    <span className="text-xs font-bold text-[#6C5BA7] font-golos">1 990 ₽</span>
                  </Link>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-2">
            {activeCalc ? (
              renderDetail(activeCalc)
            ) : (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
                <div className="w-14 h-14 rounded-xl bg-[#F4F2FA] flex items-center justify-center mx-auto mb-4">
                  <Icon name="MousePointerClick" size={24} className="text-[#6C5BA7]/50" />
                </div>
                <h3 className="font-golos font-semibold text-lg text-gray-800 mb-2">Выберите результат</h3>
                <p className="text-gray-400 text-sm font-golos">Нажмите на любой результат слева, чтобы увидеть детали</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
