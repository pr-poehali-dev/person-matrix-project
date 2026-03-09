import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getToken } from "@/lib/auth";
import Icon from "@/components/ui/icon";
import func2url from "../../backend/func2url.json";
import type { Step, ChainItem } from "@/components/emotion-chain/emotionChainTypes";
import EmotionChainInputSteps from "@/components/emotion-chain/EmotionChainInputSteps";
import EmotionChainReflectionSteps from "@/components/emotion-chain/EmotionChainReflectionSteps";

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

  const handleReset = () => {
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
        <EmotionChainInputSteps
          step={step}
          problemText={problemText}
          setProblemText={setProblemText}
          situationText={situationText}
          setSituationText={setSituationText}
          emotionLevel1={emotionLevel1}
          setEmotionLevel1={setEmotionLevel1}
          chain={chain}
          setChain={setChain}
          currentTrigger={currentTrigger}
          setCurrentTrigger={setCurrentTrigger}
          rootEmotion={rootEmotion}
          setRootEmotion={setRootEmotion}
          setStep={setStep}
        />
        <EmotionChainReflectionSteps
          step={step}
          problemText={problemText}
          allEmotions={allEmotions}
          positiveState={positiveState}
          setPositiveState={setPositiveState}
          positiveAction={positiveAction}
          setPositiveAction={setPositiveAction}
          positiveFeeling={positiveFeeling}
          setPositiveFeeling={setPositiveFeeling}
          moodResult={moodResult}
          saving={saving}
          setStep={setStep}
          setWarmthAnswer={setWarmthAnswer}
          handleFinal={handleFinal}
          onNavigateCabinet={() => navigate("/cabinet")}
          onReset={handleReset}
        />
      </main>
    </div>
  );
}
