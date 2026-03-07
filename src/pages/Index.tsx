import { useState, useEffect, useRef } from "react";
import { calcLifePath, calcCharacter, calcDestiny } from "@/lib/matrix";
import { getToken, saveCalculation } from "@/lib/auth";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import CalcSection from "@/components/CalcSection";
import ResultSection from "@/components/ResultSection";
import InfoSections from "@/components/InfoSections";
import Footer from "@/components/Footer";

const FloatingNumbers = () => {
  const nums = ["1", "3", "7", "11", "9", "4", "22", "6", "2", "8", "5"];
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {nums.map((n, i) => (
        <div
          key={i}
          className="absolute font-cormorant select-none"
          style={{
            left: `${(i * 9.3 + 3) % 95}%`,
            top: `${(i * 13.7 + 10) % 85}%`,
            fontSize: `${40 + (i % 4) * 20}px`,
            color: "rgba(201,168,76,0.05)",
            animation: `float ${4 + (i % 3)}s ease-in-out infinite`,
            animationDelay: `${i * 0.7}s`,
          }}
        >
          {n}
        </div>
      ))}
    </div>
  );
};

export default function Index() {
  const [birthDate, setBirthDate] = useState("");
  const [birthTime, setBirthTime] = useState("");
  const [result, setResult] = useState<{ life: number; character: number; destiny: number } | null>(null);
  const [calcVisible, setCalcVisible] = useState(false);
  const calcRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setCalcVisible(true); },
      { threshold: 0.1 }
    );
    if (calcRef.current) observer.observe(calcRef.current);
    return () => observer.disconnect();
  }, []);

  const handleCalculate = () => {
    const life = calcLifePath(birthDate);
    const character = calcCharacter(birthDate);
    const destiny = calcDestiny(birthDate);
    if (life && character && destiny) {
      setResult({ life, character, destiny });
      setTimeout(() => {
        document.getElementById("result-section")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
      if (getToken()) {
        saveCalculation(birthDate, life, character, destiny);
      }
    }
  };

  return (
    <div className="min-h-screen relative" style={{ backgroundColor: "#080C1F" }}>
      <FloatingNumbers />
      <div className="grid-pattern fixed inset-0 pointer-events-none z-0" />

      <Navbar />

      <main className="relative z-10 pt-20">
        <HeroSection calcRef={calcRef} />

        <CalcSection
          calcRef={calcRef}
          calcVisible={calcVisible}
          birthDate={birthDate}
          birthTime={birthTime}
          onBirthDateChange={setBirthDate}
          onBirthTimeChange={setBirthTime}
          onCalculate={handleCalculate}
        />

        {result && <ResultSection result={result} />}

        <InfoSections calcRef={calcRef} />

        <Footer />
      </main>
    </div>
  );
}