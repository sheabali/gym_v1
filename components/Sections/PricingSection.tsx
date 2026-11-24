"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { PRICING_PLANS } from "@/src/data/gymData";
import { useGetPlansQuery } from "@/redux/api/planApi";
import { useCheckoutSubscriptionMutation } from "@/redux/api/subscriptionApi";
import { useAppSelector } from "@/redux/hooks";
import { ArrowUpRight, Check, Globe, CreditCard, Banknote, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import CardSpotlight from "@/components/Motion/CardSpotlight";
import MagneticButton from "@/components/Motion/MagneticButton";

export default function PricingSection() {
  const { language, t } = useLanguage();
  const router = useRouter();
  const token = useAppSelector((state) => state.auth.token);
  const { data: plansData, isLoading: plansLoading } = useGetPlansQuery(undefined) as any;
  const [checkoutSubscription, { isLoading: checkingOut }] = useCheckoutSubscriptionMutation() as any;

  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [selectedPlanDetails, setSelectedPlanDetails] = useState<{
    id: string;
    name: string;
    price: number;
    durationDays: number;
  } | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"ONLINE" | "CASH">("ONLINE");

  // Format plans: if backend plans exist and are active, display them alongside official rates
  const backendPlans = plansData?.data || [];

  const handleSelectPlan = (planId: string, planName?: string, pricePaisa?: number, durationDays?: number) => {
    // If backend plan ID is available and user is authenticated, open checkout modal
    if (token && planId && pricePaisa) {
      setSelectedPlanDetails({
        id: planId,
        name: planName || "Membership Plan",
        price: pricePaisa / 100,
        durationDays: durationDays || 30,
      });
      setCheckoutModalOpen(true);
      return;
    }

    // Otherwise, scroll to contact inquiry and prefill
    const el = document.getElementById("contact");
    if (el) {
      const topOffset = 75;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - topOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });

      window.dispatchEvent(
        new CustomEvent("select-gym-plan", { detail: { planId } })
      );
    }
  };

  const handleConfirmCheckout = async () => {
    if (!selectedPlanDetails) return;

    try {
      const result = await checkoutSubscription({
        planId: selectedPlanDetails.id,
        paymentMethod,
      }).unwrap();

      if (paymentMethod === "ONLINE" && result.data.gatewayUrl) {
        toast.info(language === "bn" ? "পেমেন্ট গেটওয়েতে রিডাইরেক্ট করা হচ্ছে..." : "Redirecting to SSLCommerz gateway...");
        window.location.href = result.data.gatewayUrl;
      } else {
        toast.success(
          language === "bn"
            ? `সাবস্ক্রিপশন সফলভাবে শুরু হয়েছে! ট্রানজ্যাকশন আইডি: ${result.data.payment.tranId}`
            : `Subscription requested! Tran ID: ${result.data.payment.tranId}. Please pay at front desk.`
        );
        setCheckoutModalOpen(false);
        router.push("/user");
      }
    } catch (err: any) {
      const errMsg = err?.data?.message || err?.message || "Failed to initiate subscription.";
      toast.error(errMsg);
    }
  };

  // Determine which plan list to display: use backend plans if available, else static official rate card
  const displayPlans = backendPlans.length > 0
    ? backendPlans.map((bp: any) => {
      const matchingStatic = PRICING_PLANS.find(
        (sp) => sp.nameEn.toLowerCase().includes(bp.name.toLowerCase()) || bp.name.toLowerCase().includes(sp.id)
      );
      return {
        id: bp.id,
        rawId: bp.id,
        name: bp.name,
        nameEn: bp.name,
        nameBn: matchingStatic?.nameBn || bp.name,
        periodEn: `${bp.durationDays} Days Access`,
        periodBn: `${bp.durationDays} দিনের মেম্বারশিপ`,
        price: bp.price / 100, // paisa to BDT
        pricePaisa: bp.price,
        durationDays: bp.durationDays,
        admissionFee: matchingStatic?.admissionFee || 2000,
        durationFee: bp.price / 100,
        subTotal: (bp.price / 100) + (matchingStatic?.admissionFee || 2000),
        discount: matchingStatic?.discount || 0,
        popular: bp.isFeatured,
        badgeEn: bp.isFeatured ? "POPULAR" : "OFFICIAL",
        badgeBn: bp.isFeatured ? "জনপ্রিয়" : "অফিশিয়াল",
        featuresEn: bp.features && bp.features.length > 0 ? bp.features : (matchingStatic?.featuresEn || []),
        featuresBn: matchingStatic?.featuresBn || (bp.features && bp.features.length > 0 ? bp.features : []),
      };
    })
    : PRICING_PLANS.map((sp: any) => ({
      ...sp,
      rawId: sp.id,
      pricePaisa: sp.price * 100,
      durationDays: sp.id === "single" ? 30 : sp.id === "half-yearly" ? 180 : 365,
    }));

  return (
    <section id="pricing" className="py-28 px-4 sm:px-6 lg:px-8 border-b border-white/[0.06] bg-white dark:bg-[#0b0b0d]">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 pb-8 border-b border-white/[0.08]">
          <div>
            <div className="mono-label text-[#22c55e] mb-2 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e]" />
              <span>05 • OFFICIAL RATE CARD & MEMBERSHIP PACKAGES</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white uppercase">
              {language === "bn" ? "অফিশিয়াল মেম্বারশিপ প্যাকেজ" : "Official Packages & Pricing"}
            </h2>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs font-mono text-[#22c55e] uppercase tracking-wider font-bold">
              EST. 2015 • ALL-INCLUSIVE RATES
            </span>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-md font-normal leading-relaxed">
              {language === "bn"
                ? "কোনো গোপন চার্জ নেই। ভর্তি ফি, মেয়াদের ফি এবং এককালীন বিশেষ ডিসকাউন্টসহ স্বচ্ছ হিসাব।"
                : "Exact official rates from our front desk. Includes admission fee, duration dues, and instant cash discounts."}
            </p>
          </div>
        </div>

        {/* 4 Official Rate Card Package Columns */}
        {plansLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch mb-14">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="border border-white/[0.08] bg-[#0e0e12] rounded-xs h-96 p-6 animate-pulse flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="h-6 bg-white/[0.05] rounded-xs w-3/4" />
                  <div className="h-4 bg-white/[0.03] rounded-xs w-1/2" />
                  <div className="h-10 bg-white/[0.05] rounded-xs mt-6" />
                </div>
                <div className="h-10 bg-white/[0.05] rounded-xs w-full" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch mb-14">
            {displayPlans.map((plan: any, idx: number) => {
              const isPopular = plan.popular;
              const name = language === "bn" ? plan.nameBn : plan.nameEn;
              const period = language === "bn" ? plan.periodBn : plan.periodEn;
              const badge = language === "bn" ? plan.badgeBn : plan.badgeEn;
              const features = language === "bn" ? plan.featuresBn : plan.featuresEn;
              const admission = (plan.admissionFee ?? 2000).toLocaleString("en-US");
              const durationFee = (plan.durationFee ?? plan.price).toLocaleString("en-US");
              const subTotal = (plan.subTotal ?? (plan.price + 2000)).toLocaleString("en-US");
              const discount = (plan.discount ?? 0).toLocaleString("en-US");

              return (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  className="h-full"
                >
                  <CardSpotlight
                    enableTilt={true}
                    showReticles={true}
                    spotlightColor="rgba(34, 197, 94, 0.18)"
                    className={`h-full flex flex-col justify-between transition-all duration-300 relative rounded-xs ${isPopular
                      ? "border-[#22c55e] shadow-2xl shadow-[#22c55e]/20 lg:scale-[1.02] ring-1 ring-[#22c55e]/50"
                      : "border-white/[0.1] hover:border-white/30"
                      }`}
                  >
                    <div className="flex flex-col justify-between h-full">
                      <div>
                        {/* Rate Card Green Header Bar */}
                        <div className="bg-[#22c55e] px-4 py-2.5 flex items-center justify-between">
                          <span className="!text-black font-black text-xs sm:text-sm tracking-wider uppercase">
                            {name}
                          </span>
                          {badge && (
                            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-xs bg-black text-[#22c55e] uppercase">
                              {badge}
                            </span>
                          )}
                        </div>

                        <div className="p-6">
                          {/* Itemized Rate Table */}
                          <div className="space-y-2.5 pb-5 mb-5 border-b border-white/[0.08] font-mono text-xs">
                            <div className="flex items-center justify-between text-zinc-400">
                              <span>{language === "bn" ? "ভর্তি ফি" : "ADMISSION FEE"}</span>
                              <span className="text-white font-bold">{admission} TK.</span>
                            </div>

                            <div className="flex items-center justify-between text-zinc-400">
                              <span>{language === "bn" ? "প্যাকেজ ফি" : "PACKAGE FEE"}</span>
                              <span className="text-white font-bold">{durationFee} TK.</span>
                            </div>

                            <div className="flex items-center justify-between text-zinc-400 pt-1 border-t border-white/[0.04]">
                              <span>{language === "bn" ? "সাব টোটাল" : "SUB TOTAL"}</span>
                              <span className="text-white font-bold">{subTotal} TK.</span>
                            </div>

                            <div className="flex items-center justify-between text-[#22c55e] font-bold">
                              <span>{language === "bn" ? "ডিসকাউন্ট" : "DISCOUNT"}</span>
                              <span>-{discount} TK.</span>
                            </div>
                          </div>

                          {/* Grand Total Price Block */}
                          <div className="mb-6 p-4 rounded-xs bg-black/60 border border-white/[0.08] shadow-inner">
                            <span className="text-[10px] mono-label text-zinc-400 block mb-1">
                              {language === "bn" ? "সর্বমোট প্রদেয়" : "GRAND TOTAL"}
                            </span>
                            <div className="flex items-baseline gap-1.5">
                              <span className="text-3xl sm:text-4xl font-black text-[#22c55e] tracking-tight font-mono">
                                ৳{plan.price.toLocaleString("en-US")}
                              </span>
                            </div>
                            <span className="text-[11px] mono-label text-zinc-400 block mt-1">
                              {period}
                            </span>
                          </div>

                          {/* Features List */}
                          <ul className="space-y-2.5 mb-6 text-xs text-zinc-300 font-sans">
                            {features.map((feature: any, i: number) => (
                              <li key={i} className="flex items-start gap-2.5 leading-snug">
                                <Check className="w-3.5 h-3.5 text-[#22c55e] shrink-0 mt-0.5" />
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Select / Subscribe Magnetic Button */}
                      <div className="p-6 pt-0 mt-auto">
                        <MagneticButton
                          onClick={() => handleSelectPlan(plan.rawId, plan.nameEn, plan.pricePaisa, plan.durationDays)}
                          className={`w-full py-3.5 text-xs uppercase tracking-wider font-bold transition-all cursor-pointer flex items-center justify-center gap-2 rounded-xs shadow-md ${isPopular
                            ? "bg-[#22c55e] !text-black hover:bg-[#16a34a] shadow-[#22c55e]/25 font-black"
                            : "bg-white/[0.03] border border-white/[0.12] text-white hover:bg-[#22c55e] hover:!text-black hover:border-[#22c55e]"
                            }`}
                        >
                          <span className={isPopular ? "!text-black font-black" : "text-white group-hover:!text-black font-bold"}>
                            {token && plan.pricePaisa ? (language === "bn" ? "সাবস্ক্রাইব করুন" : "Subscribe Now") : t.pricing.selectPlan}
                          </span>
                          <ArrowUpRight className={`w-4 h-4 ${isPopular ? "!text-black stroke-[2.5]" : "text-white group-hover:!text-black stroke-[2]"}`} />
                        </MagneticButton>
                      </div>
                    </div>
<<<<<<< HEAD

                    {/* Select / Subscribe CTA */}
                    <div className="pt-2 mt-auto">
                      <MagneticButton
                        onClick={() => handleSelectPlan(plan.rawId, plan.nameEn, plan.pricePaisa, plan.durationDays)}
                        className={`w-full py-3 text-xs font-bold rounded-sm transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-md ${
                          isPopular
                            ? "bg-[#22c55e] !text-black hover:bg-[#16a34a] shadow-[#22c55e]/25"
                            : "bg-white/[0.04] border border-white/[0.1] text-zinc-200 hover:bg-[#22c55e] hover:!text-black hover:border-[#22c55e]"
                        }`}
                      >
                        <span className={isPopular ? "!text-black" : ""}>
                          {token && plan.pricePaisa ? (language === "bn" ? "সাবস্ক্রাইব করুন" : "Subscribe Now") : t.pricing.selectPlan}
                        </span>
                        <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
                      </MagneticButton>
                    </div>
                  </div>
=======
                  </CardSpotlight>
>>>>>>> 23520c35639d1c633a8bd1adba2b49170f746c86
                </motion.div>
              );
            })}
          </div>
        )}

        {/* 3-Branch Network Directory */}
        <div className="border border-white/[0.08] p-6 sm:p-8 bg-[#0e0e12] space-y-6 rounded-xs shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.06]">
            <div>
              <span className="mono-label text-[10px] text-[#22c55e] block mb-1">
                PLATINUM GYM NETWORK • 3 OFFICIAL BRANCHES
              </span>
              <h4 className="text-xl font-black text-white uppercase tracking-tight">
                {language === "bn" ? "প্লাটিনাম জিম শাখা নেটওয়ার্ক" : "Official Multi-Branch Locations"}
              </h4>
            </div>
            <div className="flex items-center gap-4 text-xs mono-label text-zinc-400">
              <span className="flex items-center gap-1.5 text-white">
                <Globe className="w-3.5 h-3.5 text-[#22c55e]" />
                <a
                  href="https://www.platinumgym.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#22c55e] transition-colors"
                >
                  www.platinumgym.com
                </a>
              </span>
              <span>•</span>
              <span>EST. 2015</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
            <div className="p-4 rounded-xs bg-white/[0.02] border border-white/[0.06]">
              <span className="text-[10px] text-zinc-500 uppercase block mb-1">BRANCH 01</span>
              <span className="text-white font-bold block mb-1 font-sans">Block-J, Banasree</span>
              <p className="text-[11px] text-zinc-400 leading-relaxed font-sans">
                House-01, Road-07, Block-J, Banasree, Dhaka-1219
              </p>
            </div>

            <div className="p-4 rounded-xs bg-[#22c55e]/5 border border-[#22c55e]/30 relative">
              <span className="absolute top-2 right-2 text-[9px] font-bold px-1.5 py-0.2 rounded-xs bg-[#22c55e] text-black uppercase">
                THIS CAMPUS
              </span>
              <span className="text-[10px] text-[#22c55e] uppercase block mb-1">BRANCH 02</span>
              <span className="text-white font-bold block mb-1 font-sans">Block-D, Banasree</span>
              <p className="text-[11px] text-zinc-300 leading-relaxed font-sans">
                House: 16, Road: 03, Block: D, Banasree, Rampura, Dhaka-1219
              </p>
            </div>

            <div className="p-4 rounded-xs bg-white/[0.02] border border-white/[0.06]">
              <span className="text-[10px] text-zinc-500 uppercase block mb-1">BRANCH 03</span>
              <span className="text-white font-bold block mb-1 font-sans">Aftab Nagar, Badda</span>
              <p className="text-[11px] text-zinc-400 leading-relaxed font-sans">
                Siraj Convention Center, Level 7, Plot No-39, Block-C, Aftab Nagar, Badda, Dhaka 1212
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Checkout Dialog for Logged-In Members */}
      <Dialog open={checkoutModalOpen} onOpenChange={setCheckoutModalOpen}>
        <DialogContent className="sm:max-w-md bg-[#0e0e12] border border-white/[0.1] text-white rounded-xs">
          <DialogHeader>
            <DialogTitle className="text-lg font-black uppercase tracking-tight text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#22c55e]" />
              {language === "bn" ? "মেম্বারশিপ চেকআউট নিশ্চিত করুন" : "Confirm Membership Checkout"}
            </DialogTitle>
            <DialogDescription className="text-xs text-zinc-400 font-sans">
              {language === "bn"
                ? "আপনার মেম্বারশিপ এক্টিভেট বা রিনিউ করতে পেমেন্ট মেথড নির্বাচন করুন।"
                : "Select your payment method to activate or renew your Platinum Gym membership."}
            </DialogDescription>
          </DialogHeader>

          {selectedPlanDetails && (
            <div className="space-y-4 py-2">
              <div className="p-3 rounded-xs bg-[#121216] border border-white/[0.08] flex justify-between items-center text-xs">
                <div>
                  <span className="font-bold text-white block font-sans">{selectedPlanDetails.name}</span>
                  <span className="text-zinc-400 font-mono text-[11px]">{selectedPlanDetails.durationDays} Days Active Access</span>
                </div>
                <span className="text-base font-black text-[#22c55e] font-mono">
                  ৳{selectedPlanDetails.price.toLocaleString("en-US")}
                </span>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono uppercase tracking-wider text-zinc-300 block font-semibold">
                  {language === "bn" ? "পেমেন্ট মাধ্যম বেছে নিন:" : "Select Payment Channel:"}
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("ONLINE")}
                    className={`p-3 rounded-sm border text-left flex flex-col gap-1 transition-all cursor-pointer ${paymentMethod === "ONLINE"
                      ? "border-[#22c55e] bg-[#22c55e]/10 text-white"
                      : "border-white/[0.1] bg-white/[0.02] text-zinc-400 hover:text-white"
                      }`}
                  >
                    <CreditCard className="w-5 h-5 text-[#22c55e]" />
                    <span className="text-xs font-bold font-sans">Online Gateway</span>
                    <span className="text-[10px] text-zinc-400 font-sans">Cards / bKash / Nagad</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod("CASH")}
                    className={`p-3 rounded-sm border text-left flex flex-col gap-1 transition-all cursor-pointer ${paymentMethod === "CASH"
                      ? "border-[#22c55e] bg-[#22c55e]/10 text-white"
                      : "border-white/[0.1] bg-white/[0.02] text-zinc-400 hover:text-white"
                      }`}
                  >
                    <Banknote className="w-5 h-5 text-amber-400" />
                    <span className="text-xs font-bold font-sans">Cash at Reception</span>
                    <span className="text-[10px] text-zinc-400 font-sans">Pay at Front Desk</span>
                  </button>
                </div>
              </div>

              <Button
                onClick={handleConfirmCheckout}
                disabled={checkingOut}
                className="w-full bg-[#22c55e] hover:bg-[#16a34a] text-black font-black text-xs font-mono uppercase tracking-wider py-4 rounded-sm cursor-pointer shadow-lg shadow-[#22c55e]/20"
              >
                {checkingOut ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing Checkout...
                  </>
                ) : (
                  `Confirm & ${paymentMethod === "ONLINE" ? "Proceed to Payment" : "Submit Request"}`
                )}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
