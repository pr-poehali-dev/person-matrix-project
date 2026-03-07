import { useState } from "react";
import Icon from "@/components/ui/icon";

type DestinyFormProps = {
  birthDate: string;
  birthTime: string;
  birthCity: string;
  error: string;
  onBirthDateChange: (v: string) => void;
  onBirthTimeChange: (v: string) => void;
  onBirthCityChange: (v: string) => void;
  onCalculate: () => void;
};

export default function DestinyForm({
  birthDate,
  birthTime,
  birthCity,
  error,
  onBirthDateChange,
  onBirthTimeChange,
  onBirthCityChange,
  onCalculate,
}: DestinyFormProps) {
  const [extraOpen, setExtraOpen] = useState(false);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 max-w-lg mx-auto">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Дата рождения
          </label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <Icon name="Calendar" size={16} className="text-gray-400" />
            </div>
            <input
              type="date"
              value={birthDate}
              onChange={(e) => onBirthDateChange(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-400 transition-colors"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={() => setExtraOpen(!extraOpen)}
          className="flex items-center gap-2 text-sm text-amber-600 hover:text-amber-700 font-medium transition-colors"
        >
          <Icon name={extraOpen ? "ChevronUp" : "ChevronDown"} size={16} />
          Дополнительно
          <span className="text-gray-400 font-normal">(время и город рождения)</span>
        </button>

        {extraOpen && (
          <div className="space-y-4 pt-1 border-t border-gray-100">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Время рождения
                <span className="text-gray-400 font-normal ml-1">(необязательно)</span>
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <Icon name="Clock" size={16} className="text-gray-400" />
                </div>
                <input
                  type="time"
                  value={birthTime}
                  onChange={(e) => onBirthTimeChange(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-400 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Город рождения
                <span className="text-gray-400 font-normal ml-1">(необязательно)</span>
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <Icon name="MapPin" size={16} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  value={birthCity}
                  onChange={(e) => onBirthCityChange(e.target.value)}
                  placeholder="Например, Москва"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 text-sm placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-400 transition-colors"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-4 flex items-center gap-2 text-sm text-red-500">
          <Icon name="AlertCircle" size={16} />
          {error}
        </div>
      )}

      <button
        onClick={onCalculate}
        className="mt-6 w-full inline-flex items-center justify-center gap-2 text-white text-sm font-semibold rounded-xl px-8 py-3.5 transition-all shadow-md shadow-amber-200/50 hover:shadow-lg hover:shadow-amber-300/50"
        style={{ background: "linear-gradient(135deg, #92400e, #d97706, #f59e0b)" }}
      >
        <Icon name="Sparkles" size={18} />
        Рассчитать карту судьбы
      </button>
    </div>
  );
}
