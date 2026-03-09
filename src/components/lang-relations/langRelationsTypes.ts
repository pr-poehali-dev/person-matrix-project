// ─── Типы шагов ──────────────────────────────────────────────────────────────

export type LRStep =
  | "intro"
  | "rel_type"
  | "emotions"
  | "user_reaction"
  | "partner_reaction"
  | "result"
  | "saved"
  | "not_enough"
  | "report";

// ─── Типы отношений ───────────────────────────────────────────────────────────

export const RELATIONSHIP_TYPES: Record<number, string> = {
  1: "Партнёр",
  2: "Бывший партнёр",
  3: "Родители",
  4: "Дети",
  5: "Родственники",
  6: "Друзья",
  7: "Коллеги",
  8: "Руководитель",
  9: "Другое",
};

// ─── Эмоции ──────────────────────────────────────────────────────────────────

export const EMOTIONS_NEGATIVE: Record<number, string> = {
  1: "Обида",
  2: "Злость",
  3: "Раздражение",
  4: "Грусть",
  5: "Тревога",
  6: "Разочарование",
  7: "Несправедливость",
  8: "Страх",
  9: "Напряжение",
  10: "Растерянность",
};

export const EMOTIONS_POSITIVE: Record<number, string> = {
  11: "Спокойствие",
  12: "Радость",
  13: "Благодарность",
  14: "Уважение",
  15: "Тепло",
};

export const NEGATIVE_CODES = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
export const POSITIVE_CODES = new Set([11, 12, 13, 14, 15]);

// ─── Реакция пользователя ─────────────────────────────────────────────────────

export const USER_REACTIONS: Record<number, string> = {
  1: "Промолчала",
  2: "Объяснила позицию",
  3: "Вступила в спор",
  4: "Закрылась",
  5: "Согласилась против воли",
  6: "Выразила эмоции",
  7: "Перевела разговор",
  8: "Ушла от общения",
  9: "Резкий ответ",
  10: "Спокойный диалог",
};

// ─── Реакция партнёра ─────────────────────────────────────────────────────────

export const PARTNER_REACTIONS: Record<number, string> = {
  1: "Вступил в спор",
  2: "Обиделся",
  3: "Игнорировал",
  4: "Защищался",
  5: "Объяснял",
  6: "Извинился",
  7: "Сменил тему",
  8: "Давил",
  9: "Поддержал",
  10: "Спокойный диалог",
};

// ─── Итог ситуации ────────────────────────────────────────────────────────────

export const RESULTS: Record<number, string> = {
  1: "Конфликт усилился",
  2: "Конфликт остался",
  3: "Частично решился",
  4: "Ситуация прояснилась",
  5: "Договорились",
  6: "Без результата",
  7: "Стало легче",
};

// ─── Одна запись ─────────────────────────────────────────────────────────────

export type LREntry = {
  relationship_type: number;
  emotions: number[];
  user_reaction: number[];
  partner_reaction: number[];
  result: number;
  ei: number;
  conflict_score: number;
};

// ─── Стили поведения ─────────────────────────────────────────────────────────

export type UserStyle = "avoidance" | "suppression" | "emotional" | "constructive";
export type PartnerStyle = "pressure" | "defense" | "ignoring" | "constructive";

// Категории реакций пользователя
const USER_AVOIDANCE = new Set([1, 4, 8]);
const USER_SUPPRESSION = new Set([5, 7]);
const USER_EMOTIONAL = new Set([3, 6, 9]);
const USER_CONSTRUCTIVE = new Set([2, 10]);

// Категории реакций партнёра
const PARTNER_PRESSURE = new Set([1, 8]);
const PARTNER_DEFENSE = new Set([4, 2]);
const PARTNER_IGNORING = new Set([3, 7]);
const PARTNER_CONSTRUCTIVE = new Set([5, 6, 9, 10]);

// Коэффициенты ConflictScore
const USER_REACTION_COEFF: Record<string, number> = {
  avoidance: 1,
  suppression: 2,
  emotional: 3,
  constructive: 0,
};

const PARTNER_REACTION_COEFF: Record<string, number> = {
  pressure: 3,
  defense: 2,
  ignoring: 2,
  constructive: 0,
};

const RESULT_COEFF: Record<number, number> = {
  1: 4,
  2: 3,
  3: 2,
  4: 1,
  5: 0,
  6: 2,
  7: 0,
};

// ─── Расчёт EI ───────────────────────────────────────────────────────────────

export function calcEI(emotions: number[]): number {
  if (!emotions.length) return 0;
  const n = emotions.filter(e => NEGATIVE_CODES.has(e)).length;
  const p = emotions.filter(e => POSITIVE_CODES.has(e)).length;
  const t = emotions.length;
  return (n - p) / t;
}

function classifyUserReactions(reactions: number[]): UserStyle {
  const counts: Record<UserStyle, number> = { avoidance: 0, suppression: 0, emotional: 0, constructive: 0 };
  for (const r of reactions) {
    if (USER_AVOIDANCE.has(r)) counts.avoidance++;
    else if (USER_SUPPRESSION.has(r)) counts.suppression++;
    else if (USER_EMOTIONAL.has(r)) counts.emotional++;
    else if (USER_CONSTRUCTIVE.has(r)) counts.constructive++;
  }
  return (Object.entries(counts) as [UserStyle, number][]).reduce((a, b) => b[1] > a[1] ? b : a)[0];
}

function classifyPartnerReactions(reactions: number[]): PartnerStyle {
  const counts: Record<PartnerStyle, number> = { pressure: 0, defense: 0, ignoring: 0, constructive: 0 };
  for (const r of reactions) {
    if (PARTNER_PRESSURE.has(r)) counts.pressure++;
    else if (PARTNER_DEFENSE.has(r)) counts.defense++;
    else if (PARTNER_IGNORING.has(r)) counts.ignoring++;
    else if (PARTNER_CONSTRUCTIVE.has(r)) counts.constructive++;
  }
  return (Object.entries(counts) as [PartnerStyle, number][]).reduce((a, b) => b[1] > a[1] ? b : a)[0];
}

function calcConflictScore(userStyle: UserStyle, partnerStyle: PartnerStyle, result: number): number {
  return USER_REACTION_COEFF[userStyle] + PARTNER_REACTION_COEFF[partnerStyle] + (RESULT_COEFF[result] ?? 2);
}

// ─── Анализ всех записей ─────────────────────────────────────────────────────

export type Scenario =
  | "suppression"
  | "escalation"
  | "unresolved"
  | "healthy"
  | "neutral";

export type LRReport = {
  totalEntries: number;
  avgEI: number;
  eiLabel: "high_negative" | "moderate" | "positive";
  userStyle: UserStyle;
  userStyleScore: number;
  partnerStyle: PartnerStyle;
  partnerStyleScore: number;
  relationshipIndex: number;
  riLabel: "healthy" | "tense" | "high_conflict" | "toxic";
  scenario: Scenario;
  topEmotions: { code: number; label: string; count: number }[];
  relType: number;
};

export function analyzeEntries(entries: LREntry[]): LRReport {
  const n = entries.length;

  const avgEI = entries.reduce((s, e) => s + e.ei, 0) / n;
  const eiLabel =
    avgEI > 0.5 ? "high_negative" : avgEI >= 0 ? "moderate" : "positive";

  // Стиль пользователя
  const allUserReactions = entries.flatMap(e => e.user_reaction);
  const userStyleCounts: Record<UserStyle, number> = { avoidance: 0, suppression: 0, emotional: 0, constructive: 0 };
  for (const r of allUserReactions) {
    if (USER_AVOIDANCE.has(r)) userStyleCounts.avoidance++;
    else if (USER_SUPPRESSION.has(r)) userStyleCounts.suppression++;
    else if (USER_EMOTIONAL.has(r)) userStyleCounts.emotional++;
    else if (USER_CONSTRUCTIVE.has(r)) userStyleCounts.constructive++;
  }
  const userStyleEntry = (Object.entries(userStyleCounts) as [UserStyle, number][]).reduce((a, b) => b[1] > a[1] ? b : a);
  const userStyle = userStyleEntry[0];
  const userStyleScore = allUserReactions.length ? userStyleEntry[1] / allUserReactions.length : 0;

  // Стиль партнёра
  const allPartnerReactions = entries.flatMap(e => e.partner_reaction);
  const partnerStyleCounts: Record<PartnerStyle, number> = { pressure: 0, defense: 0, ignoring: 0, constructive: 0 };
  for (const r of allPartnerReactions) {
    if (PARTNER_PRESSURE.has(r)) partnerStyleCounts.pressure++;
    else if (PARTNER_DEFENSE.has(r)) partnerStyleCounts.defense++;
    else if (PARTNER_IGNORING.has(r)) partnerStyleCounts.ignoring++;
    else if (PARTNER_CONSTRUCTIVE.has(r)) partnerStyleCounts.constructive++;
  }
  const partnerStyleEntry = (Object.entries(partnerStyleCounts) as [PartnerStyle, number][]).reduce((a, b) => b[1] > a[1] ? b : a);
  const partnerStyle = partnerStyleEntry[0];
  const partnerStyleScore = allPartnerReactions.length ? partnerStyleEntry[1] / allPartnerReactions.length : 0;

  // RelationshipIndex
  const userStylePerEntry = entries.map(e => classifyUserReactions(e.user_reaction));
  const partnerStylePerEntry = entries.map(e => classifyPartnerReactions(e.partner_reaction));
  const totalConflict = entries.reduce((s, e, i) => {
    return s + calcConflictScore(userStylePerEntry[i], partnerStylePerEntry[i], e.result);
  }, 0);
  const relationshipIndex = totalConflict / n;

  const riLabel =
    relationshipIndex <= 2 ? "healthy"
    : relationshipIndex <= 4 ? "tense"
    : relationshipIndex <= 6 ? "high_conflict"
    : "toxic";

  // Сценарий
  let scenario: Scenario = "neutral";
  if (userStyle === "avoidance" && partnerStyle === "pressure") scenario = "suppression";
  else if (userStyle === "emotional" && partnerStyle === "defense") scenario = "escalation";
  else if (userStyle === "suppression" && partnerStyle === "ignoring") scenario = "unresolved";
  else if (userStyle === "constructive" && partnerStyle === "constructive" && relationshipIndex < 2) scenario = "healthy";

  // Топ эмоций
  const emotionCount: Record<number, number> = {};
  for (const e of entries) {
    for (const code of e.emotions) {
      emotionCount[code] = (emotionCount[code] || 0) + 1;
    }
  }
  const allEmotions = { ...EMOTIONS_NEGATIVE, ...EMOTIONS_POSITIVE };
  const topEmotions = Object.entries(emotionCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([code, count]) => ({ code: Number(code), label: allEmotions[Number(code)] || "", count }));

  // Тип отношений (самый частый)
  const relTypeCount: Record<number, number> = {};
  for (const e of entries) {
    relTypeCount[e.relationship_type] = (relTypeCount[e.relationship_type] || 0) + 1;
  }
  const relType = Number(Object.entries(relTypeCount).sort((a, b) => b[1] - a[1])[0]?.[0] || 1);

  return {
    totalEntries: n,
    avgEI,
    eiLabel,
    userStyle,
    userStyleScore,
    partnerStyle,
    partnerStyleScore,
    relationshipIndex,
    riLabel,
    scenario,
    topEmotions,
    relType,
  };
}

// ─── Тексты для отчёта ───────────────────────────────────────────────────────

export const USER_STYLE_TEXTS: Record<UserStyle, { label: string; desc: string; tip: string }> = {
  avoidance: {
    label: "Избегание",
    desc: "В сложных ситуациях вы чаще молчите, уходите или закрываетесь. Это защищает от немедленного конфликта, но копит напряжение внутри.",
    tip: "Попробуйте называть своё состояние вслух: «Мне сейчас трудно говорить об этом» — это уже не молчание.",
  },
  suppression: {
    label: "Подавление",
    desc: "Вы соглашаетесь или переводите тему, когда на самом деле несогласны. Ваши потребности остаются за кадром.",
    tip: "Перед тем как согласиться — сделайте паузу. Спросите себя: «Это моя позиция или я избегаю давления?»",
  },
  emotional: {
    label: "Эмоциональная реакция",
    desc: "Ваши эмоции выходят наружу — через спор, резкий ответ или открытое выражение чувств. Это честно, но иногда усиливает конфликт.",
    tip: "Назовите эмоцию перед словами: «Я злюсь, потому что...» — это снижает накал и удерживает диалог.",
  },
  constructive: {
    label: "Конструктив",
    desc: "Вы склонны объяснять свою позицию и вести спокойный диалог. Это сильная база для любых отношений.",
    tip: "Продолжайте — и ищите ситуации, где можно помочь другому тоже перейти в этот стиль.",
  },
};

export const PARTNER_STYLE_TEXTS: Record<PartnerStyle, { label: string; desc: string }> = {
  pressure: {
    label: "Давление",
    desc: "Второй человек чаще спорит, давит, настаивает. Это создаёт среду, в которой сложно оставаться собой.",
  },
  defense: {
    label: "Защита",
    desc: "Собеседник уходит в оборону — обижается или защищается. Диалог становится битвой правот.",
  },
  ignoring: {
    label: "Игнорирование",
    desc: "Темы замалчиваются или меняются. Проблемы не решаются — они просто исчезают с поверхности.",
  },
  constructive: {
    label: "Конструктив",
    desc: "Второй человек объясняет, поддерживает, ищет решения. Хорошая основа для развития отношений.",
  },
};

export const SCENARIO_TEXTS: Record<Scenario, { label: string; desc: string; recommendations: string[] }> = {
  suppression: {
    label: "Сценарий подавления",
    desc: "Один давит — другой молчит или уступает. Внешне спокойно, внутри накапливается. Этот сценарий медленно разрушает самооценку и доверие.",
    recommendations: [
      "Начните с малого: обозначайте своё состояние, не требуя изменений.",
      "Изучите, что стоит за вашим молчанием — страх реакции или привычка?",
      "Выстраивайте личные границы постепенно, начиная с безопасных ситуаций.",
    ],
  },
  escalation: {
    label: "Эскалация конфликтов",
    desc: "Ваши эмоции встречают защиту — и температура растёт. Оба правы, оба не слышат. Конфликты затягиваются и повторяются.",
    recommendations: [
      "Делайте паузу в момент накала — хотя бы 10 минут перед ответом.",
      "Говорите о своих ощущениях, а не о поведении другого.",
      "Ищите, что стоит за защитой партнёра — часто это тоже уязвимость.",
    ],
  },
  unresolved: {
    label: "Неразрешённые конфликты",
    desc: "Темы уходят, не решаясь. Напряжение накапливается слоями. Через время это может взорваться или привести к отчуждению.",
    recommendations: [
      "Договоритесь о «времени для разговора» — без телефонов, в спокойной обстановке.",
      "Возвращайтесь к незавершённым темам намеренно.",
      "Если тема болезненна — начните с письма, а не с разговора.",
    ],
  },
  healthy: {
    label: "Здоровая коммуникация",
    desc: "Оба ищут диалог и решение. Это редкость и ценность. Продолжайте — и развивайте этот навык в других сферах жизни.",
    recommendations: [
      "Замечайте и называйте, что работает — это укрепляет паттерн.",
      "Делитесь этим подходом с людьми вокруг вас.",
      "Практикуйте активное слушание — это следующий уровень.",
    ],
  },
  neutral: {
    label: "Смешанный сценарий",
    desc: "В ваших отношениях сочетаются разные стили. Ситуации влияют на реакции обоих.",
    recommendations: [
      "Обратите внимание на ситуации, когда общение проходит лучше всего.",
      "Попробуйте воспроизвести эти условия намеренно.",
      "Работайте над последовательностью своих реакций.",
    ],
  },
};

export const RI_LABELS: Record<string, { label: string; color: string }> = {
  healthy: { label: "Здоровая коммуникация", color: "text-emerald-600" },
  tense: { label: "Напряжённые отношения", color: "text-amber-600" },
  high_conflict: { label: "Высокий уровень конфликтов", color: "text-orange-600" },
  toxic: { label: "Токсичный сценарий", color: "text-rose-600" },
};

export const EI_LABELS: Record<string, { label: string; color: string }> = {
  high_negative: { label: "Высокая негативность", color: "text-rose-600" },
  moderate: { label: "Умеренный фон", color: "text-amber-600" },
  positive: { label: "Позитивная коммуникация", color: "text-emerald-600" },
};

// ─── Хелперы для расчёта при создании записи ─────────────────────────────────

export function buildEntry(
  relationship_type: number,
  emotions: number[],
  user_reaction: number[],
  partner_reaction: number[],
  result: number,
): LREntry {
  const ei = calcEI(emotions);
  const uStyle = classifyUserReactions(user_reaction);
  const pStyle = classifyPartnerReactions(partner_reaction);
  const conflict_score = calcConflictScore(uStyle, pStyle, result);
  return { relationship_type, emotions, user_reaction, partner_reaction, result, ei, conflict_score };
}

export const MIN_ENTRIES_FOR_REPORT = 5;
