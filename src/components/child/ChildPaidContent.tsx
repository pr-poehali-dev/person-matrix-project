import { useState } from "react";
import { Link } from "react-router-dom";
import Icon from "@/components/ui/icon";
import type { PersonDescription } from "@/lib/matrix";
import type { ChildProfile } from "@/lib/child-matrix";
import { getToken } from "@/lib/auth";
import { PRODUCT_PRICES } from "@/lib/payments";
import func2url from "../../../backend/func2url.json";
import ChildAnalysisCore from "./ChildAnalysisCore";
import ChildAbilities from "./ChildAbilities";
import ChildLifeAndFamily from "./ChildLifeAndFamily";

type ChildPaidContentProps = {
  profile: ChildProfile;
  desc: PersonDescription | undefined;
  name: string;
  purchased: boolean;
  balance: number;
  spending: boolean;
  birthDate: string;
  motherDate: string;
  fatherDate: string;
  onBuy: () => void;
  onReset: () => void;
  onNavigateAuth: () => void;
};

export default function ChildPaidContent({
  profile,
  desc,
  name,
  purchased,
  balance,
  spending,
  birthDate,
  motherDate,
  fatherDate,
  onBuy,
  onReset,
  onNavigateAuth,
}: ChildPaidContentProps) {
  const [pdfLoading, setPdfLoading] = useState(false);

  const onDownloadPdf = async () => {
    const token = getToken();
    if (!token) return;
    setPdfLoading(true);
    try {
      const res = await fetch((func2url as Record<string, string>)["child-pdf"], {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Auth-Token": token },
        body: JSON.stringify({
          action: "generate",
          child_date: birthDate,
          child_name: name,
          mother_date: motherDate || undefined,
          father_date: fatherDate || undefined,
        }),
      });
      if (res.status === 403) {
        setPdfLoading(false);
        return;
      }
      const data = await res.json();
      const parsed = typeof data === "string" ? JSON.parse(data) : data;
      if (parsed.pdf) {
        const bytes = Uint8Array.from(atob(parsed.pdf), (c) => c.charCodeAt(0));
        const blob = new Blob([bytes], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = parsed.filename || "child_profile.pdf";
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch {
      // ignore
    }
    setPdfLoading(false);
  };

  return (
    <>
      {purchased ? (
        <>
          <ChildAnalysisCore profile={profile} />
          <ChildAbilities profile={profile} />
          <ChildLifeAndFamily
            profile={profile}
            desc={desc}
            name={name}
            pdfLoading={pdfLoading}
            onDownloadPdf={onDownloadPdf}
          />
        </>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-[#F4F2FA] flex items-center justify-center mx-auto mb-4">
            <Icon name="Lock" size={24} className="text-[#6C5BA7]" />
          </div>
          <h3 className="font-golos font-semibold text-2xl text-gray-900 mb-2">
            Полный профиль ребёнка
          </h3>
          <p className="text-sm text-gray-500 mb-2 max-w-md mx-auto">
            Психологический портрет, индексы развития, карьерные склонности, жизненные
            циклы, совместимость с родителями и советы
          </p>
          <div className="text-3xl font-golos font-bold text-[#6C5BA7] mb-4">
            {PRODUCT_PRICES.child_analysis} ₽
          </div>
          {getToken() ? (
            <div>
              <button
                onClick={onBuy}
                disabled={spending}
                className="px-8 py-3 rounded-xl text-sm font-semibold text-white transition-all"
                style={{
                  background: spending
                    ? "#d1d5db"
                    : "linear-gradient(135deg, #6C5BA7, #8B7EC8)",
                }}
              >
                {spending
                  ? "Оплата..."
                  : balance >= PRODUCT_PRICES.child_analysis
                    ? "Оплатить с баланса"
                    : `Пополнить баланс (${balance} ₽)`}
              </button>
              {balance < PRODUCT_PRICES.child_analysis && (
                <p className="text-xs text-gray-400 mt-2">
                  На балансе {balance} ₽, нужно{" "}
                  {PRODUCT_PRICES.child_analysis} ₽
                </p>
              )}
            </div>
          ) : (
            <button
              onClick={onNavigateAuth}
              className="px-8 py-3 rounded-xl text-sm font-semibold text-white"
              style={{
                background:
                  "linear-gradient(135deg, #6C5BA7, #8B7EC8)",
              }}
            >
              Войти для покупки
            </button>
          )}
        </div>
      )}

      <div className="text-center pt-4 pb-8 space-y-4">
        <p className="text-sm text-gray-400">
          Результаты основаны на психологическом анализе личности
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={onReset}
            className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-xl px-6 py-3 transition-colors"
          >
            <Icon name="RotateCcw" size={16} />
            Анализ другого ребёнка
          </button>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 font-medium transition-colors"
          >
            <Icon name="ArrowLeft" size={16} />
            На главную
          </Link>
        </div>
      </div>
    </>
  );
}