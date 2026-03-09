import Icon from "@/components/ui/icon";
import type { Step, ChainItem } from "./emotionChainTypes";
import { StepCard, EmotionGrid } from "./EmotionChainPrimitives";

const EMOTIONS_LEVEL_1 = [
  "раздражение", "тревога", "стресс", "напряжение", "усталость",
  "беспокойство", "недовольство", "нервозность", "растерянность",
  "неудовлетворённость", "дискомфорт", "тревожность",
  "подавленность", "раздражённость",
];

const EMOTIONS_LEVEL_2 = [
  "обида", "злость", "разочарование", "чувство несправедливости",
  "чувство давления", "чувство непонимания", "чувство одиночества",
  "беспомощность", "неуверенность", "тревога за будущее",
  "чувство вины", "чувство стыда", "ревность", "зависть",
  "ощущение, что меня игнорируют", "ощущение, что меня не слышат",
  "ощущение, что меня критикуют", "ощущение, что меня недооценивают",
  "ощущение давления",
];

const ROOT_EMOTIONS = [
  "меня не любят", "я никому не нужен", "я не важен",
  "меня не ценят", "меня не принимают", "я недостаточно хорош",
  "я хуже других", "я не заслуживаю любви", "меня могут бросить",
  "меня могут отвергнуть", "я один", "я не интересен",
  "меня могут забыть", "я не нужен людям",
];

type Props = {
  step: Step;
  problemText: string;
  setProblemText: (v: string) => void;
  situationText: string;
  setSituationText: (v: string) => void;
  emotionLevel1: string;
  setEmotionLevel1: (v: string) => void;
  chain: ChainItem[];
  setChain: (v: ChainItem[]) => void;
  currentTrigger: string;
  setCurrentTrigger: (v: string) => void;
  rootEmotion: string;
  setRootEmotion: (v: string) => void;
  setStep: (s: Step) => void;
};

export default function EmotionChainInputSteps({
  step,
  problemText,
  setProblemText,
  situationText,
  setSituationText,
  emotionLevel1,
  setEmotionLevel1,
  chain,
  setChain,
  currentTrigger,
  setCurrentTrigger,
  rootEmotion,
  setRootEmotion,
  setStep,
}: Props) {
  return (
    <>
      {step === "problem" && (
        <StepCard
          icon="MessageCircle"
          title="Что вас сейчас больше всего беспокоит?"
          subtitle="Опишите кратко то, что тревожит вас прямо сейчас"
        >
          <textarea
            value={problemText}
            onChange={e => setProblemText(e.target.value)}
            placeholder="Например: конфликт на работе, отношения с близким человеком..."
            className="w-full border border-gray-200 rounded-xl p-4 font-golos text-sm text-gray-700 resize-none h-32 focus:outline-none focus:ring-2 focus:ring-[#6C5BA7]/30 focus:border-[#6C5BA7] transition-all"
            maxLength={500}
          />
          <div className="flex justify-between items-center mt-2">
            <span className="text-xs text-gray-300 font-golos">{problemText.length}/500</span>
            <button
              disabled={problemText.trim().length < 10}
              onClick={() => setStep("situation")}
              className="inline-flex items-center gap-2 gradient-primary text-white font-golos text-sm font-medium px-6 py-2.5 rounded-xl transition-all hover:opacity-90 active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Далее
              <Icon name="ArrowRight" size={15} />
            </button>
          </div>
        </StepCard>
      )}

      {step === "situation" && (
        <StepCard
          icon="FileText"
          title="Какая ситуация вызвала это чувство?"
          subtitle="Опишите кратко"
        >
          <textarea
            value={situationText}
            onChange={e => setSituationText(e.target.value)}
            placeholder="Что именно произошло?"
            className="w-full border border-gray-200 rounded-xl p-4 font-golos text-sm text-gray-700 resize-none h-32 focus:outline-none focus:ring-2 focus:ring-[#6C5BA7]/30 focus:border-[#6C5BA7] transition-all"
            maxLength={500}
          />
          <div className="flex justify-end mt-4">
            <button
              disabled={situationText.trim().length < 5}
              onClick={() => setStep("emotion1")}
              className="inline-flex items-center gap-2 gradient-primary text-white font-golos text-sm font-medium px-6 py-2.5 rounded-xl transition-all hover:opacity-90 active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Далее
              <Icon name="ArrowRight" size={15} />
            </button>
          </div>
        </StepCard>
      )}

      {step === "emotion1" && (
        <StepCard
          icon="Heart"
          title="Что вы сейчас чувствуете?"
          subtitle="Выберите одну эмоцию, которая ближе всего"
        >
          <EmotionGrid
            options={EMOTIONS_LEVEL_1}
            selected={emotionLevel1}
            onSelect={v => {
              setEmotionLevel1(v);
              setCurrentTrigger("");
              setStep("chain_trigger");
            }}
          />
        </StepCard>
      )}

      {step === "chain_trigger" && (
        <StepCard
          icon="Search"
          title="Это чувство возникло не просто так"
          subtitle="Что именно в ситуации усилило это чувство?"
        >
          <div className="mb-4 px-4 py-3 bg-[#F4F2FA] rounded-xl">
            <p className="text-sm text-[#6C5BA7] font-golos">
              Текущее чувство: <span className="font-semibold">{chain.length > 0 ? chain[chain.length - 1].emotion : emotionLevel1}</span>
            </p>
          </div>
          <textarea
            value={currentTrigger}
            onChange={e => setCurrentTrigger(e.target.value)}
            placeholder="Что усилило это чувство?"
            className="w-full border border-gray-200 rounded-xl p-4 font-golos text-sm text-gray-700 resize-none h-24 focus:outline-none focus:ring-2 focus:ring-[#6C5BA7]/30 focus:border-[#6C5BA7] transition-all"
            maxLength={300}
          />
          <div className="flex justify-end mt-4">
            <button
              disabled={currentTrigger.trim().length < 3}
              onClick={() => setStep("chain_emotion")}
              className="inline-flex items-center gap-2 gradient-primary text-white font-golos text-sm font-medium px-6 py-2.5 rounded-xl transition-all hover:opacity-90 active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Далее
              <Icon name="ArrowRight" size={15} />
            </button>
          </div>
        </StepCard>
      )}

      {step === "chain_emotion" && (
        <StepCard
          icon="Layers"
          title="Что вы чувствуете из-за этого?"
          subtitle="Выберите эмоцию, которая появилась"
        >
          <EmotionGrid
            options={EMOTIONS_LEVEL_2}
            selected=""
            onSelect={v => {
              const newChain = [...chain, { trigger: currentTrigger, emotion: v }];
              setChain(newChain);
              setCurrentTrigger("");
              if (newChain.length >= 5) {
                setStep("root");
              } else {
                setStep("chain_trigger");
              }
            }}
          />
          {chain.length >= 1 && (
            <div className="mt-4 flex justify-center">
              <button
                onClick={() => setStep("root")}
                className="text-sm text-[#6C5BA7] hover:underline font-golos"
              >
                Перейти к глубинному чувству
              </button>
            </div>
          )}
        </StepCard>
      )}

      {step === "root" && (
        <StepCard
          icon="Target"
          title="Какое чувство ближе всего к тому, что вы ощущаете глубже всего?"
          subtitle="Это — корень вашей эмоциональной цепочки"
        >
          <EmotionGrid
            options={ROOT_EMOTIONS}
            selected={rootEmotion}
            onSelect={v => {
              setRootEmotion(v);
              setStep("show_chain");
            }}
          />
        </StepCard>
      )}
    </>
  );
}
