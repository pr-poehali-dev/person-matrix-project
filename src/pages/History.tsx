import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getMe, getToken } from "@/lib/auth";
import { PRODUCT_NAMES } from "@/lib/payments";
import Icon from "@/components/ui/icon";

type Purchase = {
  id: number;
  product: string;
  birth_date: string | null;
  birth_date2: string | null;
  child_name: string | null;
  amount: number;
  created_at: string;
};

type TrainerResult = {
  id: number;
  trainer_type: string;
  result_data: Record<string, unknown>;
  created_at: string;
};

type HistoryItem = {
  type: "purchase" | "trainer";
  id: number;
  created_at: string;
  purchase?: Purchase;
  trainer?: TrainerResult;
};

const PRODUCT_ICONS: Record<string, string> = {
  full_analysis: "Brain",
  compatibility: "HeartHandshake",
  child_analysis: "Baby",
  destiny_map: "Map",
  family_matrix: "Users",
  barriers_anxiety: "BarChart2",
};

const PRODUCT_COLORS: Record<string, { color: string; bg: string }> = {
  full_analysis: { color: "text-[#6C5BA7]", bg: "bg-[#F4F2FA]" },
  compatibility: { color: "text-rose-500", bg: "bg-rose-50" },
  child_analysis: { color: "text-[#6C5BA7]", bg: "bg-[#F4F2FA]" },
  destiny_map: { color: "text-[#6C5BA7]", bg: "bg-[#F4F2FA]" },
  family_matrix: { color: "text-emerald-600", bg: "bg-emerald-50" },
  barriers_anxiety: { color: "text-[#E06B2E]", bg: "bg-[#FFF3EC]" },
};

const TRAINER_META: Record<string, { title: string; icon: string; color: string; bg: string }> = {
  emotion_chain: { title: "Цепочка чувств", icon: "Link", color: "text-violet-600", bg: "bg-violet-50" },
  barriers_anxiety: { title: "Барьеры, тревоги и стресс", icon: "BarChart2", color: "text-[#E06B2E]", bg: "bg-[#FFF3EC]" },
  lang_relations: { title: "Язык отношений", icon: "HeartHandshake", color: "text-rose-500", bg: "bg-rose-50" },
};

function buildResultLink(p: Purchase): string {
  switch (p.product) {
    case "full_analysis":
      return `/result?date=${p.birth_date}`;
    case "compatibility":
      return `/compatibility?date1=${p.birth_date}&date2=${p.birth_date2}`;
    case "child_analysis":
      return `/child?date=${p.birth_date}&name=${encodeURIComponent(p.child_name || "")}`;
    case "destiny_map":
      return `/destiny?date=${p.birth_date}`;
    case "family_matrix":
      return `/family?date1=${p.birth_date}&date2=${p.birth_date2}`;
    case "barriers_anxiety":
      return "/trainer/barriers";
    default:
      return "/cabinet";
  }
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" });
}

function formatBirthDate(date: string | null): string {
  if (!date) return "";
  const parts = date.split("-");
  if (parts.length === 3) {
    return `${parts[2]}.${parts[1]}.${parts[0]}`;
  }
  return date;
}

function buildSubtitle(p: Purchase): string {
  switch (p.product) {
    case "full_analysis":
    case "destiny_map":
      return p.birth_date ? `Дата рождения: ${formatBirthDate(p.birth_date)}` : "";
    case "compatibility":
    case "family_matrix":
      return [
        p.birth_date ? formatBirthDate(p.birth_date) : "",
        p.birth_date2 ? formatBirthDate(p.birth_date2) : "",
      ].filter(Boolean).join(" + ");
    case "child_analysis":
      return [
        p.child_name || "",
        p.birth_date ? formatBirthDate(p.birth_date) : "",
      ].filter(Boolean).join(", ");
    default:
      return "";
  }
}

function buildTrainerSubtitle(t: TrainerResult): string {
  const rd = t.result_data;
  if (t.trainer_type === "emotion_chain" && rd.problem_text) {
    const text = String(rd.problem_text);
    return text.length > 60 ? text.slice(0, 60) + "..." : text;
  }
  if (t.trainer_type === "barriers_anxiety") {
    const parts: string[] = [];
    if (rd.context) parts.push(String(rd.context));
    if (rd.profile) {
      const profiles: Record<string, string> = {
        chronic_anxiety: "Хроническая тревожность",
        fear_of_judgement: "Страх оценки",
        low_belief: "Низкая вера в успех",
        ambitious_anxious: "Амбициозный, но тревожный",
        balanced: "Сбалансированный тип",
      };
      parts.push(profiles[String(rd.profile)] || String(rd.profile));
    }
    return parts.join(" · ");
  }
  if (t.trainer_type === "lang_relations") {
    const entries = rd.entries as Array<Record<string, unknown>> | undefined;
    if (entries && entries.length > 0) {
      return `${entries.length} ситуаций записано`;
    }
    return "Анализ отношений";
  }
  return "";
}

export default function History() {
  const navigate = useNavigate();
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!getToken()) { navigate("/auth"); return; }
    getMe().then(res => {
      if (res.status === 200 && typeof res.data === "object" && res.data !== null && "user" in res.data) {
        const d = res.data as { purchases: Purchase[]; trainer_results?: TrainerResult[] };
        const all: HistoryItem[] = [];

        (d.purchases || []).forEach(p => {
          all.push({ type: "purchase", id: p.id, created_at: p.created_at, purchase: p });
        });

        (d.trainer_results || []).forEach(t => {
          all.push({ type: "trainer", id: t.id, created_at: t.created_at, trainer: t });
        });

        all.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        setItems(all);
      } else {
        navigate("/auth");
      }
    }).finally(() => setLoading(false));
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-400 text-sm font-golos">Загрузка...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] px-5 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link to="/cabinet" className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors font-golos text-sm">
            <Icon name="ArrowLeft" size={16} />
            Кабинет
          </Link>
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#6C5BA7]/10 flex items-center justify-center">
              <span className="font-golos text-sm font-bold text-[#6C5BA7]">М</span>
            </div>
            <span className="font-golos text-lg font-semibold text-[#4A3D7A] tracking-tight">Матрица личности</span>
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-8">
        <div className="mb-8">
          <h1 className="font-golos font-semibold text-2xl text-gray-900 mb-1">Мои результаты</h1>
          <p className="text-gray-400 text-sm font-golos">Все ваши анализы и тренажёры в одном месте</p>
        </div>

        {items.length === 0 ? (
          <div className="bg-white rounded-2xl soft-shadow p-10 text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#F4F2FA] flex items-center justify-center mx-auto mb-4">
              <Icon name="Clock" size={24} className="text-[#6C5BA7]" />
            </div>
            <h2 className="font-golos font-semibold text-lg text-gray-800 mb-2">Пока нет результатов</h2>
            <p className="font-golos text-sm text-gray-400 mb-6 max-w-sm mx-auto">
              Пройдите анализ или тренажёр, и результат появится здесь
            </p>
            <Link
              to="/cabinet"
              className="inline-flex items-center gap-2 gradient-primary text-white font-golos text-sm font-medium px-6 py-2.5 rounded-xl hover:opacity-90 transition-all"
            >
              Выбрать инструмент
              <Icon name="ArrowRight" size={15} />
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map(item => {
              if (item.type === "purchase" && item.purchase) {
                const p = item.purchase;
                const colors = PRODUCT_COLORS[p.product] || { color: "text-gray-600", bg: "bg-gray-100" };
                const subtitle = buildSubtitle(p);

                return (
                  <Link
                    key={`p-${p.id}`}
                    to={buildResultLink(p)}
                    className="bg-white rounded-2xl soft-shadow p-5 flex items-center gap-4 hover:soft-shadow-hover transition-all duration-200 hover:-translate-y-0.5 group block"
                  >
                    <div className={`w-12 h-12 rounded-xl ${colors.bg} flex items-center justify-center flex-shrink-0`}>
                      <Icon name={PRODUCT_ICONS[p.product] || "FileText"} size={22} className={colors.color} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-golos font-semibold text-[15px] text-[#4A3D7A] mb-0.5">
                        {PRODUCT_NAMES[p.product] || p.product}
                      </h3>
                      {subtitle && (
                        <p className="font-golos text-sm text-gray-400 truncate">{subtitle}</p>
                      )}
                      <p className="font-golos text-xs text-gray-300 mt-1">{formatDate(p.created_at)}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-xs font-medium text-gray-400 font-golos hidden sm:block">
                        {p.amount} ₽
                      </span>
                      <div className="w-8 h-8 rounded-lg bg-[#F4F2FA] flex items-center justify-center group-hover:bg-[#6C5BA7] transition-colors">
                        <Icon name="ArrowRight" size={14} className="text-[#6C5BA7] group-hover:text-white transition-colors" />
                      </div>
                    </div>
                  </Link>
                );
              }

              if (item.type === "trainer" && item.trainer) {
                const t = item.trainer;
                const meta = TRAINER_META[t.trainer_type] || { title: t.trainer_type, icon: "Dumbbell", color: "text-violet-600", bg: "bg-violet-50" };
                const subtitle = buildTrainerSubtitle(t);

                const trainerLink = t.trainer_type === "lang_relations"
                  ? "/trainer/lang-relations"
                  : t.trainer_type === "barriers_anxiety"
                  ? "/trainer/barriers"
                  : `/trainer/emotion-chain/result?id=${t.id}`;

                return (
                  <Link
                    key={`t-${t.id}`}
                    to={trainerLink}
                    className="bg-white rounded-2xl soft-shadow p-5 flex items-center gap-4 hover:soft-shadow-hover transition-all duration-200 hover:-translate-y-0.5 group block"
                  >
                    <div className={`w-12 h-12 rounded-xl ${meta.bg} flex items-center justify-center flex-shrink-0`}>
                      <Icon name={meta.icon} size={22} className={meta.color} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h3 className="font-golos font-semibold text-[15px] text-[#4A3D7A]">
                          {meta.title}
                        </h3>
                        <span className="text-[10px] font-medium text-violet-600 bg-violet-50 border border-violet-100 px-1.5 py-0.5 rounded-full">
                          Тренажёр
                        </span>
                      </div>
                      {subtitle && (
                        <p className="font-golos text-sm text-gray-400 truncate">{subtitle}</p>
                      )}
                      <p className="font-golos text-xs text-gray-300 mt-1">{formatDate(t.created_at)}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center group-hover:bg-violet-600 transition-colors">
                        <Icon name="ArrowRight" size={14} className="text-violet-600 group-hover:text-white transition-colors" />
                      </div>
                    </div>
                  </Link>
                );
              }

              return null;
            })}
          </div>
        )}
      </main>
    </div>
  );
}