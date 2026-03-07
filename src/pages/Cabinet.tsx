import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getMe, logout, getToken } from "@/lib/auth";
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
};

function NumBadge({ num, label }: { num: number; label: string }) {
  const desc = DESCRIPTIONS[num];
  return (
    <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex flex-col gap-1">
      <div className="text-2xl font-serif font-bold text-amber-700">{num}</div>
      <div className="text-xs font-medium text-amber-600 uppercase tracking-wide">{label}</div>
      {desc && <div className="text-xs text-gray-500 mt-1">{desc.title} — {desc.tagline}</div>}
    </div>
  );
}

export default function Cabinet() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [calculations, setCalculations] = useState<Calculation[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCalc, setActiveCalc] = useState<Calculation | null>(null);

  useEffect(() => {
    if (!getToken()) { navigate("/auth"); return; }
    getMe().then(res => {
      if (res.status === 200 && typeof res.data === "object" && res.data !== null && "user" in res.data) {
        const d = res.data as { user: User; calculations: Calculation[] };
        setUser(d.user);
        setCalculations(d.calculations);
        if (d.calculations.length > 0) setActiveCalc(d.calculations[0]);
      } else {
        navigate("/auth");
      }
    }).finally(() => setLoading(false));
  }, [navigate]);

  const handleLogout = async () => {
    await logout();
    navigate("/");
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
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full border border-amber-400 flex items-center justify-center">
              <span className="font-serif text-sm font-bold text-amber-600">М</span>
            </div>
            <span className="font-serif text-lg text-gray-800">Матрица личности</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500 hidden sm:block">{user?.email}</span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors"
            >
              <Icon name="LogOut" size={15} />
              Выйти
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8">
        {/* Greeting */}
        <div className="mb-8">
          <h1 className="font-serif text-3xl text-gray-900 mb-1">
            Привет, {user?.name || "красавица"} 👋
          </h1>
          <p className="text-gray-400 text-sm">Здесь хранится ваша история расчётов</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: history list */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
                <h2 className="font-semibold text-gray-800 text-sm">История расчётов</h2>
                <span className="text-xs bg-amber-100 text-amber-700 rounded-full px-2 py-0.5">{calculations.length}</span>
              </div>

              {calculations.length === 0 ? (
                <div className="px-5 py-10 text-center">
                  <div className="text-3xl mb-3">🔮</div>
                  <p className="text-gray-400 text-sm mb-4">Расчётов пока нет</p>
                  <Link to="/" className="text-sm text-amber-600 font-medium hover:underline">
                    Сделать первый расчёт →
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {calculations.map(calc => (
                    <button
                      key={calc.id}
                      onClick={() => setActiveCalc(calc)}
                      className="w-full px-5 py-4 flex items-center justify-between text-left transition-colors hover:bg-amber-50"
                      style={{ background: activeCalc?.id === calc.id ? "#fffbeb" : undefined }}
                    >
                      <div>
                        <div className="text-sm font-medium text-gray-800">{calc.birth_date}</div>
                        <div className="text-xs text-gray-400 mt-0.5">
                          {new Date(calc.created_at).toLocaleDateString("ru-RU")}
                        </div>
                      </div>
                      <div className="flex gap-1.5">
                        {[calc.life_path, calc.character_num, calc.destiny].map((n, i) => (
                          <span key={i} className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 text-xs flex items-center justify-center font-bold">
                            {n}
                          </span>
                        ))}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* CTA new calc */}
            <Link to="/" className="mt-4 flex items-center justify-center gap-2 w-full py-3 rounded-xl border-2 border-dashed border-amber-200 text-amber-600 text-sm font-medium hover:bg-amber-50 transition-colors">
              <Icon name="Plus" size={16} />
              Новый расчёт
            </Link>
          </div>

          {/* Right: result detail */}
          <div className="lg:col-span-2">
            {activeCalc ? (
              <div className="space-y-5">
                {/* Numbers */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="font-serif text-xl text-gray-900">Матрица для {activeCalc.birth_date}</h2>
                    <span className="text-xs text-gray-400">{new Date(activeCalc.created_at).toLocaleDateString("ru-RU")}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <NumBadge num={activeCalc.life_path} label="Жизненный путь" />
                    <NumBadge num={activeCalc.character_num} label="Характер" />
                    <NumBadge num={activeCalc.destiny} label="Судьба" />
                  </div>
                </div>

                {/* Full description based on life path */}
                {DESCRIPTIONS[activeCalc.life_path] && (
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                        <span className="font-serif text-lg font-bold text-amber-700">{activeCalc.life_path}</span>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{DESCRIPTIONS[activeCalc.life_path].title}</div>
                        <div className="text-xs text-amber-600">{DESCRIPTIONS[activeCalc.life_path].tagline}</div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed mb-4">
                      {DESCRIPTIONS[activeCalc.life_path].character}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Сильные стороны</div>
                        <ul className="space-y-1.5">
                          {DESCRIPTIONS[activeCalc.life_path].strengths.map(s => (
                            <li key={s} className="flex items-start gap-2 text-sm text-gray-700">
                              <Icon name="Check" size={14} className="text-green-500 mt-0.5 shrink-0" />
                              {s}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Сферы роста</div>
                        <ul className="space-y-1.5">
                          {DESCRIPTIONS[activeCalc.life_path].challenges.map(c => (
                            <li key={c} className="flex items-start gap-2 text-sm text-gray-700">
                              <Icon name="ArrowUpRight" size={14} className="text-amber-500 mt-0.5 shrink-0" />
                              {c}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {/* Career & relationships */}
                {DESCRIPTIONS[activeCalc.life_path] && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <Icon name="Briefcase" size={16} className="text-amber-600" />
                        <span className="font-semibold text-gray-800 text-sm">Карьера</span>
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed">{DESCRIPTIONS[activeCalc.life_path].career}</p>
                    </div>
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <Icon name="Heart" size={16} className="text-rose-400" />
                        <span className="font-semibold text-gray-800 text-sm">Отношения</span>
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed">{DESCRIPTIONS[activeCalc.life_path].relationships}</p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
                <div className="text-5xl mb-4">✨</div>
                <p className="text-gray-400 text-sm">Выберите расчёт слева, чтобы увидеть детали</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
