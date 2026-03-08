import Icon from "@/components/ui/icon";
import { DESCRIPTIONS } from "@/lib/matrix";
import { MATRIX_LABELS } from "@/lib/destiny-map";
import type { DestinyMapProfile } from "@/lib/destiny-map";
import { ProgressBar } from "@/components/child/ChildPrimitives";

function Section({
  icon,
  title,
  subtitle,
  iconBg = "bg-[#F4F2FA]",
  iconColor = "text-[#6C5BA7]",
  children,
}: {
  icon: string;
  title: string;
  subtitle?: string;
  iconBg?: string;
  iconColor?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
      <div className="flex items-start gap-3 mb-5">
        <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center shrink-0 mt-0.5`}>
          <Icon name={icon} size={20} className={iconColor} />
        </div>
        <div>
          <h2 className="font-golos text-xl sm:text-2xl font-semibold text-gray-900 leading-tight">{title}</h2>
          {subtitle && <p className="text-sm text-gray-400 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {children}
    </div>
  );
}

export default function DestinyFullReport({ profile }: { profile: DestinyMapProfile }) {
  const desc = DESCRIPTIONS[profile.lifePath];

  return (
    <>
      {/* 1. Код личности */}
      <Section icon="Hash" title="Основной код личности" subtitle="Число жизненного пути и его значение">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          {[
            { n: profile.lifePath, label: "Жизненный путь" },
            { n: profile.lifePathBeforeReduce, label: "Промежуточная сумма" },
          ].map((item) => (
            <div key={item.label} className="bg-[#F4F2FA]/60 border border-[#E8E4F5] rounded-xl p-4 text-center">
              <div className="text-3xl font-golos font-bold text-[#6C5BA7]">{item.n}</div>
              <div className="text-[11px] font-semibold text-[#6C5BA7] uppercase tracking-widest">{item.label}</div>
            </div>
          ))}
        </div>
        {desc && (
          <div className="bg-gray-50/80 border border-gray-100 rounded-xl p-5">
            <p className="text-gray-700 text-[15px] leading-relaxed">{desc.character}</p>
          </div>
        )}
      </Section>

      {/* 2. Матрица личности */}
      <Section icon="Grid3x3" title="Матрица личности" subtitle="Распределение энергий по 9 аспектам" iconBg="bg-purple-100" iconColor="text-purple-600">
        <div className="grid grid-cols-3 gap-2 sm:gap-3 max-w-md mx-auto">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((d) => {
            const count = profile.matrix[d] || 0;
            const filled = count > 0;
            return (
              <div key={d} className={`rounded-xl p-3 sm:p-4 text-center border ${filled ? "bg-[#F4F2FA]/80 border-[#E8E4F5]" : "bg-gray-50 border-gray-100"}`}>
                <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">{MATRIX_LABELS[d]}</div>
                <div className={`text-xl sm:text-2xl font-golos font-bold ${filled ? "text-[#6C5BA7]" : "text-gray-300"}`}>
                  {count > 0 ? String(d).repeat(count) : "-"}
                </div>
              </div>
            );
          })}
        </div>
      </Section>

      {/* 3. Архетип (подробнее) */}
      <Section icon="Shield" title="Архетип личности" subtitle={`${profile.archetype.label} — ${profile.archetype.element}`}>
        <div className="bg-[#F4F2FA]/60 border border-[#E8E4F5] rounded-xl p-5 sm:p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-[#E8E4F5] flex items-center justify-center">
              <Icon name="Crown" size={20} className="text-[#6C5BA7]" />
            </div>
            <div>
              <div className="text-sm font-semibold text-[#4A3D7A]">{profile.archetype.label}</div>
              <div className="text-xs text-[#6C5BA7]">«{profile.archetype.motto}»</div>
            </div>
          </div>
          <p className="text-gray-700 text-[15px] leading-relaxed">{profile.archetype.description}</p>
        </div>
      </Section>

      {/* 4. Тип мышления */}
      <Section icon="Brain" title="Тип мышления" subtitle={profile.thinkingStyle.label} iconBg="bg-sky-100" iconColor="text-sky-600">
        <div className="bg-sky-50/60 border border-sky-100 rounded-xl p-5 sm:p-6 mb-4">
          <p className="text-gray-700 text-[15px] leading-relaxed">{profile.thinkingStyle.description}</p>
        </div>
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Лучшие методы:</h3>
        <div className="space-y-2">
          {profile.thinkingStyle.bestMethods.map((m, i) => (
            <div key={i} className="flex items-start gap-2.5 bg-gray-50/80 border border-gray-100 rounded-xl p-3">
              <Icon name="CheckCircle" size={16} className="text-sky-500 shrink-0 mt-0.5" />
              <span className="text-sm text-gray-700">{m}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* 5. Потенциал интеллекта */}
      <Section icon="GraduationCap" title="Потенциал интеллекта" subtitle={`Индекс: ${profile.mindIndex}%`} iconBg="bg-indigo-100" iconColor="text-indigo-600">
        <div className="space-y-4">
          <div className="space-y-1.5">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Индекс интеллекта</span>
              <span className="font-semibold text-gray-900">{profile.mindIndex}%</span>
            </div>
            <ProgressBar value={profile.mindIndex} color="indigo" />
          </div>
          <p className="text-sm text-gray-600 bg-indigo-50/60 border border-indigo-100 rounded-xl p-4">
            {profile.mindIndex >= 75
              ? "Ваш интеллектуальный потенциал значительно выше среднего. Аналитические способности, системное мышление и жажда знаний — ваши мощные инструменты. Используйте их для решения масштабных задач."
              : profile.mindIndex >= 50
                ? "У вас хороший интеллектуальный базис. При целенаправленном развитии вы способны достичь высоких результатов в интеллектуальных областях. Инвестируйте в образование."
                : "Ваш интеллектуальный потенциал требует целенаправленного развития. Это не ограничение, а вызов — регулярная практика и обучение способны значительно усилить ваши способности."}
          </p>
        </div>
      </Section>

      {/* 6. Энергетика */}
      <Section icon="Zap" title="Энергетика личности" subtitle={`${profile.energyLevel} — ${profile.energyIndex}%`} iconBg="bg-[#F4F2FA]" iconColor="text-[#6C5BA7]">
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-[#F4F2FA]/60 border border-[#E8E4F5] rounded-xl p-4 text-center">
            <div className="text-2xl font-golos font-bold text-[#6C5BA7]">{profile.energyIndex}%</div>
            <div className="text-xs text-[#6C5BA7] font-medium">Общая энергия</div>
          </div>
          <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 text-center">
            <div className="text-2xl font-golos font-bold text-gray-700">{profile.energyLevel}</div>
            <div className="text-xs text-gray-500 font-medium">Уровень</div>
          </div>
        </div>
        <p className="text-sm text-gray-600 bg-gray-50/80 border border-gray-100 rounded-xl p-4">
          {profile.energyIndex >= 70
            ? "У вас мощный энергетический ресурс. Вы способны работать интенсивно и долго, вдохновлять окружающих своей энергией. Важно: учитесь восстанавливаться, чтобы не сжечь себя."
            : profile.energyIndex >= 40
              ? "Средний уровень энергии обеспечивает стабильность в повседневной жизни. Для прорывов нужно грамотно управлять энергией: высыпаться, тренироваться и правильно питаться."
              : "Ваша энергетика требует бережного отношения. Избегайте перегрузок, создайте чёткий режим дня. Физические нагрузки и природа помогут восполнить ресурсы."}
        </p>
      </Section>

      {/* 7. Характер и поведение */}
      <Section icon="User" title="Характер и поведение" subtitle="Как вы действуете в жизни" iconBg="bg-purple-100" iconColor="text-purple-600">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Типичные паттерны поведения:</h3>
        <div className="space-y-2">
          {profile.behaviorPatterns.map((p, i) => (
            <div key={i} className="flex items-start gap-3 bg-purple-50/50 border border-purple-100 rounded-xl p-3.5">
              <div className="w-6 h-6 rounded-lg bg-purple-200 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-[10px] font-bold text-purple-700">{i + 1}</span>
              </div>
              <span className="text-sm text-gray-700">{p}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* 8. Сильные стороны (полный список) */}
      <Section icon="ThumbsUp" title="Сильные стороны" subtitle="Ваши природные дарования" iconBg="bg-emerald-100" iconColor="text-emerald-600">
        <div className="space-y-2">
          {profile.strengths.map((s, i) => (
            <div key={i} className="flex items-start gap-2.5 bg-emerald-50/50 border border-emerald-100 rounded-xl p-3.5">
              <Icon name="CircleCheck" size={18} className="text-emerald-500 shrink-0 mt-0.5" />
              <span className="text-sm text-gray-700">{s}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* 9. Слабые стороны */}
      <Section icon="AlertTriangle" title="Слабые стороны" subtitle="Зоны роста и развития" iconBg="bg-rose-100" iconColor="text-rose-600">
        <div className="space-y-2">
          {profile.weaknesses.map((w, i) => (
            <div key={i} className="flex items-start gap-2.5 bg-rose-50/50 border border-rose-100 rounded-xl p-3.5">
              <Icon name="ArrowUpRight" size={18} className="text-rose-500 shrink-0 mt-0.5" />
              <span className="text-sm text-gray-700">{w}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* 10. Деньги и карьера */}
      <Section icon="Banknote" title="Деньги и карьера" subtitle="Финансовый потенциал">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
          {[
            { label: "Деньги", value: profile.moneyIndex, color: "purple", icon: "Banknote" },
            { label: "Богатство", value: profile.wealthIndex, color: "purple", icon: "Gem" },
            { label: "Успех", value: profile.successIndex, color: "emerald", icon: "Trophy" },
          ].map((idx) => (
            <div key={idx.label} className="bg-gray-50/80 border border-gray-100 rounded-xl p-4 text-center">
              <Icon name={idx.icon} size={20} className="text-[#6C5BA7] mx-auto mb-1" />
              <div className="text-2xl font-golos font-bold text-gray-900">{idx.value}%</div>
              <div className="text-xs text-gray-500 mb-2">{idx.label}</div>
              <ProgressBar value={idx.value} color={idx.color} />
            </div>
          ))}
        </div>
        {desc && (
          <div className="bg-[#F4F2FA]/60 border border-[#E8E4F5] rounded-xl p-5">
            <p className="text-gray-700 text-[15px] leading-relaxed">{desc.finances}</p>
          </div>
        )}
      </Section>

      {/* 11. Предназначение */}
      <Section icon="Compass" title="Предназначение" subtitle="Ваша миссия в этой жизни" iconBg="bg-indigo-100" iconColor="text-indigo-600">
        <div className="bg-indigo-50/60 border border-indigo-100 rounded-xl p-5 sm:p-6 mb-4">
          <p className="text-gray-700 text-[15px] leading-relaxed font-medium">{profile.purpose}</p>
        </div>
        <div className="space-y-2">
          {profile.purposeDetails.map((d, i) => (
            <div key={i} className="flex items-start gap-2.5 bg-gray-50/80 border border-gray-100 rounded-xl p-3.5">
              <Icon name="Star" size={16} className="text-indigo-500 shrink-0 mt-0.5" />
              <span className="text-sm text-gray-700">{d}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* 12. Лучшие профессии */}
      <Section icon="Briefcase" title="Лучшие профессии" subtitle="Направления с наибольшим потенциалом" iconBg="bg-sky-100" iconColor="text-sky-600">
        <div className="space-y-3">
          {profile.careers.slice(0, 10).map((career) => (
            <div key={career.title} className="flex items-center gap-3 bg-gray-50/80 border border-gray-100 rounded-xl p-3.5">
              <div className="w-9 h-9 rounded-lg bg-sky-100 flex items-center justify-center shrink-0">
                <Icon name={career.icon} size={18} className="text-sky-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-800">{career.title}</div>
                <div className="text-xs text-gray-400">{career.description}</div>
                <div className="mt-1.5">
                  <ProgressBar value={career.score} color="sky" />
                </div>
              </div>
              <span className="text-sm font-semibold text-gray-600 shrink-0">{career.score}%</span>
            </div>
          ))}
        </div>
      </Section>

      {/* 13. Отношения */}
      <Section icon="Heart" title="Отношения" subtitle="Как вы любите и дружите" iconBg="bg-rose-100" iconColor="text-rose-600">
        <div className="bg-rose-50/60 border border-rose-100 rounded-xl p-5 sm:p-6 mb-4">
          <div className="space-y-2 mb-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Индекс любви</span>
              <span className="font-semibold text-gray-900">{profile.loveIndex}%</span>
            </div>
            <ProgressBar value={profile.loveIndex} color="rose" />
          </div>
          <p className="text-gray-700 text-[15px] leading-relaxed">{profile.relationships}</p>
        </div>
      </Section>

      {/* 14. Совместимость типов */}
      <Section icon="Users" title="Совместимость типов" subtitle="Лучшие партнёры для вашего типа">
        <div className="space-y-3">
          {profile.bestPartners.map((p) => (
            <div key={p.type} className="bg-gray-50/80 border border-gray-100 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Icon name="Heart" size={16} className="text-rose-500" />
                  <span className="text-sm font-semibold text-gray-800">{p.label}</span>
                </div>
                <span className="text-sm font-bold text-[#6C5BA7]">{p.score}%</span>
              </div>
              <ProgressBar value={p.score} color="rose" />
              <p className="text-xs text-gray-600 mt-2 leading-relaxed">{p.description}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* 15. Жизненные циклы */}
      <Section icon="Clock" title="Жизненные циклы" subtitle="Три ключевых периода вашей жизни" iconBg="bg-sky-100" iconColor="text-sky-600">
        <div className="space-y-3">
          {profile.lifeCycles.map((cycle, i) => (
            <div key={i} className="flex items-start gap-4 bg-gray-50/80 border border-gray-100 rounded-xl p-4">
              <div className="w-12 h-12 rounded-xl bg-sky-100 flex items-center justify-center shrink-0">
                <span className="text-lg font-golos font-bold text-sky-700">{cycle.number}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold text-gray-800">{cycle.period}</span>
                  <span className="text-xs text-gray-400 bg-gray-100 rounded px-2 py-0.5">{cycle.ages}</span>
                </div>
                <p className="text-xs text-gray-500 mb-1 italic">{cycle.theme}</p>
                <p className="text-sm text-gray-600 leading-relaxed">{cycle.description}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* 16. Ключевые годы */}
      <Section icon="CalendarCheck" title="Ключевые годы жизни" subtitle="Переломные моменты вашего пути">
        <div className="flex flex-wrap gap-3">
          {profile.keyAges.map((age) => (
            <div key={age} className="bg-[#F4F2FA]/60 border border-[#E8E4F5] rounded-xl px-5 py-3 text-center">
              <div className="text-2xl font-golos font-bold text-[#6C5BA7]">{age}</div>
              <div className="text-[10px] font-semibold text-[#6C5BA7] uppercase">лет</div>
            </div>
          ))}
        </div>
        <p className="text-sm text-gray-500 mt-4 bg-gray-50/80 border border-gray-100 rounded-xl p-4">
          В эти годы вас ждут значимые события и трансформации. Будьте готовы к переменам — они несут рост и новые возможности. Каждый ключевой год — это шанс выйти на новый уровень.
        </p>
      </Section>

      {/* 17. Кармические уроки */}
      {profile.karmicLessons.length > 0 && (
        <Section icon="BookOpen" title="Кармические уроки" subtitle="Отсутствующие цифры и их значение" iconBg="bg-purple-100" iconColor="text-purple-600">
          <div className="space-y-3">
            {profile.karmicLessons.map((lesson) => (
              <div key={lesson.digit} className="bg-purple-50/50 border border-purple-100 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 rounded-lg bg-purple-200 flex items-center justify-center">
                    <span className="text-xs font-bold text-purple-700">{lesson.digit}</span>
                  </div>
                  <span className="text-sm font-semibold text-purple-800">{lesson.label}</span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{lesson.description}</p>
                <div className="flex items-start gap-2 bg-white/80 rounded-lg p-3">
                  <Icon name="Lightbulb" size={14} className="text-[#6C5BA7] shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700">{lesson.howToWork}</span>
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* 18. Потенциал успеха */}
      <Section icon="TrendingUp" title="Потенциал успеха" subtitle="Все индексы в одном месте" iconBg="bg-emerald-100" iconColor="text-emerald-600">
        <div className="space-y-4">
          {[
            { label: "Энергия", value: profile.energyIndex, color: "purple", icon: "Zap" },
            { label: "Интеллект", value: profile.mindIndex, color: "sky", icon: "Brain" },
            { label: "Эмоции", value: profile.emotionIndex, color: "rose", icon: "Heart" },
            { label: "Лидерство", value: profile.leaderIndex, color: "purple", icon: "Crown" },
            { label: "Деньги", value: profile.moneyIndex, color: "purple", icon: "Banknote" },
            { label: "Любовь", value: profile.loveIndex, color: "rose", icon: "Heart" },
            { label: "Успех", value: profile.successIndex, color: "emerald", icon: "Trophy" },
            { label: "Реализация", value: profile.realizationIndex, color: "indigo", icon: "Target" },
            { label: "Будущий потенциал", value: profile.futurePotential, color: "purple", icon: "Rocket" },
          ].map((idx) => (
            <div key={idx.label} className="space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon name={idx.icon} size={16} className="text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">{idx.label}</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">{idx.value}%</span>
              </div>
              <ProgressBar value={idx.value} color={idx.color} />
            </div>
          ))}
        </div>
      </Section>

      {/* 19. Риски */}
      {profile.risks.length > 0 && (
        <Section icon="ShieldAlert" title="Риски жизни" subtitle="На что обратить внимание" iconBg="bg-rose-100" iconColor="text-rose-600">
          <div className="space-y-3">
            {profile.risks.map((risk, i) => {
              const levelColors = {
                high: { bg: "bg-red-50", border: "border-red-100", badge: "bg-red-100 text-red-700" },
                medium: { bg: "bg-orange-50", border: "border-orange-100", badge: "bg-orange-100 text-orange-700" },
                low: { bg: "bg-emerald-50", border: "border-emerald-100", badge: "bg-emerald-100 text-emerald-700" },
              };
              const c = levelColors[risk.level];
              return (
                <div key={i} className={`${c.bg} border ${c.border} rounded-xl p-4`}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-xs font-semibold rounded-md px-2 py-0.5 ${c.badge}`}>
                      {risk.level === "high" ? "Высокий" : risk.level === "medium" ? "Средний" : "Низкий"}
                    </span>
                    <span className="text-sm font-semibold text-gray-800">{risk.area}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{risk.description}</p>
                  <div className="flex items-start gap-2 bg-white/80 rounded-lg p-3">
                    <Icon name="Shield" size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700">{risk.prevention}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </Section>
      )}

      {/* 20. Стратегия жизни */}
      <Section icon="Map" title="Лучшая стратегия жизни" subtitle={profile.strategy.label} iconBg="bg-indigo-100" iconColor="text-indigo-600">
        <div className="bg-indigo-50/60 border border-indigo-100 rounded-xl p-5 sm:p-6 mb-4">
          <p className="text-gray-700 text-[15px] leading-relaxed">{profile.strategy.description}</p>
        </div>
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Ключевые действия:</h3>
        <div className="space-y-2">
          {profile.strategy.keyActions.map((a, i) => (
            <div key={i} className="flex items-start gap-3 bg-gray-50/80 border border-gray-100 rounded-xl p-3.5">
              <div className="w-7 h-7 rounded-lg bg-indigo-100 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-xs font-bold text-indigo-600">{i + 1}</span>
              </div>
              <span className="text-sm text-gray-700">{a}</span>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}