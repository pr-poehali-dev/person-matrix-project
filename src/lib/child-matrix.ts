import { reduce, calcLifePath, calcCharacter, calcDestiny, calcSoulUrge, calcPythagorasMatrix } from "./matrix";
import type { PythagorasMatrix } from "./matrix";

export type ChildProfile = {
  lifePath: number;
  character: number;
  destiny: number;
  talent: number;
  thinking: number;
  energy: number;
  matrix: PythagorasMatrix;
  energyIndex: number;
  mindIndex: number;
  emotionIndex: number;
  leaderIndex: number;
  learningIndex: number;
  successIndex: number;
  futureIndex: number;
  thinkingType: ThinkingType;
  learningStyle: LearningStyle;
  careers: CareerMatch[];
  risks: Risk[];
  lifeCycles: ChildCycle[];
  turningAge: number;
  parentCompat: ParentCompat | null;
};

export type ThinkingType = {
  type: "logical" | "emotional" | "managerial" | "creative";
  label: string;
  description: string;
};

export type LearningStyle = {
  primary: string;
  secondary: string;
  description: string;
};

export type CareerMatch = {
  title: string;
  score: number;
  icon: string;
  digits: number[];
};

export type Risk = {
  digit: number;
  label: string;
  description: string;
  tip: string;
};

export type ChildCycle = {
  period: string;
  number: number;
  ages: string;
  description: string;
};

export type ParentCompat = {
  motherScore: number | null;
  fatherScore: number | null;
  familyBalance: number;
  motherInsight: string;
  fatherInsight: string;
};

const MATRIX_LABELS: Record<number, string> = {
  1: "Воля",
  2: "Эмоции",
  3: "Творчество",
  4: "Практичность",
  5: "Мышление",
  6: "Ответственность",
  7: "Интуиция",
  8: "Амбиции",
  9: "Интеллект",
};

const RISK_DATA: Record<number, { label: string; desc: string; tip: string }> = {
  1: { label: "Нет инициативы", desc: "Ребёнку сложно начинать дела самому, ждёт указаний", tip: "Давайте выбор из 2-3 вариантов, поощряйте любую инициативу" },
  2: { label: "Трудности общения", desc: "Сложно считывать эмоции и строить дружбу", tip: "Ролевые игры, совместные занятия с другими детьми" },
  3: { label: "Нет креативности", desc: "Мыслит шаблонно, не любит фантазировать", tip: "Рисование, лепка, сочинение историй — без оценки «правильно»" },
  4: { label: "Неорганизованность", desc: "Трудно планировать, теряет вещи, хаотичен", tip: "Визуальное расписание, помощь в организации дня" },
  5: { label: "Сложности обучения", desc: "Трудно усваивать новую информацию, нет любопытства", tip: "Обучение через игру и практику, а не зубрёжку" },
  6: { label: "Безответственность", desc: "Не чувствует ответственности за поступки и слова", tip: "Простые обязанности по дому, уход за питомцем" },
  7: { label: "Нет аналитики", desc: "Не задаёт вопросов «почему?», принимает всё на веру", tip: "Задавайте ребёнку вопросы, а не давайте готовые ответы" },
  8: { label: "Нет амбиций", desc: "Не стремится к целям, довольствуется минимумом", tip: "Спортивные соревнования, настольные игры на стратегию" },
  9: { label: "Низкая концентрация", desc: "Быстро отвлекается, сложно довести задачу до конца", tip: "Техника помодоро для детей: 10 мин работы + 5 мин отдыха" },
};

const CAREER_DB: CareerMatch[] = [
  { title: "Учёный / исследователь", score: 0, icon: "Microscope", digits: [5, 7, 9] },
  { title: "Программист / инженер", score: 0, icon: "Code", digits: [5, 7, 9] },
  { title: "Руководитель / менеджер", score: 0, icon: "Crown", digits: [1, 8] },
  { title: "Художник / дизайнер", score: 0, icon: "Palette", digits: [3, 6] },
  { title: "Предприниматель", score: 0, icon: "Briefcase", digits: [4, 8] },
  { title: "Врач / психолог", score: 0, icon: "Heart", digits: [2, 6, 9] },
  { title: "Писатель / журналист", score: 0, icon: "PenTool", digits: [3, 5, 9] },
  { title: "Музыкант / артист", score: 0, icon: "Music", digits: [2, 3, 6] },
  { title: "Спортсмен / тренер", score: 0, icon: "Trophy", digits: [1, 4, 8] },
  { title: "Педагог / наставник", score: 0, icon: "GraduationCap", digits: [2, 6, 7] },
  { title: "Юрист / дипломат", score: 0, icon: "Scale", digits: [1, 7, 9] },
  { title: "Архитектор / строитель", score: 0, icon: "Building", digits: [4, 7, 8] },
];

const CYCLE_DESC: Record<number, string> = {
  1: "Период развития самостоятельности и лидерских качеств",
  2: "Время обучения сотрудничеству и эмоциональной чуткости",
  3: "Расцвет творческого самовыражения и коммуникации",
  4: "Формирование дисциплины, трудолюбия и ответственности",
  5: "Этап перемен, поиска себя и расширения горизонтов",
  6: "Время заботы о близких и обретения гармонии",
  7: "Период погружения в знания, анализ и самопознание",
  8: "Этап амбиций, достижений и финансового роста",
  9: "Время мудрости, завершения циклов и отдачи миру",
  11: "Период духовного развития и интуитивных прозрений",
  22: "Масштабные свершения и реализация большой миссии",
};

const THINKING_TYPES: Record<string, ThinkingType> = {
  logical: {
    type: "logical",
    label: "Логический",
    description: "Ребёнок анализирует мир через факты, схемы и закономерности. Любит задавать вопросы «почему?» и строить причинно-следственные связи. Хорошо справляется с задачами, где нужен чёткий алгоритм.",
  },
  emotional: {
    type: "emotional",
    label: "Эмоциональный",
    description: "Ребёнок воспринимает мир через чувства и эмоции. Решения принимает «сердцем», обладает развитой интуицией. Отлично считывает настроение окружающих и тонко реагирует на атмосферу.",
  },
  managerial: {
    type: "managerial",
    label: "Управленческий",
    description: "Ребёнок — прирождённый организатор. Умеет распределять роли, принимать решения и вести за собой. С ранних лет проявляет лидерские качества и стремится к контролю ситуации.",
  },
  creative: {
    type: "creative",
    label: "Творческий",
    description: "Ребёнок мыслит образами и метафорами. Придумывает нестандартные решения, обладает богатой фантазией. Лучше всего учится через игру, рисование, музыку и истории.",
  },
};

const LEARNING_STYLES: Record<number, { name: string; desc: string }> = {
  5: { name: "Через логику", desc: "Лучше всего усваивает информацию через анализ, схемы и пошаговые объяснения. Нужны чёткие инструкции и логические цепочки." },
  3: { name: "Через творчество", desc: "Запоминает через рисунки, истории и образы. Дайте свободу самовыражения — и обучение пойдёт легко." },
  2: { name: "Через общение", desc: "Лучше учится в паре или группе. Обсуждение, вопросы, совместная работа — ключ к знаниям." },
  7: { name: "Через анализ", desc: "Предпочитает разбираться сам. Дайте книгу, видео или задачу — и ребёнок найдёт ответ самостоятельно." },
};

function calcTalent(date: string): number {
  const [y, m, d] = date.split("-").map(Number);
  const rdm = reduce(m);
  const rdd = reduce(d);
  return reduce(rdm + rdd);
}

function calcThinking(date: string): number {
  const [y] = date.split("-").map(Number);
  const rdy = reduce(y);
  const lp = calcLifePath(date)!;
  return reduce(rdy + lp);
}

function calcEnergy(date: string): number {
  const digits = date.replace(/-/g, "").split("").map(Number);
  return digits.reduce((a, b) => a + b, 0);
}

function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, Math.round(v)));
}

function calcMindIndex(matrix: PythagorasMatrix): number {
  return clamp((matrix[3] + matrix[5] + matrix[7] + matrix[9]) * 25, 0, 100);
}

function calcEmotionIndex(matrix: PythagorasMatrix): number {
  return clamp((matrix[2] + matrix[6] + matrix[9]) * 30, 0, 100);
}

function calcLeaderIndex(matrix: PythagorasMatrix): number {
  return clamp((matrix[1] + matrix[8]) * 40, 0, 100);
}

function calcLearningIndex(matrix: PythagorasMatrix): number {
  return clamp((matrix[5] + matrix[7] + matrix[9]) * 30, 0, 100);
}

function determineThinkingType(mindIdx: number, emotionIdx: number, leaderIdx: number, matrix: PythagorasMatrix): ThinkingType {
  if (matrix[3] >= 2) return THINKING_TYPES.creative;
  if (leaderIdx >= 80) return THINKING_TYPES.managerial;
  if (emotionIdx > mindIdx) return THINKING_TYPES.emotional;
  return THINKING_TYPES.logical;
}

function determineLearningStyle(matrix: PythagorasMatrix): LearningStyle {
  const candidates = [5, 3, 2, 7] as const;
  let best = 5 as number;
  let bestCount = matrix[5];
  let second = 3 as number;

  for (const c of candidates) {
    if (matrix[c] > bestCount) {
      second = best;
      best = c;
      bestCount = matrix[c];
    }
  }
  if (best === second) {
    second = candidates.find(c => c !== best) || 7;
  }

  const primary = LEARNING_STYLES[best] || LEARNING_STYLES[5];
  const sec = LEARNING_STYLES[second] || LEARNING_STYLES[3];

  return {
    primary: primary.name,
    secondary: sec.name,
    description: primary.desc,
  };
}

function calcCareerMatches(matrix: PythagorasMatrix): CareerMatch[] {
  return CAREER_DB.map(c => {
    const score = clamp(c.digits.reduce((sum, d) => sum + matrix[d], 0) * (100 / c.digits.length / 2), 0, 100);
    return { ...c, score };
  })
    .sort((a, b) => b.score - a.score)
    .slice(0, 8);
}

function detectRisks(matrix: PythagorasMatrix): Risk[] {
  const risks: Risk[] = [];
  for (let d = 1; d <= 9; d++) {
    if (matrix[d] === 0) {
      const data = RISK_DATA[d];
      risks.push({ digit: d, label: data.label, description: data.desc, tip: data.tip });
    }
  }
  return risks;
}

function calcChildCycles(date: string): ChildCycle[] {
  const [y, m, d] = date.split("-").map(Number);
  const rdm = reduce(m);
  const rdd = reduce(d);
  const rdy = reduce(y);

  const c1 = reduce(rdm + rdd);
  const c2 = reduce(rdd + rdy);
  const c3 = reduce(c1 + c2);

  return [
    { period: "Детство и юность", number: c1, ages: "0–27", description: CYCLE_DESC[c1] || CYCLE_DESC[reduce(c1)] || "" },
    { period: "Зрелость", number: c2, ages: "28–54", description: CYCLE_DESC[c2] || CYCLE_DESC[reduce(c2)] || "" },
    { period: "Мудрость", number: c3, ages: "55+", description: CYCLE_DESC[c3] || CYCLE_DESC[reduce(c3)] || "" },
  ];
}

function calcTurningAge(lp: number): number {
  const base = lp > 9 ? reduce(lp) : lp;
  return base * 4;
}

function calcParentCompatibility(childDate: string, motherDate?: string, fatherDate?: string): ParentCompat | null {
  const childLp = calcLifePath(childDate);
  if (!childLp) return null;

  let motherScore: number | null = null;
  let fatherScore: number | null = null;
  let motherInsight = "";
  let fatherInsight = "";

  if (motherDate) {
    const parentLp = calcLifePath(motherDate);
    if (parentLp) {
      motherScore = clamp(100 - Math.abs(parentLp - childLp) * 10, 10, 100);
      motherInsight = getParentInsight(parentLp, childLp, "мамы");
    }
  }

  if (fatherDate) {
    const parentLp = calcLifePath(fatherDate);
    if (parentLp) {
      fatherScore = clamp(100 - Math.abs(parentLp - childLp) * 10, 10, 100);
      fatherInsight = getParentInsight(parentLp, childLp, "папы");
    }
  }

  const scores = [motherScore, fatherScore].filter((s): s is number => s !== null);
  const familyBalance = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;

  return { motherScore, fatherScore, familyBalance, motherInsight, fatherInsight };
}

function getParentInsight(parentLp: number, childLp: number, role: string): string {
  const diff = Math.abs(parentLp - childLp);
  if (diff <= 2) return `Энергии ${role} и ребёнка очень близки — интуитивное взаимопонимание, лёгкость в общении.`;
  if (diff <= 4) return `${role.charAt(0).toUpperCase() + role.slice(1)} и ребёнок дополняют друг друга. Различия создают баланс в семье.`;
  if (diff <= 6) return `Есть зоны непонимания между ${role} и ребёнком. Важно учиться принимать различия в темпераменте.`;
  return `Энергии ${role} и ребёнка существенно различаются. Нужно особое терпение и осознанный подход к воспитанию.`;
}

export function calcFullChildProfile(
  childDate: string,
  motherDate?: string,
  fatherDate?: string,
): ChildProfile | null {
  const lifePath = calcLifePath(childDate);
  const character = calcCharacter(childDate);
  const destiny = calcDestiny(childDate);
  const soulUrge = calcSoulUrge(childDate);
  const matrix = calcPythagorasMatrix(childDate);

  if (!lifePath || !character || !destiny || !soulUrge || !matrix) return null;

  const talent = calcTalent(childDate);
  const thinking = calcThinking(childDate);
  const energy = calcEnergy(childDate);

  const energyIndex = clamp(energy * 3, 0, 100);
  const mindIndex = calcMindIndex(matrix);
  const emotionIndex = calcEmotionIndex(matrix);
  const leaderIndex = calcLeaderIndex(matrix);
  const learningIndex = calcLearningIndex(matrix);
  const successIndex = clamp(Math.round((leaderIndex + mindIndex + energyIndex) / 3), 0, 100);
  const futureIndex = clamp(Math.round((successIndex + learningIndex + leaderIndex) / 3), 0, 100);

  const thinkingType = determineThinkingType(mindIndex, emotionIndex, leaderIndex, matrix);
  const learningStyle = determineLearningStyle(matrix);
  const careers = calcCareerMatches(matrix);
  const risks = detectRisks(matrix);
  const lifeCycles = calcChildCycles(childDate);
  const turningAge = calcTurningAge(lifePath);
  const parentCompat = calcParentCompatibility(childDate, motherDate, fatherDate);

  return {
    lifePath,
    character,
    destiny,
    talent,
    thinking,
    energy,
    matrix,
    energyIndex,
    mindIndex,
    emotionIndex,
    leaderIndex,
    learningIndex,
    successIndex,
    futureIndex,
    thinkingType,
    learningStyle,
    careers,
    risks,
    lifeCycles,
    turningAge,
    parentCompat,
  };
}

export { MATRIX_LABELS };
