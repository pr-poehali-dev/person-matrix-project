import { useState } from "react";
import Icon from "@/components/ui/icon";
import { fmt, fmtDate, type UserRow } from "./adminTypes";

type Props = {
  users: UserRow[];
  total: number;
  page: number;
  onPageChange: (p: number) => void;
  onTopup: (userId: number, amount: number) => Promise<{ status: number; data: Record<string, unknown> }>;
};

export default function AdminUsersTable({ users, total, page, onPageChange, onTopup }: Props) {
  const totalPages = Math.ceil(total / 50);
  const [topupUser, setTopupUser] = useState<UserRow | null>(null);
  const [topupAmount, setTopupAmount] = useState("");
  const [topupLoading, setTopupLoading] = useState(false);
  const [topupMsg, setTopupMsg] = useState("");

  async function handleTopup() {
    if (!topupUser) return;
    const amount = parseInt(topupAmount);
    if (!amount || amount <= 0) { setTopupMsg("Введите сумму больше 0"); return; }
    setTopupLoading(true);
    setTopupMsg("");
    const res = await onTopup(topupUser.id, amount);
    if (res.status === 200) {
      setTopupMsg(`Начислено ${fmt(amount)} ₽. Новый баланс: ${fmt(res.data.balance as number)} ₽`);
      setTopupAmount("");
      setTimeout(() => { setTopupUser(null); setTopupMsg(""); }, 1500);
    } else {
      setTopupMsg((res.data.error as string) || "Ошибка");
    }
    setTopupLoading(false);
  }

  return (
    <>
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
                <th className="px-6 py-3"></th>
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
                  <td className="px-6 py-3">
                    <button
                      onClick={() => { setTopupUser(u); setTopupAmount(""); setTopupMsg(""); }}
                      className="text-xs text-emerald-600 hover:text-emerald-800 font-medium flex items-center gap-1 transition-colors"
                    >
                      <Icon name="Plus" size={13} />
                      Начислить
                    </button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-400">Нет пользователей</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {topupUser && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4" onClick={() => setTopupUser(null)}>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-lg p-6 w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif text-lg text-gray-900">Начислить баланс</h3>
              <button onClick={() => setTopupUser(null)} className="text-gray-400 hover:text-gray-600">
                <Icon name="X" size={18} />
              </button>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 mb-4">
              <div className="text-sm text-gray-900 font-medium">{topupUser.email}</div>
              <div className="text-xs text-gray-400 mt-0.5">ID {topupUser.id} · Баланс: {fmt(topupUser.balance)} ₽</div>
            </div>
            <div className="flex gap-2 mb-3">
              {[500, 1000, 5000, 10000].map((a) => (
                <button
                  key={a}
                  onClick={() => setTopupAmount(String(a))}
                  className={`flex-1 text-xs py-2 rounded-lg border transition-colors ${
                    topupAmount === String(a)
                      ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                      : "border-gray-200 text-gray-600 hover:border-gray-300"
                  }`}
                >
                  {fmt(a)} ₽
                </button>
              ))}
            </div>
            <input
              type="number"
              placeholder="Или введите сумму"
              value={topupAmount}
              onChange={(e) => setTopupAmount(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleTopup()}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm mb-3 focus:outline-none focus:border-emerald-400"
            />
            {topupMsg && (
              <div className={`text-sm rounded-xl px-3 py-2 mb-3 ${
                topupMsg.startsWith("Начислено") ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
              }`}>
                {topupMsg}
              </div>
            )}
            <button
              onClick={handleTopup}
              disabled={topupLoading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-xl py-3 transition-colors disabled:opacity-50"
            >
              {topupLoading ? "Начисляю..." : "Начислить"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
