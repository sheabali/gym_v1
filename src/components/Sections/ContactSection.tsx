"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { useLanguage } from "@/context/LanguageContext";
import { BUSINESS_INFO } from "@/data/gymData";
import { useSubmitContactMutation } from "@/redux/api/contactApi";
import { motion } from "framer-motion";
import MagneticButton from "@/components/Motion/MagneticButton";
import {
  MapPin,
  Phone,
  ArrowRight,
  MessageSquare,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Clock,
  Star,
} from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, { message: "Please enter your full name (at least 2 letters)" }),
  phone: z
    .string()
    .min(10, { message: "Please enter a valid phone number (at least 10 digits)" }),
  plan: z.string().min(1, { message: "Please select a plan" }),
  slot: z.string().min(1, { message: "Please select a preferred shift slot" }),
  message: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function ContactSection() {
  const { language, t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      plan: "half-yearly",
      slot: "male-evening",
      message: "",
    },
  });

  const selectedPlan = watch("plan");
  const selectedSlot = watch("slot");

  // Listen to select-gym-plan event from pricing cards
  useEffect(() => {
    const handleSelectGymPlan = (e: any) => {
      if (e.detail?.planId) {
        setValue("plan", e.detail.planId);
      }
    };
    window.addEventListener("select-gym-plan", handleSelectGymPlan);
    return () => window.removeEventListener("select-gym-plan", handleSelectGymPlan);
  }, [setValue]);

  const [submitContact] = useSubmitContactMutation();

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      await submitContact({
        name: data.name,
        phone: data.phone,
        preferredPlan: data.plan,
        preferredSlot: data.slot,
        message: data.message || "Website Direct Booking Form Inquiry",
      }).unwrap();

      setIsSubmitted(true);
      reset();
      toast.success(
        language === "bn"
          ? "আপনার অনুরোধ সফলভাবে পাঠানো হয়েছে! আমরা শীঘ্রই যোগাযোগ করব।"
          : "Your visit request has been received! Our front desk will contact you."
      );
    } catch (err: any) {
      toast.error(
        err?.data?.message ||
          (language === "bn"
            ? "দুঃখিত, অনুরোধ পাঠাতে ব্যর্থ হয়েছে। অনুগ্রহ করে ফোন করুন।"
            : "Failed to submit request. Please call our front desk directly.")
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const planOptions = [
    { id: "single", titleEn: "Monthly", titleBn: "১ মাস", price: "৳2,500" },
    { id: "quarterly", titleEn: "3 Months", titleBn: "৩ মাস", price: "৳6,500" },
    { id: "half-yearly", titleEn: "6 Months", titleBn: "৬ মাস", price: "৳11,000" },
    { id: "yearly", titleEn: "12 Months", titleBn: "১ বছর", price: "৳18,000" },
    { id: "trial", titleEn: "Free Trial", titleBn: "ফ্রি ট্রায়াল", price: "Free" },
  ];

  const slotOptions = [
    {
      id: "male-morning",
      titleEn: "Male Morning",
      titleBn: "পুরুষ সকাল",
      time: "07:00 – 11:30 AM",
    },
    {
      id: "female-afternoon",
      titleEn: "Female Only",
      titleBn: "নারী শিফট",
      time: "12:00 – 04:30 PM",
    },
    {
      id: "combined-shift",
      titleEn: "Combined",
      titleBn: "কম্বাইন্ড",
      time: "04:30 – 06:30 PM",
    },
    {
      id: "male-evening",
      titleEn: "Male Prime",
      titleBn: "পুরুষ সন্ধ্যা",
      time: "06:30 – 10:30 PM",
    },
  ];

  return (
    <section id="contact" className="py-24 px-4 sm:px-6 lg:px-8 border-b border-white/[0.06] bg-white dark:bg-[#0b0b0d]">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14 pb-8 border-b border-white/[0.08]">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs font-medium text-[#22c55e] mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e]" />
              <span>Get in Touch</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white uppercase">
              {language === "bn" ? "লোকেশন ও যোগাযোগ" : "Visit & Connect"}
            </h2>
          </div>
          <div className="max-w-md">
            <span className="text-xs text-[#22c55e] font-semibold block mb-1">
              {BUSINESS_INFO.addressEn}
            </span>
            <p className="text-sm text-zinc-400 font-normal leading-relaxed">
              {language === "bn"
                ? "সরাসরি চলে আসুন আমাদের প্রধান জিম ভিজিট করতে, অথবা নিচের ফর্মটি পূরণ করে ফ্রি ট্রায়াল নিশ্চিত করুন।"
                : "Drop by our flagship campus, or schedule your complimentary walkthrough and trial below."}
            </p>
          </div>
        </div>

        {/* 2-Column Balanced Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Left Column (5 Cols): Campus Details & Location Map */}
          <div className="lg:col-span-5 space-y-6">
            <div className="border border-white/[0.08] bg-[#0e0e12] p-6 sm:p-7 rounded-2xl space-y-5 shadow-xl">
              <div>
                <span className="text-xs text-[#22c55e] font-semibold block mb-1">
                  Main Campus • {BUSINESS_INFO.area}
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  {BUSINESS_INFO.name}
                </h3>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                  {BUSINESS_INFO.addressEn}
                </p>
              </div>

              {/* Hours & Rating */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/[0.06] text-xs">
                <div>
                  <span className="text-[11px] text-zinc-500 font-medium block mb-0.5">Operating Hours</span>
                  <span className="font-semibold text-white">{BUSINESS_INFO.openingHoursEn}</span>
                </div>
                <div>
                  <span className="text-[11px] text-zinc-500 font-medium block mb-0.5">Verified Rating</span>
                  <span className="font-bold text-[#22c55e] flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-[#22c55e]" />
                    <span>{BUSINESS_INFO.googleRating} ({BUSINESS_INFO.reviewCount} Reviews)</span>
                  </span>
                </div>
              </div>

              {/* Direct Communication Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <a
                  href={`tel:${BUSINESS_INFO.phone}`}
                  className="py-2.5 px-3 bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.1] text-white text-xs flex items-center justify-center gap-2 transition-colors font-semibold rounded-sm"
                >
                  <Phone className="w-3.5 h-3.5 text-[#22c55e]" />
                  <span>{BUSINESS_INFO.phone}</span>
                </a>

                <a
                  href={`${BUSINESS_INFO.whatsapp}?text=${encodeURIComponent(`Hello ${BUSINESS_INFO.name}, I want to visit the gym`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-3 bg-[#22c55e]/10 hover:bg-[#22c55e]/20 border border-[#22c55e]/30 text-[#22c55e] text-xs flex items-center justify-center gap-2 transition-colors font-semibold rounded-sm"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Google Map Box */}
            <div className="border border-white/[0.08] bg-[#0e0e12] overflow-hidden rounded-2xl shadow-xl">
              <div className="h-60 sm:h-64 w-full relative">
                <iframe
                  title={`${BUSINESS_INFO.name} Map`}
                  src={BUSINESS_INFO.googleMapsEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0, filter: "invert(90%) hue-rotate(180deg) contrast(120%)" }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full"
                />
              </div>

              <div className="p-3.5 bg-[#121216] flex items-center justify-between text-xs border-t border-white/[0.08]">
                <span className="flex items-center gap-2 text-zinc-300">
                  <span className="w-2 h-2 rounded-full bg-[#22c55e]" />
                  <span>{BUSINESS_INFO.plusCode}</span>
                </span>
                <a
                  href={BUSINESS_INFO.googleMapsDirectionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#22c55e] hover:text-[#16a34a] font-semibold flex items-center gap-1 transition-colors"
                >
                  <span>Get Directions</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>

          {/* Right Column (7 Cols): Modern Booking Form */}
          <div className="lg:col-span-7 border border-white/[0.08] bg-[#0e0e12] p-6 sm:p-8 rounded-2xl shadow-xl">
            <div className="pb-5 mb-6 border-b border-white/[0.08]">
              <span className="text-xs text-[#22c55e] font-semibold block mb-1">
                Online Registration & Inquiry
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                {language === "bn" ? "অ্যাডমিশন ও ফ্রি ট্রায়াল ফর্ম" : "Book a Visit or Membership"}
              </h3>
            </div>

            {isSubmitted ? (
              <div className="py-12 px-6 border border-[#22c55e]/30 bg-[#22c55e]/5 text-center flex flex-col items-center rounded-sm">
                <div className="w-12 h-12 bg-[#22c55e] text-black flex items-center justify-center mb-4 rounded-full">
                  <CheckCircle2 className="w-6 h-6 !text-black stroke-[2.5]" />
                </div>
                <h4 className="text-xl sm:text-2xl font-bold text-white mb-2">
                  {language === "bn" ? "অনুরোধ নিশ্চিত করা হয়েছে!" : "Booking Request Received!"}
                </h4>
                <p className="text-sm text-zinc-400 max-w-md mb-8 leading-relaxed">
                  {language === "bn"
                    ? `${BUSINESS_INFO.nameBangla} নির্বাচন করার জন্য ধন্যবাদ। আমাদের ফ্রন্ট ডেস্ক ম্যানেজার আপনার নম্বরে দ্রুত কল করে সেশন নিশ্চিত করবেন।`
                    : `Thank you for choosing ${BUSINESS_INFO.name}. Our front desk team will contact you shortly to confirm your entry.`}
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <a
                    href={`${BUSINESS_INFO.whatsapp}?text=${encodeURIComponent(`Hello ${BUSINESS_INFO.name}, I just submitted my enrollment request`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 bg-[#22c55e] hover:bg-[#16a34a] !text-black text-xs font-bold transition-all flex items-center gap-2 rounded-sm shadow-md shadow-[#22c55e]/20"
                  >
                    <MessageSquare className="w-3.5 h-3.5 !text-black stroke-[2.5]" />
                    <span className="!text-black">Notify via WhatsApp</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => setIsSubmitted(false)}
                    className="px-5 py-2.5 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.1] text-xs font-medium text-white transition-colors cursor-pointer rounded-sm"
                  >
                    {language === "bn" ? "আরেকটি ফর্ম পূরণ করুন" : "Submit Another Request"}
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* 1. Package Selector */}
                <div>
                  <label className="text-xs uppercase tracking-wider text-zinc-300 font-semibold mb-2.5 block">
                    1. Select Membership Plan
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-2">
                    {planOptions.map((opt) => {
                      const isSelected = selectedPlan === opt.id;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => setValue("plan", opt.id)}
                          className={`py-2.5 px-3 border text-center transition-all cursor-pointer rounded-sm ${
                            isSelected
                              ? "bg-[#22c55e] !text-black font-bold border-[#22c55e] shadow-md shadow-[#22c55e]/20"
                              : "bg-[#121216] border-white/[0.08] text-zinc-300 hover:border-white/20 hover:text-white"
                          }`}
                        >
                          <span className={`text-xs block font-bold ${isSelected ? "!text-black" : "text-white"}`}>
                            {language === "bn" ? opt.titleBn : opt.titleEn}
                          </span>
                          <span className={`text-[11px] block mt-0.5 ${isSelected ? "!text-black/80 font-bold" : "text-[#22c55e]"}`}>
                            {opt.price}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Shift Selector */}
                <div>
                  <label className="text-xs uppercase tracking-wider text-zinc-300 font-semibold mb-2.5 block">
                    2. Preferred Shift Slot
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {slotOptions.map((slot) => {
                      const isSelected = selectedSlot === slot.id;
                      return (
                        <button
                          key={slot.id}
                          type="button"
                          onClick={() => setValue("slot", slot.id)}
                          className={`py-2 px-2.5 border text-center transition-all cursor-pointer rounded-sm ${
                            isSelected
                              ? "bg-[#22c55e] !text-black font-bold border-[#22c55e] shadow-md shadow-[#22c55e]/20"
                              : "bg-[#121216] border-white/[0.08] text-zinc-300 hover:border-white/20 hover:text-white"
                          }`}
                        >
                          <span className={`text-xs block font-bold ${isSelected ? "!text-black" : "text-white"}`}>
                            {language === "bn" ? slot.titleBn : slot.titleEn}
                          </span>
                          <span className={`text-[10px] block mt-0.5 ${isSelected ? "!text-black/80 font-medium" : "text-zinc-400"}`}>
                            {slot.time}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Name & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                      {t.contact.nameLabel} <span className="text-[#22c55e]">*</span>
                    </label>
                    <input
                      type="text"
                      {...register("name")}
                      placeholder={t.contact.namePlaceholder}
                      className={`w-full px-4 py-3 bg-[#121216] border text-sm text-white placeholder-zinc-500 focus:outline-none transition-all rounded-xl ${
                        errors.name
                          ? "border-red-500 focus:border-red-500"
                          : "border-white/[0.08] focus:border-[#22c55e]"
                      }`}
                    />
                    {errors.name && (
                      <p className="text-xs text-red-400 mt-1">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                      {t.contact.phoneLabel} <span className="text-[#22c55e]">*</span>
                    </label>
                    <input
                      type="tel"
                      {...register("phone")}
                      placeholder={t.contact.phonePlaceholder}
                      className={`w-full px-4 py-3 bg-[#121216] border text-sm text-white placeholder-zinc-500 focus:outline-none transition-all rounded-xl ${
                        errors.phone
                          ? "border-red-500 focus:border-red-500"
                          : "border-white/[0.08] focus:border-[#22c55e]"
                      }`}
                    />
                    {errors.phone && (
                      <p className="text-xs text-red-400 mt-1">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Optional Message Field */}
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                    {language === "bn" ? "অতিরিক্ত বার্তা বা লক্ষ্য (ঐচ্ছিক)" : "Additional Notes or Goal (Optional)"}
                  </label>
                  <textarea
                    {...register("message")}
                    rows={2}
                    placeholder={language === "bn" ? "আপনার কোনো বিশেষ লক্ষ্য বা জিজ্ঞাসা থাকলে লিখুন..." : "Any fitness goals, weight targets, or questions..."}
                    className="w-full px-4 py-2.5 bg-[#121216] border border-white/[0.08] focus:border-[#22c55e] text-sm text-white placeholder-zinc-500 focus:outline-none transition-all rounded-sm resize-none"
                  />
                </div>

                {/* 4. Action Button */}
                <div className="pt-2">
                  <MagneticButton
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 rounded-sm text-sm font-bold !text-black bg-[#22c55e] hover:bg-[#16a34a] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-[#22c55e]/25"
                  >
                    {isSubmitting ? (
                      <span className="!text-black">{t.contact.submitting}</span>
                    ) : (
                      <>
                        <span className="!text-black">
                          {language === "bn" ? "বুকিং নিশ্চিত করুন" : "Confirm Admission or Trial"}
                        </span>
                        <ArrowRight className="w-4 h-4 !text-black stroke-[2.5]" />
                      </>
                    )}
                  </MagneticButton>

                  <div className="flex items-center justify-center gap-2 pt-3 text-xs text-zinc-400">
                    <ShieldCheck className="w-4 h-4 text-[#22c55e]" />
                    <span>No advance payment needed • Confirmation call by front desk</span>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
