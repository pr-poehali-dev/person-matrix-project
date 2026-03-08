import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";
import type { DestinyMapProfile } from "@/lib/destiny-map";
import { getToken } from "@/lib/auth";
import { PRODUCT_PRICES } from "@/lib/payments";
import func2url from "../../../backend/func2url.json";
import DestinyFullReport from "./DestinyFullReport";

type DestinyPaidContentProps = {
  profile: DestinyMapProfile;
  purchased: boolean;
  balance: number;
  spending: boolean;
  birthDate: string;
  onBuy: () => void;
  onReset: () => void;
  onNavigateAuth: () => void;
};

export default function DestinyPaidContent({
  profile,
  purchased,
  balance,
  spending,
  birthDate,
  onBuy,
  onReset,
  onNavigateAuth,
}: DestinyPaidContentProps) {
  const [pdfLoading, setPdfLoading] = useState(false);
  const navigate = useNavigate();

  const onDownloadPdf = async () => {
    const token = getToken();
    if (!token) return;
    setPdfLoading(true);
    try {
      const url = (func2url as Record<string, string>)["destiny-pdf"];
      if (!url) { setPdfLoading(false); return; }
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Auth-Token": token },
        body: JSON.stringify({ action: "generate", birth_date: birthDate }),
      });
      if (res.status === 403) { setPdfLoading(false); return; }
      const data = await res.json();
      const parsed = typeof data === "string" ? JSON.parse(data) : data;
      if (parsed.pdf) {
        const bytes = Uint8Array.from(atob(parsed.pdf), (c) => c.charCodeAt(0));
        const blob = new Blob([bytes], { type: "application/pdf" });
        const u = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = u;
        a.download = parsed.filename || "destiny_map.pdf";
        a.click();
        URL.revokeObjectURL(u);
      }
    } catch { /* ignore */ }
    setPdfLoading(false);
  };

  const price = PRODUCT_PRICES.destiny_map;

  return (
    <>
      {purchased ? (
        <>
          <DestinyFullReport profile={profile} />

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 text-center">
            <div className="w-12 h-12 rounded-xl bg-[#F4F2FA] flex items-center justify-center mx-auto mb-3">
              <Icon name="Download" size={22} className="text-[#6C5BA7]" />
            </div>
            <h3 className="font-golos text-lg font-semibold text-gray-900 mb-1">Скачать PDF-отчёт</h3>
            <p className="text-sm text-gray-400 mb-4">Полный анализ предназначения в формате PDF (25–40 страниц)</p>
            <button
              onClick={onDownloadPdf}
              disabled={pdfLoading}
              className="inline-flex items-center gap-2 text-white text-sm font-semibold rounded-xl px-6 py-3 transition-all disabled:opacity-60 bg-[#6C5BA7] hover:bg-[#5A4B95]"
            >
              <Icon name="Download" size={16} />
              {pdfLoading ? "Генерация PDF..." : "Скачать PDF-отчёт"}
            </button>
          </div>
        </>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-[#F4F2FA] flex items-center justify-center mx-auto mb-4">
            <Icon name="Lock" size={24} className="text-[#6C5BA7]" />
          </div>
          <h3 className="font-golos text-2xl font-semibold text-gray-900 mb-2">Полный анализ предназначения</h3>
          <p className="text-sm text-gray-500 mb-2 max-w-md mx-auto">
            20 разделов глубокого анализа: архетип, индексы, карьера,
            предназначение, отношения, совместимость, жизненные циклы,
            ключевые уроки, риски, стратегия жизни + PDF-отчёт на 25–40 страниц
          </p>
          <div className="text-3xl font-golos font-bold text-[#6C5BA7] mb-4">{price} ₽</div>
          {getToken() ? (
            <div>
              <button
                onClick={onBuy}
                disabled={spending}
                className={`px-8 py-3 rounded-xl text-sm font-semibold text-white transition-all ${spending ? "bg-gray-300" : "bg-[#6C5BA7] hover:bg-[#5A4B95]"}`}
              >
                {spending
                  ? "Оплата..."
                  : balance >= price
                    ? "Оплатить с баланса"
                    : `Пополнить баланс (${balance} ₽)`}
              </button>
              {balance < price && (
                <p className="text-xs text-gray-400 mt-2">
                  На балансе {balance} ₽, нужно {price} ₽
                </p>
              )}
            </div>
          ) : (
            <button
              onClick={onNavigateAuth}
              className="px-8 py-3 rounded-xl text-sm font-semibold text-white bg-[#6C5BA7] hover:bg-[#5A4B95]"
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
            className="inline-flex items-center gap-2 text-white text-sm font-medium rounded-xl px-6 py-3 transition-colors bg-[#6C5BA7] hover:bg-[#5A4B95]"
          >
            <Icon name="RotateCcw" size={16} />
            Новый анализ
          </button>
          <Link
            to="/catalog"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 font-medium transition-colors"
          >
            <Icon name="ArrowLeft" size={16} />
            Все тесты и инструменты
          </Link>
        </div>
      </div>
    </>
  );
}
