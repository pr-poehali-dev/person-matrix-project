import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";
import {
  adminLogin,
  getStats,
  getUsers,
  getPurchases,
  getAdminToken,
  setAdminToken,
  clearAdminToken,
} from "@/lib/admin";

const PRODUCT_LABELS: Record<string, string> = {
  full_analysis: "Полный анализ",
  compatibility: "Совместимость",
  child_analysis: "Анализ ребёнка",
};

type Stats = {
  users: { total: number; today: number; week: number; month: number };
  income: { total: number; today: number; week: number; month: number };
  purchases: { total: number; by_product: { product: string; count: number; revenue: number }[] };
  balances_total: number;
  charts: { registrations: { date: string; count: number }[]; income: { date: string; amount: number }[] };
};

type UserRow = { id: number; email: string; name: string; created_at: string; balance: number };
type PurchaseRow = { id: number; email: string; product: string; amount: number; birth_date: string; child_name: string; created_at: string };

function fmt(n: number) {
  return n.toLocaleString("ru-RU");
}

function fmtDate(d: string) {
  if (!d) return "—";
  const dt = new Date(d);
  return dt.toLocaleDateString("ru-RU") + " " + dt.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
}

export default function Admin() {
  const [authed, setAuthed] = useState(!!getAdminToken());
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginErr, setLoginErr] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  const [tab, setTab] = useState<"dashboard" | "users" | "purchases">("dashboard");
  const [stats, setStats] = useState<Stats | null>(null);
  const [users, setUsers] = useState<UserRow[]>([]);
  const [usersTotal, setUsersTotal] = useState(0);
  const [usersPage, setUsersPage] = useState(1);
  const [purchases, setPurchases] = useState<PurchaseRow[]>([]);
  const [purchasesTotal, setPurchasesTotal] = useState(0);
  const [purchasesPage, setPurchasesPage] = useState(1);
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setLoginErr("");
    setLoginLoading(true);
    const res = await adminLogin(email, password);
    if (res.status === 200 && res.data.token) {
      setAdminToken(res.data.token);
      setAuthed(true);
    } else {
      setLoginErr(res.data.error || "Ошибка входа");
    }
    setLoginLoading(false);
  }

  function handleLogout() {
    clearAdminToken();
    setAuthed(false);
    setStats(null);
  }

  useEffect(() => {
    if (!authed) return;
    loadDashboard();
  }, [authed]);

  async function loadDashboard() {
    setLoading(true);
    const res = await getStats();
    if (res.status === 200) setStats(res.data as Stats);
    else if (res.status === 401) { clearAdminToken(); setAuthed(false); }
    setLoading(false);
  }

  async function loadUsers(page: number) {
    setLoading(true);
    const res = await getUsers(page);
    if (res.status === 200) {
      setUsers(res.data.users as UserRow[]);
      setUsersTotal(res.data.total as number);
      setUsersPage(page);
    }
    setLoading(false);
  }

  async function loadPurchases(page: number) {
    setLoading(true);
    const res = await getPurchases(page);
    if (res.status === 200) {
      setPurchases(res.data.purchases as PurchaseRow[]);
      setPurchasesTotal(res.data.total as number);
      setPurchasesPage(page);
    }
    setLoading(false);
  }

  useEffect(() => {
    if (!authed) return;
    if (tab === "users") loadUsers(1);
    if (tab === "purchases") loadPurchases(1);
  }, [tab, authed]);

  if (!authed) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 w-full max-w-sm">
          <div className="flex items-center justify-center mb-6">
            <div className="w-12 h-12 rounded-xl bg-gray-900 flex items-center justify-center">
              <Icon name="Shield" size={24} className="text-white" />
            </div>
          </div>
          <h1 className="font-serif text-2xl text-gray-900 text-center mb-6">Админ-панель</h1>
          {loginErr && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-4 text-sm text-red-700">
              {loginErr}
            </div>
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm mb-3 focus:outline-none focus:border-gray-400"
          />
          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm mb-4 focus:outline-none focus:border-gray-400"
          />
          <button
            onClick={handleLogin}
            disabled={loginLoading}
            className="w-full bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium rounded-xl py-3 transition-colors disabled:opacity-50"
          >
            {loginLoading ? "Вхожу..." : "Войти"}
          </button>
        </div>
      </div>
    );
  }

  const tabs = [
    { key: "dashboard" as const, label: "Дашборд", icon: "BarChart3" },
    { key: "users" as const, label: "Пользователи", icon: "Users" },
    { key: "purchases" as const, label: "Покупки", icon: "ShoppingCart" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-100 px-6 py-3 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center">
              <Icon name="Shield" size={16} className="text-white" />
            </div>
            <span className="font-serif text-lg text-gray-800">Админ-панель</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex bg-gray-100 rounded-xl p-1 gap-0.5">
              {tabs.map((t) => (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    tab === t.key ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <Icon name={t.icon} size={14} />
                  <span className="hidden sm:inline">{t.label}</span>
                </button>
              ))}
            </div>
            <button
              onClick={handleLogout}
              className="text-sm text-gray-400 hover:text-gray-600 transition-colors flex items-center gap-1"
            >
              <Icon name="LogOut" size={14} />
              <span className="hidden sm:inline">Выйти</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-6 space-y-6">
        {loading && !stats && (
          <div className="text-center py-20 text-gray-400 text-sm">Загрузка...</div>
        )}

        {tab === "dashboard" && stats && <Dashboard stats={stats} onRefresh={loadDashboard} />}
        {tab === "users" && (
          <UsersTable
            users={users}
            total={usersTotal}
            page={usersPage}
            onPageChange={loadUsers}
          />
        )}
        {tab === "purchases" && (
          <PurchasesTable
            purchases={purchases}
            total={purchasesTotal}
            page={purchasesPage}
            onPageChange={loadPurchases}
          />
        )}
      </main>
    </div>
  );
}

function StatCard({ icon, label, value, sub, color }: { icon: string; label: string; value: string; sub?: string; color: string }) {
  const colors: Record<string, string> = {
    amber: "bg-amber-100 text-amber-700",
    emerald: "bg-emerald-100 text-emerald-700",
    blue: "bg-blue-100 text-blue-700",
    purple: "bg-purple-100 text-purple-700",
  };
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${colors[color]}`}>
          <Icon name={icon} size={18} />
        </div>
        <span className="text-sm text-gray-500">{label}</span>
      </div>
      <div className="font-serif text-3xl text-gray-900 font-bold">{value}</div>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  );
}

function Dashboard({ stats, onRefresh }: { stats: Stats; onRefresh: () => void }) {
  const maxReg = Math.max(...stats.charts.registrations.map((r) => r.count), 1);
  const maxInc = Math.max(...stats.charts.income.map((r) => r.amount), 1);

  return (
    <>
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-2xl text-gray-900">Обзор</h2>
        <button onClick={onRefresh} className="text-sm text-gray-400 hover:text-gray-600 flex items-center gap-1 transition-colors">
          <Icon name="RefreshCw" size={14} />
          Обновить
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon="Users"
          label="Пользователи"
          value={fmt(stats.users.total)}
          sub={`Сегодня +${stats.users.today} · Неделя +${stats.users.week} · Месяц +${stats.users.month}`}
          color="blue"
        />
        <StatCard
          icon="DollarSign"
          label="Доход (всего)"
          value={`${fmt(stats.income.total)} ₽`}
          sub={`Сегодня +${fmt(stats.income.today)} ₽ · Неделя +${fmt(stats.income.week)} ₽`}
          color="emerald"
        />
        <StatCard
          icon="ShoppingCart"
          label="Покупки"
          value={fmt(stats.purchases.total)}
          color="amber"
        />
        <StatCard
          icon="Wallet"
          label="На балансах"
          value={`${fmt(stats.balances_total)} ₽`}
          sub="Сумма всех пользователей"
          color="purple"
        />
      </div>

      {stats.purchases.by_product.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-serif text-lg text-gray-900 mb-4 flex items-center gap-2">
            <Icon name="PieChart" size={18} className="text-amber-600" />
            Услуги
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {stats.purchases.by_product.map((p) => (
              <div key={p.product} className="bg-gray-50 rounded-xl p-4 text-center">
                <div className="text-sm text-gray-500 mb-1">{PRODUCT_LABELS[p.product] || p.product}</div>
                <div className="font-serif text-2xl font-bold text-gray-900">{p.count}</div>
                <div className="text-xs text-gray-400 mt-1">{fmt(p.revenue)} ₽</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {stats.charts.registrations.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-serif text-lg text-gray-900 mb-4 flex items-center gap-2">
            <Icon name="UserPlus" size={18} className="text-blue-600" />
            Регистрации за 30 дней
          </h3>
          <div className="flex items-end gap-1 h-32">
            {stats.charts.registrations.map((r) => (
              <div key={r.date} className="flex-1 flex flex-col items-center gap-1 group relative">
                <div
                  className="w-full bg-blue-200 hover:bg-blue-400 rounded-t transition-colors min-h-[2px]"
                  style={{ height: `${(r.count / maxReg) * 100}%` }}
                />
                <div className="absolute -top-6 bg-gray-800 text-white text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {r.date.slice(5)}: {r.count}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {stats.charts.income.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-serif text-lg text-gray-900 mb-4 flex items-center gap-2">
            <Icon name="TrendingUp" size={18} className="text-emerald-600" />
            Доход за 30 дней
          </h3>
          <div className="flex items-end gap-1 h-32">
            {stats.charts.income.map((r) => (
              <div key={r.date} className="flex-1 flex flex-col items-center gap-1 group relative">
                <div
                  className="w-full bg-emerald-200 hover:bg-emerald-400 rounded-t transition-colors min-h-[2px]"
                  style={{ height: `${(r.amount / maxInc) * 100}%` }}
                />
                <div className="absolute -top-6 bg-gray-800 text-white text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {r.date.slice(5)}: {fmt(r.amount)} ₽
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

function UsersTable({
  users,
  total,
  page,
  onPageChange,
}: {
  users: UserRow[];
  total: number;
  page: number;
  onPageChange: (p: number) => void;
}) {
  const totalPages = Math.ceil(total / 50);
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <h3 className="font-serif text-lg text-gray-900">
          Пользователи <span className="text-sm text-gray-400 font-sans">({total})</span>
        </h3>
        {totalPages > 1 && (
          <div className="flex items-center gap-2 text-sm">
            <button
              disabled={page <= 1}
              onClick={() => onPageChange(page - 1)}
              className="text-gray-400 hover:text-gray-700 disabled:opacity-30"
            >
              <Icon name="ChevronLeft" size={16} />
            </button>
            <span className="text-gray-500">{page} / {totalPages}</span>
            <button
              disabled={page >= totalPages}
              onClick={() => onPageChange(page + 1)}
              className="text-gray-400 hover:text-gray-700 disabled:opacity-30"
            >
              <Icon name="ChevronRight" size={16} />
            </button>
          </div>
        )}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-left text-xs uppercase tracking-wider">
              <th className="px-6 py-3">ID</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Имя</th>
              <th className="px-6 py-3">Баланс</th>
              <th className="px-6 py-3">Дата регистрации</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-gray-50/50">
                <td className="px-6 py-3 text-gray-400">{u.id}</td>
                <td className="px-6 py-3 text-gray-900 font-medium">{u.email}</td>
                <td className="px-6 py-3 text-gray-600">{u.name || "—"}</td>
                <td className="px-6 py-3">
                  <span className={u.balance > 0 ? "text-emerald-600 font-medium" : "text-gray-400"}>
                    {fmt(u.balance)} ₽
                  </span>
                </td>
                <td className="px-6 py-3 text-gray-400">{fmtDate(u.created_at)}</td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-400">Нет пользователей</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PurchasesTable({
  purchases,
  total,
  page,
  onPageChange,
}: {
  purchases: PurchaseRow[];
  total: number;
  page: number;
  onPageChange: (p: number) => void;
}) {
  const totalPages = Math.ceil(total / 50);
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <h3 className="font-serif text-lg text-gray-900">
          Покупки <span className="text-sm text-gray-400 font-sans">({total})</span>
        </h3>
        {totalPages > 1 && (
          <div className="flex items-center gap-2 text-sm">
            <button
              disabled={page <= 1}
              onClick={() => onPageChange(page - 1)}
              className="text-gray-400 hover:text-gray-700 disabled:opacity-30"
            >
              <Icon name="ChevronLeft" size={16} />
            </button>
            <span className="text-gray-500">{page} / {totalPages}</span>
            <button
              disabled={page >= totalPages}
              onClick={() => onPageChange(page + 1)}
              className="text-gray-400 hover:text-gray-700 disabled:opacity-30"
            >
              <Icon name="ChevronRight" size={16} />
            </button>
          </div>
        )}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-left text-xs uppercase tracking-wider">
              <th className="px-6 py-3">ID</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Услуга</th>
              <th className="px-6 py-3">Сумма</th>
              <th className="px-6 py-3">Дата</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {purchases.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50/50">
                <td className="px-6 py-3 text-gray-400">{p.id}</td>
                <td className="px-6 py-3 text-gray-900 font-medium">{p.email}</td>
                <td className="px-6 py-3">
                  <span className="inline-flex items-center bg-amber-50 text-amber-700 text-xs font-medium px-2.5 py-1 rounded-lg">
                    {PRODUCT_LABELS[p.product] || p.product}
                  </span>
                </td>
                <td className="px-6 py-3 text-gray-700 font-medium">{fmt(p.amount)} ₽</td>
                <td className="px-6 py-3 text-gray-400">{fmtDate(p.created_at)}</td>
              </tr>
            ))}
            {purchases.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-400">Нет покупок</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
