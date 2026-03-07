import func2url from "../../backend/func2url.json";
import { getToken } from "./auth";

const PAY_URL = func2url.payments;

async function call(action: string, body: Record<string, unknown> = {}) {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  const t = getToken();
  if (t) headers["X-Auth-Token"] = t;
  const res = await fetch(PAY_URL, {
    method: "POST",
    headers,
    body: JSON.stringify({ action, ...body }),
  });
  const text = await res.text();
  let data: unknown;
  try { data = JSON.parse(JSON.parse(text)); } catch { try { data = JSON.parse(text); } catch { data = text; } }
  return { status: res.status, data: data as Record<string, unknown> };
}

export async function getBalance() {
  return call("balance");
}

export async function createPayment(amount: number, returnUrl: string) {
  return call("create-payment", { amount, return_url: returnUrl });
}

export async function spend(product: string, extra: Record<string, string> = {}) {
  return call("spend", { product, ...extra });
}

export async function checkPurchase(product: string, extra: Record<string, string> = {}) {
  return call("check-purchase", { product, ...extra });
}

export async function getHistory() {
  return call("history");
}

export async function getPrices() {
  return call("prices");
}

export const PRODUCT_PRICES: Record<string, number> = {
  full_analysis: 490,
  compatibility: 690,
  child_analysis: 990,
};

export const PRODUCT_NAMES: Record<string, string> = {
  full_analysis: "Полный анализ личности",
  compatibility: "Анализ совместимости",
  child_analysis: "Анализ ребёнка",
};
