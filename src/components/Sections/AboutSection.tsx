"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { BUSINESS_INFO } from "@/data/gymData";
import { ArrowUpRight, Check, Minus } from "lucide-react";

export default function AboutSection() {
  const { language, t } = useLanguage();

  const tenets = [
    {
      num: "01",
      titleEn: "Climate Architecture",
      titleBn: "সেন্ট্রাল তাপমাত্রা ও অক্সিজেন নিয়ন্ত্রণ",
      descEn:
        "High-capacity inverter air conditioning maintains a crisp 20°C with continuous air exchange, ensuring high energy and zero stuffiness even during intense summer heat.",
      descBn:
        "উন্নত ইনভার্টার এসি সিস্টেম সার্বক্ষণিক ২০ ডিগ্রি তাপমাত্রা ও সতেজ বাতাস নিশ্চিত করে, যা তীব্র গরমেও ক্লান্তিহীন ও স্বাস্থ্যকর ওয়ার্কআউট নিশ্চিত করে।",
    },
    {
      num: "02",
      titleEn: "Shift Privacy & Modesty",
      titleBn: "সম্পূর্ণ নিরাপদ নারী ও পুরুষ শিফট",
      descEn:
        "We reject crowded combined free-for-alls. Our two male shifts and one dedicated female exclusive shift—coached by certified female instructors—guarantee absolute privacy.",
      descBn:
        "কোনো রকম অস্বস্তিকর ভিড় নয়। ২টি পুরুষ শিফট এবং নারী প্রশিক্ষক পরিচালিত ১টি সম্পূর্ণ ব্যক্তিগত নারী শিফটে সবার জন্য সর্বোচ্চ নিরাপত্তা ও স্বাধীনতা।",
    },
    {
      num: "03",
      titleEn: "Zero-Queue Biomechanics",
      titleBn: "পর্যাপ্ত ইকুইপমেন্ট ও হেভি ডাম্বেল",
      descEn:
        "Commercial-grade cable crossover stacks, power racks, deadlift platforms, and dumbbells up to 50kg+. Designed so your sets never wait on someone else.",
      descBn:
        "২ কেজি থেকে ৫০+ কেজির ডাম্বেল, কেবল ক্রসওভার ও অলিম্পিক বারবেল। কোনো মেশিনের জন্য অপেক্ষা না করে দ্রুত ও সঠিকভাবে ওয়ার্কআউট শেষ করার সুবিধা।",
    },
  ];

  const comparison = [
    {
      metric: "Climate & Air Quality",
      metricBn: "তাপমাত্রা ও বাতাসের মান",
      platinum: "100% Inverter Central AC + continuous air exchange",
      platinumBn: "১০০% সেন্ট্রাল এসি ও সার্বক্ষণিক ফ্রেশ এয়ার ভেন্টিলেশন",
      ordinary: "Stuffy ceiling fans, high humidity, bad odor",
      ordinaryBn: "ঘিঞ্জি ফ্যান, স্যাঁতসেঁতে পরিবেশ ও দুর্গন্ধ",
    },
    {
      metric: "Gender Privacy",
      metricBn: "আলাদা শিফট ও পর্দা",
      platinum: "Dedicated Female Shift (Certified Female Instructor)",
      platinumBn: "আলাদা নারী শিফট ও নারী প্রশিক্ষক দ্বারা পরিচালিত",
      ordinary: "Crowded combined floor with zero privacy",
      ordinaryBn: "অতিরিক্ত ভিড় ও নারীদের জন্য আলাদা কোনো নিরাপদ সময় নেই",
    },
    {
      metric: "Coach Supervision",
      metricBn: "প্রশিক্ষকের সহায়তা",
      platinum: "Certified floor trainers present on EVERY shift (No extra fee)",
      platinumBn: "প্রতি শিফটে সার্টিফাইড ফ্লোর ট্রেইনার উপস্থিত (অতিরিক্ত ফি ছাড়া)",
      ordinary: "Unsupervised workouts; expensive add-on fee for basic form help",
      ordinaryBn: "গাইডেন্স ছাড়া ব্যায়াম অথবা সাধারণ উপদেশের জন্যও বাড়তি টাকা দাবি",
    },
    {
      metric: "Equipment Standard",
      metricBn: "ইকুইপমেন্টের মান",
      platinum: "Calibrated biomechanical machines & dumbbells to 50kg+",
      platinumBn: "আন্তর্জাতিক মানের সঠিক বায়োমেকানিক্যাল মেশিন ও ৫০+ কেজি ডাম্বেল",
      ordinary: "Local welded steel with improper joint leverage",
      ordinaryBn: "ত্রুটিপূর্ণ লোকাল মেশিন যার ভুল এঙ্গেলে জয়েন্টে আঘাতের ঝুঁকি থাকে",
    },
  ];

  return (
    <section id="about" className="py-24 px-4 sm:px-6 lg:px-8 border-b border-white/[0.06] bg-white dark:bg-[#0b0b0d]">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 pb-8 border-b border-white/[0.08]">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs font-medium text-[#22c55e] mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e]" />
              <span>About {BUSINESS_INFO.name}</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white uppercase">
              {language === "bn" ? "আমাদের মূল দর্শন" : "Engineered For Focus"}
            </h2>
          </div>
          <p className="text-sm text-zinc-400 max-w-md font-normal leading-relaxed">
            {language === "bn"
              ? "একটি জিম শুধু লোহার স্তূপ নয়; এটি এমন একটি সুপরিকল্পিত পরিবেশ যেখানে আপনার একাগ্রতা ও স্বাস্থ্য অগ্রাধিকারে থাকে।"
              : "A gym is not a warehouse of steel. It is an intentional sanctuary where discipline, privacy, and athletic progress are respected."}
          </p>
        </div>

        {/* Editorial Composition */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start mb-20">
          {/* Left: Facility Photo */}
          <div className="lg:col-span-5 relative">
            <div className="relative border border-white/[0.08] bg-[#0e0e12] rounded-2xl overflow-hidden shadow-2xl p-2.5">
              <div className="aspect-[4/5] relative w-full overflow-hidden rounded-xl bg-zinc-900">
                <Image
                  src="https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=1200&q=80"
                  alt={`${BUSINESS_INFO.name} interior floor`}
                  fill
                  className="object-cover contrast-105"
                  sizes="(max-width: 768px) 100vw, 500px"
                />
              </div>

              <div className="pt-3 pb-1 px-2 flex items-center justify-between text-xs text-zinc-400">
                <span className="font-medium text-zinc-300">{BUSINESS_INFO.area}</span>
                <span className="text-[#22c55e] font-semibold">{BUSINESS_INFO.plusCode}</span>
              </div>
            </div>
          </div>

          {/* Right: 3 Key Tenets */}
          <div className="lg:col-span-7 flex flex-col divide-y divide-white/[0.08]">
            {tenets.map((tenet, idx) => (
              <motion.div
                key={tenet.num}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: idx * 0.08 }}
                className="py-7 first:pt-0 last:pb-0 group"
              >
                <div className="flex items-center gap-3.5 mb-2.5">
                  <div className="w-8 h-8 rounded-full bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-xs font-bold text-[#22c55e] group-hover:bg-[#22c55e] group-hover:text-black transition-colors">
                    {tenet.num}
                  </div>
                  <h3 className="text-xl font-bold text-white tracking-tight group-hover:text-zinc-200 transition-colors">
                    {language === "bn" ? tenet.titleBn : tenet.titleEn}
                  </h3>
                </div>
                <p className="text-sm text-zinc-400 leading-relaxed pl-11 max-w-xl">
                  {language === "bn" ? tenet.descBn : tenet.descEn}
                </p>
              </motion.div>
            ))}

            <div className="pt-7">
              <a
                href="#schedule"
                className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-900 dark:text-white hover:text-[#22c55e] transition-colors group"
              >
                <span className="text-zinc-900 dark:text-white group-hover:!text-[#22c55e] transition-colors">
                  View Operating Shifts & Daily Timetable
                </span>
                <ArrowUpRight className="w-4 h-4 text-[#22c55e] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            </div>
          </div>
        </div>

        {/* Minimalist Comparison Table */}
        <div className="border border-white/[0.08] bg-[#0e0e12] p-6 sm:p-8 rounded-2xl shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-5 border-b border-white/[0.08]">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-[#22c55e] mb-1">
                Quality Comparison
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
                {language === "bn"
                  ? `${BUSINESS_INFO.nameBangla} বনাম সাধারণ জিম`
                  : `The ${BUSINESS_INFO.name} Standard vs. Conventional Gyms`}
              </h3>
            </div>
            <span className="text-xs text-zinc-400 font-medium">
              Modern Fitness Standards
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-white/[0.08] text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  <th className="py-3 px-4 font-normal">Feature</th>
                  <th className="py-3 px-4 font-bold text-[#22c55e] bg-white/[0.02] rounded-t-lg">
                    {BUSINESS_INFO.name}
                  </th>
                  <th className="py-3 px-4 font-normal text-zinc-500">
                    Typical Gyms
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.05]">
                {comparison.map((item, idx) => (
                  <tr key={idx} className="hover:bg-white/[0.015] transition-colors">
                    <td className="py-4 px-4 font-medium text-zinc-300">
                      {language === "bn" ? item.metricBn : item.metric}
                    </td>
                    <td className="py-4 px-4 bg-white/[0.02] text-white font-medium">
                      <div className="flex items-center gap-2.5">
                        <Check className="w-4 h-4 text-[#22c55e] shrink-0 stroke-[2.5]" />
                        <span>{language === "bn" ? item.platinumBn : item.platinum}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-zinc-500">
                      <div className="flex items-center gap-2.5">
                        <Minus className="w-4 h-4 text-zinc-600 shrink-0" />
                        <span>{language === "bn" ? item.ordinaryBn : item.ordinary}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
