"use client";

import React from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { BUSINESS_INFO } from "@/data/gymData";
import Hero3DCanvas from "@/components/3D/Hero3DCanvas";
import { ArrowUpRight, Phone, Star, Wind, Clock } from "lucide-react";
import MagneticButton from "@/components/Motion/MagneticButton";

export default function HeroSection() {
  const { language, t } = useLanguage();

  const handleScrollTo = (targetId: string) => {
    const el = document.getElementById(targetId);
    if (el) {
      const topOffset = 75;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - topOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <section
      id="hero"
      className="relative min-h-[88vh] flex items-center justify-center border-b border-white/[0.06] pt-12 pb-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-[#0b0b0d]"
    >
      <div className="max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Headline, Description & CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-7 flex flex-col items-start text-left"
          >
            {/* Clean Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs font-medium text-zinc-300 mb-6">
              <span className="w-2 h-2 rounded-full bg-[#22c55e]" />
              <span>Premier 100% Air-Conditioned Fitness Center</span>
            </div>

            {/* Confident, Modern Headline */}
            <h1 className="text-4xl sm:text-6xl xl:text-7xl font-black tracking-tight text-white uppercase leading-[1.05] mb-6">
              <span>DISCIPLINE.</span>
              <br />
              <span className="text-zinc-500">PRECISION.</span>
              <br />
              <span className="text-white relative inline-block">
                RESULTS.
                <span className="absolute -bottom-1.5 left-0 w-24 h-1 bg-[#22c55e] rounded-full" />
              </span>
            </h1>

            {/* Bengali & English Identity */}
            <div className="text-base sm:text-lg font-semibold text-zinc-200 mb-4">
              {language === "bn"
                ? `${BUSINESS_INFO.nameBangla} • সর্বাধুনিক সেন্ট্রাল এসি ফিটনেস সেন্টার`
                : `${BUSINESS_INFO.name} • ${BUSINESS_INFO.addressEn}`}
            </div>

            {/* Description */}
            <p className="text-sm sm:text-base text-zinc-400 max-w-xl leading-relaxed mb-8 font-normal">
              {language === "bn"
                ? "তীব্র গরমেও সার্বক্ষণিক শীতল পরিবেশ, বায়োমেকানিক্যালি ক্যালিব্রেটেড মেশিনারি, পুরুষ ও নারীদের জন্য আলাদা শিফট এবং অভিজ্ঞ ট্রেইনারদের আন্তরিক তত্ত্বাবধান।"
                : `A purposeful training environment in ${BUSINESS_INFO.area}. Uncompromising climate control, biomechanically engineered machinery, and strictly dedicated shifts for male and female members.`}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 w-full sm:w-auto mb-12">
              <MagneticButton
                onClick={() => handleScrollTo("contact")}
                className="px-6 py-3.5 bg-[#22c55e] hover:bg-[#16a34a] !text-black text-sm font-bold rounded-sm shadow-lg shadow-[#22c55e]/25 transition-all"
              >
                <span className="!text-black font-bold">{t.hero.bookTrial}</span>
                <ArrowUpRight className="w-4 h-4 !text-black stroke-[2.5]" />
              </MagneticButton>

              <MagneticButton
                onClick={() => window.open(`tel:${BUSINESS_INFO.phone}`, "_self")}
                className="px-6 py-3.5 bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.12] hover:border-white/30 text-white text-sm font-medium rounded-xl transition-all"
              >
                <Phone className="w-4 h-4 text-[#22c55e]" />
                <span>Call {BUSINESS_INFO.phone}</span>
              </MagneticButton>
            </div>

            {/* 3 Clean Metric Cards (Shifts card removed as requested) */}
            <div className="w-full pt-6 border-t border-white/[0.08] grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-left">
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.12] transition-colors">
                <div className="flex items-center gap-1.5 text-xs text-zinc-400 mb-1">
                  <Star className="w-3.5 h-3.5 fill-[#22c55e] text-[#22c55e]" />
                  <span>Google Rating</span>
                </div>
                <div className="text-xl font-bold text-white">{BUSINESS_INFO.googleRating} / 5.0</div>
                <div className="text-xs text-zinc-500 mt-0.5">{BUSINESS_INFO.reviewCount} Verified Reviews</div>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.12] transition-colors">
                <div className="flex items-center gap-1.5 text-xs text-zinc-400 mb-1">
                  <Wind className="w-3.5 h-3.5 text-[#22c55e]" />
                  <span>Air Quality</span>
                </div>
                <div className="text-xl font-bold text-[#22c55e]">100% AC</div>
                <div className="text-xs text-zinc-500 mt-0.5">Central Inverter Cooling</div>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.12] transition-colors">
                <div className="flex items-center gap-1.5 text-xs text-zinc-400 mb-1">
                  <Clock className="w-3.5 h-3.5 text-[#22c55e]" />
                  <span>Daily Schedule</span>
                </div>
                <div className="text-xl font-bold text-white">07:00 AM</div>
                <div className="text-xs text-zinc-500 mt-0.5">Open Daily • {BUSINESS_INFO.area}</div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Clean 3D Interactive Showcase */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="lg:col-span-5 relative flex items-center justify-center"
          >
            <div className="w-full relative border border-white/[0.08] bg-[#0e0e12]/80 backdrop-blur-sm p-4 rounded-2xl shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.06] text-xs text-zinc-400">
                <span className="font-semibold text-white">Olympic Standard Equipment</span>
                <span className="text-[#22c55e] font-medium">{BUSINESS_INFO.area}</span>
              </div>

              {/* 3D Canvas Rig */}
              <Hero3DCanvas />

              <div className="flex items-center justify-between pt-3 border-t border-white/[0.06] text-xs text-zinc-400">
                <span>Drag to inspect 360°</span>
                <span className="text-zinc-500">Interactive 3D</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
