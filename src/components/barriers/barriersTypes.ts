export type BarriersStep =
  | "context"
  | "strength"
  | "weakness"
  | "steps_intro"
  | "step_text"
  | "step_x"
  | "step_y"
  | "break_point_auto"
  | "break_point_manual"
  | "insight"
  | "extra_strength"
  | "recalc"
  | "profile"
  | "final";

export type StepEntry = {
  stepNum: number;
  text: string;
  x: number;
  y: number;
};

export type BarriersProfile =
  | "chronic_anxiety"
  | "fear_of_judgement"
  | "low_belief"
  | "ambitious_anxious"
  | "balanced";

export const CONTEXTS = [
  "Новая работа",
  "Попытка сменить профессию",
  "Запуск проекта",
  "Обучение новому",
  "Публичное выступление",
  "Попытка начать бизнес",
  "Повышение",
  "Творческий проект",
  "Спорт / дисциплина",
  "Отношения",
  "Свой вариант",
];

export const STRENGTHS = [
  "Ответственность",
  "Упорство",
  "Креативность",
  "Аналитическое мышление",
  "Общительность",
  "Самостоятельность",
  "Быстрое обучение",
  "Организованность",
  "Энергичность",
  "Стратегическое мышление",
  "Дисциплина",
  "Смелость",
  "Инициативность",
  "Эмпатия",
  "Стрессоустойчивость",
  "Свой вариант",
];

export const WEAKNESSES = [
  "Страх ошибки",
  "Страх осуждения",
  "Страх нестабильности",
  "Прокрастинация",
  "Перфекционизм",
  "Синдром самозванца",
  "Быстрое выгорание",
  "Тревожность",
  "Неуверенность",
  "Потеря мотивации",
  "Страх отказа",
  "Страх критики",
  "Самосаботаж",
  "Импульсивность",
  "Усталость",
  "Свой вариант",
];

export function detectBreakStep(steps: StepEntry[]): number | null {
  for (let i = 0; i < steps.length; i++) {
    const s = steps[i];
    if (s.y >= 7) {
      const next = steps[i + 1];
      if (!next || next.x < s.x * 0.5) return i;
    }
  }
  for (let i = 1; i < steps.length; i++) {
    if (steps[i].x < steps[i - 1].x * 0.5) return i;
  }
  return null;
}

export function calcNewY(originalY: number, weakness: string, extraCount: number): number {
  let reduction = 0;
  if (extraCount === 1) {
    const fearBased = ["Страх ошибки", "Страх осуждения", "Страх отказа", "Страх критики", "Синдром самозванца", "Страх нестабильности"];
    reduction = fearBased.includes(weakness) ? 2 : 1;
  } else if (extraCount >= 2) {
    reduction = 3;
  }
  return Math.max(0, originalY - reduction);
}

export function detectProfile(steps: StepEntry[]): BarriersProfile {
  if (steps.length === 0) return "balanced";
  const avgX = steps.reduce((s, e) => s + e.x, 0) / steps.length;
  const avgY = steps.reduce((s, e) => s + e.y, 0) / steps.length;
  const yValues = steps.map(s => s.y);
  const maxJump = yValues.slice(1).reduce((max, val, i) => Math.max(max, val - yValues[i]), 0);
  if (avgX < 4) return "low_belief";
  if (maxJump >= 4) return "fear_of_judgement";
  if (avgY > 6 && avgY / avgX < 1.2) return "chronic_anxiety";
  if (avgX >= 7 && avgY >= 6) return "ambitious_anxious";
  return "balanced";
}

export const PROFILE_TEXTS: Record<BarriersProfile, { title: string; text: string }> = {
  chronic_anxiety: {
    title: "Хроническая тревожность",
    text: "Ваша тревога нарастала плавно на протяжении всего пути. Это характерно для людей, которые несут напряжение постоянно, не давая себе точек сброса. Осознание этого ритма — первый шаг к управлению им.",
  },
  fear_of_judgement: {
    title: "Страх оценки",
    text: "Уровень тревоги резко возрастал в ключевые моменты. Скорее всего, это было связано с оценкой со стороны — реальной или воображаемой. Такая реакция нормальна, но ею можно управлять.",
  },
  low_belief: {
    title: "Низкая вера в успех",
    text: "С самого начала уровень прогресса оставался невысоким. Возможно, вы заранее сомневались в результате. Это влияет на каждый шаг — и это можно изменить.",
  },
  ambitious_anxious: {
    title: "Амбициозный, но тревожный",
    text: "Вы двигались с высокой энергией и стремлением — и одновременно несли высокое внутреннее напряжение. Это мощный, но ресурсоёмкий режим. Вторая опора помогает его удержать.",
  },
  balanced: {
    title: "Сбалансированный тип",
    text: "Ваши показатели прогресса и тревоги развивались относительно равномерно. У вас есть внутренний ресурс — важно уметь его активировать в нужный момент.",
  },
};
