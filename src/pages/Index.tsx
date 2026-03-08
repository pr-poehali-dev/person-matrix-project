import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Icon from "@/components/ui/icon";

export default function Index() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main>
        {/* Block 1 — Hero */}
        <section className="gradient-soft py-24 sm:py-32">
          <div className="max-w-2xl mx-auto px-5 text-center">
            <h1 className="font-golos text-4xl sm:text-5xl font-bold text-[#4A3D7A] tracking-tight opacity-0 animate-fade-up">
              Матрица личности
            </h1>
            <p className="mt-5 font-golos text-base sm:text-lg text-gray-500 leading-relaxed opacity-0 animate-fade-up delay-200">
              Платформа для анализа личности, семьи и жизненного потенциала
            </p>
          </div>
        </section>

        {/* Block 2 — Main free test card */}
        <section className="py-16 sm:py-20 px-5">
          <div className="max-w-lg mx-auto">
            <div className="bg-white rounded-2xl soft-shadow p-8 sm:p-10 text-center transition-shadow duration-300 hover:soft-shadow-hover">
              <div className="w-14 h-14 rounded-xl bg-[#6C5BA7]/10 flex items-center justify-center mx-auto mb-6">
                <Icon name="Sparkles" size={28} className="text-[#6C5BA7]" />
              </div>
              <h2 className="font-golos text-xl sm:text-2xl font-semibold text-[#4A3D7A]">
                Тест: Тип вашей личности
              </h2>
              <p className="mt-3 font-golos text-sm sm:text-base text-gray-400 leading-relaxed">
                Определите свой психологический тип и сильные стороны характера
              </p>
              <button
                onClick={() => navigate("/test/personality")}
                className="mt-8 inline-flex items-center gap-2 gradient-primary text-white font-golos text-sm font-medium px-7 py-3 rounded-xl transition-all duration-200 hover:opacity-90 active:scale-[0.97]"
              >
                Пройти тест
                <Icon name="ArrowRight" size={16} />
              </button>
            </div>
          </div>
        </section>

        {/* Block 3 — CTA to catalog */}
        <section className="pb-20 sm:pb-24 px-5">
          <div className="max-w-md mx-auto text-center">
            <p className="font-golos text-base text-gray-500">
              Хотите узнать больше о себе?
            </p>
            <button
              onClick={() => navigate("/catalog")}
              className="mt-5 inline-flex items-center gap-2 font-golos text-sm font-medium text-[#6C5BA7] bg-[#6C5BA7]/8 hover:bg-[#6C5BA7]/15 border border-[#6C5BA7]/15 px-6 py-2.5 rounded-xl transition-all duration-200 active:scale-[0.97]"
            >
              Посмотреть все тесты и инструменты
              <Icon name="ChevronRight" size={16} />
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
