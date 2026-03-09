import Icon from "@/components/ui/icon";
import { Card } from "./CompatibilityPrimitives";

type Props = {
  date1: string;
  date2: string;
  error: string;
  onDate1Change: (v: string) => void;
  onDate2Change: (v: string) => void;
  onCalculate: () => void;
};

export default function CompatibilityForm({ date1, date2, error, onDate1Change, onDate2Change, onCalculate }: Props) {
  return (
    <Card className="p-6 sm:p-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Партнёр 1
          </label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <Icon name="User" size={16} className="text-gray-400" />
            </div>
            <input
              type="date"
              value={date1}
              onChange={(e) => onDate1Change(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#6C5BA7]/30 focus:border-[#6C5BA7]/50 transition-colors"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Партнёр 2
          </label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <Icon name="UserPlus" size={16} className="text-gray-400" />
            </div>
            <input
              type="date"
              value={date2}
              onChange={(e) => onDate2Change(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#6C5BA7]/30 focus:border-[#6C5BA7]/50 transition-colors"
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-4 flex items-center gap-2 text-sm text-red-600 bg-red-50 px-4 py-2.5 rounded-xl">
          <Icon name="AlertCircle" size={16} />
          {error}
        </div>
      )}

      <button
        onClick={onCalculate}
        className="mt-6 w-full py-3.5 rounded-xl bg-[#6C5BA7] hover:bg-[#5A4B95] text-white font-semibold text-sm transition-all shadow-md shadow-[#6C5BA7]/20 flex items-center justify-center gap-2"
      >
        <Icon name="Sparkles" size={18} />
        Начать анализ
      </button>
    </Card>
  );
}
