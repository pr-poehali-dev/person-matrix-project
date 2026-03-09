import Icon from "@/components/ui/icon";

export function StepCard({ icon, title, subtitle, children }: {
  icon: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl soft-shadow p-6 sm:p-8 animate-fade-in">
      {title && (
        <div className="flex items-start gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-[#F4F2FA] flex items-center justify-center flex-shrink-0 mt-0.5">
            <Icon name={icon} size={20} className="text-[#6C5BA7]" />
          </div>
          <div>
            <h2 className="font-golos font-semibold text-lg text-gray-900">{title}</h2>
            {subtitle && <p className="font-golos text-sm text-gray-400 mt-0.5">{subtitle}</p>}
          </div>
        </div>
      )}
      {children}
    </div>
  );
}

export function EmotionGrid({ options, selected, onSelect }: {
  options: string[];
  selected: string;
  onSelect: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(opt => (
        <button
          key={opt}
          onClick={() => onSelect(opt)}
          className={`px-4 py-2 rounded-xl text-sm font-golos transition-all border ${
            selected === opt
              ? "bg-[#6C5BA7] text-white border-[#6C5BA7]"
              : "bg-white text-gray-700 border-gray-200 hover:border-[#6C5BA7] hover:bg-[#F4F2FA]"
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}
