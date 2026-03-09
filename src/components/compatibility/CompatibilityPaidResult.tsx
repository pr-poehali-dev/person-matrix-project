import Icon from "@/components/ui/icon";
import { Card, SectionHeading, ScoreCircle, DimensionCard, PersonCard } from "./CompatibilityPrimitives";
import type { FullCompatibilityResult } from "@/lib/matrix";

type Props = {
  result: FullCompatibilityResult;
  pdfLoading: boolean;
  onDownloadPdf: () => void;
};

export default function CompatibilityPaidResult({ result, pdfLoading, onDownloadPdf }: Props) {
  return (
    <>
      <Card className="p-6 sm:p-8">
        <SectionHeading
          icon="Users"
          title="Числа партнёров"
          subtitle="Сравнение психологических профилей"
        />
        <div className="flex flex-col sm:flex-row gap-6">
          <PersonCard label="Партнёр 1" person={result.person1} />
          <div className="hidden sm:flex items-center">
            <div className="w-px h-full bg-gray-100" />
          </div>
          <div className="sm:hidden h-px bg-gray-100" />
          <PersonCard label="Партнёр 2" person={result.person2} />
        </div>
      </Card>

      <div>
        <SectionHeading
          icon="Radar"
          title="8 измерений совместимости"
          subtitle="Детальный анализ вашего союза"
        />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <DimensionCard icon="Brain" label="Психологическая" score={result.scores.psychological} />
          <DimensionCard icon="Heart" label="Эмоциональная" score={result.scores.emotional} />
          <DimensionCard icon="Compass" label="Ценности" score={result.scores.values} />
          <DimensionCard icon="Wallet" label="Финансовая" score={result.scores.financial} />
          <DimensionCard icon="Lightbulb" label="Интеллектуальная" score={result.scores.intellectual} />
          <DimensionCard icon="Flame" label="Интимная" score={result.scores.intimacy} />
          <DimensionCard icon="Home" label="Семейный потенциал" score={result.scores.family} />
          <DimensionCard icon="RefreshCcw" label="Совместимость циклов" score={result.lifeCycleCompat} />
        </div>
      </div>

      <Card className="p-6 sm:p-8">
        <SectionHeading icon="Swords" title="Индекс конфликтности" />
        <div className="flex items-center gap-6">
          <ScoreCircle score={result.scores.conflict} size={90} />
          <div className="flex-1">
            <p className="text-sm text-gray-600 leading-relaxed">
              {result.scores.conflict >= 60
                ? "Высокий уровень потенциальных разногласий. Осознанность и работа над отношениями критически важны для гармонии."
                : result.scores.conflict >= 30
                  ? "Умеренный уровень трения. Конфликты возможны, но они решаемы при взаимном уважении и открытом диалоге."
                  : "Низкий уровень конфликтности. Вы хорошо ладите и естественно находите компромиссы."}
            </p>
          </div>
        </div>
      </Card>

      {result.karmic.isKarmic && (
        <Card className="p-6 sm:p-8 border-[#E8E4F5] bg-[#F4F2FA]/30">
          <SectionHeading
            icon="Infinity"
            title="Глубинная связь"
            subtitle="Обнаружены признаки особой связи между партнёрами"
          />
          <div className="space-y-3">
            {result.karmic.reasons.map((reason, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#F4F2FA] flex items-center justify-center shrink-0 mt-0.5">
                  <Icon name="Star" size={12} className="text-[#6C5BA7]" />
                </div>
                <p className="text-sm text-gray-700">{reason}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Card className="p-6 sm:p-8">
        <SectionHeading
          icon="BookOpen"
          title="Рекомендации"
          subtitle="Практические советы для вашей пары"
        />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-green-50 flex items-center justify-center">
                <Icon name="ThumbsUp" size={14} className="text-green-500" />
              </div>
              <span className="text-sm font-semibold text-gray-700">Сильные стороны</span>
            </div>
            <ul className="space-y-2">
              {result.recommendations.strengths.map((s, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 shrink-0 mt-1.5" />
                  <span className="text-sm text-gray-600">{s}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center">
                <Icon name="AlertTriangle" size={14} className="text-red-400" />
              </div>
              <span className="text-sm font-semibold text-gray-700">Риски</span>
            </div>
            <ul className="space-y-2">
              {result.recommendations.risks.map((r, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0 mt-1.5" />
                  <span className="text-sm text-gray-600">{r}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-[#F4F2FA] flex items-center justify-center">
                <Icon name="MessageCircle" size={14} className="text-[#6C5BA7]" />
              </div>
              <span className="text-sm font-semibold text-gray-700">Советы</span>
            </div>
            <ul className="space-y-2">
              {result.recommendations.advice.map((a, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#6C5BA7] shrink-0 mt-1.5" />
                  <span className="text-sm text-gray-600">{a}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Card>

      <div className="flex justify-center">
        <button
          onClick={onDownloadPdf}
          disabled={pdfLoading}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-60"
        >
          <Icon name="Download" size={18} className="text-gray-500" />
          {pdfLoading ? "Генерация PDF..." : "Скачать PDF-отчёт"}
        </button>
      </div>
    </>
  );
}
