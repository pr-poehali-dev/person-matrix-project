import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { getToken } from "@/lib/auth";
import Icon from "@/components/ui/icon";
import func2url from "../../backend/func2url.json";

type ResultData = {
  problem_text: string;
  situation_text: string;
  emotion_chain: string[];
  root_emotion: string;
  mood_result: string;
  positive_state: string | null;
  positive_action: string | null;
  positive_feeling: string | null;
};

export default function EmotionChainResult() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const resultId = searchParams.get("id");
  const [data, setData] = useState<ResultData | null>(null);
  const [createdAt, setCreatedAt] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token) { navigate("/auth"); return; }
    if (!resultId) { navigate("/history"); return; }

    fetch((func2url as Record<string, string>)["trainers"], {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Auth-Token": token },
      body: JSON.stringify({ action: "get", id: Number(resultId) }),
    })
      .then(r => r.text())
      .then(text => {
        let parsed: Record<string, unknown>;
        try { parsed = JSON.parse(JSON.parse(text)); } catch { try { parsed = JSON.parse(text); } catch { parsed = {}; } }
        if (parsed.result_data) {
          setData(parsed.result_data as ResultData);
          setCreatedAt(parsed.created_at as string);
        } else {
          navigate("/history");
        }
      })
      .catch(() => navigate("/history"))
      .finally(() => setLoading(false));
  }, [navigate, resultId]);

  if (loading || !data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-400 text-sm font-golos">Загрузка...</div>
      </div>
    );
  }

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] px-5 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Link to="/history" className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors font-golos text-sm">
            <Icon name="ArrowLeft" size={16} />
            Мои результаты
          </Link>
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#6C5BA7]/10 flex items-center justify-center">
              <span className="font-golos text-sm font-bold text-[#6C5BA7]">М</span>
            </div>
            <span className="font-golos text-lg font-semibold text-[#4A3D7A] tracking-tight">Матрица личности</span>
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-8">
        <div className="mb-6">
          <h1 className="font-golos font-semibold text-2xl text-gray-900 mb-1">Цепочка чувств</h1>
          {createdAt && <p className="text-gray-400 text-sm font-golos">{formatDate(createdAt)}</p>}
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-2xl soft-shadow p-6">
            <div className="flex items-center gap-2 mb-3">
              <Icon name="MessageCircle" size={18} className="text-[#6C5BA7]" />
              <h3 className="font-golos font-semibold text-sm text-[#4A3D7A]">Что беспокоило</h3>
            </div>
            <p className="font-golos text-sm text-gray-600 leading-relaxed">{data.problem_text}</p>
          </div>

          <div className="bg-white rounded-2xl soft-shadow p-6">
            <div className="flex items-center gap-2 mb-3">
              <Icon name="FileText" size={18} className="text-[#6C5BA7]" />
              <h3 className="font-golos font-semibold text-sm text-[#4A3D7A]">Ситуация</h3>
            </div>
            <p className="font-golos text-sm text-gray-600 leading-relaxed">{data.situation_text}</p>
          </div>

          <div className="bg-white rounded-2xl soft-shadow p-6">
            <div className="flex items-center gap-2 mb-3">
              <Icon name="GitBranch" size={18} className="text-[#6C5BA7]" />
              <h3 className="font-golos font-semibold text-sm text-[#4A3D7A]">Цепочка эмоций</h3>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {data.emotion_chain.map((em, i) => (
                <span key={i} className="flex items-center gap-2">
                  <span className={`px-3 py-1.5 rounded-lg text-xs font-golos font-medium ${
                    i === 0 ? "bg-[#E8E4F5] text-[#6C5BA7]" :
                    i === data.emotion_chain.length - 1 ? "bg-rose-100 text-rose-600" :
                    "bg-gray-100 text-gray-600"
                  }`}>
                    {em}
                  </span>
                  {i < data.emotion_chain.length - 1 && (
                    <Icon name="ArrowRight" size={12} className="text-gray-300" />
                  )}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl soft-shadow p-6">
            <div className="flex items-center gap-2 mb-3">
              <Icon name="Target" size={18} className="text-rose-500" />
              <h3 className="font-golos font-semibold text-sm text-rose-600">Глубинное чувство</h3>
            </div>
            <p className="font-golos text-sm text-rose-600 font-medium">{data.root_emotion}</p>
          </div>

          <div className="bg-white rounded-2xl soft-shadow p-6">
            <div className="flex items-center gap-2 mb-3">
              <Icon name="Sun" size={18} className="text-amber-500" />
              <h3 className="font-golos font-semibold text-sm text-[#4A3D7A]">Итог</h3>
            </div>
            <p className="font-golos text-sm text-gray-600">
              Настроение изменилось: <span className="font-semibold">{data.mood_result}</span>
            </p>
            {data.positive_state && (
              <p className="font-golos text-sm text-gray-500 mt-1">
                Желаемое состояние: {data.positive_state}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
          <button
            onClick={() => navigate("/trainer/emotion-chain")}
            className="inline-flex items-center justify-center gap-2 gradient-primary text-white font-golos text-sm font-medium px-6 py-2.5 rounded-xl transition-all hover:opacity-90 active:scale-[0.97]"
          >
            <Icon name="RotateCcw" size={15} />
            Пройти ещё раз
          </button>
          <button
            onClick={() => navigate("/cabinet")}
            className="inline-flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700 font-golos text-sm font-medium px-6 py-2.5 rounded-xl transition-all hover:bg-gray-50 active:scale-[0.97]"
          >
            <Icon name="ArrowLeft" size={15} />
            В кабинет
          </button>
        </div>
      </main>
    </div>
  );
}
