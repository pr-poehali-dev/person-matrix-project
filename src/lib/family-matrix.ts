import {
  calcLifePath,
  calcCharacter,
  calcDestiny,
  calcSoulUrge,
  calcPythagorasMatrix,
  calcLifeCycles,
  calcFullCompatibility,
} from "./matrix";
import type { PythagorasMatrix, FullCompatibilityResult, LifeCycle } from "./matrix";

function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, Math.round(v)));
}

function calcEnergy(date: string): number {
  return date.replace(/-/g, "").split("").map(Number).reduce((a, b) => a + b, 0);
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

export type FamilyRole = {
  name: string;
  icon: string;
  description: string;
};

export const FAMILY_ROLES: Record<string, FamilyRole> = {
  leader: { name: "Лидер", icon: "Crown", description: "Принимает ключевые решения, задаёт направление" },
  strategist: { name: "Стратег", icon: "Brain", description: "Анализирует ситуации и строит планы" },
  emotional_center: { name: "Эмоциональный центр", icon: "Heart", description: "Создаёт атмосферу, поддерживает близких" },
  organizer: { name: "Организатор", icon: "ListChecks", description: "Обеспечивает порядок и стабильность" },
  explorer: { name: "Исследователь", icon: "Compass", description: "Приносит новые идеи и расширяет горизонты" },
};

export type FamilyMember = {
  label: string;
  birthDate: string;
  lifePath: number;
  character: number;
  destiny: number;
  soulUrge: number;
  matrix: PythagorasMatrix;
  lifeCycles: LifeCycle[];
  energy: number;
  energyIndex: number;
  mindIndex: number;
  emotionIndex: number;
  leaderIndex: number;
  roles: FamilyRole[];
};

export type ChildFamilyProfile = {
  member: FamilyMember;
  parentInfluence: number;
  compatWithParent1: number;
  compatWithParent2: number;
  supportIndex: number;
  roleInFamily: string;
};

export type FamilyType = {
  name: string;
  icon: string;
  description: string;
  advice: string;
};

export type FamilyAnalysis = {
  parent1: FamilyMember;
  parent2: FamilyMember;
  children: ChildFamilyProfile[];
  coupleCompatibility: FullCompatibilityResult;
  familyEnergy: number;
  balanceIndex: number;
  familyType: FamilyType;
  harmonyIndex: number;
  conflictIndex: number;
  growthPotential: number;
  avgLeadership: number;
  avgEmotion: number;
  avgMind: number;
  strengths: string[];
  challenges: string[];
  recommendations: string[];
  freeSummary: {
    familyTypeName: string;
    harmonyScore: number;
    shortDescription: string;
    coupleScore: number;
  };
};

const FAMILY_TYPES: Record<string, FamilyType> = {
  development: {
    name: "Семья развития",
    icon: "GraduationCap",
    description: "Интеллект — ваша главная сила. В вашей семье ценятся знания, обучение и постоянный рост. Каждый член семьи стремится узнать больше и поделиться этим с близкими.",
    advice: "Создавайте совместные интеллектуальные проекты: читайте книги, обсуждайте идеи, путешествуйте с образовательной целью. Не забывайте уделять внимание эмоциональной стороне — чувства не менее важны, чем знания.",
  },
  support: {
    name: "Семья поддержки",
    icon: "Heart",
    description: "Эмоциональная связь — фундамент вашей семьи. Вы умеете чувствовать друг друга, поддерживать в трудные моменты и создавать атмосферу тепла и принятия.",
    advice: "Ваша сила — в единстве и взаимной заботе. Развивайте традиции совместного времяпрепровождения. Следите, чтобы поддержка не перерастала в гиперопеку — давайте каждому пространство для самостоятельности.",
  },
  achievement: {
    name: "Семья достижения",
    icon: "Trophy",
    description: "Лидерство и амбиции — двигатель вашей семьи. Вы ставите высокие цели и вместе идёте к ним. Каждый член семьи вносит вклад в общий успех.",
    advice: "Направляйте лидерскую энергию на совместные цели: семейный бизнес, спорт, творческие проекты. Важно научиться уступать друг другу — в семье не должно быть постоянной конкуренции.",
  },
  stability: {
    name: "Семья стабильности",
    icon: "Shield",
    description: "Гармоничный баланс всех качеств — ваша уникальная черта. Вы интуитивно находите равновесие между разумом, чувствами и действием. Это редкий и ценный дар.",
    advice: "Цените свой баланс и не пытайтесь резко менять семейный уклад. Развивайте все направления равномерно. Ваша стабильность — это фундамент, на котором можно строить любые проекты.",
  },
};

const STRENGTH_TEXTS: Record<string, string[]> = {
  highHarmony: [
    "Высокий уровень гармонии в семье — вы интуитивно чувствуете потребности друг друга",
    "Семейная атмосфера способствует раскрытию потенциала каждого члена семьи",
    "Взаимопонимание между партнёрами создаёт прочный фундамент для воспитания детей",
  ],
  mediumHarmony: [
    "В семье есть потенциал для глубокого взаимопонимания",
    "Различия в характерах дополняют друг друга и обогащают семейную жизнь",
    "Семья обладает ресурсами для преодоления трудностей",
  ],
  lowHarmony: [
    "Разнообразие характеров в семье создаёт мощный потенциал для роста",
    "Каждый член семьи привносит уникальные качества в общую динамику",
    "Преодоление различий закаляет семейные связи",
  ],
  highEnergy: [
    "Высокий уровень семейной энергии — вы способны на многое вместе",
    "Энергетический потенциал семьи позволяет реализовывать амбициозные планы",
  ],
  highBalance: [
    "Семейный баланс на высоком уровне — все качества распределены гармонично",
    "Каждый член семьи вносит свой уникальный вклад в общую гармонию",
  ],
  strongLeadership: [
    "Сильное лидерское начало в семье помогает принимать решения и двигаться вперёд",
  ],
  strongEmotion: [
    "Развитый эмоциональный интеллект семьи создаёт атмосферу тепла и принятия",
  ],
  strongMind: [
    "Интеллектуальный потенциал семьи открывает широкие возможности для развития",
  ],
};

const CHALLENGE_TEXTS: Record<string, string[]> = {
  lowHarmony: [
    "Различия в характерах могут приводить к недопониманию — важно учиться слушать друг друга",
    "Семье необходимо выработать общие правила коммуникации",
    "Конфликтные ситуации требуют осознанного подхода и готовности к компромиссам",
  ],
  mediumHarmony: [
    "Периодические разногласия требуют терпения и открытого диалога",
    "Важно не замалчивать проблемы, а обсуждать их спокойно и конструктивно",
  ],
  highHarmony: [
    "Комфорт может привести к застою — не забывайте ставить новые цели",
    "Высокая гармония не означает отсутствие работы над отношениями",
  ],
  lowEnergy: [
    "Семейная энергия ниже среднего — важно находить общие источники вдохновения",
    "Планируйте совместный активный отдых для подзарядки",
  ],
  lowBalance: [
    "Дисбаланс качеств может создавать напряжение — ищите способы компенсации",
    "Некоторые члены семьи могут чувствовать себя недооценёнными",
  ],
  weakLeadership: [
    "Недостаток лидерского начала может затруднять принятие решений",
  ],
  weakEmotion: [
    "Эмоциональная сфера требует внимания — учитесь выражать чувства открыто",
  ],
  weakMind: [
    "Интеллектуальное развитие семьи стоит поддерживать совместным обучением",
  ],
};

const RECOMMENDATION_TEXTS: Record<string, string[]> = {
  general: [
    "Проводите семейные советы раз в неделю — обсуждайте планы, чувства и идеи",
    "Создайте семейные традиции, которые объединяют всех членов семьи",
  ],
  highConflict: [
    "Обратитесь к семейному психологу для проработки конфликтных паттернов",
    "Используйте технику «Я-высказываний» вместо обвинений",
    "Установите правило: не решать серьёзные вопросы в момент эмоционального напряжения",
  ],
  mediumConflict: [
    "Практикуйте активное слушание — повторяйте слова партнёра своими словами",
    "Выделяйте время для разговоров один на один с каждым членом семьи",
  ],
  lowConflict: [
    "Продолжайте укреплять позитивную динамику совместными проектами",
    "Не бойтесь конструктивных разногласий — они помогают расти",
  ],
  forChildren: [
    "Уделяйте индивидуальное внимание каждому ребёнку с учётом его уникальных потребностей",
    "Поощряйте детей выражать свои чувства и мнения в безопасной обстановке",
  ],
  forCouple: [
    "Регулярно проводите время вдвоём — без детей и бытовых забот",
    "Обсуждайте долгосрочные планы и мечты, чтобы двигаться в одном направлении",
  ],
  energyBoost: [
    "Совместные физические активности повысят общий энергетический фон семьи",
    "Путешествия и новые впечатления — мощный источник семейной энергии",
  ],
  balanceImprovement: [
    "Распределяйте семейные обязанности с учётом сильных сторон каждого",
    "Создайте пространство для развития слабых сторон без давления и критики",
  ],
};

function buildFamilyMember(date: string, label: string): FamilyMember | null {
  const lifePath = calcLifePath(date);
  const character = calcCharacter(date);
  const destiny = calcDestiny(date);
  const soulUrge = calcSoulUrge(date);
  const matrix = calcPythagorasMatrix(date);
  const lifeCycles = calcLifeCycles(date);

  if (!lifePath || !character || !destiny || !soulUrge || !matrix || !lifeCycles) return null;

  const energy = calcEnergy(date);
  const energyIndex = clamp(energy * 3, 0, 100);
  const mindIndex = calcMindIndex(matrix);
  const emotionIndex = calcEmotionIndex(matrix);
  const leaderIndex = calcLeaderIndex(matrix);
  const roles = assignRoles(leaderIndex, emotionIndex, mindIndex, energyIndex);

  return {
    label,
    birthDate: date,
    lifePath,
    character,
    destiny,
    soulUrge,
    matrix,
    lifeCycles,
    energy,
    energyIndex,
    mindIndex,
    emotionIndex,
    leaderIndex,
    roles,
  };
}

function assignRoles(
  leaderIndex: number,
  emotionIndex: number,
  mindIndex: number,
  energyIndex: number,
): FamilyRole[] {
  const roleIndex = leaderIndex + emotionIndex + mindIndex;

  const scored: { key: string; score: number }[] = [
    { key: "leader", score: leaderIndex },
    { key: "strategist", score: mindIndex },
    { key: "emotional_center", score: emotionIndex },
    { key: "organizer", score: clamp((energyIndex + mindIndex) / 2, 0, 100) },
    { key: "explorer", score: clamp((mindIndex + energyIndex - leaderIndex + 50) / 2, 0, 100) },
  ];

  scored.sort((a, b) => b.score - a.score);

  const roles: FamilyRole[] = [FAMILY_ROLES[scored[0].key]];

  if (scored.length > 1 && scored[1].score >= roleIndex * 0.3 && scored[1].score > 20) {
    roles.push(FAMILY_ROLES[scored[1].key]);
  }

  return roles;
}

function calcFamilyEnergy(members: FamilyMember[]): number {
  if (members.length === 0) return 0;
  const total = members.reduce((sum, m) => sum + m.energy, 0);
  return clamp(Math.round(total / members.length), 0, 100);
}

function calcBalanceIndex(members: FamilyMember[]): number {
  if (members.length < 2) return 100;

  let totalDiff = 0;
  let pairCount = 0;

  for (let i = 0; i < members.length; i++) {
    for (let j = i + 1; j < members.length; j++) {
      totalDiff += Math.abs(members[i].leaderIndex - members[j].leaderIndex);
      totalDiff += Math.abs(members[i].emotionIndex - members[j].emotionIndex);
      totalDiff += Math.abs(members[i].mindIndex - members[j].mindIndex);
      pairCount++;
    }
  }

  const scaledDiff = pairCount > 0 ? totalDiff / (pairCount * 3) : 0;
  return clamp(100 - scaledDiff, 0, 100);
}

function determineFamilyType(avgMind: number, avgEmotion: number, avgLeadership: number): FamilyType {
  const max = Math.max(avgMind, avgEmotion, avgLeadership);
  const min = Math.min(avgMind, avgEmotion, avgLeadership);

  if (max - min <= 15) return FAMILY_TYPES.stability;
  if (max === avgMind) return FAMILY_TYPES.development;
  if (max === avgEmotion) return FAMILY_TYPES.support;
  return FAMILY_TYPES.achievement;
}

function calcChildCompatWithParent(childLp: number, parentLp: number): number {
  return clamp(100 - Math.abs(parentLp - childLp) * 10, 10, 100);
}

function generateStrengths(
  harmonyIndex: number,
  familyEnergy: number,
  balanceIndex: number,
  avgLeadership: number,
  avgEmotion: number,
  avgMind: number,
): string[] {
  const result: string[] = [];

  if (harmonyIndex >= 70) {
    result.push(...STRENGTH_TEXTS.highHarmony.slice(0, 2));
  } else if (harmonyIndex >= 45) {
    result.push(...STRENGTH_TEXTS.mediumHarmony.slice(0, 2));
  } else {
    result.push(...STRENGTH_TEXTS.lowHarmony.slice(0, 2));
  }

  if (familyEnergy >= 30) {
    result.push(STRENGTH_TEXTS.highEnergy[0]);
  }

  if (balanceIndex >= 70) {
    result.push(STRENGTH_TEXTS.highBalance[0]);
  }

  if (avgLeadership >= 60) {
    result.push(STRENGTH_TEXTS.strongLeadership[0]);
  }
  if (avgEmotion >= 60) {
    result.push(STRENGTH_TEXTS.strongEmotion[0]);
  }
  if (avgMind >= 60) {
    result.push(STRENGTH_TEXTS.strongMind[0]);
  }

  return result.slice(0, 5);
}

function generateChallenges(
  harmonyIndex: number,
  familyEnergy: number,
  balanceIndex: number,
  avgLeadership: number,
  avgEmotion: number,
  avgMind: number,
): string[] {
  const result: string[] = [];

  if (harmonyIndex < 45) {
    result.push(...CHALLENGE_TEXTS.lowHarmony.slice(0, 2));
  } else if (harmonyIndex < 70) {
    result.push(...CHALLENGE_TEXTS.mediumHarmony.slice(0, 2));
  } else {
    result.push(CHALLENGE_TEXTS.highHarmony[0]);
  }

  if (familyEnergy < 25) {
    result.push(CHALLENGE_TEXTS.lowEnergy[0]);
  }

  if (balanceIndex < 50) {
    result.push(CHALLENGE_TEXTS.lowBalance[0]);
  }

  if (avgLeadership < 30) {
    result.push(CHALLENGE_TEXTS.weakLeadership[0]);
  }
  if (avgEmotion < 30) {
    result.push(CHALLENGE_TEXTS.weakEmotion[0]);
  }
  if (avgMind < 30) {
    result.push(CHALLENGE_TEXTS.weakMind[0]);
  }

  return result.slice(0, 5);
}

function generateRecommendations(
  conflictIndex: number,
  familyEnergy: number,
  balanceIndex: number,
  hasChildren: boolean,
): string[] {
  const result: string[] = [];

  result.push(...RECOMMENDATION_TEXTS.general);

  if (conflictIndex >= 60) {
    result.push(...RECOMMENDATION_TEXTS.highConflict.slice(0, 2));
  } else if (conflictIndex >= 35) {
    result.push(...RECOMMENDATION_TEXTS.mediumConflict.slice(0, 2));
  } else {
    result.push(RECOMMENDATION_TEXTS.lowConflict[0]);
  }

  if (hasChildren) {
    result.push(RECOMMENDATION_TEXTS.forChildren[0]);
  }

  result.push(RECOMMENDATION_TEXTS.forCouple[0]);

  if (familyEnergy < 25) {
    result.push(RECOMMENDATION_TEXTS.energyBoost[0]);
  }

  if (balanceIndex < 50) {
    result.push(RECOMMENDATION_TEXTS.balanceImprovement[0]);
  }

  return result.slice(0, 5);
}

function getFamilyTypeShortDescription(familyType: FamilyType, harmonyIndex: number): string {
  if (harmonyIndex >= 70) {
    return `${familyType.name} с высоким уровнем гармонии. Ваши отношения — пример взаимопонимания и поддержки.`;
  }
  if (harmonyIndex >= 45) {
    return `${familyType.name} с хорошим потенциалом. Работая над взаимопониманием, вы сможете достичь глубокой гармонии.`;
  }
  return `${familyType.name} с зонами роста. Различия в характерах — это возможность для развития и укрепления связей.`;
}

export function calcFamilyMatrix(
  parent1Date: string,
  parent2Date: string,
  childrenDates: string[],
): FamilyAnalysis | null {
  const parent1 = buildFamilyMember(parent1Date, "Партнёр 1");
  const parent2 = buildFamilyMember(parent2Date, "Партнёр 2");

  if (!parent1 || !parent2) return null;

  const coupleCompatibility = calcFullCompatibility(parent1Date, parent2Date);
  if (!coupleCompatibility) return null;

  const validChildrenDates = childrenDates.slice(0, 5);
  const childMembers: FamilyMember[] = [];

  for (let i = 0; i < validChildrenDates.length; i++) {
    const child = buildFamilyMember(validChildrenDates[i], `Ребёнок ${i + 1}`);
    if (child) childMembers.push(child);
  }

  const allMembers: FamilyMember[] = [parent1, parent2, ...childMembers];

  const familyEnergy = calcFamilyEnergy(allMembers);
  const balanceIndex = calcBalanceIndex(allMembers);

  const avgLeadership = clamp(
    Math.round(allMembers.reduce((s, m) => s + m.leaderIndex, 0) / allMembers.length),
    0,
    100,
  );
  const avgEmotion = clamp(
    Math.round(allMembers.reduce((s, m) => s + m.emotionIndex, 0) / allMembers.length),
    0,
    100,
  );
  const avgMind = clamp(
    Math.round(allMembers.reduce((s, m) => s + m.mindIndex, 0) / allMembers.length),
    0,
    100,
  );

  const familyType = determineFamilyType(avgMind, avgEmotion, avgLeadership);

  const children: ChildFamilyProfile[] = childMembers.map((child) => {
    const compatWithParent1 = calcChildCompatWithParent(child.lifePath, parent1.lifePath);
    const compatWithParent2 = calcChildCompatWithParent(child.lifePath, parent2.lifePath);
    const parentInfluence = clamp(Math.round((compatWithParent1 + compatWithParent2) / 2), 0, 100);

    const parentEmotionAvg = Math.round((parent1.emotionIndex + parent2.emotionIndex) / 2);
    const supportIndex = clamp(Math.round((parentEmotionAvg + child.emotionIndex) / 2), 0, 100);

    const roleInFamily = child.roles.length > 0 ? child.roles[0].name : FAMILY_ROLES.explorer.name;

    return {
      member: child,
      parentInfluence,
      compatWithParent1,
      compatWithParent2,
      supportIndex,
      roleInFamily,
    };
  });

  const coupleScore = coupleCompatibility.overallIndex;

  let avgChildCompat = 0;
  if (children.length > 0) {
    const totalChildCompat = children.reduce(
      (sum, c) => sum + (c.compatWithParent1 + c.compatWithParent2) / 2,
      0,
    );
    avgChildCompat = Math.round(totalChildCompat / children.length);
  } else {
    avgChildCompat = coupleScore;
  }

  const harmonyIndex = clamp(Math.round((coupleScore + avgChildCompat + balanceIndex) / 3), 0, 100);
  const conflictIndex = clamp(100 - harmonyIndex, 0, 100);

  const growthPotential = clamp(Math.round((avgMind + familyEnergy + avgLeadership) / 3), 0, 100);

  const strengths = generateStrengths(harmonyIndex, familyEnergy, balanceIndex, avgLeadership, avgEmotion, avgMind);
  const challenges = generateChallenges(harmonyIndex, familyEnergy, balanceIndex, avgLeadership, avgEmotion, avgMind);
  const recommendations = generateRecommendations(conflictIndex, familyEnergy, balanceIndex, children.length > 0);

  const freeSummary = {
    familyTypeName: familyType.name,
    harmonyScore: harmonyIndex,
    shortDescription: getFamilyTypeShortDescription(familyType, harmonyIndex),
    coupleScore,
  };

  return {
    parent1,
    parent2,
    children,
    coupleCompatibility,
    familyEnergy,
    balanceIndex,
    familyType,
    harmonyIndex,
    conflictIndex,
    growthPotential,
    avgLeadership,
    avgEmotion,
    avgMind,
    strengths,
    challenges,
    recommendations,
    freeSummary,
  };
}

export default calcFamilyMatrix;