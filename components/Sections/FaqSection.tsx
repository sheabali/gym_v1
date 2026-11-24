"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { BUSINESS_INFO } from "@/data/gymData";
import { useGetFaqsQuery } from "@/redux/api/contentApi";
import { Plus, Minus, ArrowUpRight, HelpCircle, Phone } from "lucide-react";

export default function FaqSection() {
  const { language, t } = useLanguage();
  const [openId, setOpenId] = useState<string | null>("proto-1");
  const [activeTab, setActiveTab] = useState<"all" | "shifts" | "privacy" | "coaching" | "admission">("all");

  const { data: faqsResponse } = useGetFaqsQuery(undefined);

  const apiFaqs = (faqsResponse as any)?.data || [];

  const baseProtocols = [
    {
      id: "proto-1",
      category: "shifts",
      categoryLabel: language === "bn" ? "শিফট কাঠামো" : "Shift Schedule",
      badge: "Daily",
      question:
        language === "bn"
          ? "পুরুষ, নারী এবং কম্বাইন্ড সদস্যদের আলাদা শিফটের সঠিক সময়সূচি কী?"
          : "What are the exact operating shift hours for Male, Female, and Combined slots?",
      answer:
        language === "bn"
          ? `${BUSINESS_INFO.nameBangla} প্রতিদিন ৪টি সুনির্দিষ্ট আলাদা শিফটে পরিচালিত হয় যাতে ভিড় এড়ানো যায় এবং সর্বোচ্চ মনোযোগ ও পর্দা বজায় থাকে। সার্বক্ষণিক সেন্ট্রাল এসি চালু থাকে।`
          : `${BUSINESS_INFO.name} enforces 4 structured daily shifts to ensure zero floor crowding, focused workout atmosphere, and strict gender separation. 100% central inverter cooling operates continuously.`,
      specs: [
        { label: language === "bn" ? "পুরুষ সকাল শিফট" : "Male Morning Shift", value: "07:00 AM – 11:30 AM" },
        { label: language === "bn" ? "নারী এক্সক্লুসিভ শিফট" : "Female Exclusive Shift", value: "12:00 PM – 04:30 PM (Private)" },
        { label: language === "bn" ? "যৌথ কম্বাইন্ড শিফট" : "Combined Evening Shift", value: "04:30 PM – 06:30 PM" },
        { label: language === "bn" ? "পুরুষ প্রাইম শিফট" : "Male Prime Night Shift", value: "06:30 PM – 10:30 PM" },
      ],
    },
    {
      id: "proto-2",
      category: "privacy",
      categoryLabel: language === "bn" ? "নারী নিরাপত্তা" : "Female Privacy",
      badge: "Guaranteed",
      question:
        language === "bn"
          ? "নারী শিফটে শতভাগ পর্দা, গোপনীয়তা ও নিরাপত্তা কীভাবে নিশ্চিত করা হয়?"
          : "How is strict privacy, modesty, and security maintained during the dedicated Female shift?",
      answer:
        language === "bn"
          ? "দুপুর ১২টা থেকে বিকাল ৪টা ৩০ মিনিট পর্যন্ত জিম শুধুমাত্র নারীদের জন্য উন্মুক্ত থাকে। এই সময়ে কোনো পুরুষ প্রবেশ করতে পারে না। ফ্লোরে সার্টিফাইড নারী ট্রেনার উপস্থিত থাকেন এবং পর্দা সম্পূর্ণ সুরক্ষিত।"
          : "From 12:00 PM to 04:30 PM, the gym enforces 100% women-only privacy with frosted partitions and zero male personnel on the training floor. Certified female fitness coaches supervise all sessions.",
      specs: [
        { label: language === "bn" ? "নির্ধারিত সময়" : "Dedicated Window", value: "12:00 PM – 04:30 PM (Daily)" },
        { label: language === "bn" ? "প্রশিক্ষক স্টাফ" : "Supervising Staff", value: "Certified Female Fitness Trainers" },
        { label: language === "bn" ? "ফ্লোর প্রটেকশন" : "Privacy Standard", value: "Frosted Glazing & Restricted Entry" },
        { label: language === "bn" ? "লকার ও শাওয়ার" : "Amenities", value: "Private Ladies Restroom & Lockers" },
      ],
    },
    {
      id: "proto-3",
      category: "coaching",
      categoryLabel: language === "bn" ? "ট্রেনিং ও গাইডেন্স" : "Coaching & Guidance",
      badge: "Included Free",
      question:
        language === "bn"
          ? "সাধারণ মেম্বারশিপে কি ট্রেনার সাপোর্ট পাওয়া যায়, নাকি পার্সোনাল ট্রেনার আলাদা নিতে হয়?"
          : "Is certified trainer form guidance included in general membership, or is personal training required?",
      answer:
        language === "bn"
          ? `${BUSINESS_INFO.nameBangla}-এর প্রতিটি শিফটে সার্টিফাইড ফ্লোর ট্রেনার সার্বক্ষণিক নিয়োজিত থাকেন। তারা সকল সাধারণ সদস্যকে ওয়ার্কআউট রুটিন, সঠিক ফর্ম ও নিরাপত্তা নিশ্চিত করতে বিনামূল্যে গাইড করেন।`
          : "Every general membership includes on-floor certified trainer support. Floor instructors observe posture, calibrate machine settings, and provide beginner split plans without requiring a personal training contract.",
      specs: [
        { label: language === "bn" ? "ফ্লোর ট্রেনার উপস্থিতি" : "Floor Instructor", value: "Present Every Operational Shift" },
        { label: language === "bn" ? "ফর্ম ও পোস্চার কারেকশন" : "Posture Correction", value: "Active Spotting & Instruction" },
        { label: language === "bn" ? "রুটিন চার্ট" : "Routine Roadmap", value: "Complimentary Beginner & Intermediate Splits" },
        { label: language === "bn" ? "স্পেশালাইজড পিটি" : "1-on-1 PT Option", value: "Optional Custom Transformation Add-on" },
      ],
    },
    {
      id: "proto-4",
      category: "coaching",
      categoryLabel: language === "bn" ? "সরঞ্জাম ও হাইজিন" : "Equipment & Hygiene",
      badge: "Mandatory",
      question:
        language === "bn"
          ? "জিমে প্রবেশের জন্য কী ধরণের পোশাক ও জুতার নিয়ম রয়েছে?"
          : "What are the footwear, apparel, and towel hygiene requirements for working out?",
      answer:
        language === "bn"
          ? "বাইরের জুতা পরে ফ্লোরে ঢোকা সম্পূর্ণ নিষেধ। সদস্যদের পরিষ্কার ইনডোর ট্রেনিং শু বহন করতে হবে। এছাড়া প্রত্যেকের জন্য নিজস্ব তোয়ালে ও পরিচ্ছন্ন আরামদায়ক জিম পোশাক বাধ্যতামূলক।"
          : "Outdoor shoes are strictly prohibited on workout turf and rubber platforms. Members must carry clean indoor athletic shoes. Personal towels and appropriate sports attire are mandatory for hygiene.",
      specs: [
        { label: language === "bn" ? "জুতা নীতি" : "Footwear Rule", value: "Clean Indoor-Only Training Shoes" },
        { label: language === "bn" ? "তোয়ালে নিয়ম" : "Towel Requirement", value: "Mandatory Sweat Towel Per Member" },
        { label: language === "bn" ? "পোশাক স্ট্যান্ডার্ড" : "Apparel Standard", value: "Breathable Sports Attire / Dry-Fit" },
        { label: language === "bn" ? "স্যানিটাইজেশন" : "Sanitization Protocol", value: "Daily Chemical Disinfection" },
      ],
    },
    {
      id: "proto-5",
      category: "admission",
      categoryLabel: language === "bn" ? "ভর্তি ও ট্রায়াল" : "Admission & Trial",
      badge: "Open Registration",
      question:
        language === "bn"
          ? "ভর্তি হওয়ার আগে কি ট্রায়াল সেশন বা জিম ঘুরে দেখার সুযোগ আছে?"
          : "Can I inspect the facility or book a trial workout session before purchasing a membership?",
      answer:
        language === "bn"
          ? "হ্যাঁ, যেকোনো দিন অফিস টাইমে এসে সরাসরি ক্যাম্পাস ভিজিট ও ইকুইপমেন্ট পরিদর্শন করতে পারেন। এছাড়া ওয়েবসাইট বা ফোনে কল দিয়ে আপনি ফ্রি ট্রায়াল সেশন ও বডি কম্পোজিশন কনসালটেশন শিডিউল করতে পারেন।"
          : "Yes. Walk-in facility tours are available anytime during operating hours. You can also reserve a free trial workout session and body composition consultation by contacting our front desk or booking online.",
      specs: [
        { label: language === "bn" ? "ফ্যাসিলিটি ট্যুর" : "Walk-in Inspection", value: "Free During Operational Hours" },
        { label: language === "bn" ? "ট্রায়াল সেশন" : "Trial Workout", value: "Available Upon Phone/Online Request" },
        { label: language === "bn" ? "বিএমআই ও পরামর্শ" : "BMI Consultation", value: "Free with Front Desk Representative" },
        { label: language === "bn" ? "ইনস্ট্যান্ট ভর্তি" : "Instant Onboarding", value: "Same-Day Access Card Issuance" },
      ],
    },
    {
      id: "proto-6",
      category: "admission",
      categoryLabel: language === "bn" ? "পেমেন্ট ও পলিসি" : "Payments & Freeze",
      badge: "No Hidden Dues",
      question:
        language === "bn"
          ? "পেমেন্ট পদ্ধতি কী কী এবং মেম্বারশিপ সাময়িক স্থগিত (Freeze) করা যায় কি?"
          : "What payment methods are supported, and what is the policy regarding membership freezing?",
      answer:
        language === "bn"
          ? "আমরা বিকাশ, নগদ, ভিসা, মাস্টারকার্ড এবং সরাসরি নগদ পেমেন্ট গ্রহণ করি। ৩ মাস, ৬ মাস বা বাৎসরিক প্যাকেজে যুক্তিসঙ্গত কারণে (মেডিকেল ইমার্জেন্সি বা পরীক্ষা) মেম্বারশিপ সাময়িক ফ্রিজ করার সুযোগ রয়েছে।"
          : "We accept bKash, Nagad, Visa, Mastercard, and cash. Quarterly, half-yearly, and annual members may freeze their plans for 15 to 30 days due to travel, medical needs, or academic exams with advance notice.",
      specs: [
        { label: language === "bn" ? "ডিজিটাল পেমেন্ট" : "Accepted Methods", value: "bKash, Nagad, Visa, Mastercard, Cash" },
        { label: language === "bn" ? "ভর্তি ফি অফার" : "Admission Fee", value: "Discounted on Multi-Month Packages" },
        { label: language === "bn" ? "মেম্বারশিপ ফ্রিজ" : "Membership Freeze", value: "15 to 30 Days (Quarterly & Yearly)" },
        { label: language === "bn" ? "লকার সুবিধা" : "Locker Allocation", value: "Available During Active Workout Sessions" },
      ],
    },
    {
      id: "proto-7",
      category: "admission",
      categoryLabel: language === "bn" ? "লোকেশন ও ক্যাম্পাস" : "Campus & Parking",
      badge: BUSINESS_INFO.area,
      question:
        language === "bn"
          ? "জিমের সঠিক অবস্থান কোথায় এবং পার্কিংয়ের কী ব্যবস্থা রয়েছে?"
          : `Where is ${BUSINESS_INFO.name} located, and is dedicated vehicle parking available?`,
      answer:
        language === "bn"
          ? `${BUSINESS_INFO.addressBn}। মেইন রোড থেকে মাত্র ১৫০ মিটার ভেতরে। ভবনের গ্রাউন্ড ফ্লোরে সদস্যদের মোটরসাইকেল ও সাইকেলের জন্য ২৪ ঘণ্টা সিকিউরিটি গার্ড নিয়ন্ত্রিত সুরক্ষিত পার্কিং রয়েছে।`
          : `${BUSINESS_INFO.addressEn}. Situated just 150m from the Main Road. The building includes covered ground-floor parking for member motorcycles and bicycles with 24/7 security.`,
      specs: [
        { label: language === "bn" ? "মেইন রোড থেকে দূরত্ব" : "From Main Road", value: "150m (2 Min Walk)" },
        { label: language === "bn" ? "যাতায়াত সুবিধা" : "Accessibility", value: "Easy Public & Private Access" },
        { label: language === "bn" ? "পার্কিং সুবিধা" : "Parking Facility", value: "Dedicated Ground Floor Bike Bay" },
        { label: language === "bn" ? "ভবন নিরাপত্তা" : "Premises Security", value: "24/7 Security Personnel on Duty" },
      ],
    },
  ];

  const protocols = [
    ...apiFaqs.map((faq: any, idx: number) => ({
      id: faq.id,
      category: "admission",
      categoryLabel: "General FAQ",
      badge: "Verified",
      question: faq.question,
      answer: faq.answer,
      specs: [],
    })),
    ...baseProtocols,
  ];

  const filtered =
    activeTab === "all"
      ? protocols
      : protocols.filter((p) => p.category === activeTab);

  return (
    <section id="faq" className="py-24 px-4 sm:px-6 lg:px-8 border-b border-white/[0.06] bg-white dark:bg-[#0b0b0d]">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 pb-8 border-b border-white/[0.08]">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs font-medium text-[#22c55e] mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e]" />
              <span>Frequently Asked Questions</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white uppercase">
              {language === "bn" ? "ক্লাব প্রটোকল ও নিয়মাবলী" : "Rules & FAQs"}
            </h2>
          </div>
          <p className="text-sm text-zinc-400 max-w-md font-normal leading-relaxed">
            {language === "bn"
              ? "শিফটের সময়সূচি, নারীদের শতভাগ গোপনীয়তা, ট্রেইনারের প্রাপ্যতা ও ফি সংক্রান্ত স্বচ্ছ নীতিমালা।"
              : "Clear answers to member questions regarding shifts, privacy, trainer guidance, and admission policies."}
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex flex-wrap items-center gap-2 mb-10 pb-4 border-b border-white/[0.06]">
          {[
            { key: "all", labelEn: "All Questions", labelBn: "সকল প্রশ্ন" },
            { key: "shifts", labelEn: "Shift Timings", labelBn: "শিফট সময়সূচি" },
            { key: "privacy", labelEn: "Female Privacy", labelBn: "নারী নিরাপত্তা" },
            { key: "coaching", labelEn: "Coaching & Rules", labelBn: "প্রশিক্ষক ও নিয়মাবলী" },
            { key: "admission", labelEn: "Fees & Campus", labelBn: "ফি ও ক্যাম্পাস" },
          ].map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-4 py-2 text-xs font-semibold rounded-sm transition-all cursor-pointer ${
                activeTab === tab.key
                  ? "bg-[#22c55e] !text-black shadow-md shadow-[#22c55e]/20"
                  : "bg-white/[0.04] text-zinc-300 hover:text-white border border-white/[0.06]"
              }`}
            >
              <span>{language === "bn" ? tab.labelBn : tab.labelEn}</span>
            </button>
          ))}
        </div>

        {/* Accordion Table */}
        <div className="border border-white/[0.08] divide-y divide-white/[0.08] bg-[#0e0e12] mb-12 rounded-2xl shadow-xl overflow-hidden">
          {filtered.map((item: any, idx: number) => {
            const isOpen = openId === item.id;

            return (
              <div key={item.id} className="transition-colors">
                <button
                  type="button"
                  onClick={() => setOpenId(isOpen ? null : item.id)}
                  aria-expanded={isOpen}
                  className="w-full p-6 sm:p-7 text-left flex items-start justify-between gap-6 cursor-pointer group focus:outline-none hover:bg-white/[0.015]"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-[#22c55e]">
                        {item.categoryLabel}
                      </span>
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-zinc-400">
                        {item.badge}
                      </span>
                    </div>

                    <h3
                      className={`text-base sm:text-lg font-bold tracking-tight transition-colors ${
                        isOpen ? "text-white" : "text-zinc-200 group-hover:text-white"
                      }`}
                    >
                      {item.question}
                    </h3>
                  </div>

                  <div
                    className={`w-8 h-8 rounded-full border flex items-center justify-center shrink-0 transition-all ${
                      isOpen
                        ? "bg-[#22c55e] border-[#22c55e] text-black font-bold shadow-md shadow-[#22c55e]/20"
                        : "border-white/[0.1] bg-white/[0.02] text-zinc-400 group-hover:border-white/30 group-hover:text-white"
                    }`}
                  >
                    {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </div>
                </button>

                {/* Expanded Details */}
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden border-t border-white/[0.06] bg-[#121217]"
                    >
                      <div className="px-6 sm:px-7 pb-7 pt-5 space-y-5">
                        <p className="text-sm text-zinc-300 font-normal leading-relaxed max-w-3xl">
                          {item.answer}
                        </p>

                        {/* Specs Matrix */}
                        {item.specs && item.specs.length > 0 && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
                            {item.specs.map((spec: any, i: number) => (
                              <div
                                key={i}
                                className="p-3.5 border border-white/[0.08] bg-[#0e0e12] rounded-xl"
                              >
                                <span className="text-xs text-zinc-400 block mb-1">
                                  {spec.label}
                                </span>
                                <span className="text-xs sm:text-sm font-semibold text-white block">
                                  {spec.value}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Clean Callout Card */}
        <div className="border border-white/[0.08] p-6 sm:p-8 bg-[#0e0e12] flex flex-col md:flex-row md:items-center justify-between gap-6 rounded-2xl shadow-xl">
          <div>
            <div className="text-xs text-[#22c55e] font-semibold mb-1">
              Need Personalized Guidance?
            </div>
            <h4 className="text-xl font-bold text-white tracking-tight">
              Have More Questions Before Joining?
            </h4>
            <p className="text-xs text-zinc-400 mt-1">
              Call our front desk at {BUSINESS_INFO.phone} or drop by {BUSINESS_INFO.addressEn}.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <a
              href={`tel:${BUSINESS_INFO.phone}`}
              className="px-4 py-2.5 border border-white/[0.12] bg-white/[0.04] hover:bg-white/[0.08] text-white text-xs font-semibold transition-colors flex items-center gap-2 rounded-sm"
            >
              <Phone className="w-3.5 h-3.5 text-[#22c55e]" />
              <span>Call Front Desk</span>
            </a>

            <a
              href="#contact"
              className="px-5 py-2.5 bg-[#22c55e] hover:bg-[#16a34a] !text-black font-bold text-xs transition-all flex items-center gap-1.5 shadow-md shadow-[#22c55e]/25 cursor-pointer rounded-sm"
            >
              <span className="!text-black">Book Free Trial</span>
              <ArrowUpRight className="w-3.5 h-3.5 !text-black stroke-[2.5]" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
