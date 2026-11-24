"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import { BUSINESS_INFO } from "@/data/gymData";

export default function LiveEnergyTicker() {
  const { language } = useLanguage();

  const items =
    language === "bn"
      ? [
          "১০০% সেন্ট্রাল এয়ার-কন্ডিশন্ড",
          BUSINESS_INFO.addressBn,
          `গুগল রেটিং ${BUSINESS_INFO.googleRating}★ (${BUSINESS_INFO.reviewCount}+ ভেরিফাইড রিভিউ)`,
          "আলাদা পুরুষ ও নারী শিফট ব্যবস্থা",
          "প্রতি শিফটে সার্টিফাইড ফ্লোর কোচ",
          "প্রতিদিন সকাল ০৭:০০ টায় খোলে",
          `সরাসরি ফোন: ${BUSINESS_INFO.phone}`,
        ]
      : [
          "100% Inverter Central Air Conditioning",
          BUSINESS_INFO.addressEn,
          `Google Rating ${BUSINESS_INFO.googleRating}★ (${BUSINESS_INFO.reviewCount}+ Verified Reviews)`,
          "Dedicated Separate Male & Female Time Slots",
          "Certified Floor Trainers on Duty Every Shift",
          "Open Daily from 07:00 AM",
          `Direct Front Desk: ${BUSINESS_INFO.phone}`,
        ];

  return (
    <div className="w-full bg-slate-100 dark:bg-[#0a0a0d] border-b border-white/[0.06] py-3 overflow-hidden select-none">
      <div className="flex w-max animate-marquee-slow">
        {[...items, ...items, ...items].map((text, idx) => (
          <div
            key={idx}
            className="flex items-center gap-4 mx-6 text-xs text-zinc-400 font-medium whitespace-nowrap"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e]" />
            <span className="hover:text-white transition-colors">{text}</span>
            <span className="text-zinc-700 ml-4">•</span>
          </div>
        ))}
      </div>
    </div>
  );
}
