import urls from "../../backend/func2url.json";

const API = urls.admin;
const TOKEN_KEY = "pm_admin_token";

export function getAdminToken() {
  return localStorage.getItem(TOKEN_KEY) || "";
}

export function setAdminToken(t: string) {
  localStorage.setItem(TOKEN_KEY, t);
}

export function clearAdminToken() {
  localStorage.removeItem(TOKEN_KEY);
}

async function post(action: string, data: Record<string, unknown> = {}) {
  const res = await fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Admin-Token": getAdminToken(),
    },
    body: JSON.stringify({ action, ...data }),
  });
  return { status: res.status, data: await res.json() };
}

export async function adminLogin(email: string, password: string) {
  return post("login", { email, password });
}

export async function getStats() {
  return post("stats");
}

export async function getUsers(page = 1) {
  return post("users", { page });
}

export async function getPurchases(page = 1) {
  return post("purchases", { page });
}

export default { adminLogin, getStats, getUsers, getPurchases };
