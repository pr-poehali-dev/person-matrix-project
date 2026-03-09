import Icon from "@/components/ui/icon";
import { StepCard, NextButton, MultiSelect, SingleSelect, EntryCounter } from "./LangRelationsPrimitives";
import {
  RELATIONSHIP_TYPES,
  EMOTIONS_NEGATIVE,
  EMOTIONS_POSITIVE,
  USER_REACTIONS,
  PARTNER_REACTIONS,
  RESULTS,
  MIN_ENTRIES_FOR_REPORT,
  buildEntry,
  type LRStep,
  type LREntry,
} from "./langRelationsTypes";

type Props = {
  step: LRStep;
  entries: LREntry[];
  freeUsed: boolean;
  // draft
  relType: number | null;
  setRelType: (v: number | null) => void;
  emotions: number[];
  setEmotions: (v: number[]) => void;
  userReaction: number[];
  setUserReaction: (v: number[]) => void;
  partnerReaction: number[];
  setPartnerReaction: (v: number[]) => void;
  result: number | null;
  setResult: (v: number | null) => void;
  setStep: (s: LRStep) => void;
  onAddEntry: (e: LREntry) => void;
};

function toOptions(map: Record<number, string>) {
  return Object.entries(map).map(([k, v]) => ({ value: Number(k), label: v }));
}

const relTypeOptions = toOptions(RELATIONSHIP_TYPES);
const negativeOptions = toOptions(EMOTIONS_NEGATIVE);
const positiveOptions = toOptions(EMOTIONS_POSITIVE);
const userReactionOptions = toOptions(USER_REACTIONS);
const partnerReactionOptions = toOptions(PARTNER_REACTIONS);
const resultOptions = toOptions(RESULTS);

export default function LangRelationsInputSteps({
  step,
  entries,
  freeUsed,
  relType,
  setRelType,
  emotions,
  setEmotions,
  userReaction,
  setUserReaction,
  partnerReaction,
  setPartnerReaction,
  result,
  setResult,
  setStep,
  onAddEntry,
}: Props) {
  const entryNum = entries.length + 1;
  const isLastFree = !freeUsed && entries.length === 0;
  const canGoReport = entries.length >= MIN_ENTRIES_FOR_REPORT;

  const handleSaveEntry = () => {
    if (!relType || emotions.length === 0 || userReaction.length === 0 || partnerReaction.length === 0 || result === null) return;
    const entry = buildEntry(relType, emotions, userReaction, partnerReaction, result);
    onAddEntry(entry);
    setRelType(null);
    setEmotions([]);
    setUserReaction([]);
    setPartnerReaction([]);
    setResult(null);
  };

  if (step === "intro") {
    return (
      <StepCard icon="Heart" title="Язык отношений" subtitle="Тренажёр паттернов коммуникации">
        <div className="space-y-3 mb-6">
          <p className="font-golos text-sm text-gray-700 leading-relaxed">
            Вы будете описывать реальные ситуации из ваших отношений — эмоции, реакции, итоги. Алгоритм найдёт паттерны.
          </p>
          <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
            <p className="font-golos text-sm text-amber-800 font-medium">1 запись — бесплатно. Полный анализ — после 5 записей.</p>
          </div>
          {entries.length > 0 && (
            <EntryCounter count={entries.length} min={MIN_ENTRIES_FOR_REPORT} />
          )}
        </div>
        <div className="flex flex-col gap-2">
          <button
            onClick={() => setStep("rel_type")}
            className="w-full bg-rose-500 hover:bg-rose-600 text-white font-golos text-sm font-medium rounded-xl py-3 transition-colors"
          >
            {entries.length === 0 ? "Начать — описать ситуацию" : `Добавить запись ${entryNum}`}
          </button>
          {canGoReport && (
            <button
              onClick={() => setStep("report")}
              className="w-full bg-[#6C5BA7] hover:bg-[#5A4B8C] text-white font-golos text-sm font-medium rounded-xl py-3 transition-colors"
            >
              Посмотреть анализ ({entries.length} записей)
            </button>
          )}
        </div>
      </StepCard>
    );
  }

  if (step === "not_enough") {
    return (
      <StepCard icon="Clock" title="Нужно больше данных">
        <div className="space-y-4 mb-6">
          <EntryCounter count={entries.length} min={MIN_ENTRIES_FOR_REPORT} />
          <p className="font-golos text-sm text-gray-600 leading-relaxed">
            Добавьте ещё {MIN_ENTRIES_FOR_REPORT - entries.length} {declEntry(MIN_ENTRIES_FOR_REPORT - entries.length)}, чтобы алгоритм мог увидеть паттерны.
          </p>
          <p className="font-golos text-xs text-gray-400">
            Лучше всего описывать реальные ситуации за последние 1–3 месяца.
          </p>
        </div>
        <button
          onClick={() => setStep("rel_type")}
          className="w-full bg-rose-500 hover:bg-rose-600 text-white font-golos text-sm font-medium rounded-xl py-3 transition-colors"
        >
          Добавить запись {entryNum}
        </button>
      </StepCard>
    );
  }

  if (step === "saved") {
    return (
      <StepCard icon="CheckCircle" title={`Запись ${entryNum - 1} сохранена`}>
        <div className="space-y-4 mb-6">
          <EntryCounter count={entries.length} min={MIN_ENTRIES_FOR_REPORT} />
          {!canGoReport && (
            <p className="font-golos text-sm text-gray-600 leading-relaxed">
              Опишите ещё {MIN_ENTRIES_FOR_REPORT - entries.length} {declEntry(MIN_ENTRIES_FOR_REPORT - entries.length)} — желательно из разных ситуаций.
            </p>
          )}
          {canGoReport && (
            <div className="bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3">
              <p className="font-golos text-sm text-emerald-800 font-medium">Достаточно данных для анализа!</p>
              <p className="font-golos text-xs text-emerald-700 mt-0.5">Вы можете посмотреть отчёт или добавить ещё записей для точности.</p>
            </div>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <button
            onClick={() => setStep("rel_type")}
            className="w-full border border-rose-200 text-rose-600 hover:bg-rose-50 font-golos text-sm font-medium rounded-xl py-3 transition-colors"
          >
            Добавить ещё запись
          </button>
          {canGoReport && (
            <button
              onClick={() => setStep("report")}
              className="w-full bg-[#6C5BA7] hover:bg-[#5A4B8C] text-white font-golos text-sm font-medium rounded-xl py-3 transition-colors"
            >
              Смотреть анализ
            </button>
          )}
        </div>
      </StepCard>
    );
  }

  if (step === "rel_type") {
    return (
      <StepCard
        icon="Users"
        title={`Запись ${entryNum}: с кем была эта ситуация?`}
        subtitle="Выберите один вариант"
      >
        {isLastFree && (
          <div className="mb-4 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
            <p className="font-golos text-xs text-amber-700">
              Это ваша бесплатная запись. Для полного анализа потребуется открыть доступ.
            </p>
          </div>
        )}
        <SingleSelect
          options={relTypeOptions}
          value={relType}
          onChange={setRelType}
        />
        <NextButton onClick={() => setStep("emotions")} disabled={relType === null} />
      </StepCard>
    );
  }

  if (step === "emotions") {
    return (
      <StepCard
        icon="Heart"
        title="Что вы чувствовали?"
        subtitle="Выберите все подходящие эмоции"
      >
        <div className="mb-4">
          <p className="font-golos text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Негативные</p>
          <MultiSelect
            options={negativeOptions}
            values={emotions}
            onChange={setEmotions}
            variant="negative"
          />
        </div>
        <div>
          <p className="font-golos text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Позитивные</p>
          <MultiSelect
            options={positiveOptions}
            values={emotions}
            onChange={setEmotions}
            variant="positive"
          />
        </div>
        <div className="flex items-center justify-between mt-6">
          <button
            onClick={() => setStep("rel_type")}
            className="text-sm text-gray-400 hover:text-gray-600 flex items-center gap-1"
          >
            <Icon name="ChevronLeft" size={14} />
            Назад
          </button>
          <button
            onClick={() => setStep("user_reaction")}
            disabled={emotions.length === 0}
            className="inline-flex items-center gap-2 bg-rose-500 hover:bg-rose-600 text-white font-golos text-sm font-medium px-6 py-2.5 rounded-xl transition-colors disabled:opacity-40"
          >
            Продолжить
            <Icon name="ArrowRight" size={15} />
          </button>
        </div>
      </StepCard>
    );
  }

  if (step === "user_reaction") {
    return (
      <StepCard
        icon="MessageCircle"
        title="Как вы отреагировали?"
        subtitle="Можно выбрать несколько"
      >
        <MultiSelect
          options={userReactionOptions}
          values={userReaction}
          onChange={setUserReaction}
        />
        <div className="flex items-center justify-between mt-6">
          <button
            onClick={() => setStep("emotions")}
            className="text-sm text-gray-400 hover:text-gray-600 flex items-center gap-1"
          >
            <Icon name="ChevronLeft" size={14} />
            Назад
          </button>
          <button
            onClick={() => setStep("partner_reaction")}
            disabled={userReaction.length === 0}
            className="inline-flex items-center gap-2 bg-rose-500 hover:bg-rose-600 text-white font-golos text-sm font-medium px-6 py-2.5 rounded-xl transition-colors disabled:opacity-40"
          >
            Продолжить
            <Icon name="ArrowRight" size={15} />
          </button>
        </div>
      </StepCard>
    );
  }

  if (step === "partner_reaction") {
    return (
      <StepCard
        icon="User"
        title="Как отреагировал второй человек?"
        subtitle="Можно выбрать несколько"
      >
        <MultiSelect
          options={partnerReactionOptions}
          values={partnerReaction}
          onChange={setPartnerReaction}
        />
        <div className="flex items-center justify-between mt-6">
          <button
            onClick={() => setStep("user_reaction")}
            className="text-sm text-gray-400 hover:text-gray-600 flex items-center gap-1"
          >
            <Icon name="ChevronLeft" size={14} />
            Назад
          </button>
          <button
            onClick={() => setStep("result")}
            disabled={partnerReaction.length === 0}
            className="inline-flex items-center gap-2 bg-rose-500 hover:bg-rose-600 text-white font-golos text-sm font-medium px-6 py-2.5 rounded-xl transition-colors disabled:opacity-40"
          >
            Продолжить
            <Icon name="ArrowRight" size={15} />
          </button>
        </div>
      </StepCard>
    );
  }

  if (step === "result") {
    return (
      <StepCard
        icon="Flag"
        title="Чем закончилась ситуация?"
        subtitle="Выберите один вариант"
      >
        <SingleSelect
          options={resultOptions}
          value={result}
          onChange={setResult}
        />
        <div className="flex items-center justify-between mt-6">
          <button
            onClick={() => setStep("partner_reaction")}
            className="text-sm text-gray-400 hover:text-gray-600 flex items-center gap-1"
          >
            <Icon name="ChevronLeft" size={14} />
            Назад
          </button>
          <button
            onClick={() => {
              handleSaveEntry();
              setStep("saved");
            }}
            disabled={result === null}
            className="inline-flex items-center gap-2 bg-rose-500 hover:bg-rose-600 text-white font-golos text-sm font-medium px-6 py-2.5 rounded-xl transition-colors disabled:opacity-40"
          >
            Сохранить запись
            <Icon name="Check" size={15} />
          </button>
        </div>
      </StepCard>
    );
  }

  return null;
}

function declEntry(n: number) {
  if (n % 10 === 1 && n % 100 !== 11) return "запись";
  if ([2, 3, 4].includes(n % 10) && ![12, 13, 14].includes(n % 100)) return "записи";
  return "записей";
}
