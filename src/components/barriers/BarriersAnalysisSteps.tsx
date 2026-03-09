import Icon from "@/components/ui/icon";
import { StepCard, OptionsGrid, XYChart } from "./BarriersPrimitives";
import {
  STRENGTHS, calcNewY, PROFILE_TEXTS,
  type BarriersStep, type StepEntry, type BarriersProfile,
} from "./barriersTypes";

type Props = {
  step: BarriersStep;
  steps: StepEntry[];
  breakIdx: number | null;
  setBreakIdx: (v: number | null) => void;
  breakManual: number | null;
  setBreakManual: (v: number | null) => void;
  weakness: string;
  weaknessCustom: string;
  strengths: string[];
  strengthCustom: string;
  extraStrengths: string[];
  setExtraStrengths: (v: string[]) => void;
  extraStrengthCustom: string;
  setExtraStrengthCustom: (v: string) => void;
  profile: BarriersProfile;
  saving: boolean;
  setStep: (s: BarriersStep) => void;
  onNavigateCabinet: () => void;
  onReset: () => void;
};

function resolveLabel(raw: string, custom: string) {
  return raw === "Свой вариант" ? custom || raw : raw;
}

export default function BarriersAnalysisSteps({
  step, steps, breakIdx, setBreakIdx, breakManual, setBreakManual,
  weakness, weaknessCustom, strengths, strengthCustom,
  extraStrengths, setExtraStrengths, extraStrengthCustom, setExtraStrengthCustom,
  profile, saving, setStep, onNavigateCabinet, onReset,
}: Props) {

  const resolvedWeakness = resolveLabel(weakness, weaknessCustom);
  const resolvedStrengths = strengths.map(s => resolveLabel(s, strengthCustom));

  const effectiveBreak = breakIdx !== null ? breakIdx : breakManual;
  const breakStep = effectiveBreak !== null ? steps[effectiveBreak] : null;

  const newYSteps: StepEntry[] | undefined = effectiveBreak !== null
    ? steps.map((s, i) => ({
        ...s,
        y: i >= (effectiveBreak ?? 0)
          ? calcNewY(s.y, resolvedWeakness, extraStrengths.length)
          : s.y,
      }))
    : undefined;

  const breakNewY = breakStep
    ? calcNewY(breakStep.y, resolvedWeakness, extraStrengths.length)
    : null;

  const canNextExtra = extraStrengths.length > 0 && (
    !extraStrengths.includes("Свой вариант") || extraStrengthCustom.trim() !== ""
  );

  const handleToggleExtra = (v: string) => {
    if (extraStrengths.includes(v)) {
      setExtraStrengths(extraStrengths.filter(s => s !== v));
    } else if (extraStrengths.length < 2) {
      setExtraStrengths([...extraStrengths, v]);
    }
  };

  const availableForExtra = STRENGTHS.filter(s => !strengths.includes(s));

  return (
    <>
      {step === "break_point_auto" && (
        <StepCard icon="AlertOctagon" title="Анализ точки срыва" subtitle="">
          <div className="mb-5">
            <XYChart steps={steps} breakIdx={breakIdx} />
          </div>

          {breakIdx !== null ? (
            <div className="bg-rose-50 border border-rose-100 rounded-xl p-4 mb-6">
              <p className="font-golos text-sm text-rose-700 leading-relaxed">
                <span className="font-semibold">Автоматически определена точка срыва:</span> шаг {(breakIdx + 1)} — «{steps[breakIdx].text}»
              </p>
              <p className="font-golos text-xs text-rose-500 mt-1">
                X = {steps[breakIdx].x} · Y = {steps[breakIdx].y}
              </p>
            </div>
          ) : (
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 mb-4">
              <p className="font-golos text-sm text-amber-800">
                Не удалось определить точку срыва автоматически. Укажите её сами:
              </p>
            </div>
          )}

          {breakIdx === null && (
            <div className="flex flex-col gap-2 mb-6">
              {steps.map((s, i) => (
                <button
                  key={i}
                  onClick={() => { setBreakManual(i); setBreakIdx(i); }}
                  className={`w-full text-left px-4 py-3 rounded-xl border font-golos text-sm transition-all
                    ${breakManual === i
                      ? "bg-rose-50 border-rose-300 text-rose-700"
                      : "bg-white border-gray-200 text-gray-700 hover:border-rose-200"}`}
                >
                  <span className="font-medium">Шаг {i + 1}:</span> {s.text}
                  <span className="ml-2 text-xs text-gray-400">X={s.x} Y={s.y}</span>
                </button>
              ))}
            </div>
          )}

          <div className="flex justify-center">
            <button
              disabled={effectiveBreak === null}
              onClick={() => setStep("insight")}
              className="inline-flex items-center gap-2 bg-[#E06B2E] text-white font-golos text-sm font-medium px-6 py-2.5 rounded-xl transition-all hover:opacity-90 active:scale-[0.97] disabled:opacity-40"
            >
              Продолжить
              <Icon name="ArrowRight" size={15} />
            </button>
          </div>
        </StepCard>
      )}

      {step === "insight" && (
        <StepCard icon="Lightbulb" title="" subtitle="">
          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center mx-auto mb-4">
              <Icon name="Lightbulb" size={28} className="text-amber-500" />
            </div>
            <h2 className="font-golos font-semibold text-xl text-gray-900 mb-3">
              Вы не слабый
            </h2>
            <p className="font-golos text-sm text-gray-600 leading-relaxed max-w-sm mx-auto">
              Вы не выдержали уровень внутреннего напряжения.
            </p>
          </div>

          <div className="bg-[#F9F8FC] border border-[#E8E4F5] rounded-xl p-5 mb-5">
            <p className="font-golos text-sm text-gray-700 leading-relaxed">
              На шаге <span className="font-semibold text-[#6C5BA7]">{(effectiveBreak ?? 0) + 1}</span> уровень тревоги достиг{" "}
              <span className="font-semibold text-rose-500">{breakStep?.y ?? "–"}</span> из 10.
              При этом прогресс составлял{" "}
              <span className="font-semibold text-[#6C5BA7]">{breakStep?.x ?? "–"}</span>.
            </p>
            <p className="font-golos text-sm text-gray-600 leading-relaxed mt-2">
              Ваша слабая реакция — <span className="font-semibold">{resolvedWeakness}</span>.
              Она накапливалась и в итоге подавила движение вперёд.
            </p>
          </div>

          <div className="mb-5">
            <XYChart steps={steps} breakIdx={effectiveBreak} />
          </div>

          <div className="flex justify-center">
            <button
              onClick={() => setStep("extra_strength")}
              className="inline-flex items-center gap-2 bg-[#E06B2E] text-white font-golos text-sm font-medium px-6 py-2.5 rounded-xl transition-all hover:opacity-90 active:scale-[0.97]"
            >
              Что могло помочь?
              <Icon name="ArrowRight" size={15} />
            </button>
          </div>
        </StepCard>
      )}

      {step === "extra_strength" && (
        <StepCard
          icon="Shield"
          title="Какая ещё сильная сторона могла бы удержать вас в этот момент?"
          subtitle="Выберите до 2 вариантов"
        >
          <div className="mb-4 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
            <p className="font-golos text-xs text-amber-700">
              Ваши уже выбранные стороны: <span className="font-semibold">{resolvedStrengths.join(", ")}</span>
            </p>
          </div>
          <OptionsGrid
            options={availableForExtra}
            selected={extraStrengths}
            max={2}
            onToggle={handleToggleExtra}
            customValue={extraStrengthCustom}
            onCustomChange={setExtraStrengthCustom}
          />
          <div className="mt-6 flex justify-center">
            <button
              disabled={!canNextExtra}
              onClick={() => setStep("recalc")}
              className="inline-flex items-center gap-2 bg-[#E06B2E] text-white font-golos text-sm font-medium px-6 py-2.5 rounded-xl transition-all hover:opacity-90 active:scale-[0.97] disabled:opacity-40"
            >
              Пересчитать
              <Icon name="ArrowRight" size={15} />
            </button>
          </div>
        </StepCard>
      )}

      {step === "recalc" && (
        <StepCard icon="BarChart2" title="Вот что изменилось бы" subtitle="">
          <div className="grid grid-cols-2 gap-3 mb-5">
            <div className="bg-rose-50 border border-rose-100 rounded-xl p-4 text-center">
              <p className="font-golos text-xs text-gray-500 mb-1">Было</p>
              <p className="font-golos text-sm font-medium text-gray-700">X = {breakStep?.x ?? "–"}</p>
              <p className="font-golos text-sm font-medium text-rose-600">Y = {breakStep?.y ?? "–"} → срыв</p>
            </div>
            <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 text-center">
              <p className="font-golos text-xs text-gray-500 mb-1">Стало бы</p>
              <p className="font-golos text-sm font-medium text-gray-700">X = {breakStep?.x ?? "–"}</p>
              <p className="font-golos text-sm font-medium text-emerald-600">Y = {breakNewY ?? "–"} → удержание</p>
            </div>
          </div>

          <div className="mb-5">
            <XYChart steps={steps} breakIdx={effectiveBreak} newYSteps={newYSteps} />
          </div>

          <div className="bg-[#F9F8FC] border border-[#E8E4F5] rounded-xl p-4 mb-5">
            <p className="font-golos text-sm text-gray-600 leading-relaxed">
              При добавлении второй опоры уровень напряжения снижается.
              Вы могли бы продолжить движение.
            </p>
          </div>

          <div className="flex justify-center">
            <button
              onClick={() => setStep("profile")}
              className="inline-flex items-center gap-2 bg-[#E06B2E] text-white font-golos text-sm font-medium px-6 py-2.5 rounded-xl transition-all hover:opacity-90 active:scale-[0.97]"
            >
              Мой профиль
              <Icon name="ArrowRight" size={15} />
            </button>
          </div>
        </StepCard>
      )}

      {step === "profile" && (
        <StepCard icon="User" title="Ваш психологический профиль" subtitle="">
          <div className="bg-gradient-to-br from-[#FFF3EC] to-[#FFF8F4] border border-orange-100 rounded-xl p-5 mb-5">
            <h3 className="font-golos font-semibold text-[#C45520] mb-2">
              {PROFILE_TEXTS[profile].title}
            </h3>
            <p className="font-golos text-sm text-gray-700 leading-relaxed">
              {PROFILE_TEXTS[profile].text}
            </p>
          </div>

          <div className="bg-[#F9F8FC] border border-[#E8E4F5] rounded-xl p-4 mb-5 space-y-2">
            <p className="font-golos text-xs text-gray-500 font-semibold uppercase tracking-wide">Итог сессии</p>
            <div className="flex justify-between text-sm font-golos">
              <span className="text-gray-500">Сфера</span>
              <span className="text-gray-800 font-medium text-right max-w-[60%]">{resolveLabel(weakness, weaknessCustom)}</span>
            </div>
            <div className="flex justify-between text-sm font-golos">
              <span className="text-gray-500">Сильные стороны</span>
              <span className="text-gray-800 font-medium text-right max-w-[60%]">{resolvedStrengths.join(", ")}</span>
            </div>
            <div className="flex justify-between text-sm font-golos">
              <span className="text-gray-500">Слабая реакция</span>
              <span className="text-gray-800 font-medium text-right max-w-[60%]">{resolvedWeakness}</span>
            </div>
            <div className="flex justify-between text-sm font-golos">
              <span className="text-gray-500">Точка срыва</span>
              <span className="text-gray-800 font-medium">Шаг {(effectiveBreak ?? 0) + 1}</span>
            </div>
            <div className="flex justify-between text-sm font-golos">
              <span className="text-gray-500">Дополнительная опора</span>
              <span className="text-gray-800 font-medium text-right max-w-[60%]">
                {extraStrengths.map(s => resolveLabel(s, extraStrengthCustom)).join(", ")}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              disabled={saving}
              onClick={() => setStep("final")}
              className="inline-flex items-center justify-center gap-2 bg-[#E06B2E] text-white font-golos text-sm font-medium px-6 py-2.5 rounded-xl transition-all hover:opacity-90 active:scale-[0.97] disabled:opacity-50"
            >
              {saving ? "Сохраняем..." : "Завершить"}
              <Icon name="CheckCircle" size={15} />
            </button>
          </div>
        </StepCard>
      )}

      {step === "final" && (
        <StepCard icon="CheckCircle" title="" subtitle="">
          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-4">
              <Icon name="CheckCircle" size={30} className="text-emerald-500" />
            </div>
            <h2 className="font-golos font-semibold text-xl text-gray-900 mb-3">
              Сессия завершена
            </h2>
            <p className="font-golos text-sm text-gray-500 leading-relaxed max-w-sm mx-auto">
              Теперь вы видите закономерность. Вы не ленивый и не слабый — вы знаете, что именно вас останавливало. И знаете, что можно изменить.
            </p>
          </div>

          <div className="bg-[#FFF3EC] border border-orange-100 rounded-xl p-4 mb-6">
            <p className="font-golos text-sm text-[#C45520] font-semibold mb-1">
              {PROFILE_TEXTS[profile].title}
            </p>
            <p className="font-golos text-xs text-gray-600 leading-relaxed">
              {PROFILE_TEXTS[profile].text}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={onNavigateCabinet}
              className="inline-flex items-center justify-center gap-2 bg-[#E06B2E] text-white font-golos text-sm font-medium px-6 py-2.5 rounded-xl transition-all hover:opacity-90 active:scale-[0.97]"
            >
              <Icon name="ArrowLeft" size={15} />
              В кабинет
            </button>
            <button
              onClick={onReset}
              className="inline-flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700 font-golos text-sm font-medium px-6 py-2.5 rounded-xl transition-all hover:bg-gray-50 active:scale-[0.97]"
            >
              <Icon name="RotateCcw" size={15} />
              Пройти ещё раз
            </button>
          </div>
        </StepCard>
      )}
    </>
  );
}
