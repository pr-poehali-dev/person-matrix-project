import Icon from "@/components/ui/icon";
import { DESCRIPTIONS } from "@/lib/matrix";
import { MATRIX_LABELS } from "@/lib/destiny-map";
import type { DestinyMapProfile } from "@/lib/destiny-map";

export default function DestinyHero({ profile }: { profile: DestinyMapProfile }) {
  const desc = DESCRIPTIONS[profile.lifePath];

  return (
    <>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden p-8 sm:p-10">
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-amber-50 rounded-full opacity-60 pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-36 h-36 bg-purple-50 rounded-full opacity-50 pointer-events-none" />

        <div className="relative flex flex-col sm:flex-row sm:items-center gap-6">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl flex items-center justify-center shrink-0 mx-auto sm:mx-0" style={{ background: "linear-gradient(135deg, #fef3c7, #fde68a)" }}>
            <span className="font-serif text-5xl sm:text-6xl font-bold text-amber-700">
              {profile.lifePath}
            </span>
          </div>

          <div className="text-center sm:text-left">
            <p className="text-xs font-semibold text-amber-600 uppercase tracking-widest mb-1">
              Число жизненного пути
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl text-gray-900 mb-1">
              {profile.archetype.label}
            </h2>
            {desc && (
              <p className="text-gray-500 text-base leading-relaxed">
                {desc.title} — {desc.tagline}
              </p>
            )}
            <div className="flex items-center gap-2 mt-2">
              <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-700 text-xs font-semibold rounded-lg px-2.5 py-1">
                <Icon name="Flame" size={12} />
                {profile.archetype.element}
              </span>
              <span className="text-xs text-gray-400 italic">
                «{profile.archetype.motto}»
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
        <div className="flex items-start gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0 mt-0.5">
            <Icon name="User" size={20} className="text-amber-600" />
          </div>
          <div>
            <h2 className="font-serif text-xl sm:text-2xl text-gray-900 leading-tight">
              Архетип личности
            </h2>
            <p className="text-sm text-gray-400 mt-0.5">Ваша глубинная сущность</p>
          </div>
        </div>
        <div className="bg-amber-50/60 border border-amber-100 rounded-xl p-5 sm:p-6">
          <p className="text-gray-700 text-[15px] leading-relaxed">
            {profile.archetype.description}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
        <div className="flex items-start gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0 mt-0.5">
            <Icon name="Hash" size={20} className="text-amber-600" />
          </div>
          <div>
            <h2 className="font-serif text-xl sm:text-2xl text-gray-900 leading-tight">
              Характерные черты
            </h2>
            <p className="text-sm text-gray-400 mt-0.5">Ваш психологический портрет</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {profile.characterTraits.map((trait, i) => (
            <span key={i} className="inline-flex items-center gap-1.5 bg-gray-50 border border-gray-100 text-gray-700 text-sm font-medium rounded-xl px-3.5 py-2">
              {trait}
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-serif text-lg text-gray-900 mb-3 flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center">
              <Icon name="ThumbsUp" size={15} className="text-emerald-600" />
            </div>
            Сильные стороны
          </h3>
          <ul className="space-y-2">
            {profile.strengths.slice(0, 3).map((s, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <Icon name="CircleCheck" size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                <span className="text-sm text-gray-700">{s}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-serif text-lg text-gray-900 mb-3 flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center">
              <Icon name="Brain" size={15} className="text-amber-600" />
            </div>
            Тип мышления
          </h3>
          <div className="mb-2">
            <span className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-700 text-xs font-semibold rounded-lg px-2.5 py-1">
              <Icon name="Lightbulb" size={12} />
              {profile.thinkingStyle.label}
            </span>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
            {profile.thinkingStyle.description}
          </p>
        </div>
      </div>

      <div className="rounded-2xl p-6 sm:p-8 text-center text-white" style={{ background: "linear-gradient(135deg, #92400e, #b45309, #d97706)" }}>
        <Icon name="Lock" size={28} className="mx-auto mb-3 opacity-80" />
        <h3 className="font-serif text-xl sm:text-2xl mb-2">
          Полная карта судьбы
        </h3>
        <p className="text-amber-100 text-sm max-w-lg mx-auto">
          20 разделов анализа: матрица, индексы, карьера, предназначение, отношения,
          жизненные циклы, кармические уроки, риски, стратегия и многое другое
        </p>
      </div>
    </>
  );
}
