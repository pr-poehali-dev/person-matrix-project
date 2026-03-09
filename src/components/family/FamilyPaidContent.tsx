import type { FamilyAnalysis } from "@/lib/family-matrix";
import FamilyPaywall from "./FamilyPaywall";
import FamilyOverviewCards from "./FamilyOverviewCards";
import FamilyInsightCards from "./FamilyInsightCards";

type FamilyPaidContentProps = {
  analysis: FamilyAnalysis;
  purchased: boolean;
  balance: number;
  spending: boolean;
  onBuy: () => void;
  onReset: () => void;
  onNavigateAuth: () => void;
};

export default function FamilyPaidContent({
  analysis,
  purchased,
  balance,
  spending,
  onBuy,
  onReset,
  onNavigateAuth,
}: FamilyPaidContentProps) {
  if (!purchased) {
    return (
      <FamilyPaywall
        spending={spending}
        balance={balance}
        onBuy={onBuy}
        onReset={onReset}
        onNavigateAuth={onNavigateAuth}
      />
    );
  }

  return (
    <>
      <FamilyOverviewCards analysis={analysis} />
      <FamilyInsightCards analysis={analysis} onReset={onReset} />
    </>
  );
}
