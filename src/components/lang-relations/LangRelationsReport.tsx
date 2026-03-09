import Icon from "@/components/ui/icon";
import { ScoreBar } from "./LangRelationsPrimitives";
import {
  analyzeEntries,
  RELATIONSHIP_TYPES,
  USER_STYLE_TEXTS,
  PARTNER_STYLE_TEXTS,
  SCENARIO_TEXTS,
  RI_LABELS,
  EI_LABELS,
  type LREntry,
} from "./langRelationsTypes";

type Props = {
  entries: LREntry[];
  saving: boolean;
  onAddMore: () => void;
  onCabinet: () => void;
};

export default function LangRelationsReport({ entries, saving, onAddMore, onCabinet }: Props) {
  const r = analyzeEntries(entries);

  const userStyleText = USER_STYLE_TEXTS[r.userStyle];
  const partnerStyleText = PARTNER_STYLE_TEXTS[r.partnerStyle];
  const scenarioText = SCENARIO_TEXTS[r.scenario];
  const riInfo = RI_LABELS[r.riLabel];
  const eiInfo = EI_LABELS[r.eiLabel];

  const riMax = 10;

  return (
    <div className="space-y-5">
      {/* Заголовок */}
      <div className="bg-gradient-to-br from-rose-500 to-rose-600 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-2 mb-1">
          <Icon name="BarChart3" size={18} className="text-white/80" />
          <span className="font-golos text-xs text-white/80 uppercase tracking-wider">Анализ отношений</span>
        </div>
        <h2 className="font-golos font-bold text-xl mb-1">{RELATIONSHIP_TYPES[r.relType]}</h2>
        <p className="font-golos text-white/75 text-sm">На основе {r.totalEntries} записей</p>
      </div>

      {/* Блок 1: Эмоциональный фон */}
      <SectionCard icon="Heart" title="Эмоциональный фон">
        <div className="flex items-center justify-between mb-3">
          <span className="font-golos text-sm text-gray-600">Общий тон</span>
          <span className={`font-golos text-sm font-semibold ${eiInfo.color}`}>{eiInfo.label}</span>
        </div>
        {r.topEmotions.length > 0 && (
          <div>
            <p className="font-golos text-xs text-gray-400 uppercase tracking-wider mb-2">Топ эмоций</p>
            <div className="flex flex-wrap gap-2">
              {r.topEmotions.map(e => (
                <span key={e.code} className="bg-rose-50 border border-rose-100 text-rose-700 text-xs font-medium px-2.5 py-1 rounded-lg font-golos">
                  {e.label} · {e.count}
                </span>
              ))}
            </div>
          </div>
        )}
        <div className="mt-4 bg-gray-50 rounded-xl px-4 py-3">
          <p className="font-golos text-xs text-gray-500 leading-relaxed">
            {r.eiLabel === "high_negative"
              ? "Большинство ситуаций сопровождаются негативными эмоциями. Это требует внимания."
              : r.eiLabel === "moderate"
              ? "Эмоциональный фон смешанный — есть как напряжение, так и моменты спокойствия."
              : "Преобладают позитивные эмоции. Коммуникация в целом ощущается как безопасная."}
          </p>
        </div>
      </SectionCard>

      {/* Блок 2: Ваш стиль */}
      <SectionCard icon="MessageCircle" title="Ваш стиль реакции">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-[#6C5BA7]/10 flex items-center justify-center shrink-0">
            <Icon name="User" size={18} className="text-[#6C5BA7]" />
          </div>
          <div>
            <p className="font-golos font-semibold text-gray-900 text-sm">{userStyleText.label}</p>
            <p className="font-golos text-xs text-gray-400">{Math.round(r.userStyleScore * 100)}% реакций</p>
          </div>
        </div>
        <p className="font-golos text-sm text-gray-700 leading-relaxed mb-4">{userStyleText.desc}</p>
        <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
          <p className="font-golos text-xs font-semibold text-amber-800 mb-0.5">Совет</p>
          <p className="font-golos text-xs text-amber-700 leading-relaxed">{userStyleText.tip}</p>
        </div>
      </SectionCard>

      {/* Блок 3: Стиль второго человека */}
      <SectionCard icon="Users" title="Стиль второго человека">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center shrink-0">
            <Icon name="User" size={18} className="text-rose-500" />
          </div>
          <div>
            <p className="font-golos font-semibold text-gray-900 text-sm">{partnerStyleText.label}</p>
            <p className="font-golos text-xs text-gray-400">{Math.round(r.partnerStyleScore * 100)}% реакций</p>
          </div>
        </div>
        <p className="font-golos text-sm text-gray-700 leading-relaxed">{partnerStyleText.desc}</p>
      </SectionCard>

      {/* Блок 4: Индекс конфликтности */}
      <SectionCard icon="BarChart2" title="Индекс конфликтности">
        <div className="flex items-center justify-between mb-3">
          <span className="font-golos text-2xl font-bold text-gray-900">{r.relationshipIndex.toFixed(1)}</span>
          <span className={`font-golos text-sm font-semibold ${riInfo.color}`}>{riInfo.label}</span>
        </div>
        <ScoreBar
          label="Уровень напряжённости"
          value={r.relationshipIndex}
          max={riMax}
          color={
            r.riLabel === "healthy" ? "bg-emerald-400"
            : r.riLabel === "tense" ? "bg-amber-400"
            : r.riLabel === "high_conflict" ? "bg-orange-400"
            : "bg-rose-500"
          }
        />
        <div className="flex justify-between text-xs text-gray-400 font-golos mt-1 mb-4">
          <span>0 — здоровая</span>
          <span>6+ — токсичная</span>
        </div>
        <div className="grid grid-cols-4 gap-1.5 text-center text-xs">
          {[
            { range: "0–2", label: "Здоровая", active: r.riLabel === "healthy" },
            { range: "2–4", label: "Напряжение", active: r.riLabel === "tense" },
            { range: "4–6", label: "Конфликт", active: r.riLabel === "high_conflict" },
            { range: "6+", label: "Токсичная", active: r.riLabel === "toxic" },
          ].map(item => (
            <div
              key={item.range}
              className={`rounded-lg py-2 px-1 font-golos ${
                item.active
                  ? "bg-rose-100 border border-rose-200 text-rose-800 font-semibold"
                  : "bg-gray-50 text-gray-400"
              }`}
            >
              <div className="font-medium">{item.range}</div>
              <div className="text-[10px] mt-0.5">{item.label}</div>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Блок 5: Сценарий */}
      <SectionCard icon="Layers" title="Сценарий отношений">
        <div className="bg-[#F9F8FC] border border-[#E8E4F5] rounded-xl p-4 mb-4">
          <p className="font-golos font-semibold text-[#4A3D7A] text-base mb-2">{scenarioText.label}</p>
          <p className="font-golos text-sm text-gray-700 leading-relaxed">{scenarioText.desc}</p>
        </div>
      </SectionCard>

      {/* Блок 6: Рекомендации */}
      <SectionCard icon="Lightbulb" title="Рекомендации">
        <ul className="space-y-3">
          {scenarioText.recommendations.map((rec, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-lg bg-rose-50 flex items-center justify-center text-xs font-bold text-rose-500 font-golos shrink-0 mt-0.5">
                {i + 1}
              </span>
              <p className="font-golos text-sm text-gray-700 leading-relaxed">{rec}</p>
            </li>
          ))}
        </ul>
      </SectionCard>

      {/* Сохранение + действия */}
      {saving && (
        <div className="bg-[#F9F8FC] border border-[#E8E4F5] rounded-xl px-4 py-3 flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-[#6C5BA7] border-t-transparent rounded-full animate-spin" />
          <span className="font-golos text-sm text-gray-500">Сохраняем анализ...</span>
        </div>
      )}

      <div className="flex flex-col gap-2 pb-4">
        <button
          onClick={onAddMore}
          className="w-full border border-rose-200 text-rose-600 hover:bg-rose-50 font-golos text-sm font-medium rounded-xl py-3 transition-colors"
        >
          Добавить ещё ситуацию
        </button>
        <button
          onClick={onCabinet}
          className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-golos text-sm font-medium rounded-xl py-3 transition-colors"
        >
          В кабинет
        </button>
      </div>
    </div>
  );
}

// ─── SectionCard ─────────────────────────────────────────────────────────────

function SectionCard({ icon, title, children }: { icon: string; title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center">
          <Icon name={icon} size={16} className="text-gray-500" />
        </div>
        <h3 className="font-golos font-semibold text-gray-900 text-sm">{title}</h3>
      </div>
      {children}
    </div>
  );
}
