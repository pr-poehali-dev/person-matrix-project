import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Icon from "@/components/ui/icon";

const freeTests = [
  {
    title: "Тип вашей личности",
    description: "Определите свой психологический тип и сильные стороны характера",
    icon: "Sparkles",
    link: "/test/personality",
  },
  {
    title: "Ваше предназначение",
    description: "Узнайте свою ключевую жизненную миссию",
    icon: "Compass",
    link: "/test/purpose",
  },
  {
    title: "Какой вы партнёр",
    description: "Раскройте свой стиль в отношениях и любви",
    icon: "Heart",
    link: "/test/partner",
  },
  {
    title: "Какой вы родитель",
    description: "Определите свой стиль воспитания и сильные стороны",
    icon: "Baby",
    link: "/test/parent",
  },
  {
    title: "Тип личности ребёнка",
    description: "Узнайте особенности характера вашего ребёнка",
    icon: "Star",
    link: "/test/child-type",
  },
  {
    title: "Реализация потенциала",
    description: "Оцените, насколько вы раскрываете свои возможности",
    icon: "TrendingUp",
    link: "/test/potential",
  },
];

const instruments = [
  {
    title: "Глубокий анализ личности",
    description: "Полный разбор характера, талантов и скрытого потенциала",
    icon: "Brain",
    price: "490 \u20BD",
    link: "/result",
  },
  {
    title: "Анализ предназначения",
    description: "Детальная карта жизненного пути и ключевых этапов",
    icon: "Map",
    price: "1 490 \u20BD",
    link: "/destiny",
  },
  {
    title: "Анализ отношений",
    description: "Глубокий разбор совместимости и динамики пары",
    icon: "HeartHandshake",
    price: "490 \u20BD",
    link: "/compatibility",
  },
  {
    title: "Анализ семьи",
    description: "Комплексный анализ семейной динамики и ролей",
    icon: "Users",
    price: "990 \u20BD",
    link: "/family",
  },
];

const personalAnalyses = [
  {
    title: "Персональный анализ личности",
    description: "Индивидуальный разбор всех аспектов вашей личности",
    icon: "UserCircle",
    price: "от 490 \u20BD",
    link: "/result",
  },
  {
    title: "Анализ совместимости пары",
    description: "Персональный отчёт о вашей паре",
    icon: "Heart",
    price: "от 490 \u20BD",
    link: "/compatibility",
  },
  {
    title: "Анализ личности ребёнка",
    description: "Персональный анализ характера и потенциала ребёнка",
    icon: "Baby",
    price: "от 490 \u20BD",
    link: "/child",
  },
  {
    title: "Анализ семьи",
    description: "Полный персональный анализ семейной системы",
    icon: "Home",
    price: "от 990 \u20BD",
    link: "/family",
  },
];

interface CardProps {
  title: string;
  description: string;
  icon: string;
  badge: React.ReactNode;
  buttonLabel: string;
  onClick: () => void;
}

function Card({ title, description, icon, badge, buttonLabel, onClick }: CardProps) {
  return (
    <div className="bg-white rounded-2xl soft-shadow p-6 flex flex-col transition-all duration-300 hover:soft-shadow-hover hover:-translate-y-0.5">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="w-11 h-11 rounded-xl bg-[#6C5BA7]/8 flex items-center justify-center shrink-0">
          <Icon name={icon} size={22} className="text-[#6C5BA7]" />
        </div>
        {badge}
      </div>
      <h3 className="font-golos text-base font-semibold text-[#4A3D7A] leading-snug">
        {title}
      </h3>
      <p className="mt-2 font-golos text-sm text-gray-400 leading-relaxed flex-1">
        {description}
      </p>
      <button
        onClick={onClick}
        className="mt-5 w-full inline-flex items-center justify-center gap-1.5 font-golos text-sm font-medium py-2.5 rounded-xl transition-all duration-200 active:scale-[0.97] bg-[#6C5BA7]/8 text-[#6C5BA7] hover:bg-[#6C5BA7]/15"
      >
        {buttonLabel}
        <Icon name="ArrowRight" size={15} />
      </button>
    </div>
  );
}

function FreeBadge() {
  return (
    <span className="inline-flex items-center font-golos text-xs font-medium px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-600">
      Бесплатно
    </span>
  );
}

function PriceBadge({ price }: { price: string }) {
  return (
    <span className="inline-flex items-center font-golos text-xs font-medium px-2.5 py-1 rounded-lg bg-[#F4F2FA] text-[#6C5BA7]">
      {price}
    </span>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-8">
      <div className="w-1 h-7 rounded-full bg-[#6C5BA7]/20" />
      <h2 className="font-golos text-xl sm:text-2xl font-semibold text-[#4A3D7A]">
        {children}
      </h2>
    </div>
  );
}

export default function Catalog() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main>
        {/* Header */}
        <section className="gradient-soft py-16 sm:py-20">
          <div className="max-w-5xl mx-auto px-5 text-center">
            <h1 className="font-golos text-3xl sm:text-4xl font-bold text-[#4A3D7A] tracking-tight opacity-0 animate-fade-up">
              Тесты и инструменты
            </h1>
            <p className="mt-4 font-golos text-base text-gray-500 opacity-0 animate-fade-up delay-200">
              Выберите подходящий инструмент для анализа
            </p>
          </div>
        </section>

        {/* Category 1 — Free tests */}
        <section className="py-14 sm:py-16 px-5">
          <div className="max-w-5xl mx-auto">
            <SectionTitle>Бесплатные тесты</SectionTitle>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {freeTests.map((test) => (
                <Card
                  key={test.title}
                  title={test.title}
                  description={test.description}
                  icon={test.icon}
                  badge={<FreeBadge />}
                  buttonLabel="Пройти"
                  onClick={() => navigate(test.link)}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Category 2 — Instruments */}
        <section className="py-14 sm:py-16 px-5 bg-[#F4F2FA]/40">
          <div className="max-w-5xl mx-auto">
            <SectionTitle>Инструменты анализа</SectionTitle>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {instruments.map((item) => (
                <Card
                  key={item.title}
                  title={item.title}
                  description={item.description}
                  icon={item.icon}
                  badge={<PriceBadge price={item.price} />}
                  buttonLabel="Подробнее"
                  onClick={() => navigate(item.link)}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Category 3 — Personal analyses */}
        <section className="py-14 sm:py-16 px-5">
          <div className="max-w-5xl mx-auto">
            <SectionTitle>Персональные анализы</SectionTitle>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {personalAnalyses.map((item) => (
                <Card
                  key={item.title}
                  title={item.title}
                  description={item.description}
                  icon={item.icon}
                  badge={<PriceBadge price={item.price} />}
                  buttonLabel="Заказать"
                  onClick={() => navigate(item.link)}
                />
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
