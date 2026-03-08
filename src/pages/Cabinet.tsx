import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getMe, logout, getToken } from "@/lib/auth";
import { getBalance, PRODUCT_PRICES } from "@/lib/payments";
import Icon from "@/components/ui/icon";

type User = {
  id: number;
  email: string;
  name: string | null;
  birth_date: string | null;
  created_at: string;
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

type ToolItem = {
  id: string;
  title: string;
  description: string;
  icon: string;
  free: boolean;
  product?: string;
  price?: number;
  route: string;
  color: string;
  bg: string;
};

const FREE_TESTS: ToolItem[] = [
  {
    id: "personality-type",
    title: "Тип вашей личности",
    description: "Определите психологический тип и сильные стороны характера",
    icon: "Sparkles",
    free: true,
    route: "/test/personality",
    color: "text-[#6C5BA7]",
    bg: "bg-[#F4F2FA]",
  },
  {
    id: "purpose",
    title: "Ваше предназначение",
    description: "Ключевая жизненная миссия и направление развития",
    icon: "Compass",
    free: true,
    route: "/test/purpose",
    color: "text-[#6C5BA7]",
    bg: "bg-[#F4F2FA]",
  },
  {
    id: "partner",
    title: "Какой вы партнёр",
    description: "Ваш стиль в отношениях и любви",
    icon: "Heart",
    free: true,
    route: "/test/partner",
    color: "text-rose-500",
    bg: "bg-rose-50",
  },
  {
    id: "parent",
    title: "Какой вы родитель",
    description: "Ваш стиль воспитания и взаимодействия с детьми",
    icon: "Baby",
    free: true,
    route: "/test/parent",
    color: "text-[#6C5BA7]",
    bg: "bg-[#F4F2FA]",
  },
  {
    id: "child-type",
    title: "Тип личности ребёнка",
    description: "Особенности характера и склонности вашего ребёнка",
    icon: "Star",
    free: true,
    route: "/test/child-type",
    color: "text-amber-500",
    bg: "bg-amber-50",
  },
  {
    id: "potential",
    title: "Реализация потенциала",
    description: "Как раскрыть ваши возможности и сильные стороны",
    icon: "TrendingUp",
    free: true,
    route: "/test/potential",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
];

const PAID_TOOLS: ToolItem[] = [
  {
    id: "full-analysis",
    title: "Глубокий анализ личности",
    description: "Полный разбор вашего характера, талантов и жизненных особенностей",
    icon: "Brain",
    free: false,
    product: "full_analysis",
    price: PRODUCT_PRICES.full_analysis,
    route: "/result",
    color: "text-[#6C5BA7]",
    bg: "bg-[#F4F2FA]",
  },
  {
    id: "destiny",
    title: "Анализ предназначения",
    description: "Карта жизненного пути, ключевые этапы и потенциал развития",
    icon: "Map",
    free: false,
    product: "destiny_map",
    price: PRODUCT_PRICES.destiny_map,
    route: "/destiny",
    color: "text-[#6C5BA7]",
    bg: "bg-[#F4F2FA]",
  },
  {
    id: "compatibility",
    title: "Анализ отношений",
    description: "Разбор совместимости, динамики пары и возможных точек конфликтов",
    icon: "HeartHandshake",
    free: false,
    product: "compatibility",
    price: PRODUCT_PRICES.compatibility,
    route: "/compatibility",
    color: "text-rose-500",
    bg: "bg-rose-50",
  },
  {
    id: "child-analysis",
    title: "Анализ личности ребёнка",
    description: "Персональный анализ характера, сильных сторон и особенностей развития",
    icon: "Baby",
    free: false,
    product: "child_analysis",
    price: PRODUCT_PRICES.child_analysis,
    route: "/child",
    color: "text-[#6C5BA7]",
    bg: "bg-[#F4F2FA]",
  },
  {
    id: "family",
    title: "Анализ семьи",
    description: "Комплексный анализ семейной динамики и взаимодействия всех членов семьи",
    icon: "Users",
    free: false,
    product: "family_matrix",
    price: PRODUCT_PRICES.family_matrix,
    route: "/family",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
];

function formatPrice(price: number): string {
  return price.toLocaleString("ru-RU") + " ₽";
}

export default function Cabinet() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [balance, setBalance] = useState<number>(0);

  useEffect(() => {
    if (!getToken()) { navigate("/auth"); return; }
    getMe().then(res => {
      if (res.status === 200 && typeof res.data === "object" && res.data !== null && "user" in res.data) {
        const d = res.data as { user: User; calculations: unknown[]; purchases: Purchase[] };
        setUser(d.user);
        setPurchases(d.purchases || []);
        getBalance().then(r => {
          if (r.status === 200 && r.data?.balance !== undefined) setBalance(r.data.balance as number);
        });
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
        <div className="text-gray-400 text-sm font-golos">Загрузка...</div>
      </div>
    );
  }

  const renderFreeCard = (tool: ToolItem) => (
    <div key={tool.id} className="bg-white rounded-2xl soft-shadow p-6 flex flex-col gap-4 hover:soft-shadow-hover transition-all duration-200 hover:-translate-y-0.5">
      <div className="flex items-start justify-between">
        <div className={`w-11 h-11 rounded-xl ${tool.bg} flex items-center justify-center`}>
          <Icon name={tool.icon} size={22} className={tool.color} />
        </div>
        <span className="text-xs font-medium text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full">
          Бесплатно
        </span>
      </div>
      <div>
        <h3 className="font-golos font-semibold text-base text-[#4A3D7A] mb-1">{tool.title}</h3>
        <p className="font-golos text-sm text-gray-400 leading-relaxed">{tool.description}</p>
      </div>
      <button
        onClick={() => navigate(tool.route)}
        className="mt-auto inline-flex items-center justify-center gap-2 gradient-primary text-white font-golos text-sm font-medium py-2.5 rounded-xl transition-all duration-200 hover:opacity-90 active:scale-[0.97]"
      >
        Пройти тест
        <Icon name="ArrowRight" size={15} />
      </button>
    </div>
  );

  const renderPaidCard = (tool: ToolItem) => (
    <div key={tool.id} className="bg-white rounded-2xl soft-shadow p-6 flex flex-col gap-4 hover:soft-shadow-hover transition-all duration-200 hover:-translate-y-0.5">
      <div className="flex items-start justify-between">
        <div className={`w-11 h-11 rounded-xl ${tool.bg} flex items-center justify-center`}>
          <Icon name={tool.icon} size={22} className={tool.color} />
        </div>
        <span className="text-xs font-medium text-gray-500 bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-full">
          {tool.price !== undefined ? formatPrice(tool.price) : ""}
        </span>
      </div>
      <div>
        <h3 className="font-golos font-semibold text-base text-[#4A3D7A] mb-1">{tool.title}</h3>
        <p className="font-golos text-sm text-gray-400 leading-relaxed">{tool.description}</p>
      </div>
      <button
        onClick={() => navigate(tool.route)}
        className="mt-auto inline-flex items-center justify-center gap-2 gradient-primary text-white font-golos text-sm font-medium py-2.5 rounded-xl transition-all duration-200 hover:opacity-90 active:scale-[0.97]"
      >
        Пройти — {tool.price !== undefined ? formatPrice(tool.price) : ""}
        <Icon name="ArrowRight" size={15} />
      </button>
    </div>
  );

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
            <Link
              to="/balance"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F4F2FA] border border-[#E8E4F5] text-[#6C5BA7] text-sm font-medium hover:bg-[#E8E4F5] transition-colors font-golos"
            >
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
        <div className="mb-10">
          <h1 className="font-golos font-semibold text-3xl text-gray-900 mb-1">
            Привет, {user?.name || "друг"}
          </h1>
          <p className="text-gray-400 text-sm font-golos">Выберите тест или инструмент для анализа</p>
        </div>

        {purchases.length > 0 && (
          <Link
            to="/history"
            className="mb-8 bg-white rounded-2xl soft-shadow p-5 flex items-center gap-4 hover:soft-shadow-hover transition-all duration-200 hover:-translate-y-0.5 group block"
          >
            <div className="w-12 h-12 rounded-xl bg-[#F4F2FA] flex items-center justify-center flex-shrink-0">
              <Icon name="Clock" size={22} className="text-[#6C5BA7]" />
            </div>
            <div className="flex-1">
              <h3 className="font-golos font-semibold text-[15px] text-[#4A3D7A]">Мои результаты</h3>
              <p className="font-golos text-sm text-gray-400">
                {purchases.length} {purchases.length === 1 ? "анализ" : purchases.length < 5 ? "анализа" : "анализов"} — нажмите, чтобы посмотреть
              </p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-[#F4F2FA] flex items-center justify-center group-hover:bg-[#6C5BA7] transition-colors flex-shrink-0">
              <Icon name="ArrowRight" size={14} className="text-[#6C5BA7] group-hover:text-white transition-colors" />
            </div>
          </Link>
        )}

        <section className="mb-10">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
              <Icon name="Sparkles" size={16} className="text-emerald-600" />
            </div>
            <h2 className="font-golos text-lg font-semibold text-gray-800">Бесплатные тесты</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FREE_TESTS.map(renderFreeCard)}
          </div>
        </section>

        <section>
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 rounded-lg bg-[#F4F2FA] flex items-center justify-center">
              <Icon name="Brain" size={16} className="text-[#6C5BA7]" />
            </div>
            <h2 className="font-golos text-lg font-semibold text-gray-800">Платные инструменты анализа</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {PAID_TOOLS.map(renderPaidCard)}
          </div>
        </section>
      </main>
    </div>
  );
}