"use client";

import React from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { BUSINESS_INFO, REVIEWS_DATA } from "@/data/gymData";
import { ArrowUpRight, Star } from "lucide-react";
import CardSpotlight from "@/components/Motion/CardSpotlight";
import MagneticButton from "@/components/Motion/MagneticButton";

export default function ReviewsSection() {
  const { language, t } = useLanguage();

  return (
<<<<<<< HEAD
    <section id="reviews" className="py-24 px-4 sm:px-6 lg:px-8 border-b border-white/[0.06] bg-slate-50 dark:bg-[#0c0c0f]">
=======
    <section id="reviews" className="py-28 px-4 sm:px-6 lg:px-8 border-b border-white/[0.06] bg-[#0c0c0f]">
>>>>>>> 23520c35639d1c633a8bd1adba2b49170f746c86
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 pb-8 border-b border-white/[0.08]">
          <div>
            <div className="mono-label text-zinc-400 mb-2 font-mono flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e]" />
              <span>08 • COMMUNITY REVIEWS</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white uppercase">
              {language === "bn" ? "সদস্যদের প্রত্যক্ষ মতামত" : "Member Perspectives"}
            </h2>
          </div>

          {/* Minimalist Google Audit Box with Magnetic Button */}
          <div className="border border-white/[0.08] p-3.5 bg-[#121217] flex items-center gap-6 shrink-0 rounded-xs shadow-md">
            <div>
              <div className="mono-label text-[10px] text-zinc-400 font-mono">
                GOOGLE VERIFIED AUDIT
              </div>
              <div className="text-xl font-black text-white flex items-center gap-2 mt-0.5 font-mono">
                <span>4.4 / 5.0</span>
                <span className="text-xs text-zinc-400 font-sans font-normal">
                  (173 Reviews)
                </span>
              </div>
            </div>

            <MagneticButton
              onClick={() => window.open(BUSINESS_INFO.googleMapsDirectionsUrl, "_blank")}
<<<<<<< HEAD
              className="px-4 py-2.5 bg-[#22c55e] hover:bg-[#16a34a] !text-black font-bold text-xs rounded-sm transition-all flex items-center gap-1.5 shadow-md shadow-[#22c55e]/20"
=======
              className="px-4 py-2.5 bg-[#22c55e] hover:bg-[#16a34a] !text-black font-black text-xs font-mono uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-md shadow-[#22c55e]/20 rounded-xs cursor-pointer"
>>>>>>> 23520c35639d1c633a8bd1adba2b49170f746c86
            >
              <span className="!text-black font-black">{language === "bn" ? "গুগলে দেখুন" : "VIEW ON GOOGLE"}</span>
              <ArrowUpRight className="w-3.5 h-3.5 !text-black stroke-[2.5]" />
            </MagneticButton>
          </div>
        </div>

        {/* Editorial Testimonials Grid with Cursor Spotlight */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {REVIEWS_DATA.map((review, idx) => {
            const author = language === "bn" ? review.authorBn : review.authorEn;
            const membership =
              language === "bn" ? review.membershipBn : review.membershipEn;
            const comment =
              language === "bn" ? review.commentBn : review.commentEn;
            const date = language === "bn" ? review.dateBn : review.dateEn;
            const shift = language === "bn" ? review.shiftBn : review.shiftEn;

            return (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="h-full"
              >
                <CardSpotlight
                  enableTilt={true}
                  showReticles={true}
                  spotlightColor="rgba(34, 197, 94, 0.12)"
                  className="p-8 flex flex-col justify-between hover:border-[#22c55e]/30 transition-all rounded-xs shadow-xl h-full group"
                >
                  <div className="flex flex-col justify-between h-full">
                    <div>
                      <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/[0.06] text-xs mono-label text-zinc-400 font-mono">
                        <span className="text-white font-bold">{shift}</span>
                        <span>{date}</span>
                      </div>

                      <p className="text-sm sm:text-base text-zinc-300 leading-relaxed mb-8 font-normal font-sans group-hover:text-white transition-colors">
                        &ldquo;{comment}&rdquo;
                      </p>
                    </div>

                    <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs mt-auto">
                      <div>
                        <h4 className="font-bold text-white tracking-tight">
                          {author}
                        </h4>
                        <p className="mono-label text-[10px] text-zinc-500 mt-0.5 font-mono">
                          {membership}
                        </p>
                      </div>

                      {/* High-visibility amber stars with micro-bounce animation */}
                      <div className="flex items-center gap-0.5 text-zinc-400">
                        {[...Array(5)].map((_, i) => (
                          <motion.div
                            key={i}
                            whileHover={{ scale: 1.25, rotate: 6 }}
                            transition={{ type: "spring", stiffness: 400, damping: 10 }}
                          >
                            <Star
                              className={`w-3.5 h-3.5 ${i < Math.floor(review.rating)
                                ? "fill-amber-400 text-amber-400"
                                : "fill-zinc-700 text-zinc-700"
                                }`}
                            />
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardSpotlight>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
