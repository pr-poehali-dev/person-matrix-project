import Icon from "@/components/ui/icon";
import { Card } from "./FamilyPrimitives";

type FamilyFormProps = {
  parent1Date: string;
  parent2Date: string;
  childrenDates: string[];
  error: string;
  onParent1DateChange: (v: string) => void;
  onParent2DateChange: (v: string) => void;
  onChildrenDatesChange: (dates: string[]) => void;
  onCalculate: () => void;
};

const INPUT_CLASS =
  "w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 text-sm placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400 transition-colors";

export default function FamilyForm({
  parent1Date,
  parent2Date,
  childrenDates,
  error,
  onParent1DateChange,
  onParent2DateChange,
  onChildrenDatesChange,
  onCalculate,
}: FamilyFormProps) {
  const handleChildDateChange = (index: number, value: string) => {
    const updated = [...childrenDates];
    updated[index] = value;
    onChildrenDatesChange(updated);
  };

  const handleAddChild = () => {
    if (childrenDates.length < 5) {
      onChildrenDatesChange([...childrenDates, ""]);
    }
  };

  const handleRemoveChild = (index: number) => {
    onChildrenDatesChange(childrenDates.filter((_, i) => i !== index));
  };

  return (
    <Card className="p-6 sm:p-8 max-w-lg mx-auto">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Дата рождения партнёра 1
          </label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <Icon name="User" size={16} className="text-gray-400" />
            </div>
            <input
              type="date"
              value={parent1Date}
              onChange={(e) => onParent1DateChange(e.target.value)}
              className={INPUT_CLASS}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Дата рождения партнёра 2
          </label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <Icon name="User" size={16} className="text-gray-400" />
            </div>
            <input
              type="date"
              value={parent2Date}
              onChange={(e) => onParent2DateChange(e.target.value)}
              className={INPUT_CLASS}
            />
          </div>
        </div>

        <div className="pt-2 border-t border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-700">
              Дети
              <span className="text-gray-400 font-normal ml-1">
                (необязательно)
              </span>
            </span>
            {childrenDates.length < 5 && (
              <button
                type="button"
                onClick={handleAddChild}
                className="inline-flex items-center gap-1.5 text-sm text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
              >
                <Icon name="Plus" size={16} />
                Добавить ребёнка
              </button>
            )}
          </div>

          {childrenDates.length > 0 && (
            <div className="space-y-3">
              {childrenDates.map((date, index) => (
                <div key={index}>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Ребёнок {index + 1}
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                        <Icon
                          name="Baby"
                          size={16}
                          className="text-gray-400"
                        />
                      </div>
                      <input
                        type="date"
                        value={date}
                        onChange={(e) =>
                          handleChildDateChange(index, e.target.value)
                        }
                        className={INPUT_CLASS}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveChild(index)}
                      className="shrink-0 w-9 h-9 rounded-lg border border-gray-200 bg-gray-50 flex items-center justify-center text-gray-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-colors"
                    >
                      <Icon name="X" size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
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
        className="mt-6 w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white text-sm font-semibold rounded-xl px-8 py-3.5 transition-all shadow-md shadow-emerald-200/50 hover:shadow-lg hover:shadow-emerald-300/50"
      >
        <Icon name="Sparkles" size={18} />
        Рассчитать матрицу семьи
      </button>
    </Card>
  );
}
