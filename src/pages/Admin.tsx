import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";
import {
  adminLogin,
  getStats,
  getUsers,
  getPurchases,
  adminTopup,
  getAdminToken,
  setAdminToken,
  clearAdminToken,
} from "@/lib/admin";
import type { Stats, UserRow, PurchaseRow } from "@/components/admin/adminTypes";
import AdminDashboard from "@/components/admin/AdminDashboard";
import AdminUsersTable from "@/components/admin/AdminUsersTable";
import AdminPurchasesTable from "@/components/admin/AdminPurchasesTable";

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

        {tab === "dashboard" && stats && (
          <AdminDashboard stats={stats} onRefresh={loadDashboard} />
        )}
        {tab === "users" && (
          <AdminUsersTable
            users={users}
            total={usersTotal}
            page={usersPage}
            onPageChange={loadUsers}
            onTopup={async (userId, amount) => {
              const res = await adminTopup(userId, amount);
              if (res.status === 200) loadUsers(usersPage);
              return res;
            }}
          />
        )}
        {tab === "purchases" && (
          <AdminPurchasesTable
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
