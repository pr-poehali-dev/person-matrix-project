import Icon from "@/components/ui/icon";
import {
  analyzeEntries,
  RELATIONSHIP_TYPES,
  RESULTS,
  USER_STYLE_TEXTS,
  PARTNER_STYLE_TEXTS,
  SCENARIO_TEXTS,
  RI_LABELS,
  EI_LABELS,
  type LREntry,
  type LRReport,
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

  return (
    <div className="space-y-5 pb-6">
      <HeaderBlock r={r} eiInfo={eiInfo} riInfo={riInfo} />
      <MainInsightBlock r={r} userStyleText={userStyleText} partnerStyleText={partnerStyleText} scenarioText={scenarioText} />
      <DynamicsBlock entries={entries} r={r} />
      <PatternBlock r={r} userStyleText={userStyleText} partnerStyleText={partnerStyleText} />
      <ConflictMapBlock r={r} riInfo={riInfo} />
      <ScenarioBlock scenarioText={scenarioText} />
      <ActionPlanBlock scenarioText={scenarioText} userStyleText={userStyleText} r={r} />

      {saving && (
        <div className="bg-[#F9F8FC] border border-[#E8E4F5] rounded-xl px-4 py-3 flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-[#6C5BA7] border-t-transparent rounded-full animate-spin" />
          <span className="font-golos text-sm text-gray-500">Сохраняем анализ...</span>
        </div>
      )}

      <div className="flex flex-col gap-2">
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

function HeaderBlock({ r, eiInfo, riInfo }: { r: LRReport; eiInfo: { label: string; color: string }; riInfo: { label: string; color: string } }) {
  const emoji = r.riLabel === "healthy" ? "💚" : r.riLabel === "tense" ? "💛" : r.riLabel === "high_conflict" ? "🟠" : "🔴";

  return (
    <div className="bg-gradient-to-br from-rose-500 to-rose-600 rounded-2xl p-6 text-white">
      <div className="text-3xl mb-3">{emoji}</div>
      <h2 className="font-golos font-bold text-xl mb-1">Ваши отношения: {riInfo.label.toLowerCase()}</h2>
      <p className="font-golos text-white/80 text-sm mb-4">
        {r.totalEntries} ситуаций · {RELATIONSHIP_TYPES[r.relType]}
      </p>
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white/15 rounded-xl px-3 py-2.5">
          <div className="font-golos text-[11px] text-white/60 uppercase tracking-wider mb-0.5">Эмоц. фон</div>
          <div className="font-golos font-semibold text-sm">{eiInfo.label}</div>
        </div>
        <div className="bg-white/15 rounded-xl px-3 py-2.5">
          <div className="font-golos text-[11px] text-white/60 uppercase tracking-wider mb-0.5">Напряжение</div>
          <div className="font-golos font-semibold text-sm">{r.relationshipIndex.toFixed(1)} из 10</div>
        </div>
      </div>
    </div>
  );
}

function MainInsightBlock({ r, userStyleText, partnerStyleText, scenarioText }: {
  r: LRReport;
  userStyleText: { label: string; desc: string; tip: string };
  partnerStyleText: { label: string; desc: string };
  scenarioText: { label: string; desc: string; recommendations: string[] };
}) {
  const mainMessage = buildMainMessage(r, userStyleText, partnerStyleText);

  return (
    <SectionCard icon="Sparkles" title="Главное, что мы увидели">
      <div className="bg-[#FFFBF5] border border-amber-100 rounded-xl p-4 mb-4">
        <p className="font-golos text-sm text-gray-800 leading-relaxed">{mainMessage}</p>
      </div>
      <div className="bg-gray-50 rounded-xl p-4">
        <p className="font-golos text-xs font-semibold text-gray-700 mb-1">Что это значит на практике</p>
        <p className="font-golos text-sm text-gray-600 leading-relaxed">{scenarioText.desc}</p>
      </div>
    </SectionCard>
  );
}

function DynamicsBlock({ entries, r }: { entries: LREntry[]; r: LRReport }) {
  const allEmotions = { ...EMOTIONS_NEGATIVE, ...EMOTIONS_POSITIVE };
  const allResults = RESULTS;

  const negCount = entries.reduce((s, e) => s + e.emotions.filter(em => em <= 10).length, 0);
  const posCount = entries.reduce((s, e) => s + e.emotions.filter(em => em > 10).length, 0);
  const totalEm = negCount + posCount;

  const resultCounts: Record<number, number> = {};
  entries.forEach(e => { resultCounts[e.result] = (resultCounts[e.result] || 0) + 1; });
  const topResult = Object.entries(resultCounts).sort((a, b) => b[1] - a[1])[0];

  return (
    <SectionCard icon="TrendingUp" title="Что чаще происходит">
      {r.topEmotions.length > 0 && (
        <div className="mb-4">
          <p className="font-golos text-xs text-gray-400 uppercase tracking-wider mb-2">Ваши основные чувства</p>
          <div className="flex flex-wrap gap-2">
            {r.topEmotions.map(e => (
              <span key={e.code} className={`text-xs font-medium px-2.5 py-1.5 rounded-lg font-golos ${
                e.code <= 10 
                  ? "bg-rose-50 border border-rose-100 text-rose-700"
                  : "bg-emerald-50 border border-emerald-100 text-emerald-700"
              }`}>
                {e.label} · {e.count} раз
              </span>
            ))}
          </div>
        </div>
      )}

      {totalEm > 0 && (
        <div className="mb-4">
          <div className="flex justify-between text-xs font-golos mb-1.5">
            <span className="text-rose-500">Негативные: {negCount}</span>
            <span className="text-emerald-500">Позитивные: {posCount}</span>
          </div>
          <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden flex">
            <div className="h-full bg-rose-400 transition-all" style={{ width: `${(negCount / totalEm) * 100}%` }} />
            <div className="h-full bg-emerald-400 transition-all" style={{ width: `${(posCount / totalEm) * 100}%` }} />
          </div>
        </div>
      )}

      {topResult && (
        <div className="bg-gray-50 rounded-xl px-4 py-3">
          <p className="font-golos text-sm text-gray-700">
            Чаще всего ситуация заканчивается: <strong>{allResults[Number(topResult[0])]?.toLowerCase()}</strong> ({topResult[1]} из {entries.length})
          </p>
        </div>
      )}
    </SectionCard>
  );
}

function PatternBlock({ r, userStyleText, partnerStyleText }: {
  r: LRReport;
  userStyleText: { label: string; desc: string; tip: string };
  partnerStyleText: { label: string; desc: string };
}) {
  return (
    <SectionCard icon="Repeat" title="Паттерны общения">
      <div className="space-y-4">
        <div className="bg-[#F9F8FC] border border-[#E8E4F5] rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-[#6C5BA7]/10 flex items-center justify-center">
              <Icon name="User" size={16} className="text-[#6C5BA7]" />
            </div>
            <div>
              <p className="font-golos font-semibold text-gray-900 text-sm">Вы: {userStyleText.label}</p>
              <p className="font-golos text-xs text-gray-400">{Math.round(r.userStyleScore * 100)}% ваших реакций</p>
            </div>
          </div>
          <p className="font-golos text-sm text-gray-600 leading-relaxed">{userStyleText.desc}</p>
        </div>

        <div className="bg-rose-50/50 border border-rose-100 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-rose-100 flex items-center justify-center">
              <Icon name="Users" size={16} className="text-rose-500" />
            </div>
            <div>
              <p className="font-golos font-semibold text-gray-900 text-sm">Собеседник: {partnerStyleText.label}</p>
              <p className="font-golos text-xs text-gray-400">{Math.round(r.partnerStyleScore * 100)}% реакций</p>
            </div>
          </div>
          <p className="font-golos text-sm text-gray-600 leading-relaxed">{partnerStyleText.desc}</p>
        </div>

        <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
          <div className="flex items-start gap-2">
            <Icon name="Zap" size={14} className="text-amber-600 mt-0.5 shrink-0" />
            <p className="font-golos text-sm text-amber-800 leading-relaxed">
              <strong>{userStyleText.label}</strong> + <strong>{partnerStyleText.label}</strong> — {getComboInsight(r.userStyle, r.partnerStyle)}
            </p>
          </div>
        </div>
      </div>
    </SectionCard>
  );
}

function ConflictMapBlock({ r, riInfo }: { r: LRReport; riInfo: { label: string; color: string } }) {
  const zones = [
    { range: "0–2", label: "Здоровая", color: "bg-emerald-400", active: r.riLabel === "healthy" },
    { range: "2–4", label: "Напряжение", color: "bg-amber-400", active: r.riLabel === "tense" },
    { range: "4–6", label: "Конфликт", color: "bg-orange-400", active: r.riLabel === "high_conflict" },
    { range: "6+", label: "Токсичная", color: "bg-rose-500", active: r.riLabel === "toxic" },
  ];

  return (
    <SectionCard icon="Activity" title="Уровень напряжённости">
      <div className="flex items-end gap-2 mb-4">
        <span className="font-golos text-4xl font-bold text-gray-900">{r.relationshipIndex.toFixed(1)}</span>
        <span className="font-golos text-sm text-gray-400 mb-1">из 10</span>
        <span className={`font-golos text-sm font-semibold ml-auto ${riInfo.color}`}>{riInfo.label}</span>
      </div>

      <div className="h-3 bg-gray-100 rounded-full overflow-hidden mb-1">
        <div
          className={`h-full rounded-full transition-all duration-700 ${
            r.riLabel === "healthy" ? "bg-emerald-400"
            : r.riLabel === "tense" ? "bg-amber-400"
            : r.riLabel === "high_conflict" ? "bg-orange-400"
            : "bg-rose-500"
          }`}
          style={{ width: `${Math.min((r.relationshipIndex / 10) * 100, 100)}%` }}
        />
      </div>
      <div className="flex justify-between text-[10px] text-gray-400 font-golos mb-4">
        <span>спокойно</span>
        <span>критично</span>
      </div>

      <div className="grid grid-cols-4 gap-1.5 text-center text-xs">
        {zones.map(z => (
          <div
            key={z.range}
            className={`rounded-lg py-2 px-1 font-golos ${
              z.active
                ? "bg-rose-100 border border-rose-200 text-rose-800 font-semibold"
                : "bg-gray-50 text-gray-400"
            }`}
          >
            <div className="font-medium">{z.range}</div>
            <div className="text-[10px] mt-0.5">{z.label}</div>
          </div>
        ))}
      </div>

      <div className="mt-4 bg-gray-50 rounded-xl px-4 py-3">
        <p className="font-golos text-xs text-gray-500 leading-relaxed">
          {r.riLabel === "healthy"
            ? "У вас низкий уровень конфликтов. Основа для доверительных отношений уже есть."
            : r.riLabel === "tense"
            ? "Есть точки напряжения, но они управляемые. Работа над паттернами общения даст быстрый результат."
            : r.riLabel === "high_conflict"
            ? "Конфликты повторяются и не решаются. Стоит обратить внимание на способ, которым вы оба реагируете."
            : "Уровень напряжения высокий. Подумайте, есть ли в этих отношениях пространство для изменений."}
        </p>
      </div>
    </SectionCard>
  );
}

function ScenarioBlock({ scenarioText }: { scenarioText: { label: string; desc: string; recommendations: string[] } }) {
  return (
    <SectionCard icon="Map" title="Сценарий ваших отношений">
      <div className="bg-[#F9F8FC] border border-[#E8E4F5] rounded-xl p-4">
        <p className="font-golos font-semibold text-[#4A3D7A] text-base mb-2">{scenarioText.label}</p>
        <p className="font-golos text-sm text-gray-700 leading-relaxed">{scenarioText.desc}</p>
      </div>
    </SectionCard>
  );
}

function ActionPlanBlock({ scenarioText, userStyleText, r }: {
  scenarioText: { label: string; desc: string; recommendations: string[] };
  userStyleText: { label: string; desc: string; tip: string };
  r: LRReport;
}) {
  return (
    <SectionCard icon="Lightbulb" title="Что делать дальше">
      <div className="bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3 mb-4">
        <p className="font-golos text-xs font-semibold text-emerald-800 mb-0.5">Ваш первый шаг</p>
        <p className="font-golos text-sm text-emerald-700 leading-relaxed">{userStyleText.tip}</p>
      </div>

      <p className="font-golos text-xs text-gray-400 uppercase tracking-wider mb-3">План действий</p>
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

      {r.totalEntries < 10 && (
        <div className="mt-4 bg-[#F9F8FC] border border-[#E8E4F5] rounded-xl px-4 py-3">
          <p className="font-golos text-xs text-gray-500 leading-relaxed">
            💡 Чем больше ситуаций вы опишете, тем точнее анализ. Сейчас {r.totalEntries} — попробуйте добавить ещё, чтобы увидеть динамику.
          </p>
        </div>
      )}
    </SectionCard>
  );
}

function SectionCard({ icon, title, children }: { icon: string; title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center">
          <Icon name={icon} size={16} className="text-rose-500" />
        </div>
        <h3 className="font-golos font-semibold text-gray-900 text-[15px]">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function buildMainMessage(
  r: LRReport,
  userStyleText: { label: string },
  partnerStyleText: { label: string },
): string {
  const relName = RELATIONSHIP_TYPES[r.relType]?.toLowerCase() || "собеседник";

  if (r.riLabel === "healthy") {
    return `В ваших отношениях с категорией «${relName}» преобладает конструктив. Вы оба стремитесь к диалогу, и это видно: конфликты решаются, а не копятся. Это сильная база — и встречается не так часто.`;
  }
  if (r.riLabel === "tense") {
    return `Ваш стиль — ${userStyleText.label.toLowerCase()}, а собеседник чаще реагирует через ${partnerStyleText.label.toLowerCase().replace(/^./, '')}. Это создаёт напряжение, но ситуация управляемая. Ключевое — заметить момент, когда разговор начинает идти по кругу.`;
  }
  if (r.riLabel === "high_conflict") {
    return `В ${r.totalEntries} описанных ситуациях чётко виден повторяющийся цикл: вы реагируете через ${userStyleText.label.toLowerCase()}, собеседник — через ${partnerStyleText.label.toLowerCase()}. Конфликты не решаются до конца и возвращаются. Это не приговор, но сигнал, что пора менять подход.`;
  }
  return `Уровень напряжения в ваших отношениях с «${relName}» высокий. ${r.topEmotions.length > 0 ? `Доминируют ${r.topEmotions.slice(0, 2).map(e => e.label.toLowerCase()).join(" и ")}.` : ""} Подумайте: есть ли в этих отношениях пространство для другого формата общения?`;
}

function getComboInsight(userStyle: string, partnerStyle: string): string {
  const combos: Record<string, string> = {
    "avoidance_pressure": "классический цикл: чем больше давления, тем глубже молчание. Разорвать его может только один из вас.",
    "avoidance_defense": "оба уходят от сути. Проблемы не озвучиваются — они просто тонут в тишине.",
    "avoidance_ignoring": "контакт минимален. Темы не поднимаются, напряжение копится в фоне.",
    "avoidance_constructive": "собеседник готов к диалогу, но вы пока не включаетесь. Попробуйте — безопасная среда уже есть.",
    "suppression_pressure": "вы уступаете, другой давит. Со временем это разрушает самооценку и доверие.",
    "suppression_defense": "оба прячут настоящие чувства. Диалог формально есть, но настоящего контакта нет.",
    "suppression_ignoring": "конфликтов «нет», но и близости тоже. Отношения становятся формальными.",
    "suppression_constructive": "собеседник открыт, но ваши настоящие мысли остаются за кадром. Рискните озвучить.",
    "emotional_pressure": "два сильных потока эмоций сталкиваются. Конфликты яркие и изматывающие.",
    "emotional_defense": "ваши эмоции наталкиваются на стену. Это вызывает ещё больше фрустрации.",
    "emotional_ignoring": "вы выражаете, другой игнорирует. Ощущение, что вас не слышат.",
    "emotional_constructive": "хорошая динамика: вы чувствуете, другой думает. Вместе — сильная пара.",
    "constructive_pressure": "вы ищете решение, другой настаивает на своём. Ваш подход правильный — но нужно терпение.",
    "constructive_defense": "вы открыты, другой закрывается. Дайте время — доверие строится постепенно.",
    "constructive_ignoring": "вы говорите, другой уходит от темы. Попробуйте задавать вопросы вместо утверждений.",
    "constructive_constructive": "оба настроены на диалог. Это лучшая основа для развития.",
  };
  return combos[`${userStyle}_${partnerStyle}`] || "это создаёт свою уникальную динамику в ваших отношениях.";
}