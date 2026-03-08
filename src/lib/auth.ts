import func2url from "../../backend/func2url.json";

const AUTH_URL = func2url.auth;
const TOKEN_KEY = "pm_token";

export function getToken(): string {
  return localStorage.getItem(TOKEN_KEY) || "";
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

async function call(action: string, body: Record<string, unknown> = {}, token?: string) {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  const t = token ?? getToken();
  if (t) headers["X-Auth-Token"] = t;
  const res = await fetch(AUTH_URL, {
    method: "POST",
    headers,
    body: JSON.stringify({ action, ...body }),
  });
  const text = await res.text();
  let data: unknown;
  try { data = JSON.parse(JSON.parse(text)); } catch { try { data = JSON.parse(text); } catch { data = text; } }
  return { status: res.status, data };
}

export async function register(email: string, password: string, name: string) {
  return call("register", { email, password, name });
}

export async function login(email: string, password: string) {
  return call("login", { email, password });
}

export async function logout() {
  await call("logout");
  clearToken();
}

export async function getMe() {
  return call("me");
}

export async function saveCalculation(birth_date: string, life_path: number, character_num: number, destiny: number) {
  return call("save-calculation", { birth_date, life_path, character_num, destiny, calc_type: "personal" });
}

export async function saveCompatibilityCalc(birth_date: string, birth_date2: string, life_path: number, character_num: number, destiny: number, overall_score: number) {
  return call("save-calculation", { birth_date, birth_date2, life_path, character_num, destiny, overall_score, calc_type: "compatibility" });
}

export async function saveChildCalc(birth_date: string, child_name: string, life_path: number, character_num: number, destiny: number, soul_urge: number) {
  return call("save-calculation", { birth_date, child_name, life_path, character_num, destiny, soul_urge, calc_type: "child" });
}

export async function saveDestinyCalc(birth_date: string, life_path: number) {
  return call("save-calculation", { birth_date, life_path, character_num: 0, destiny: 0, calc_type: "destiny" });
}