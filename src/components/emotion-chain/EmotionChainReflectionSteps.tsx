import Icon from "@/components/ui/icon";
import type { Step } from "./emotionChainTypes";
import { StepCard, EmotionGrid } from "./EmotionChainPrimitives";

const POSITIVE_STATES = [
  "энергию", "внутренние силы", "спокойствие", "уверенность",
  "вдохновение", "радость", "желание помогать другим", "тепло", "гармонию",
];

const POSITIVE_ACTIONS = [
  "помогал близким", "поддерживал друзей", "развивал себя",
  "создавал что-то полезное", "заботился о родных", "помогал людям",
];

const POSITIVE_FEELINGS = [
  "радость", "тепло", "благодарность", "прилив энергии", "счастье", "вдохновение",
];

type Props = {
  step: Step;
  problemText: string;
  allEmotions: string[];
  positiveState: string;
  setPositiveState: (v: string) => void;
  positiveAction: string;
  setPositiveAction: (v: string) => void;
  positiveFeeling: string;
  setPositiveFeeling: (v: string) => void;
  moodResult: string;
  saving: boolean;
  setStep: (s: Step) => void;
  setWarmthAnswer: (v: string) => void;
  handleFinal: (mood: string) => void;
  onNavigateCabinet: () => void;
  onReset: () => void;
};

export default function EmotionChainReflectionSteps({
  step,
  problemText,
  allEmotions,
  positiveState,
  setPositiveState,
  positiveAction,
  setPositiveAction,
  positiveFeeling,
  setPositiveFeeling,
  moodResult,
  saving,
  setStep,
  setWarmthAnswer,
  handleFinal,
  onNavigateCabinet,
  onReset,
}: Props) {
  return (
    <>
      {step === "show_chain" && (
        <StepCard icon="GitBranch" title="Ваш эмоциональный путь" subtitle="">
          <div className="mb-6 px-4 py-3 bg-amber-50 border border-amber-100 rounded-xl">
            <p className="text-sm text-amber-800 font-golos">
              <span className="font-semibold">Ваш запрос:</span> {problemText}
            </p>
          </div>

          <div className="flex flex-col items-center gap-1 mb-6">
            {allEmotions.map((em, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className={`px-5 py-2.5 rounded-xl text-sm font-golos font-medium ${
                  i === 0 ? "bg-[#F4F2FA] text-[#6C5BA7]" :
                  i === allEmotions.length - 1 ? "bg-rose-50 text-rose-600 border border-rose-100" :
                  "bg-gray-100 text-gray-700"
                }`}>
                  {em}
                </div>
                {i < allEmotions.length - 1 && (
                  <Icon name="ArrowDown" size={18} className="text-gray-300 my-1" />
                )}
              </div>
            ))}
          </div>

          <div className="bg-[#F9F8FC] border border-[#E8E4F5] rounded-xl p-5 mb-6">
            <p className="text-sm text-gray-600 font-golos leading-relaxed">
              Многие эмоциональные реакции формируются как цепочка переживаний. Ситуации могут запускать внутренние чувства, связанные с принятием, ценностью, любовью и поддержкой.
            </p>
            <p className="text-sm text-gray-600 font-golos leading-relaxed mt-2">
              Осознание этой цепочки помогает лучше понимать свои реакции.
            </p>
          </div>

          <div className="flex justify-center">
            <button
              onClick={() => setStep("warmth_check")}
              className="inline-flex items-center gap-2 gradient-primary text-white font-golos text-sm font-medium px-6 py-2.5 rounded-xl transition-all hover:opacity-90 active:scale-[0.97]"
            >
              Продолжить
              <Icon name="ArrowRight" size={15} />
            </button>
          </div>
        </StepCard>
      )}

      {step === "warmth_check" && (
        <StepCard
          icon="Sun"
          title="Чувствуете ли вы сейчас тепло или принятие по отношению к себе?"
          subtitle=""
        >
          <div className="flex flex-col gap-3">
            {[
              { label: "Да", value: "да" },
              { label: "Немного", value: "немного" },
              { label: "Нет", value: "нет" },
            ].map(opt => (
              <button
                key={opt.value}
                onClick={() => {
                  setWarmthAnswer(opt.value);
                  if (opt.value === "да") {
                    setStep("review");
                  } else {
                    setStep("positive_state");
                  }
                }}
                className="w-full text-left px-5 py-3.5 bg-white border border-gray-200 rounded-xl font-golos text-sm text-gray-700 hover:border-[#6C5BA7] hover:bg-[#F4F2FA] transition-all"
              >
                {opt.label}
              </button>
            ))}
          </div>
        </StepCard>
      )}

      {step === "positive_state" && (
        <StepCard
          icon="Sparkles"
          title="Если бы вы чувствовали любовь и принятие, что бы это вам дало?"
          subtitle="Выберите один вариант"
        >
          <EmotionGrid
            options={POSITIVE_STATES}
            selected={positiveState}
            onSelect={v => {
              setPositiveState(v);
              setStep("positive_action");
            }}
          />
        </StepCard>
      )}

      {step === "positive_action" && (
        <StepCard
          icon="Zap"
          title="Как бы вы направили это состояние?"
          subtitle="Выберите один вариант"
        >
          <EmotionGrid
            options={POSITIVE_ACTIONS}
            selected={positiveAction}
            onSelect={v => {
              setPositiveAction(v);
              setStep("positive_feeling");
            }}
          />
        </StepCard>
      )}

      {step === "positive_feeling" && (
        <StepCard
          icon="Heart"
          title="Что вы бы почувствовали, делая это?"
          subtitle="Выберите одну эмоцию"
        >
          <EmotionGrid
            options={POSITIVE_FEELINGS}
            selected={positiveFeeling}
            onSelect={v => {
              setPositiveFeeling(v);
              setStep("review");
            }}
          />
        </StepCard>
      )}

      {step === "review" && (
        <StepCard
          icon="Eye"
          title="Посмотрите на эту ситуацию ещё раз"
          subtitle="Изменилось ли ваше настроение?"
        >
          <div className="mb-6 px-4 py-3 bg-amber-50 border border-amber-100 rounded-xl">
            <p className="text-sm text-amber-800 font-golos">
              <span className="font-semibold">Ваш запрос:</span> {problemText}
            </p>
          </div>
          <div className="flex flex-col gap-3">
            {[
              { label: "Да", value: "да" },
              { label: "Немного", value: "немного" },
              { label: "Нет", value: "нет" },
            ].map(opt => (
              <button
                key={opt.value}
                disabled={saving}
                onClick={() => handleFinal(opt.value)}
                className="w-full text-left px-5 py-3.5 bg-white border border-gray-200 rounded-xl font-golos text-sm text-gray-700 hover:border-[#6C5BA7] hover:bg-[#F4F2FA] transition-all disabled:opacity-50"
              >
                {opt.label}
              </button>
            ))}
          </div>
        </StepCard>
      )}

      {step === "final" && (
        <StepCard icon="CheckCircle" title="" subtitle="">
          {moodResult === "да" ? (
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-5">
                <Icon name="Sun" size={28} className="text-emerald-500" />
              </div>
              <h2 className="font-golos font-semibold text-xl text-gray-900 mb-3">
                Вы смогли изменить своё эмоциональное состояние
              </h2>
              <p className="font-golos text-sm text-gray-500 leading-relaxed max-w-md mx-auto mb-8">
                Осознание чувств помогает управлять реакциями и лучше понимать себя. Вы проделали важную работу.
              </p>
            </div>
          ) : (
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-[#F4F2FA] flex items-center justify-center mx-auto mb-5">
                <Icon name="Heart" size={28} className="text-[#6C5BA7]" />
              </div>
              <h2 className="font-golos font-semibold text-xl text-gray-900 mb-3">
                Спасибо, что прошли тренажёр
              </h2>
              <p className="font-golos text-sm text-gray-500 leading-relaxed max-w-md mx-auto mb-8">
                Осознание своих чувств — первый шаг к управлению эмоциями. Каждая практика делает вас сильнее. Вы можете вернуться к этому тренажёру в любое время.
              </p>
            </div>
          )}

          <div className="bg-[#F9F8FC] border border-[#E8E4F5] rounded-xl p-5 mb-6">
            <h3 className="font-golos font-semibold text-sm text-[#4A3D7A] mb-3">Ваша цепочка чувств</h3>
            <div className="flex flex-wrap items-center gap-2">
              {allEmotions.map((em, i) => (
                <span key={i} className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-lg text-xs font-golos font-medium ${
                    i === 0 ? "bg-[#E8E4F5] text-[#6C5BA7]" :
                    i === allEmotions.length - 1 ? "bg-rose-100 text-rose-600" :
                    "bg-gray-100 text-gray-600"
                  }`}>
                    {em}
                  </span>
                  {i < allEmotions.length - 1 && (
                    <Icon name="ArrowRight" size={12} className="text-gray-300" />
                  )}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={onNavigateCabinet}
              className="inline-flex items-center justify-center gap-2 gradient-primary text-white font-golos text-sm font-medium px-6 py-2.5 rounded-xl transition-all hover:opacity-90 active:scale-[0.97]"
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
