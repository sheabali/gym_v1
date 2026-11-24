"use client";

import React, { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";

export default function TransformationSlider() {
  const { language } = useLanguage();
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback(
    (clientX: number) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const position = Math.max(0, Math.min(100, (x / rect.width) * 100));
      setSliderPosition(position);
    },
    []
  );

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    handleMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  return (
    <div className="w-full my-16">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 pb-4 border-b border-white/[0.08]">
        <div>
          <div className="mono-label text-[10px] text-zinc-400 mb-1 font-mono">
            CASE STUDY • AUDIT 01
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            {language === "bn"
              ? "সরাসরি বিফোর-আফটার ফলাফল পর্যবেক্ষণ"
              : "Documented Transformation Comparison"}
          </h3>
        </div>
        <div className="mono-label text-[11px] text-zinc-400 font-mono">
          DRAG TO INSPECT • 01 TO 06 MONTHS
        </div>
      </div>

      {/* Comparison Frame with Hairline Border */}
      <div
        ref={containerRef}
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        onMouseMove={handleMouseMove}
        onTouchStart={() => setIsDragging(true)}
        onTouchEnd={() => setIsDragging(false)}
        onTouchMove={handleTouchMove}
        className="relative aspect-[16/9] sm:aspect-[21/9] w-full border border-white/[0.08] bg-[#0e0e12] select-none cursor-ew-resize overflow-hidden"
      >
        {/* AFTER Image (Background Base) */}
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=1400&q=80"
            alt="Transformed physique after 6 months"
            fill
            className="object-cover contrast-110"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
          <div className="absolute top-4 right-4 z-10 px-2.5 py-1 bg-black/80 backdrop-blur-md border border-white/[0.08] text-[10px] mono-label text-white font-mono">
            MONTH 06 • TRANSFORMED
          </div>
        </div>

        {/* BEFORE Image (Clipped Layer) */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ width: `${sliderPosition}%` }}
        >
          <div
            className="relative h-full w-full"
            style={{
              width: containerRef.current
                ? `${containerRef.current.clientWidth}px`
                : "100%",
            }}
          >
            <Image
              src="https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1400&q=80"
              alt="Physique at day 1"
              fill
              className="object-cover grayscale contrast-125 brightness-90"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
            <div className="absolute top-4 left-4 z-10 px-2.5 py-1 bg-black/80 backdrop-blur-md border border-white/[0.08] text-[10px] mono-label text-zinc-300 font-mono">
              DAY 01 • BASELINE
            </div>
          </div>
        </div>

        {/* Precision Hairline Divider */}
        <div
          className="absolute top-0 bottom-0 w-[1.5px] bg-white shadow-[0_0_10px_rgba(255,255,255,0.4)]"
          style={{ left: `${sliderPosition}%` }}
        >
          {/* Minimalist Drag Handle Ring */}
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-black border border-white flex items-center justify-center text-[10px] font-mono text-white select-none">
            ↔
          </div>
        </div>

        {/* Minimal Case Details */}
        <div className="absolute bottom-4 inset-x-4 z-20 flex items-center justify-between pointer-events-none text-[11px] mono-label text-zinc-300">
          <div className="px-3 py-1 bg-black/80 backdrop-blur-md border border-white/[0.08]">
            {language === "bn"
              ? "সদস্য: মো: রফিকুল ইসলাম • ১২ কেজি মেদ হ্রাস • মেইন ব্রাঞ্চ"
              : "MEMBER: MD. RAFIQUL ISLAM • 12KG LEAN RECOMP • MAIN BRANCH"}
          </div>

          <div className="hidden sm:block px-3 py-1 bg-black/80 backdrop-blur-md border border-white/[0.08]">
            COACH: TANVIR AHMED
          </div>
        </div>
      </div>
    </div>
  );
}
