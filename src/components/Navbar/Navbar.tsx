"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { BUSINESS_INFO } from "@/data/gymData";
import { Menu, X, ArrowUpRight } from "lucide-react";
import ThemeToggle from "@/components/Theme/ThemeToggle";

export default function Navbar() {
  const { language, toggleLanguage, t } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      const sections = [
        "hero",
        "about",
        "facilities",
        "schedule",
        "trainers",
        "pricing",
        "transformation",
        "gallery",
        "reviews",
        "faq",
        "contact",
      ];

      const scrollPosition = window.scrollY + 120;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "#about", label: t.nav.about, id: "about" },
    { href: "#facilities", label: t.nav.facilities, id: "facilities" },
    { href: "#schedule", label: t.nav.schedule, id: "schedule" },
    { href: "#trainers", label: t.nav.trainers, id: "trainers" },
    { href: "#pricing", label: t.nav.pricing, id: "pricing" },
    { href: "#gallery", label: t.nav.gallery, id: "gallery" },
    { href: "#reviews", label: t.nav.reviews, id: "reviews" },
    { href: "#contact", label: t.nav.contact, id: "contact" },
  ];

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      const topOffset = 75;
      const elementPosition = (target as HTMLElement).getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - topOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <>
      {/* Main Architectural Header */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 border-b ${isScrolled
          ? "bg-[#0b0b0d]/95 backdrop-blur-xl border-white/[0.08] shadow-lg shadow-black/40 py-3.5"
          : "bg-[#0b0b0d]/80 backdrop-blur-md border-white/[0.05] py-4"
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Minimalist Monumental Wordmark */}
            <Link
              href="/"
              className="flex items-center gap-3 group focus:outline-none"
            >
              <div className="w-7 h-7 bg-[#22c55e] text-black flex items-center justify-center font-black text-xs tracking-tighter rounded-xs transition-colors">
                {BUSINESS_INFO.shortCode}
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-sm sm:text-base tracking-tight text-white group-hover:text-zinc-200 transition-colors">
                    {BUSINESS_INFO.name.toUpperCase()}
                  </span>
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded-sm bg-[#22c55e]/15 text-[#22c55e] border border-[#22c55e]/30 font-bold">
                    {BUSINESS_INFO.established}
                  </span>
                </div>
                <span className="text-[10px] mono-label text-zinc-400">
                  {BUSINESS_INFO.nameBangla} • {BUSINESS_INFO.area.toUpperCase()}
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
              {navLinks.map((link) => {
                const isActive = activeSection === link.id;
                return (
                  <a
                    key={link.id}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className={`text-xs uppercase tracking-wider font-medium transition-colors relative py-1 ${isActive
                      ? "text-white font-semibold"
                      : "text-zinc-400 hover:text-white"
                      }`}
                  >
                    <span>{link.label}</span>
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#22c55e]" />
                    )}
                  </a>
                );
              })}
            </nav>

            {/* Language Switch + Theme Toggle + Primary Action */}
            <div className="hidden sm:flex items-center gap-3">
              {/* Theme Toggle Button */}
              <ThemeToggle />

              {/* Refined Language Toggle */}
              <button
                type="button"
                onClick={toggleLanguage}
                aria-label="Switch Language"
                className="px-2.5 py-1 text-xs mono-label text-zinc-300 hover:text-white border border-white/[0.1] hover:border-white/20 transition-all rounded-sm cursor-pointer"
              >
                {language === "en" ? "BN / বাং" : "EN / English"}
              </button>

              {/* Direct Admission CTA */}
              <a
                href="#contact"
                onClick={(e) => handleNavClick(e, "#contact")}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-sm text-xs uppercase tracking-wider font-black !text-black bg-[#22c55e] hover:bg-[#16a34a] transition-colors cursor-pointer shadow-lg shadow-[#22c55e]/20"
              >
                <span className="!text-black font-black">{t.nav.joinNow}</span>
                <ArrowUpRight className="w-3.5 h-3.5 !text-black stroke-[2.5]" />
              </a>
            </div>

            {/* Mobile Controls */}
            <div className="flex items-center gap-2 lg:hidden">
              <ThemeToggle />

              <button
                type="button"
                onClick={toggleLanguage}
                className="px-2 py-1 text-[11px] mono-label border border-white/10 text-zinc-300 rounded-sm sm:hidden"
              >
                {language === "en" ? "বাং" : "EN"}
              </button>

              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle Menu"
                className="p-1.5 text-zinc-300 hover:text-white focus:outline-none"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Slide-down Panel */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-x-0 top-[60px] bg-[#0b0b0d] border-b border-white/[0.08] shadow-2xl p-6 transition-all duration-300 max-h-[85vh] overflow-y-auto z-50">
            <div className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={`text-sm uppercase tracking-wider font-medium py-2 flex items-center justify-between border-b border-white/[0.04] ${activeSection === link.id
                    ? "text-[#22c55e]"
                    : "text-zinc-300 hover:text-white"
                    }`}
                >
                  <span>{link.label}</span>
                  <ArrowUpRight className="w-4 h-4 opacity-50" />
                </a>
              ))}

              <div className="pt-4 flex flex-col gap-3">
                <a
                  href={`tel:${BUSINESS_INFO.phone}`}
                  className="w-full py-3 text-center text-xs mono-label border border-white/10 text-white"
                >
                  CALL FRONT DESK: {BUSINESS_INFO.phone}
                </a>

                <a
                  href="#contact"
                  onClick={(e) => handleNavClick(e, "#contact")}
                  className="w-full py-3 text-center text-xs uppercase tracking-wider font-black bg-[#22c55e] hover:bg-[#16a34a] !text-black"
                >
                  <span className="!text-black font-black">{t.nav.joinNow}</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}