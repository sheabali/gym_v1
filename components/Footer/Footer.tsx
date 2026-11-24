"use client";

import React from "react";
import { BUSINESS_INFO } from "@/data/gymData";
import { useLanguage } from "@/context/LanguageContext";
import {
  MapPin,
  Phone,
  Clock,
  ShieldCheck,
  Facebook,
  Instagram,
  Youtube,
  ArrowUp,
  Star,
  MessageSquare,
} from "lucide-react";

export default function Footer() {
  const { language, t } = useLanguage();

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const navLinks = [
    { href: "#about", label: t.nav.about },
    { href: "#facilities", label: t.nav.facilities },
    { href: "#schedule", label: t.nav.schedule },
    { href: "#trainers", label: t.nav.trainers },
    { href: "#pricing", label: t.nav.pricing },
    { href: "#gallery", label: t.nav.gallery },
    { href: "#reviews", label: t.nav.reviews },
    { href: "#contact", label: t.nav.contact },
  ];

  return (
    <footer className="bg-slate-50 dark:bg-[#070709] border-t border-white/[0.08] relative overflow-hidden text-zinc-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-14 border-b border-white/[0.08]">
          {/* Brand & Identity Column */}
          <div className="lg:col-span-5 space-y-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 bg-[#22c55e] text-black flex items-center justify-center font-black text-xs rounded-lg shadow-sm">
                  {BUSINESS_INFO.shortCode}
                </div>
                <span className="text-xs font-semibold text-zinc-400">{BUSINESS_INFO.area}</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#22c55e]/15 text-[#22c55e] border border-[#22c55e]/30">
                  {BUSINESS_INFO.established}
                </span>
              </div>
              <h3 className="text-2xl font-black text-white tracking-tight uppercase">
                {BUSINESS_INFO.name.toUpperCase()}
              </h3>
              <p className="text-xs text-zinc-400">
                {BUSINESS_INFO.nameBangla} • {BUSINESS_INFO.area}
              </p>
            </div>

            <p className="text-sm text-zinc-400 leading-relaxed max-w-sm">
              {t.footer.tagline}
            </p>

            {/* Google Rating Pill */}
            <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.08]">
              <div className="flex items-center gap-1 text-amber-400 font-bold text-xs">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span>4.4 / 5.0</span>
              </div>
              <span className="text-zinc-600 text-xs">•</span>
              <span className="text-xs text-zinc-400">
                173 {language === "bn" ? "গুগল রিভিউ" : "Google Reviews"}
              </span>
            </div>

            {/* Social Channels */}
            <div className="flex items-center gap-2.5 pt-1">
              <a
                href={BUSINESS_INFO.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="w-9 h-9 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
              </a>
              <a
                href={BUSINESS_INFO.socials.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-9 h-9 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href={BUSINESS_INFO.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={BUSINESS_INFO.socials.youtube}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="w-9 h-9 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-semibold tracking-wider uppercase text-white">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-zinc-400 hover:text-white transition-colors inline-block py-0.5"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Daily Schedule Summary */}
          <div className="lg:col-span-4 space-y-3 text-xs">
            <h4 className="text-xs font-semibold tracking-wider uppercase text-white">
              Daily Shift Timetable
            </h4>
            <div className="space-y-2">
              <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between">
                <span className="text-zinc-400">Male Morning</span>
                <span className="text-white font-medium">07:00 – 11:30 AM</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between">
                <span className="text-[#22c55e] font-medium">Female Private</span>
                <span className="text-white font-medium">12:00 – 04:30 PM</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between">
                <span className="text-zinc-400">Combined Shift</span>
                <span className="text-white font-medium">04:30 – 06:30 PM</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between">
                <span className="text-zinc-400">Male Evening</span>
                <span className="text-white font-medium">06:30 – 10:30 PM</span>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-2 text-xs text-zinc-500">
              <ShieldCheck className="w-3.5 h-3.5 text-[#22c55e]" />
              <span>Open 7 Days a Week • Continuous Central Inverter AC</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Telemetry, Copyright, Back to top */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#22c55e]" />
            <span>{BUSINESS_INFO.name} • {BUSINESS_INFO.area}</span>
          </div>

          <p className="text-center sm:text-left">
            © {new Date().getFullYear()} {BUSINESS_INFO.name}. {BUSINESS_INFO.addressEn}
          </p>

          <button
            type="button"
            onClick={scrollToTop}
            className="flex items-center gap-1.5 text-zinc-400 hover:text-white transition-colors cursor-pointer group"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </footer>
  );
}
