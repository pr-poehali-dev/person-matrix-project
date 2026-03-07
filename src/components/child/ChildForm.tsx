import Icon from "@/components/ui/icon";
import { Card } from "./ChildPrimitives";

type ChildFormProps = {
  childName: string;
  birthDate: string;
  error: string;
  onChildNameChange: (v: string) => void;
  onBirthDateChange: (v: string) => void;
  onCalculate: () => void;
};

export default function ChildForm({
  childName,
  birthDate,
  error,
  onChildNameChange,
  onBirthDateChange,
  onCalculate,
}: ChildFormProps) {
  return (
    <Card className="p-6 sm:p-8 max-w-lg mx-auto">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Имя ребёнка
            <span className="text-gray-400 font-normal ml-1">(необязательно)</span>
          </label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <Icon name="Smile" size={16} className="text-gray-400" />
            </div>
            <input
              type="text"
              value={childName}
              onChange={(e) => onChildNameChange(e.target.value)}
              placeholder="Например, Алиса"
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 text-sm placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-400 transition-colors"
            />
          </div>
        </div>

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
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-400 transition-colors"
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-4 flex items-center gap-2 text-sm text-red-500">
          <Icon name="AlertCircle" size={16} />
          {error}
        </div>
      )}

      <button
        onClick={onCalculate}
        className="mt-6 w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white text-sm font-semibold rounded-xl px-8 py-3.5 transition-all shadow-md shadow-purple-200/50 hover:shadow-lg hover:shadow-purple-300/50"
      >
        <Icon name="Sparkles" size={18} />
        Рассчитать профиль ребёнка
      </button>
    </Card>
  );
}
