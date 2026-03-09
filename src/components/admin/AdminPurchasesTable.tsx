import Icon from "@/components/ui/icon";
import { fmt, fmtDate, PRODUCT_LABELS, type PurchaseRow } from "./adminTypes";

type Props = {
  purchases: PurchaseRow[];
  total: number;
  page: number;
  onPageChange: (p: number) => void;
};

export default function AdminPurchasesTable({ purchases, total, page, onPageChange }: Props) {
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
