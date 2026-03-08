import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";
import { getToken } from "@/lib/auth";

const navItems = [
  { label: "Главная", path: "/" },
  { label: "Тесты и инструменты", path: "/catalog" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const isLoggedIn = Boolean(getToken());

  const handleNavigate = (path: string) => {
    navigate(path);
    setMenuOpen(false);
  };

  const handleAuthClick = () => {
    handleNavigate(isLoggedIn ? "/cabinet" : "/auth");
  };

  return (
    <nav className="sticky top-0 left-0 right-0 z-50 bg-white border-b border-gray-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => handleNavigate("/")}
          className="flex items-center gap-2.5 group"
        >
          <div className="w-8 h-8 rounded-lg bg-[#6C5BA7]/10 flex items-center justify-center transition-colors duration-200 group-hover:bg-[#6C5BA7]/15">
            <span className="font-golos text-base font-bold text-[#6C5BA7]">
              М
            </span>
          </div>
          <span className="font-golos text-lg font-semibold text-[#4A3D7A] tracking-tight">
            Матрица личности
          </span>
        </button>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => handleNavigate(item.path)}
              className="font-golos text-sm text-gray-500 hover:text-[#4A3D7A] px-3.5 py-2 rounded-lg transition-colors duration-200 hover:bg-[#6C5BA7]/5"
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Desktop auth button */}
        <button
          onClick={handleAuthClick}
          className="hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-lg font-golos text-sm font-medium transition-all duration-200 bg-[#6C5BA7] text-white hover:bg-[#5A4B95] active:scale-[0.97]"
        >
          <Icon name={isLoggedIn ? "User" : "LogIn"} size={15} />
          {isLoggedIn ? "Кабинет" : "Войти"}
        </button>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 -mr-2 rounded-lg text-gray-500 hover:text-[#4A3D7A] hover:bg-gray-100 transition-colors duration-200"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          <Icon name={menuOpen ? "X" : "Menu"} size={22} />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-5 pb-4 pt-2 flex flex-col gap-1 animate-in fade-in slide-in-from-top-1 duration-200">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => handleNavigate(item.path)}
              className="font-golos text-sm text-gray-600 hover:text-[#4A3D7A] hover:bg-[#6C5BA7]/5 text-left px-3 py-2.5 rounded-lg transition-colors duration-200"
            >
              {item.label}
            </button>
          ))}
          <div className="mt-1 pt-2 border-t border-gray-100">
            <button
              onClick={handleAuthClick}
              className="w-full flex items-center gap-2 font-golos text-sm font-medium text-white bg-[#6C5BA7] hover:bg-[#5A4B95] px-3 py-2.5 rounded-lg transition-colors duration-200"
            >
              <Icon name={isLoggedIn ? "User" : "LogIn"} size={15} />
              {isLoggedIn ? "Кабинет" : "Войти"}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
