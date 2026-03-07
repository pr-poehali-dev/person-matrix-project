import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register, login, setToken } from "@/lib/auth";

type Mode = "login" | "register";

export default function Auth() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = mode === "register"
        ? await register(email, password, name)
        : await login(email, password);

      if (res.status === 200 && typeof res.data === "object" && res.data !== null && "token" in res.data) {
        setToken((res.data as { token: string }).token);
        navigate("/cabinet");
      } else {
        const d = res.data as Record<string, string>;
        setError(d?.error || "Ошибка. Попробуйте ещё раз.");
      }
    } catch {
      setError("Ошибка сети. Попробуйте позже.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top bar */}
      <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-7 h-7 rounded-full border border-amber-400 flex items-center justify-center">
            <span className="font-serif text-sm font-bold text-amber-600">М</span>
          </div>
          <span className="font-serif text-lg text-gray-800">Матрица личности</span>
        </Link>
        <Link to="/" className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
          ← На главную
        </Link>
      </header>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Tabs */}
          <div className="flex bg-white rounded-xl shadow-sm border border-gray-100 mb-6 p-1">
            {(["login", "register"] as Mode[]).map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); setError(""); }}
                className="flex-1 py-2.5 text-sm font-medium rounded-lg transition-all duration-200"
                style={{
                  background: mode === m ? "#92400e" : "transparent",
                  color: mode === m ? "#fff" : "#6b7280",
                }}
              >
                {m === "login" ? "Войти" : "Зарегистрироваться"}
              </button>
            ))}
          </div>

          {/* Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h1 className="font-serif text-2xl text-gray-900 mb-1">
              {mode === "login" ? "Добро пожаловать" : "Создать аккаунт"}
            </h1>
            <p className="text-sm text-gray-400 mb-6">
              {mode === "login"
                ? "Войдите, чтобы открыть историю расчётов"
                : "Регистрируйтесь бесплатно и сохраняйте результаты"}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === "register" && (
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">Ваше имя</label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Елена"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 text-sm focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all"
                  />
                </div>
              )}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="elena@mail.ru"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 text-sm focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">Пароль</label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 text-sm focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all"
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-xl">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 mt-2"
                style={{
                  background: loading ? "#d1d5db" : "linear-gradient(135deg, #92400e, #d97706, #f59e0b)",
                  color: loading ? "#9ca3af" : "#fff",
                  cursor: loading ? "not-allowed" : "pointer",
                }}
              >
                {loading ? "Загрузка..." : mode === "login" ? "Войти" : "Создать аккаунт"}
              </button>
            </form>
          </div>

          <p className="text-center text-xs text-gray-400 mt-4">
            Нажимая кнопку, вы соглашаетесь с{" "}
            <a href="#" className="text-amber-600 hover:underline">политикой конфиденциальности</a>
          </p>
        </div>
      </div>
    </div>
  );
}
