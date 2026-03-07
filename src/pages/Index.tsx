import { useState, useEffect, useRef } from "react";
import Icon from "@/components/ui/icon";

const DESCRIPTIONS: Record<number, {
  title: string;
  tagline: string;
  character: string;
  strengths: string[];
  challenges: string[];
  career: string;
  relationships: string;
}> = {
  1: {
    title: "Лидер",
    tagline: "Первооткрыватель и движущая сила",
    character: "Вы рождены, чтобы вести за собой. Сильная воля, независимость и амбиции — ваши главные инструменты. Вы интуитивно находите новые пути и вдохновляете других своим примером.",
    strengths: ["Лидерство и инициатива", "Независимость мышления", "Высокая мотивация", "Творческий потенциал"],
    challenges: ["Склонность к доминированию", "Нетерпеливость", "Сложности с делегированием"],
    career: "Предпринимательство, управление, творческие профессии, политика",
    relationships: "Ищете равноценного партнёра. Цените самостоятельность и уважение к вашему пространству."
  },
  2: {
    title: "Дипломат",
    tagline: "Хранитель гармонии и связей",
    character: "Тонкая интуиция и эмпатия — ваши суперсилы. Вы видите то, что скрыто от других, и умеете создавать мосты между людьми. Ваша сила — в чуткости и дипломатичности.",
    strengths: ["Глубокая эмпатия", "Дипломатичность", "Интуиция", "Умение слушать"],
    challenges: ["Нерешительность", "Зависимость от чужого мнения", "Чрезмерная чувствительность"],
    career: "Психология, медицина, дипломатия, искусство, педагогика",
    relationships: "Идеальный партнёр — внимательный и заботливый. Вам важна глубокая эмоциональная связь."
  },
  3: {
    title: "Творец",
    tagline: "Выразитель красоты и идей",
    character: "Вы — источник творческой энергии и оптимизма. Ваш дар — превращать идеи в реальность через слово, образ и действие. Общение для вас — это искусство.",
    strengths: ["Творческое мышление", "Коммуникабельность", "Оптимизм", "Харизма"],
    challenges: ["Рассеянность", "Непостоянство", "Поверхностность в деталях"],
    career: "Искусство, медиа, маркетинг, педагогика, журналистика",
    relationships: "Притягиваете людей своей энергией. Нужен партнёр, который ценит вашу свободу самовыражения."
  },
  4: {
    title: "Архитектор",
    tagline: "Строитель надёжных систем",
    character: "Ваша сила — в системности, надёжности и практичности. Вы создаёте прочные основы там, где другие видят лишь хаос. Дисциплина и методичность — ваши главные качества.",
    strengths: ["Надёжность и стабильность", "Системное мышление", "Трудолюбие", "Практичность"],
    challenges: ["Ригидность мышления", "Сопротивление переменам", "Чрезмерный перфекционизм"],
    career: "Строительство, финансы, инженерия, управление проектами, наука",
    relationships: "Цените стабильность и преданность. Партнёр должен разделять ваши ценности и быть надёжным."
  },
  5: {
    title: "Исследователь",
    tagline: "Искатель перемен и свободы",
    character: "Свобода и разнообразие — ваша жизненная философия. Вы адаптируетесь к любым условиям и умеете извлекать урок из каждого опыта. Ваш ум — острый и многогранный.",
    strengths: ["Адаптивность", "Любознательность", "Коммуникабельность", "Смелость"],
    challenges: ["Непостоянство", "Импульсивность", "Сложность в обязательствах"],
    career: "Путешествия, продажи, журналистика, консалтинг, предпринимательство",
    relationships: "Вам нужен партнёр, который понимает вашу потребность в пространстве и приключениях."
  },
  6: {
    title: "Хранитель",
    tagline: "Создатель гармонии и уюта",
    character: "Забота, любовь и ответственность — это ваша природа. Вы создаёте гармонию вокруг себя и несёте свет в жизнь других. Ваш дом — крепость любви и поддержки.",
    strengths: ["Ответственность", "Сострадание", "Эстетический вкус", "Верность"],
    challenges: ["Жертвенность", "Чрезмерный контроль", "Тревожность о близких"],
    career: "Медицина, педагогика, социальная работа, дизайн, кулинария",
    relationships: "Идеальный партнёр и родитель. Для вас важны глубокая привязанность и семейные ценности."
  },
  7: {
    title: "Мыслитель",
    tagline: "Искатель истины и глубины",
    character: "Вы рождены искать скрытый смысл. Ваш интеллект и аналитические способности позволяют видеть то, что недоступно другим. Одиночество для вас — источник силы, а не слабости.",
    strengths: ["Аналитическое мышление", "Интуиция", "Духовная глубина", "Мудрость"],
    challenges: ["Замкнутость", "Перфекционизм", "Сложность в общении"],
    career: "Наука, исследования, философия, психология, технологии",
    relationships: "Цените интеллектуальную совместимость. Партнёр должен уважать вашу потребность в уединении."
  },
  8: {
    title: "Магнат",
    tagline: "Архитектор успеха и влияния",
    character: "Власть, достижения и материальный успех — ваша территория. Вы обладаете редким даром организатора и стратега. Ваша сила притягивает ресурсы и возможности.",
    strengths: ["Амбициозность", "Стратегическое мышление", "Лидерство", "Решительность"],
    challenges: ["Властолюбие", "Материализм", "Сложность с эмпатией"],
    career: "Бизнес, финансы, право, политика, управление",
    relationships: "Ищете партнёра, способного разделить ваши амбиции. Важны статус и взаимное уважение."
  },
  9: {
    title: "Мудрец",
    tagline: "Проводник человечества",
    character: "Вы несёте в себе мудрость всех предыдущих чисел. Широкий кругозор, гуманизм и глубокое понимание жизни делают вас естественным наставником и вдохновителем.",
    strengths: ["Мудрость и зрелость", "Гуманизм", "Творческий потенциал", "Харизма"],
    challenges: ["Идеализм", "Сложность с практическими делами", "Разбросанность"],
    career: "Искусство, духовное лидерство, благотворительность, образование, медицина",
    relationships: "Любите всё человечество, но вам важен партнёр с такой же широтой души и пониманием."
  },
  11: {
    title: "Провидец",
    tagline: "Мастер-число: Интуиция и вдохновение",
    character: "Число 11 — одно из мастер-чисел. Вы обладаете исключительной интуицией и способностью вдохновлять других. Ваша миссия — нести свет и пробуждать сознание.",
    strengths: ["Мощная интуиция", "Вдохновение других", "Духовная чувствительность", "Харизма"],
    challenges: ["Нервность и тревожность", "Высокие требования к себе", "Эмоциональная нестабильность"],
    career: "Искусство, духовные практики, консультирование, творчество",
    relationships: "Ищете глубокую духовную связь. Обычные отношения вам кажутся поверхностными."
  },
  22: {
    title: "Мастер-строитель",
    tagline: "Мастер-число: Воплощение великого",
    character: "22 — самое мощное из мастер-чисел. Вы способны превращать грандиозные мечты в реальность. Ваш потенциал — строить то, что меняет мир.",
    strengths: ["Грандиозное видение", "Практическая сила", "Организаторский талант", "Настойчивость"],
    challenges: ["Огромная ответственность", "Страх провала", "Перфекционизм"],
    career: "Архитектура, политика, крупный бизнес, международные организации",
    relationships: "Вам нужен партнёр, способный понять масштаб вашей личности и ваших целей."
  }
};

function reduce(n: number): number {
  if (n === 11 || n === 22) return n;
  if (n <= 9) return n;
  const sum = String(n).split("").reduce((a, d) => a + parseInt(d), 0);
  return reduce(sum);
}

function calcLifePath(date: string): number | null {
  if (!date) return null;
  const [y, m, d] = date.split("-").map(Number);
  if (!y || !m || !d) return null;
  const digits = [...String(d), ...String(m), ...String(y)].map(Number);
  const sum = digits.reduce((a, b) => a + b, 0);
  return reduce(sum);
}

function calcCharacter(date: string): number | null {
  if (!date) return null;
  const day = parseInt(date.split("-")[2]);
  return reduce(day);
}

function calcDestiny(date: string): number | null {
  if (!date) return null;
  const [y, m, d] = date.split("-").map(Number);
  const sum = reduce(d) + reduce(m) + reduce(y);
  return reduce(sum);
}

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

const GoldDivider = () => (
  <div className="w-full my-16 md:my-24 px-6">
    <div className="section-divider w-full" />
  </div>
);

export default function Index() {
  const [birthDate, setBirthDate] = useState("");
  const [birthTime, setBirthTime] = useState("");
  const [result, setResult] = useState<{ life: number; character: number; destiny: number } | null>(null);
  const [activeNav, setActiveNav] = useState("Главная");
  const [menuOpen, setMenuOpen] = useState(false);
  const [calcVisible, setCalcVisible] = useState(false);
  const calcRef = useRef<HTMLDivElement>(null);

  const navItems = ["Главная", "Калькулятор", "Анализ", "Совместимость", "Методология"];

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
    }
  };

  const desc = result ? DESCRIPTIONS[result.life] : null;

  return (
    <div className="min-h-screen relative" style={{ backgroundColor: "#080C1F" }}>
      <FloatingNumbers />
      <div className="grid-pattern fixed inset-0 pointer-events-none z-0" />

      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50" style={{ background: "rgba(8,12,31,0.92)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(201,168,76,0.1)" }}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 number-circle flex items-center justify-center">
              <span className="font-cormorant text-lg font-bold" style={{ color: "#C9A84C" }}>М</span>
            </div>
            <span className="font-cormorant text-xl font-semibold" style={{ color: "#F5D98B", letterSpacing: "0.05em" }}>
              Матрица личности
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            {navItems.map(item => (
              <button
                key={item}
                onClick={() => setActiveNav(item)}
                className="font-golos text-sm transition-all duration-300"
                style={{ color: activeNav === item ? "#C9A84C" : "rgba(245,217,139,0.5)", letterSpacing: "0.03em" }}
              >
                {item}
              </button>
            ))}
          </div>
          <button
            className="hidden md:block px-5 py-2 font-golos text-sm font-medium transition-all duration-300 hover:scale-105"
            style={{
              background: "linear-gradient(135deg, #8B6914, #C9A84C, #F5D98B)",
              color: "#080C1F",
              borderRadius: "4px",
              letterSpacing: "0.05em"
            }}
          >
            Войти
          </button>
          <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)} style={{ color: "#C9A84C" }}>
            <Icon name={menuOpen ? "X" : "Menu"} size={22} />
          </button>
        </div>
        {menuOpen && (
          <div className="md:hidden px-6 pb-4 flex flex-col gap-4" style={{ borderTop: "1px solid rgba(201,168,76,0.1)" }}>
            {navItems.map(item => (
              <button key={item} onClick={() => { setActiveNav(item); setMenuOpen(false); }}
                className="font-golos text-sm text-left py-1" style={{ color: "rgba(245,217,139,0.7)" }}>
                {item}
              </button>
            ))}
          </div>
        )}
      </nav>

      <main className="relative z-10 pt-20">

        {/* HERO */}
        <section className="min-h-screen flex items-center justify-center px-6 py-20 relative overflow-hidden">
          <div className="absolute inset-0">
            <img
              src="https://cdn.poehali.dev/projects/160118d3-d90f-495c-ac4b-3eb880cb7af1/files/acb3c144-ac1a-40d9-9266-2cac05a463b5.jpg"
              alt="Матрица чисел"
              className="w-full h-full object-cover"
              style={{ opacity: 0.2 }}
            />
            <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, transparent 0%, rgba(8,12,31,0.7) 60%, #080C1F 100%)" }} />
          </div>

          <div className="max-w-4xl mx-auto text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 animate-fade-up opacity-0"
              style={{ background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.25)", borderRadius: "2px" }}>
              <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: "#C9A84C" }} />
              <span className="font-golos text-xs tracking-widest uppercase" style={{ color: "#C9A84C" }}>
                Алгоритмический анализ личности
              </span>
            </div>

            <h1 className="font-cormorant font-light mb-6 animate-fade-up opacity-0 delay-100"
              style={{ fontSize: "clamp(3rem, 8vw, 6rem)", lineHeight: 1.05, color: "#F5D98B" }}>
              Матрица
              <br />
              <span className="font-cormorant italic" style={{ color: "#FFFFFF" }}>личности</span>
            </h1>

            <p className="font-golos text-lg md:text-xl mb-3 animate-fade-up opacity-0 delay-200"
              style={{ color: "rgba(245,217,139,0.6)", fontWeight: 300, letterSpacing: "0.02em" }}>
              Узнайте свой числовой код
            </p>
            <p className="font-golos mb-12 max-w-2xl mx-auto animate-fade-up opacity-0 delay-300"
              style={{ color: "rgba(255,255,255,0.45)", fontSize: "1rem", lineHeight: 1.7 }}>
              Алгоритмический анализ характера, потенциала и жизненных циклов по дате рождения.
              Основано на математических моделях и нумерологии Пифагора.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up opacity-0 delay-400">
              <button
                onClick={() => calcRef.current?.scrollIntoView({ behavior: "smooth" })}
                className="px-8 py-4 font-golos font-medium text-sm tracking-widest uppercase transition-all duration-300 hover:scale-105"
                style={{
                  background: "linear-gradient(135deg, #8B6914, #C9A84C, #F5D98B)",
                  color: "#080C1F",
                  borderRadius: "3px",
                  boxShadow: "0 8px 32px rgba(201,168,76,0.3)"
                }}
              >
                Рассчитать бесплатно
              </button>
              <button
                className="px-8 py-4 font-golos text-sm tracking-widest uppercase transition-all duration-300 hover:scale-105"
                style={{
                  background: "transparent",
                  color: "#C9A84C",
                  border: "1px solid rgba(201,168,76,0.4)",
                  borderRadius: "3px"
                }}
              >
                Узнать методологию
              </button>
            </div>

            <div className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto animate-fade-up opacity-0 delay-500">
              {[["50 000+", "расчётов"], ["98%", "точность"], ["9 типов", "личности"]].map(([val, label]) => (
                <div key={label} className="text-center">
                  <div className="font-cormorant text-2xl md:text-3xl font-semibold mb-1" style={{ color: "#C9A84C" }}>{val}</div>
                  <div className="font-golos text-xs" style={{ color: "rgba(255,255,255,0.35)", letterSpacing: "0.05em" }}>{label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
            <Icon name="ChevronDown" size={20} style={{ color: "rgba(201,168,76,0.4)" }} />
          </div>
        </section>

        {/* CALCULATOR */}
        <section ref={calcRef} className="px-6 py-20 max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="font-golos text-xs tracking-widest uppercase mb-3 block" style={{ color: "#C9A84C" }}>
              Персональный расчёт
            </span>
            <h2 className="font-cormorant text-4xl md:text-5xl font-light mb-4" style={{ color: "#F5D98B" }}>
              Ваш числовой код
            </h2>
            <p className="font-golos" style={{ color: "rgba(255,255,255,0.4)", maxWidth: "500px", margin: "0 auto", lineHeight: 1.7 }}>
              Введите дату рождения — алгоритм рассчитает ваш уникальный числовой профиль
            </p>
          </div>

          <div
            className="max-w-2xl mx-auto glass-card p-8 md:p-12 transition-all duration-1000"
            style={{
              borderRadius: "8px",
              opacity: calcVisible ? 1 : 0,
              transform: calcVisible ? "translateY(0)" : "translateY(3rem)"
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="font-golos text-xs tracking-widest uppercase mb-3 block" style={{ color: "rgba(201,168,76,0.7)" }}>
                  Дата рождения *
                </label>
                <input
                  type="date"
                  value={birthDate}
                  onChange={e => setBirthDate(e.target.value)}
                  className="w-full px-4 py-3 font-golos text-sm outline-none"
                  style={{
                    background: "rgba(8,12,31,0.8)",
                    border: "1px solid rgba(201,168,76,0.25)",
                    borderRadius: "4px",
                    color: "#F5D98B",
                    colorScheme: "dark"
                  }}
                />
              </div>
              <div>
                <label className="font-golos text-xs tracking-widest uppercase mb-3 block" style={{ color: "rgba(201,168,76,0.7)" }}>
                  Время рождения (необязательно)
                </label>
                <input
                  type="time"
                  value={birthTime}
                  onChange={e => setBirthTime(e.target.value)}
                  className="w-full px-4 py-3 font-golos text-sm outline-none"
                  style={{
                    background: "rgba(8,12,31,0.8)",
                    border: "1px solid rgba(201,168,76,0.15)",
                    borderRadius: "4px",
                    color: "rgba(245,217,139,0.6)",
                    colorScheme: "dark"
                  }}
                />
              </div>
            </div>

            <button
              onClick={handleCalculate}
              disabled={!birthDate}
              className="w-full py-4 font-golos font-medium text-sm tracking-widest uppercase transition-all duration-300"
              style={{
                background: birthDate ? "linear-gradient(135deg, #8B6914, #C9A84C, #F5D98B)" : "rgba(201,168,76,0.15)",
                color: birthDate ? "#080C1F" : "rgba(201,168,76,0.4)",
                borderRadius: "4px",
                boxShadow: birthDate ? "0 8px 32px rgba(201,168,76,0.25)" : "none",
                cursor: birthDate ? "pointer" : "not-allowed"
              }}
            >
              Рассчитать матрицу личности
            </button>

            <p className="text-center mt-4 font-golos text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>
              Базовый расчёт — бесплатно · Полный анализ — после регистрации
            </p>
          </div>
        </section>

        {/* RESULT */}
        {result && desc && (
          <section id="result-section" className="px-6 pb-20 max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 mb-6"
                style={{ background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.2)", borderRadius: "2px" }}>
                <Icon name="Sparkles" size={14} style={{ color: "#C9A84C" }} />
                <span className="font-golos text-xs tracking-widest uppercase" style={{ color: "#C9A84C" }}>Ваш результат</span>
              </div>
              <h2 className="font-cormorant text-4xl md:text-6xl font-light mb-2" style={{ color: "#F5D98B" }}>
                {desc.title}
              </h2>
              <p className="font-cormorant italic text-xl" style={{ color: "rgba(201,168,76,0.6)" }}>
                {desc.tagline}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[
                { label: "Число жизненного пути", value: result.life, icon: "Compass", d: "Ваша главная миссия и потенциал" },
                { label: "Число характера", value: result.character, icon: "User", d: "Ваша истинная природа" },
                { label: "Число судьбы", value: result.destiny, icon: "Star", d: "Ваш жизненный вектор" },
              ].map(({ label, value, icon, d }) => (
                <div key={label} className="glass-card p-6 text-center" style={{ borderRadius: "6px" }}>
                  <div className="w-12 h-12 number-circle flex items-center justify-center mx-auto mb-4">
                    <Icon name={icon} size={20} style={{ color: "#C9A84C" }} />
                  </div>
                  <div className="font-cormorant text-6xl font-light mb-2" style={{ color: "#C9A84C" }}>{value}</div>
                  <div className="font-golos text-sm font-medium mb-1" style={{ color: "#F5D98B" }}>{label}</div>
                  <div className="font-golos text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>{d}</div>
                </div>
              ))}
            </div>

            <div className="glass-card p-8 md:p-10 mb-6" style={{ borderRadius: "8px" }}>
              <h3 className="font-cormorant text-2xl mb-4" style={{ color: "#F5D98B" }}>Характеристика личности</h3>
              <p className="font-golos leading-relaxed" style={{ color: "rgba(255,255,255,0.7)", lineHeight: 1.8 }}>
                {desc.character}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="glass-card p-6" style={{ borderRadius: "6px" }}>
                <div className="flex items-center gap-2 mb-4">
                  <Icon name="TrendingUp" size={16} style={{ color: "#C9A84C" }} />
                  <h3 className="font-cormorant text-xl" style={{ color: "#F5D98B" }}>Сильные стороны</h3>
                </div>
                <ul className="space-y-2">
                  {desc.strengths.map(s => (
                    <li key={s} className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: "#C9A84C" }} />
                      <span className="font-golos text-sm" style={{ color: "rgba(255,255,255,0.65)" }}>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="glass-card p-6" style={{ borderRadius: "6px" }}>
                <div className="flex items-center gap-2 mb-4">
                  <Icon name="AlertCircle" size={16} style={{ color: "rgba(201,168,76,0.6)" }} />
                  <h3 className="font-cormorant text-xl" style={{ color: "#F5D98B" }}>Зоны роста</h3>
                </div>
                <ul className="space-y-2">
                  {desc.challenges.map(c => (
                    <li key={c} className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: "rgba(201,168,76,0.4)" }} />
                      <span className="font-golos text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="glass-card p-6" style={{ borderRadius: "6px" }}>
                <div className="flex items-center gap-2 mb-4">
                  <Icon name="Briefcase" size={16} style={{ color: "#C9A84C" }} />
                  <h3 className="font-cormorant text-xl" style={{ color: "#F5D98B" }}>Карьера и призвание</h3>
                </div>
                <p className="font-golos text-sm" style={{ color: "rgba(255,255,255,0.6)", lineHeight: 1.7 }}>{desc.career}</p>
              </div>

              <div className="glass-card p-6" style={{ borderRadius: "6px" }}>
                <div className="flex items-center gap-2 mb-4">
                  <Icon name="Heart" size={16} style={{ color: "#C9A84C" }} />
                  <h3 className="font-cormorant text-xl" style={{ color: "#F5D98B" }}>Отношения</h3>
                </div>
                <p className="font-golos text-sm" style={{ color: "rgba(255,255,255,0.6)", lineHeight: 1.7 }}>{desc.relationships}</p>
              </div>
            </div>

            <div className="glass-card p-8 text-center"
              style={{ borderRadius: "8px", background: "rgba(201,168,76,0.05)", border: "1px solid rgba(201,168,76,0.2)" }}>
              <div className="w-16 h-16 number-circle flex items-center justify-center mx-auto mb-4">
                <Icon name="Lock" size={24} style={{ color: "#C9A84C" }} />
              </div>
              <h3 className="font-cormorant text-2xl mb-2" style={{ color: "#F5D98B" }}>Получите полный анализ</h3>
              <p className="font-golos text-sm mb-6" style={{ color: "rgba(255,255,255,0.45)", maxWidth: "400px", margin: "0 auto 24px" }}>
                Жизненные циклы, энергия года, PDF-отчёт на 20 страниц, совместимость с партнёром
              </p>
              <button
                className="px-10 py-4 font-golos font-medium text-sm tracking-widest uppercase transition-all duration-300 hover:scale-105"
                style={{
                  background: "linear-gradient(135deg, #8B6914, #C9A84C, #F5D98B)",
                  color: "#080C1F",
                  borderRadius: "3px",
                  boxShadow: "0 8px 32px rgba(201,168,76,0.3)"
                }}
              >
                Получить полный анализ — 490 ₽
              </button>
            </div>
          </section>
        )}

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
              { icon: "Heart", title: "Отношения и любовь", desc: "Паттерны в отношениях, совместимость, тип идеального партнёра" },
              { icon: "Activity", title: "Жизненные циклы", desc: "Три цикла жизни: благоприятные периоды для решений и изменений" },
              { icon: "Zap", title: "Энергия года", desc: "Личный год — что несёт текущий период вашей жизни" },
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { title: "Базовый", price: "Бесплатно", items: ["Число личности", "Число характера", "Краткое описание"], accent: false },
              { title: "Анализ личности", price: "490 ₽", items: ["PDF-отчёт 20 стр.", "Все числа матрицы", "Жизненные циклы", "Энергия года"], accent: true },
              { title: "Совместимость", price: "690 ₽", items: ["Анализ пары", "Числа совместимости", "Советы по отношениям", "PDF-отчёт"], accent: false },
              { title: "Анализ ребёнка", price: "990 ₽", items: ["Профиль ребёнка", "Таланты и способности", "Советы родителям", "PDF-отчёт"], accent: false },
            ].map(({ title, price, items, accent }) => (
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
                <div className="font-cormorant text-3xl font-semibold mb-4" style={{ color: "#C9A84C" }}>{price}</div>
                <ul className="space-y-2 flex-1 mb-6">
                  {items.map(item => (
                    <li key={item} className="flex items-center gap-2">
                      <Icon name="Check" size={13} style={{ color: "#C9A84C" }} />
                      <span className="font-golos text-xs" style={{ color: "rgba(255,255,255,0.55)" }}>{item}</span>
                    </li>
                  ))}
                </ul>
                <button
                  className="w-full py-3 font-golos text-xs font-medium tracking-widest uppercase transition-all duration-300"
                  style={{
                    background: accent ? "linear-gradient(135deg, #8B6914, #C9A84C, #F5D98B)" : "transparent",
                    color: accent ? "#080C1F" : "#C9A84C",
                    border: accent ? "none" : "1px solid rgba(201,168,76,0.3)",
                    borderRadius: "3px"
                  }}
                >
                  {price === "Бесплатно" ? "Попробовать" : "Получить"}
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

        {/* FOOTER */}
        <footer className="px-6 py-10" style={{ borderTop: "1px solid rgba(201,168,76,0.1)" }}>
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 number-circle flex items-center justify-center">
                <span className="font-cormorant text-base font-bold" style={{ color: "#C9A84C" }}>М</span>
              </div>
              <span className="font-cormorant text-lg" style={{ color: "#F5D98B", letterSpacing: "0.05em" }}>Матрица личности</span>
            </div>
            <div className="flex gap-6 flex-wrap justify-center">
              {["Главная", "Методология", "Блог", "Контакты", "Политика конфиденциальности"].map(item => (
                <a key={item} href="#" className="font-golos text-xs transition-colors hover:text-gold"
                  style={{ color: "rgba(255,255,255,0.3)", letterSpacing: "0.03em" }}>
                  {item}
                </a>
              ))}
            </div>
            <div className="font-golos text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>
              © 2024 personmatrix.ru
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}