import Icon from "@/components/ui/icon";
import { fmt, PRODUCT_LABELS, type Stats } from "./adminTypes";

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

type Props = { stats: Stats; onRefresh: () => void };

export default function AdminDashboard({ stats, onRefresh }: Props) {
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
