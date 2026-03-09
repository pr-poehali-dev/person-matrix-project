import { useState } from "react";
import Icon from "@/components/ui/icon";
import { StepCard, OptionsGrid, SliderInput } from "./BarriersPrimitives";
import {
  CONTEXTS, STRENGTHS, WEAKNESSES,
  type BarriersStep, type StepEntry,
} from "./barriersTypes";

type Props = {
  step: BarriersStep;
  context: string;
  setContext: (v: string) => void;
  contextCustom: string;
  setContextCustom: (v: string) => void;
  strengths: string[];
  setStrengths: (v: string[]) => void;
  strengthCustom: string;
  setStrengthCustom: (v: string) => void;
  weakness: string;
  setWeakness: (v: string) => void;
  weaknessCustom: string;
  setWeaknessCustom: (v: string) => void;
  steps: StepEntry[];
  setSteps: (v: StepEntry[]) => void;
  currentStepNum: number;
  setCurrentStepNum: (v: number) => void;
  draftText: string;
  setDraftText: (v: string) => void;
  draftX: number;
  setDraftX: (v: number) => void;
  draftY: number;
  setDraftY: (v: number) => void;
  setStep: (s: BarriersStep) => void;
};

const MIN_STEPS = 5;
const MAX_STEPS = 10;

export default function BarriersInputSteps({
  step,
  context, setContext, contextCustom, setContextCustom,
  strengths, setStrengths, strengthCustom, setStrengthCustom,
  weakness, setWeakness, weaknessCustom, setWeaknessCustom,
  steps, setSteps,
  currentStepNum, setCurrentStepNum,
  draftText, setDraftText,
  draftX, setDraftX,
  draftY, setDraftY,
  setStep,
}: Props) {

  const [customContext, setCustomContext] = useState(contextCustom);

  const resolvedContext = context === "Свой вариант" ? contextCustom : context;
  const resolvedWeakness = weakness === "Свой вариант" ? weaknessCustom : weakness;
  const canNextContext = context !== "" && (context !== "Свой вариант" || contextCustom.trim() !== "");
  const canNextStrength = strengths.length > 0 && (
    !strengths.includes("Свой вариант") || strengthCustom.trim() !== ""
  );
  const canNextWeakness = weakness !== "" && (weakness !== "Свой вариант" || weaknessCustom.trim() !== "");

  const handleToggleStrength = (v: string) => {
    if (strengths.includes(v)) {
      setStrengths(strengths.filter(s => s !== v));
    } else if (strengths.length < 2) {
      setStrengths([...strengths, v]);
    }
  };

  const addCurrentStep = () => {
    const newStep: StepEntry = {
      stepNum: currentStepNum,
      text: draftText.trim(),
      x: draftX,
      y: draftY,
    };
    const newSteps = [...steps, newStep];
    setSteps(newSteps);

    if (currentStepNum >= MAX_STEPS) {
      setStep("break_point_auto");
      return;
    }
    setCurrentStepNum(currentStepNum + 1);
    setDraftText("");
    setDraftX(5);
    setDraftY(3);
    setStep("step_text");
  };

  const finishSteps = () => {
    const newStep: StepEntry = {
      stepNum: currentStepNum,
      text: draftText.trim(),
      x: draftX,
      y: draftY,
    };
    setSteps([...steps, newStep]);
    setStep("break_point_auto");
  };

  return (
    <>
      {step === "context" && (
        <StepCard icon="Target" title="В какой сфере произошёл провал?" subtitle="Выберите один вариант">
          <OptionsGrid
            options={CONTEXTS}
            selected={context ? [context] : []}
            max={1}
            onToggle={v => {
              setContext(v);
              if (v === "Свой вариант") setContextCustom(customContext);
            }}
            customValue={contextCustom}
            onCustomChange={v => { setContextCustom(v); setCustomContext(v); }}
          />
          <div className="mt-6 flex justify-center">
            <button
              disabled={!canNextContext}
              onClick={() => setStep("strength")}
              className="inline-flex items-center gap-2 bg-[#E06B2E] text-white font-golos text-sm font-medium px-6 py-2.5 rounded-xl transition-all hover:opacity-90 active:scale-[0.97] disabled:opacity-40"
            >
              Далее
              <Icon name="ArrowRight" size={15} />
            </button>
          </div>
        </StepCard>
      )}

      {step === "strength" && (
        <StepCard icon="Zap" title="Ваша главная сильная сторона" subtitle="Можно выбрать до 2 вариантов">
          <OptionsGrid
            options={STRENGTHS}
            selected={strengths}
            max={2}
            onToggle={handleToggleStrength}
            customValue={strengthCustom}
            onCustomChange={setStrengthCustom}
          />
          <div className="mt-6 flex justify-center">
            <button
              disabled={!canNextStrength}
              onClick={() => setStep("weakness")}
              className="inline-flex items-center gap-2 bg-[#E06B2E] text-white font-golos text-sm font-medium px-6 py-2.5 rounded-xl transition-all hover:opacity-90 active:scale-[0.97] disabled:opacity-40"
            >
              Далее
              <Icon name="ArrowRight" size={15} />
            </button>
          </div>
        </StepCard>
      )}

      {step === "weakness" && (
        <StepCard icon="AlertTriangle" title="Ваша основная слабая реакция" subtitle="Выберите один вариант">
          <OptionsGrid
            options={WEAKNESSES}
            selected={weakness ? [weakness] : []}
            max={1}
            onToggle={setWeakness}
            customValue={weaknessCustom}
            onCustomChange={setWeaknessCustom}
          />
          <div className="mt-6 flex justify-center">
            <button
              disabled={!canNextWeakness}
              onClick={() => setStep("steps_intro")}
              className="inline-flex items-center gap-2 bg-[#E06B2E] text-white font-golos text-sm font-medium px-6 py-2.5 rounded-xl transition-all hover:opacity-90 active:scale-[0.97] disabled:opacity-40"
            >
              Далее
              <Icon name="ArrowRight" size={15} />
            </button>
          </div>
        </StepCard>
      )}

      {step === "steps_intro" && (
        <StepCard icon="List" title="Восстановите шаги провала" subtitle="">
          <div className="space-y-4 mb-6">
            <div className="bg-orange-50 border border-orange-100 rounded-xl p-4">
              <p className="font-golos text-sm text-orange-800 leading-relaxed">
                <span className="font-semibold">Контекст:</span> {resolvedContext}
              </p>
            </div>
            <p className="font-golos text-sm text-gray-600 leading-relaxed">
              Вспомните ключевые шаги, которые вы предпринимали. Для каждого шага вы оцените два параметра:
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#F4F2FA] rounded-xl p-3 text-center">
                <p className="font-golos text-xs text-[#6C5BA7] font-semibold mb-1">Ось X</p>
                <p className="font-golos text-xs text-gray-600">Прогресс / движение к цели</p>
              </div>
              <div className="bg-[#FFF3EC] rounded-xl p-3 text-center">
                <p className="font-golos text-xs text-[#E06B2E] font-semibold mb-1">Ось Y</p>
                <p className="font-golos text-xs text-gray-600">Тревога / напряжение</p>
              </div>
            </div>
            <p className="font-golos text-xs text-gray-400">Минимум {MIN_STEPS} шагов, максимум {MAX_STEPS}</p>
          </div>
          <div className="flex justify-center">
            <button
              onClick={() => {
                setCurrentStepNum(1);
                setDraftText("");
                setDraftX(5);
                setDraftY(3);
                setStep("step_text");
              }}
              className="inline-flex items-center gap-2 bg-[#E06B2E] text-white font-golos text-sm font-medium px-6 py-2.5 rounded-xl transition-all hover:opacity-90 active:scale-[0.97]"
            >
              Начать
              <Icon name="ArrowRight" size={15} />
            </button>
          </div>
        </StepCard>
      )}

      {step === "step_text" && (
        <StepCard
          icon="Edit3"
          title={`Шаг ${currentStepNum}`}
          subtitle="Опишите, что вы делали на этом шаге"
        >
          <div className="mb-4 flex gap-2">
            {Array.from({ length: MAX_STEPS }).map((_, i) => (
              <div
                key={i}
                className={`h-1.5 flex-1 rounded-full ${
                  i < steps.length ? "bg-[#E06B2E]" :
                  i === steps.length ? "bg-[#E06B2E]/40" :
                  "bg-gray-100"
                }`}
              />
            ))}
          </div>
          <textarea
            autoFocus
            value={draftText}
            onChange={e => setDraftText(e.target.value)}
            placeholder="Например: Я подал заявку на собеседование и подготовил резюме"
            rows={3}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 font-golos text-sm text-gray-800 resize-none outline-none focus:border-[#E06B2E] transition"
          />
          <div className="flex justify-end mt-4">
            <button
              disabled={draftText.trim().length < 3}
              onClick={() => setStep("step_x")}
              className="inline-flex items-center gap-2 bg-[#E06B2E] text-white font-golos text-sm font-medium px-5 py-2.5 rounded-xl transition-all hover:opacity-90 active:scale-[0.97] disabled:opacity-40"
            >
              Далее
              <Icon name="ArrowRight" size={15} />
            </button>
          </div>
        </StepCard>
      )}

      {step === "step_x" && (
        <StepCard
          icon="TrendingUp"
          title={`Шаг ${currentStepNum}. Прогресс`}
          subtitle="Насколько этот шаг приближал вас к успеху?"
        >
          <div className="mb-5 px-4 py-3 bg-gray-50 rounded-xl">
            <p className="font-golos text-sm text-gray-600 italic">«{draftText}»</p>
          </div>
          <SliderInput value={draftX} min={1} max={10} onChange={setDraftX} colorClass="accent-[#6C5BA7]" />
          <div className="flex justify-end mt-6">
            <button
              onClick={() => setStep("step_y")}
              className="inline-flex items-center gap-2 bg-[#E06B2E] text-white font-golos text-sm font-medium px-5 py-2.5 rounded-xl transition-all hover:opacity-90 active:scale-[0.97]"
            >
              Далее
              <Icon name="ArrowRight" size={15} />
            </button>
          </div>
        </StepCard>
      )}

      {step === "step_y" && (
        <StepCard
          icon="Activity"
          title={`Шаг ${currentStepNum}. Напряжение`}
          subtitle="Какой уровень тревоги вы чувствовали в этот момент?"
        >
          <div className="mb-5 px-4 py-3 bg-gray-50 rounded-xl">
            <p className="font-golos text-sm text-gray-600 italic">«{draftText}»</p>
          </div>
          <SliderInput value={draftY} min={0} max={10} onChange={setDraftY} colorClass="accent-[#E06B2E]" />
          <div className="flex justify-between items-center mt-6">
            {steps.length + 1 >= MIN_STEPS && (
              <button
                onClick={finishSteps}
                className="font-golos text-sm text-gray-400 hover:text-gray-600 transition underline underline-offset-2"
              >
                Завершить
              </button>
            )}
            <button
              onClick={addCurrentStep}
              disabled={currentStepNum >= MAX_STEPS}
              className="ml-auto inline-flex items-center gap-2 bg-[#E06B2E] text-white font-golos text-sm font-medium px-5 py-2.5 rounded-xl transition-all hover:opacity-90 active:scale-[0.97] disabled:opacity-40"
            >
              {currentStepNum >= MAX_STEPS ? "Готово" : "Следующий шаг"}
              <Icon name="ArrowRight" size={15} />
            </button>
          </div>
        </StepCard>
      )}
    </>
  );
}
