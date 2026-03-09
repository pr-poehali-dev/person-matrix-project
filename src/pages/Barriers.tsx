import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getToken } from "@/lib/auth";
import Icon from "@/components/ui/icon";
import func2url from "../../backend/func2url.json";
import type { BarriersStep, StepEntry, BarriersProfile } from "@/components/barriers/barriersTypes";
import { detectBreakStep, detectProfile } from "@/components/barriers/barriersTypes";
import BarriersInputSteps from "@/components/barriers/BarriersInputSteps";
import BarriersAnalysisSteps from "@/components/barriers/BarriersAnalysisSteps";

const STEP_ORDER: BarriersStep[] = [
  "context", "strength", "weakness", "steps_intro",
  "step_text", "step_x", "step_y",
  "break_point_auto", "insight", "extra_strength", "recalc", "profile", "final",
];

function calcProgress(step: BarriersStep): number {
  const idx = STEP_ORDER.indexOf(step);
  return idx < 0 ? 50 : Math.round(((idx + 1) / STEP_ORDER.length) * 100);
}

export default function Barriers() {
  const navigate = useNavigate();

  // context
  const [context, setContext] = useState("");
  const [contextCustom, setContextCustom] = useState("");
  // strengths
  const [strengths, setStrengths] = useState<string[]>([]);
  const [strengthCustom, setStrengthCustom] = useState("");
  // weakness
  const [weakness, setWeakness] = useState("");
  const [weaknessCustom, setWeaknessCustom] = useState("");
  // steps
  const [steps, setSteps] = useState<StepEntry[]>([]);
  const [currentStepNum, setCurrentStepNum] = useState(1);
  const [draftText, setDraftText] = useState("");
  const [draftX, setDraftX] = useState(5);
  const [draftY, setDraftY] = useState(3);
  // analysis
  const [breakIdx, setBreakIdx] = useState<number | null>(null);
  const [breakManual, setBreakManual] = useState<number | null>(null);
  // extra
  const [extraStrengths, setExtraStrengths] = useState<string[]>([]);
  const [extraStrengthCustom, setExtraStrengthCustom] = useState("");
  // result
  const [profile, setProfile] = useState<BarriersProfile>("balanced");
  const [saving, setSaving] = useState(false);

  const [appStep, setAppStep] = useState<BarriersStep>("context");

  const setStep = (s: BarriersStep) => {
    if (s === "break_point_auto") {
      const detected = detectBreakStep(steps);
      setBreakIdx(detected);
    }
    if (s === "profile") {
      const p = detectProfile(steps);
      setProfile(p);
      handleSave(p);
    }
    setAppStep(s);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSave = async (p: BarriersProfile) => {
    const token = getToken();
    if (!token || !("trainers" in func2url)) return;
    setSaving(true);
    try {
      await fetch((func2url as Record<string, string>)["trainers"], {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Auth-Token": token },
        body: JSON.stringify({
          action: "save",
          trainer_type: "barriers_anxiety",
          result_data: {
            context: context === "Свой вариант" ? contextCustom : context,
            strengths: strengths.map(s => s === "Свой вариант" ? strengthCustom : s),
            weakness: weakness === "Свой вариант" ? weaknessCustom : weakness,
            steps,
            break_step_idx: breakIdx,
            extra_strengths: extraStrengths.map(s => s === "Свой вариант" ? extraStrengthCustom : s),
            profile: p,
          },
        }),
      });
    } catch (e) { console.error(e); }
    setSaving(false);
  };

  const handleReset = () => {
    setContext("");
    setContextCustom("");
    setStrengths([]);
    setStrengthCustom("");
    setWeakness("");
    setWeaknessCustom("");
    setSteps([]);
    setCurrentStepNum(1);
    setDraftText("");
    setDraftX(5);
    setDraftY(3);
    setBreakIdx(null);
    setBreakManual(null);
    setExtraStrengths([]);
    setExtraStrengthCustom("");
    setProfile("balanced");
    setAppStep("context");
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
            className="h-full bg-gradient-to-r from-[#E06B2E] to-[#F08C56] rounded-full transition-all duration-500"
            style={{ width: `${calcProgress(appStep)}%` }}
          />
        </div>
        <div className="mt-3 mb-1">
          <h1 className="font-golos font-semibold text-gray-800 text-base">Барьеры, тревоги и стресс</h1>
        </div>
      </div>

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-6">
        <BarriersInputSteps
          step={appStep}
          context={context}
          setContext={setContext}
          contextCustom={contextCustom}
          setContextCustom={setContextCustom}
          strengths={strengths}
          setStrengths={setStrengths}
          strengthCustom={strengthCustom}
          setStrengthCustom={setStrengthCustom}
          weakness={weakness}
          setWeakness={setWeakness}
          weaknessCustom={weaknessCustom}
          setWeaknessCustom={setWeaknessCustom}
          steps={steps}
          setSteps={setSteps}
          currentStepNum={currentStepNum}
          setCurrentStepNum={setCurrentStepNum}
          draftText={draftText}
          setDraftText={setDraftText}
          draftX={draftX}
          setDraftX={setDraftX}
          draftY={draftY}
          setDraftY={setDraftY}
          setStep={setStep}
        />
        <BarriersAnalysisSteps
          step={appStep}
          steps={steps}
          breakIdx={breakIdx}
          setBreakIdx={setBreakIdx}
          breakManual={breakManual}
          setBreakManual={setBreakManual}
          weakness={weakness}
          weaknessCustom={weaknessCustom}
          strengths={strengths}
          strengthCustom={strengthCustom}
          extraStrengths={extraStrengths}
          setExtraStrengths={setExtraStrengths}
          extraStrengthCustom={extraStrengthCustom}
          setExtraStrengthCustom={setExtraStrengthCustom}
          profile={profile}
          saving={saving}
          setStep={setStep}
          onNavigateCabinet={() => navigate("/cabinet")}
          onReset={handleReset}
        />
      </main>
    </div>
  );
}
