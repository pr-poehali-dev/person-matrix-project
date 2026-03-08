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
      <header className="bg-white border-b border-gray-200/80 px-6 py-4 flex items-center justify-between shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-7 h-7 rounded-lg bg-[#6C5BA7]/10 flex items-center justify-center">
            <span className="font-golos text-sm font-bold text-[#6C5BA7]">М</span>
          </div>
          <span className="font-golos text-lg font-semibold text-[#4A3D7A] tracking-tight">Матрица личности</span>
        </Link>
        <Link to="/" className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
          ← На главную
        </Link>
      </header>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="flex bg-white rounded-xl shadow-sm border border-gray-100 mb-6 p-1">
            {(["login", "register"] as Mode[]).map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); setError(""); }}
                className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                  mode === m ? "bg-[#6C5BA7] text-white" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {m === "login" ? "Войти" : "Зарегистрироваться"}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h1 className="font-golos text-2xl font-semibold text-gray-900 mb-1">
              {mode === "login" ? "Добро пожаловать" : "Создать аккаунт"}
            </h1>
            <p className="text-sm text-gray-400 mb-6">
              {mode === "login"
                ? "Войдите, чтобы открыть историю результатов"
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
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 text-sm focus:outline-none focus:border-[#6C5BA7]/50 focus:ring-2 focus:ring-[#6C5BA7]/10 transition-all"
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
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 text-sm focus:outline-none focus:border-[#6C5BA7]/50 focus:ring-2 focus:ring-[#6C5BA7]/10 transition-all"
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
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 text-sm focus:outline-none focus:border-[#6C5BA7]/50 focus:ring-2 focus:ring-[#6C5BA7]/10 transition-all"
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
                className={`w-full py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 mt-2 ${
                  loading ? "bg-gray-300 text-gray-400 cursor-not-allowed" : "bg-[#6C5BA7] hover:bg-[#5A4B95] text-white cursor-pointer"
                }`}
              >
                {loading ? "Загрузка..." : mode === "login" ? "Войти" : "Создать аккаунт"}
              </button>
            </form>
          </div>

          <p className="text-center text-xs text-gray-400 mt-4">
            Нажимая кнопку, вы соглашаетесь с{" "}
            <a href="#" className="text-[#6C5BA7] hover:underline">политикой конфиденциальности</a>
          </p>
        </div>
      </div>
    </div>
  );
}
