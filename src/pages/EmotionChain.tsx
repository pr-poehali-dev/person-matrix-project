import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getToken } from "@/lib/auth";
import Icon from "@/components/ui/icon";
import func2url from "../../backend/func2url.json";

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

type Step =
  | "problem"
  | "situation"
  | "emotion1"
  | "chain_trigger"
  | "chain_emotion"
  | "root"
  | "show_chain"
  | "warmth_check"
  | "positive_state"
  | "positive_action"
  | "positive_feeling"
  | "review"
  | "final";

type ChainItem = {
  trigger: string;
  emotion: string;
};

export default function EmotionChain() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("problem");
  const [problemText, setProblemText] = useState("");
  const [situationText, setSituationText] = useState("");
  const [emotionLevel1, setEmotionLevel1] = useState("");
  const [chain, setChain] = useState<ChainItem[]>([]);
  const [currentTrigger, setCurrentTrigger] = useState("");
  const [rootEmotion, setRootEmotion] = useState("");
  const [warmthAnswer, setWarmthAnswer] = useState("");
  const [positiveState, setPositiveState] = useState("");
  const [positiveAction, setPositiveAction] = useState("");
  const [positiveFeeling, setPositiveFeeling] = useState("");
  const [moodResult, setMoodResult] = useState("");
  const [saving, setSaving] = useState(false);

  const allEmotions = [emotionLevel1, ...chain.map(c => c.emotion), rootEmotion].filter(Boolean);

  const progress = (() => {
    const steps: Step[] = ["problem", "situation", "emotion1", "chain_trigger", "root", "show_chain", "warmth_check", "review", "final"];
    const idx = steps.indexOf(step);
    if (idx < 0) {
      if (step === "chain_emotion") return 40;
      if (step === "positive_state" || step === "positive_action" || step === "positive_feeling") return 75;
      return 50;
    }
    return Math.round(((idx + 1) / steps.length) * 100);
  })();

  const saveResult = async (mood: string) => {
    const token = getToken();
    if (!token || !("trainers" in func2url)) return;
    setSaving(true);
    try {
      await fetch((func2url as Record<string, string>)["trainers"], {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Auth-Token": token },
        body: JSON.stringify({
          action: "save",
          trainer_type: "emotion_chain",
          result_data: {
            problem_text: problemText,
            situation_text: situationText,
            emotion_chain: allEmotions,
            root_emotion: rootEmotion,
            mood_result: mood,
            positive_state: positiveState || null,
            positive_action: positiveAction || null,
            positive_feeling: positiveFeeling || null,
          },
        }),
      });
    } catch (e) { console.error(e); }
    setSaving(false);
  };

  const handleFinal = async (mood: string) => {
    setMoodResult(mood);
    await saveResult(mood);
    setStep("final");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] px-5 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Link to="/cabinet" className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors font-golos text-sm">
            <Icon name="ArrowLeft" size={16} />
            Кабинет
          </Link>
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#6C5BA7]/10 flex items-center justify-center">
              <span className="font-golos text-sm font-bold text-[#6C5BA7]">М</span>
            </div>
            <span className="font-golos text-lg font-semibold text-[#4A3D7A] tracking-tight">Матрица личности</span>
          </Link>
        </div>
      </header>

      <div className="max-w-2xl mx-auto w-full px-4 pt-6">
        <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#6C5BA7] to-[#8B7BC7] rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-8">
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
                onClick={() => navigate("/cabinet")}
                className="inline-flex items-center justify-center gap-2 gradient-primary text-white font-golos text-sm font-medium px-6 py-2.5 rounded-xl transition-all hover:opacity-90 active:scale-[0.97]"
              >
                <Icon name="ArrowLeft" size={15} />
                В кабинет
              </button>
              <button
                onClick={() => {
                  setProblemText("");
                  setSituationText("");
                  setEmotionLevel1("");
                  setChain([]);
                  setCurrentTrigger("");
                  setRootEmotion("");
                  setWarmthAnswer("");
                  setPositiveState("");
                  setPositiveAction("");
                  setPositiveFeeling("");
                  setMoodResult("");
                  setStep("problem");
                }}
                className="inline-flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700 font-golos text-sm font-medium px-6 py-2.5 rounded-xl transition-all hover:bg-gray-50 active:scale-[0.97]"
              >
                <Icon name="RotateCcw" size={15} />
                Пройти ещё раз
              </button>
            </div>
          </StepCard>
        )}
      </main>
    </div>
  );
}

function StepCard({ icon, title, subtitle, children }: {
  icon: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl soft-shadow p-6 sm:p-8 animate-fade-in">
      {title && (
        <div className="flex items-start gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-[#F4F2FA] flex items-center justify-center flex-shrink-0 mt-0.5">
            <Icon name={icon} size={20} className="text-[#6C5BA7]" />
          </div>
          <div>
            <h2 className="font-golos font-semibold text-lg text-gray-900">{title}</h2>
            {subtitle && <p className="font-golos text-sm text-gray-400 mt-0.5">{subtitle}</p>}
          </div>
        </div>
      )}
      {children}
    </div>
  );
}

function EmotionGrid({ options, selected, onSelect }: {
  options: string[];
  selected: string;
  onSelect: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(opt => (
        <button
          key={opt}
          onClick={() => onSelect(opt)}
          className={`px-4 py-2 rounded-xl text-sm font-golos transition-all border ${
            selected === opt
              ? "bg-[#6C5BA7] text-white border-[#6C5BA7]"
              : "bg-white text-gray-700 border-gray-200 hover:border-[#6C5BA7] hover:bg-[#F4F2FA]"
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}