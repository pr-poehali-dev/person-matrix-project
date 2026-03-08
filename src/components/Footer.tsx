import { Link } from "react-router-dom";
import Icon from "@/components/ui/icon";

const footerLinks = [
  { label: "Главная", path: "/" },
  { label: "Тесты и инструменты", path: "/catalog" },
  { label: "Личный кабинет", path: "/cabinet" },
];

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200/80">
      <div className="max-w-6xl mx-auto px-5 py-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          {/* Logo + description */}
          <div className="flex flex-col gap-3">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-7 h-7 rounded-md bg-[#6C5BA7]/10 flex items-center justify-center">
                <span className="font-golos text-sm font-bold text-[#6C5BA7]">М</span>
              </div>
              <span className="font-golos text-base font-semibold text-[#4A3D7A] tracking-tight">
                Матрица личности
              </span>
            </Link>
            <p className="font-golos text-xs text-gray-400 max-w-xs leading-relaxed">
              Психологическая платформа для самопознания и личностного роста
            </p>
          </div>

          {/* Navigation links */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-6">
            {footerLinks.map((item) => (
              <Link
                key={item.label}
                to={item.path}
                className="font-golos text-sm text-gray-400 hover:text-[#6C5BA7] transition-colors duration-200"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Community link */}
          <div>
            <a
              href="https://t.me/+QgiLIa1gFRY4Y2Iy"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-golos text-sm text-gray-400 hover:text-[#6C5BA7] transition-colors duration-200"
            >
              <Icon name="MessageCircle" size={16} />
              Наше сообщество
            </a>
          </div>
        </div>

        {/* Divider + copyright */}
        <div className="mt-8 pt-5 border-t border-gray-200/60">
          <p className="font-golos text-xs text-gray-300 text-center">
            &copy; 2024 personmatrix.ru
          </p>
        </div>
      </div>
    </footer>
  );
}
