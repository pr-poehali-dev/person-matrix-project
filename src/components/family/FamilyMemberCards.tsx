import Icon from "@/components/ui/icon";
import { DESCRIPTIONS } from "@/lib/matrix";
import type { FamilyMember, ChildFamilyProfile } from "@/lib/family-matrix";
import { ProgressBar, ScoreBar } from "./FamilyPrimitives";

function MemberIndices({ member }: { member: FamilyMember }) {
  return (
    <div className="space-y-3">
      {[
        { label: "Лидерство", value: member.leaderIndex, icon: "Crown", color: "violet" },
        { label: "Эмоции", value: member.emotionIndex, icon: "Heart", color: "rose" },
        { label: "Интеллект", value: member.mindIndex, icon: "Brain", color: "sky" },
        { label: "Энергия", value: member.energyIndex, icon: "Zap", color: "emerald" },
      ].map((idx) => (
        <div key={idx.label} className="space-y-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon name={idx.icon} size={14} className="text-gray-400" />
              <span className="text-xs font-medium text-gray-600">
                {idx.label}
              </span>
            </div>
            <span className="text-xs font-semibold text-gray-800">
              {idx.value}%
            </span>
          </div>
          <ProgressBar value={idx.value} color={idx.color} />
        </div>
      ))}
    </div>
  );
}

export function MemberCard({ member }: { member: FamilyMember }) {
  const desc = DESCRIPTIONS[member.lifePath];
  return (
    <div className="bg-gray-50 border border-gray-100 rounded-xl p-5">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-emerald-100 to-emerald-200 flex items-center justify-center shrink-0">
          <span className="font-golos text-lg font-bold text-emerald-700">
            {member.lifePath}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-gray-900">
            {member.label}
          </div>
          {desc && (
            <div className="text-xs text-gray-500">
              {desc.title} — {desc.tagline}
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {member.roles.map((role, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full"
          >
            <Icon name={role.icon} size={12} />
            {role.name}
          </span>
        ))}
      </div>

      <MemberIndices member={member} />

      <div className="grid grid-cols-4 gap-2 mt-4">
        <div className="bg-white border border-gray-100 rounded-lg p-2 text-center">
          <div className="text-lg font-golos font-bold text-[#6C5BA7]">
            {member.lifePath}
          </div>
          <div className="text-[9px] text-gray-400 uppercase tracking-wider">
            Путь
          </div>
        </div>
        <div className="bg-white border border-gray-100 rounded-lg p-2 text-center">
          <div className="text-lg font-golos font-bold text-[#6C5BA7]">
            {member.character}
          </div>
          <div className="text-[9px] text-gray-400 uppercase tracking-wider">
            Характер
          </div>
        </div>
        <div className="bg-white border border-gray-100 rounded-lg p-2 text-center">
          <div className="text-lg font-golos font-bold text-[#6C5BA7]">
            {member.destiny}
          </div>
          <div className="text-[9px] text-gray-400 uppercase tracking-wider">
            Судьба
          </div>
        </div>
        <div className="bg-white border border-gray-100 rounded-lg p-2 text-center">
          <div className="text-lg font-golos font-bold text-[#6C5BA7]">
            {member.soulUrge}
          </div>
          <div className="text-[9px] text-gray-400 uppercase tracking-wider">
            Душа
          </div>
        </div>
      </div>
    </div>
  );
}

export function ChildInfluenceCard({ child, parent1Label, parent2Label }: { child: ChildFamilyProfile; parent1Label: string; parent2Label: string }) {
  return (
    <div className="bg-gray-50 border border-gray-100 rounded-xl p-5">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#F4F2FA] to-[#E8E4F5] flex items-center justify-center shrink-0">
          <span className="font-golos text-base font-bold text-[#6C5BA7]">
            {child.member.lifePath}
          </span>
        </div>
        <div>
          <div className="text-sm font-semibold text-gray-900">
            {child.member.label}
          </div>
          <div className="text-xs text-gray-500">
            Роль в семье: {child.roleInFamily}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <ScoreBar
          label={`Совместимость с ${parent1Label}`}
          score={child.compatWithParent1}
        />
        <ScoreBar
          label={`Совместимость с ${parent2Label}`}
          score={child.compatWithParent2}
        />
        <ScoreBar label="Влияние родителей" score={child.parentInfluence} />
        <ScoreBar label="Индекс поддержки" score={child.supportIndex} />
      </div>
    </div>
  );
}
