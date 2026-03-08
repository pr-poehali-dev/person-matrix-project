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
        {/* Блок 1 — Первый экран */}
        <section className="gradient-soft py-24 sm:py-32">
          <div className="max-w-2xl mx-auto px-5 text-center">
            <h1 className="font-golos text-4xl sm:text-5xl font-bold text-[#4A3D7A] tracking-tight leading-tight opacity-0 animate-fade-up">
              Поймите себя, свои сильные стороны и потенциал
            </h1>
            <p className="mt-6 font-golos text-base sm:text-lg text-gray-500 leading-relaxed opacity-0 animate-fade-up delay-200">
              Платформа психологического анализа личности, отношений и семьи.
              Все тесты и инструменты основаны на продуманных алгоритмах анализа поведения, мышления и жизненных моделей.
            </p>
            <button
              onClick={() => navigate("/test/personality")}
              className="mt-10 inline-flex items-center gap-2 gradient-primary text-white font-golos text-sm font-medium px-8 py-3.5 rounded-xl transition-all duration-200 hover:opacity-90 active:scale-[0.97] opacity-0 animate-fade-up delay-300"
            >
              Пройти бесплатный тест
              <Icon name="ArrowRight" size={16} />
            </button>
          </div>
        </section>

        {/* Блок 2 — О платформе */}
        <section className="py-16 sm:py-20 px-5 bg-white">
          <div className="max-w-2xl mx-auto">
            <p className="font-golos text-lg sm:text-xl text-[#4A3D7A] font-semibold leading-snug mb-4">
              Каждый человек уникален.
            </p>
            <p className="font-golos text-base text-gray-500 leading-relaxed mb-8">
              У каждого есть свои сильные стороны, особенности характера, внутренние мотивации и жизненные сценарии.
            </p>
            <p className="font-golos text-sm text-gray-400 uppercase tracking-wider mb-4">Наша платформа помогает лучше понять:</p>
            <ul className="space-y-3">
              {[
                "особенности вашей личности",
                "сильные стороны характера",
                "потенциал развития",
                "модели поведения в отношениях",
                "влияние семьи и воспитания",
                "особенности характера детей",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 font-golos text-base text-gray-600">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#6C5BA7] flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-8 font-golos text-base text-gray-500 leading-relaxed">
              Все тесты и аналитические инструменты платформы созданы для глубокого самоанализа и понимания себя.
            </p>
          </div>
        </section>

        {/* Блок 3 — Как работает платформа */}
        <section className="py-16 sm:py-20 px-5 bg-[#F9F7FF]">
          <div className="max-w-2xl mx-auto">
            <h2 className="font-golos text-2xl sm:text-3xl font-bold text-[#4A3D7A] mb-4">
              Как работает платформа
            </h2>
            <p className="font-golos text-base text-gray-500 leading-relaxed mb-6">
              Мы используем системный подход к анализу личности. Каждый тест и инструмент основан на специально разработанных алгоритмах, которые анализируют:
            </p>
            <ul className="space-y-3 mb-8">
              {[
                "ответы пользователя",
                "поведенческие модели",
                "психологические паттерны",
                "особенности принятия решений",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 font-golos text-base text-gray-600">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#6C5BA7] flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="font-golos text-base text-gray-500 leading-relaxed mb-6">
              Это позволяет получить структурированный анализ личности и жизненных особенностей.
            </p>
            <div className="bg-white border border-[#6C5BA7]/15 rounded-2xl p-6">
              <p className="font-golos text-sm text-gray-400 uppercase tracking-wider mb-2">Важно</p>
              <p className="font-golos text-base text-gray-600 leading-relaxed">
                Платформа <span className="font-semibold text-[#4A3D7A]">не использует искусственный интеллект для генерации результатов</span>. Все результаты формируются на основе заранее разработанных алгоритмов анализа.
              </p>
            </div>
          </div>
        </section>

        {/* Блок 4 — Что вы сможете узнать */}
        <section className="py-16 sm:py-20 px-5 bg-white">
          <div className="max-w-2xl mx-auto">
            <h2 className="font-golos text-2xl sm:text-3xl font-bold text-[#4A3D7A] mb-10">
              Что вы сможете узнать
            </h2>
            <div className="grid sm:grid-cols-2 gap-6">
              {[
                {
                  icon: "User",
                  title: "Себя",
                  items: ["сильные стороны личности", "особенности мышления", "внутренние мотивации", "зоны развития"],
                },
                {
                  icon: "Heart",
                  title: "Отношения",
                  items: ["модель поведения в отношениях", "эмоциональные потребности", "возможные точки конфликтов"],
                },
                {
                  icon: "Home",
                  title: "Семью",
                  items: ["особенности взаимодействия в семье", "влияние родителей на развитие ребёнка"],
                },
                {
                  icon: "Star",
                  title: "Детей",
                  items: ["характер и тип личности ребёнка", "сильные стороны и склонности", "особенности обучения и развития"],
                },
              ].map(({ icon, title, items }) => (
                <div key={title} className="bg-[#F9F7FF] rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-lg bg-[#6C5BA7]/10 flex items-center justify-center">
                      <Icon name={icon} size={18} className="text-[#6C5BA7]" />
                    </div>
                    <h3 className="font-golos text-base font-semibold text-[#4A3D7A]">{title}</h3>
                  </div>
                  <ul className="space-y-2">
                    {items.map((item) => (
                      <li key={item} className="flex items-start gap-2.5 font-golos text-sm text-gray-500">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#6C5BA7]/50 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Блок 5 — Почему это полезно */}
        <section className="py-16 sm:py-20 px-5 bg-[#F9F7FF]">
          <div className="max-w-2xl mx-auto">
            <h2 className="font-golos text-2xl sm:text-3xl font-bold text-[#4A3D7A] mb-6">
              Почему это полезно
            </h2>
            <p className="font-golos text-base text-gray-500 leading-relaxed mb-6">
              Понимание своих особенностей помогает:
            </p>
            <ul className="space-y-3 mb-8">
              {[
                "принимать более осознанные решения",
                "лучше выстраивать отношения",
                "использовать сильные стороны характера",
                "развивать свой потенциал",
                "лучше понимать детей и их потребности",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 font-golos text-base text-gray-600">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#6C5BA7] flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="font-golos text-base text-gray-500 leading-relaxed">
              Психологический самоанализ — это инструмент, который помогает человеку расти и развиваться.
            </p>
          </div>
        </section>

        {/* Блок 6 — Тест */}
        <section className="py-16 sm:py-20 px-5 bg-white">
          <div className="max-w-lg mx-auto">
            <div className="bg-white rounded-2xl soft-shadow p-8 sm:p-10 text-center transition-shadow duration-300 hover:soft-shadow-hover">
              <div className="w-14 h-14 rounded-xl bg-[#6C5BA7]/10 flex items-center justify-center mx-auto mb-6">
                <Icon name="Sparkles" size={28} className="text-[#6C5BA7]" />
              </div>
              <h2 className="font-golos text-xl sm:text-2xl font-semibold text-[#4A3D7A]">
                Определите свой тип личности
              </h2>
              <p className="mt-3 font-golos text-sm sm:text-base text-gray-400 leading-relaxed">
                Пройдите короткий тест и получите первый анализ ваших особенностей характера и мышления. Тест занимает всего несколько минут и поможет лучше понять свои сильные стороны.
              </p>
              <button
                onClick={() => navigate("/test/personality")}
                className="mt-8 inline-flex items-center gap-2 gradient-primary text-white font-golos text-sm font-medium px-7 py-3 rounded-xl transition-all duration-200 hover:opacity-90 active:scale-[0.97]"
              >
                Пройти бесплатный тест
                <Icon name="ArrowRight" size={16} />
              </button>
            </div>
          </div>
        </section>

        {/* Блок 7 — Все тесты и инструменты */}
        <section className="py-16 sm:py-20 px-5 bg-[#F9F7FF]">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-golos text-2xl sm:text-3xl font-bold text-[#4A3D7A] mb-4">
              Все тесты и инструменты
            </h2>
            <p className="font-golos text-base text-gray-500 leading-relaxed mb-4">
              На платформе доступны различные тесты и аналитические инструменты, которые помогают глубже понять себя и свою жизнь.
            </p>
            <p className="font-golos text-sm text-gray-400 mb-6">Вы можете исследовать:</p>
            <div className="flex flex-wrap justify-center gap-3 mb-10">
              {[
                "особенности личности",
                "жизненные цели и потенциал",
                "модели отношений",
                "семейную динамику",
                "характер и развитие детей",
              ].map((tag) => (
                <span
                  key={tag}
                  className="font-golos text-sm text-[#6C5BA7] bg-[#6C5BA7]/8 border border-[#6C5BA7]/15 px-4 py-1.5 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
            <button
              onClick={() => navigate("/catalog")}
              className="inline-flex items-center gap-2 font-golos text-sm font-medium text-[#6C5BA7] bg-[#6C5BA7]/8 hover:bg-[#6C5BA7]/15 border border-[#6C5BA7]/15 px-6 py-3 rounded-xl transition-all duration-200 active:scale-[0.97]"
            >
              Посмотреть все тесты и инструменты
              <Icon name="ChevronRight" size={16} />
            </button>
          </div>
        </section>

        {/* Блок 8 — Для кого эта платформа */}
        <section className="py-16 sm:py-20 px-5 bg-white">
          <div className="max-w-2xl mx-auto">
            <h2 className="font-golos text-2xl sm:text-3xl font-bold text-[#4A3D7A] mb-6">
              Для кого эта платформа
            </h2>
            <p className="font-golos text-base text-gray-500 leading-relaxed mb-6">
              Платформа будет полезна тем, кто хочет:
            </p>
            <ul className="space-y-3 mb-8">
              {[
                "лучше понять себя",
                "разобраться в своих сильных сторонах",
                "улучшить отношения",
                "понять особенности своего ребёнка",
                "получить структурированный психологический анализ личности",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 font-golos text-base text-gray-600">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#6C5BA7] flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="font-golos text-base text-gray-500 leading-relaxed">
              Наши инструменты помогают взглянуть на себя и свою жизнь более осознанно.
            </p>
          </div>
        </section>

        {/* Блок 9 — Завершающий */}
        <section className="py-20 sm:py-28 px-5 gradient-soft">
          <div className="max-w-xl mx-auto text-center">
            <h2 className="font-golos text-2xl sm:text-3xl font-bold text-[#4A3D7A] mb-4">
              Самопознание — это первый шаг к развитию.
            </h2>
            <p className="font-golos text-base text-gray-500 leading-relaxed mb-8">
              Чем лучше человек понимает свои особенности, тем легче ему строить отношения, принимать решения и реализовывать свой потенциал. Начните с простого шага — пройдите первый тест.
            </p>
            <button
              onClick={() => navigate("/test/personality")}
              className="inline-flex items-center gap-2 gradient-primary text-white font-golos text-sm font-medium px-8 py-3.5 rounded-xl transition-all duration-200 hover:opacity-90 active:scale-[0.97]"
            >
              Пройти бесплатный тест
              <Icon name="ArrowRight" size={16} />
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}