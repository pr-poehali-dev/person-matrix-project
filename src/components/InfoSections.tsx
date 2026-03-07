import { RefObject } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";

const GoldDivider = () => (
  <div className="w-full my-16 md:my-24 px-6">
    <div className="section-divider w-full" />
  </div>
);

type InfoSectionsProps = {
  calcRef: RefObject<HTMLDivElement>;
};

export default function InfoSections({ calcRef }: InfoSectionsProps) {
  const navigate = useNavigate();

  const handleTariff = (title: string) => {
    if (title === "Базовый" || title === "Полный анализ") {
      calcRef.current?.scrollIntoView({ behavior: "smooth" });
    } else if (title === "Совместимость") {
      navigate("/compatibility");
    } else if (title === "Анализ ребёнка") {
      navigate("/child");
    }
  };

  return (
    <>
      <GoldDivider />

      {/* HOW IT WORKS */}
      <section className="px-6 py-20 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="font-golos text-xs tracking-widest uppercase mb-3 block" style={{ color: "#C9A84C" }}>Принцип работы</span>
          <h2 className="font-cormorant text-4xl md:text-5xl font-light" style={{ color: "#F5D98B" }}>Как работает система</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { step: "01", icon: "Calendar", title: "Введите дату", desc: "Укажите дату рождения. Алгоритм извлекает числовые паттерны из вашей даты." },
            { step: "02", icon: "Calculator", title: "Расчёт матрицы", desc: "Математические алгоритмы вычисляют числа жизненного пути, характера и судьбы." },
            { step: "03", icon: "BarChart2", title: "Анализ профиля", desc: "Система формирует детальный психологический профиль с описанием всех аспектов личности." },
          ].map(({ step, icon, title, desc }) => (
            <div key={step} className="relative">
              <div className="font-cormorant text-8xl font-bold absolute -top-4 -left-2 select-none pointer-events-none"
                style={{ color: "rgba(201,168,76,0.06)" }}>{step}</div>
              <div className="glass-card p-6 relative" style={{ borderRadius: "6px" }}>
                <div className="w-10 h-10 number-circle flex items-center justify-center mb-4">
                  <Icon name={icon} size={18} style={{ color: "#C9A84C" }} />
                </div>
                <h3 className="font-cormorant text-xl mb-2" style={{ color: "#F5D98B" }}>{title}</h3>
                <p className="font-golos text-sm" style={{ color: "rgba(255,255,255,0.45)", lineHeight: 1.7 }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <GoldDivider />

      {/* FEATURES */}
      <section className="px-6 py-20 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="font-golos text-xs tracking-widest uppercase mb-3 block" style={{ color: "#C9A84C" }}>Что вы узнаете</span>
          <h2 className="font-cormorant text-4xl md:text-5xl font-light" style={{ color: "#F5D98B" }}>Полный анализ личности</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            { icon: "User", title: "Характер и темперамент", desc: "Глубокий анализ вашей природы, поведенческих паттернов и психотипа" },
            { icon: "TrendingUp", title: "Сильные стороны", desc: "Ваши уникальные таланты и ресурсы для достижения успеха" },
            { icon: "DollarSign", title: "Деньги и карьера", desc: "Числовой код вашего финансового потенциала и профессионального пути" },
            { icon: "Heart", title: "Отношения и совместимость", desc: "Паттерны в отношениях, проверка совместимости с партнёром" },
            { icon: "Activity", title: "Здоровье и энергия", desc: "Уязвимые зоны тела и рекомендации по поддержанию здоровья" },
            { icon: "Zap", title: "Циклы и личный год", desc: "3 жизненных цикла, 4 пика судьбы и энергия текущего года" },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="glass-card p-5 transition-all duration-300 hover:scale-105 cursor-pointer"
              style={{ borderRadius: "6px" }}>
              <div className="w-8 h-8 number-circle flex items-center justify-center mb-3">
                <Icon name={icon} size={15} style={{ color: "#C9A84C" }} />
              </div>
              <h3 className="font-cormorant text-lg mb-1" style={{ color: "#F5D98B" }}>{title}</h3>
              <p className="font-golos text-xs" style={{ color: "rgba(255,255,255,0.4)", lineHeight: 1.7 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <GoldDivider />

      {/* PRICING */}
      <section className="px-6 py-20 max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <span className="font-golos text-xs tracking-widest uppercase mb-3 block" style={{ color: "#C9A84C" }}>Тарифы</span>
          <h2 className="font-cormorant text-4xl md:text-5xl font-light" style={{ color: "#F5D98B" }}>Выберите свой анализ</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { title: "Базовый", subtitle: "Бесплатно", items: ["3 числа матрицы", "Характер личности", "Сильные стороны", "Карьера и отношения"], accent: false, btnText: "Рассчитать" },
            { title: "Полный анализ", subtitle: "490 ₽", items: ["Все 5 чисел матрицы", "Жизненные циклы и пики", "Здоровье и финансы", "Энергия личного года"], accent: true, btnText: "Подробнее" },
            { title: "Совместимость", subtitle: "690 ₽", items: ["Анализ пары", "3 шкалы совместимости", "Советы по отношениям", "Процент совместимости"], accent: false, btnText: "Проверить" },
            { title: "Анализ ребёнка", subtitle: "990 ₽", items: ["Профиль и таланты", "Советы родителям", "Сильные стороны", "Зоны развития"], accent: false, btnText: "Рассчитать" },
          ].map(({ title, subtitle, items, accent, btnText }) => (
            <div key={title}
              className="glass-card p-6 flex flex-col transition-all duration-300 hover:scale-105"
              style={{
                borderRadius: "6px",
                border: accent ? "1px solid rgba(201,168,76,0.4)" : "1px solid rgba(201,168,76,0.12)",
                background: accent ? "rgba(201,168,76,0.08)" : undefined
              }}
            >
              {accent && (
                <div className="text-center mb-3">
                  <span className="font-golos text-xs tracking-widest uppercase px-3 py-1"
                    style={{ background: "rgba(201,168,76,0.2)", color: "#C9A84C", borderRadius: "2px" }}>
                    Популярный
                  </span>
                </div>
              )}
              <h3 className="font-cormorant text-xl mb-1" style={{ color: "#F5D98B" }}>{title}</h3>
              <div className="font-cormorant text-2xl font-semibold mb-4" style={{ color: "#C9A84C" }}>{subtitle}</div>
              <ul className="space-y-2 flex-1 mb-6">
                {items.map(item => (
                  <li key={item} className="flex items-center gap-2">
                    <Icon name="Check" size={13} style={{ color: "#C9A84C" }} />
                    <span className="font-golos text-xs" style={{ color: "rgba(255,255,255,0.55)" }}>{item}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleTariff(title)}
                className="w-full py-3 font-golos text-xs font-medium tracking-widest uppercase transition-all duration-300"
                style={{
                  background: accent ? "linear-gradient(135deg, #8B6914, #C9A84C, #F5D98B)" : "transparent",
                  color: accent ? "#080C1F" : "#C9A84C",
                  border: accent ? "none" : "1px solid rgba(201,168,76,0.3)",
                  borderRadius: "3px"
                }}
              >
                {btnText}
              </button>
            </div>
          ))}
        </div>
      </section>

      <GoldDivider />

      {/* METHODOLOGY */}
      <section className="px-6 py-20 max-w-4xl mx-auto text-center">
        <span className="font-golos text-xs tracking-widest uppercase mb-3 block" style={{ color: "#C9A84C" }}>Научная база</span>
        <h2 className="font-cormorant text-4xl md:text-5xl font-light mb-8" style={{ color: "#F5D98B" }}>Методология</h2>
        <p className="font-golos mb-10 leading-relaxed" style={{ color: "rgba(255,255,255,0.5)", fontSize: "1rem", lineHeight: 1.8 }}>
          Система основана на математических методах анализа, разработанных Пифагором и развитых Чейро.
          Современные алгоритмы обрабатывают числовые паттерны даты рождения, выявляя устойчивые
          психологические характеристики, подтверждённые исследованиями в области психологии личности.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { name: "Пифагор", role: "Математическая нумерология" },
            { name: "Чейро", role: "Практическая нумерология" },
            { name: "К.Г. Юнг", role: "Типология личности" },
            { name: "Алгоритм", role: "Современный анализ" },
          ].map(({ name, role }) => (
            <div key={name} className="glass-card p-4" style={{ borderRadius: "6px" }}>
              <div className="font-cormorant text-lg font-semibold mb-1" style={{ color: "#C9A84C" }}>{name}</div>
              <div className="font-golos text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>{role}</div>
            </div>
          ))}
        </div>
      </section>

      <GoldDivider />

      {/* CTA */}
      <section className="px-6 py-20 text-center relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at center, rgba(201,168,76,0.06) 0%, transparent 70%)" }} />
        <div className="relative z-10 max-w-2xl mx-auto">
          <h2 className="font-cormorant text-4xl md:text-6xl font-light mb-4" style={{ color: "#F5D98B" }}>
            Узнайте свой<br />
            <span className="font-cormorant italic" style={{ color: "#C9A84C" }}>числовой код</span>
          </h2>
          <p className="font-golos mb-8" style={{ color: "rgba(255,255,255,0.4)", lineHeight: 1.7 }}>
            Более 50 000 женщин уже открыли свою матрицу личности.<br />
            Начните с бесплатного расчёта прямо сейчас.
          </p>
          <button
            onClick={() => calcRef.current?.scrollIntoView({ behavior: "smooth" })}
            className="px-12 py-5 font-golos font-medium text-sm tracking-widest uppercase transition-all duration-300 hover:scale-105"
            style={{
              background: "linear-gradient(135deg, #8B6914, #C9A84C, #F5D98B)",
              color: "#080C1F",
              borderRadius: "3px",
              boxShadow: "0 12px 48px rgba(201,168,76,0.35)"
            }}
          >
            Рассчитать бесплатно
          </button>
        </div>
      </section>
    </>
  );
}