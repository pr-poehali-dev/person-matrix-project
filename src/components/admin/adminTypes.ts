export const PRODUCT_LABELS: Record<string, string> = {
  full_analysis: "Полный анализ",
  compatibility: "Совместимость",
  child_analysis: "Анализ ребёнка",
};

export type Stats = {
  users: { total: number; today: number; week: number; month: number };
  income: { total: number; today: number; week: number; month: number };
  purchases: { total: number; by_product: { product: string; count: number; revenue: number }[] };
  balances_total: number;
  charts: { registrations: { date: string; count: number }[]; income: { date: string; amount: number }[] };
};

export type UserRow = { id: number; email: string; name: string; created_at: string; balance: number };
export type PurchaseRow = { id: number; email: string; product: string; amount: number; birth_date: string; child_name: string; created_at: string };

export function fmt(n: number) {
  return n.toLocaleString("ru-RU");
}

export function fmtDate(d: string) {
  if (!d) return "—";
  const dt = new Date(d);
  return dt.toLocaleDateString("ru-RU") + " " + dt.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
}
