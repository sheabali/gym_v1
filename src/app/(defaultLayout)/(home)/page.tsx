import React from "react";
import HeroSection from "@/components/Sections/HeroSection";
import LiveEnergyTicker from "@/components/Motion/LiveEnergyTicker";
import AboutSection from "@/components/Sections/AboutSection";
import FacilitiesSection from "@/components/Sections/FacilitiesSection";
import ScheduleSection from "@/components/Sections/ScheduleSection";
import TrainersSection from "@/components/Sections/TrainersSection";
import PricingSection from "@/components/Sections/PricingSection";
import TransformationSection from "@/components/Sections/TransformationSection";
import GallerySection from "@/components/Sections/GallerySection";
import ReviewsSection from "@/components/Sections/ReviewsSection";
import FaqSection from "@/components/Sections/FaqSection";
import ContactSection from "@/components/Sections/ContactSection";
import { BUSINESS_INFO } from "@/data/gymData";

export const metadata = {
  title: `${BUSINESS_INFO.name} (${BUSINESS_INFO.nameBangla}) | Premier Fitness Center in ${BUSINESS_INFO.area}`,
  description:
    `${BUSINESS_INFO.area}’s premier 100% air-conditioned gym. Complete modern equipment, certified trainers in every shift, dedicated male and female time slots. ${BUSINESS_INFO.googleRating} Google rating (${BUSINESS_INFO.reviewCount} reviews). Call ${BUSINESS_INFO.phone}.`,
  keywords: [
    BUSINESS_INFO.name,
    BUSINESS_INFO.nameBangla,
    `Gym in ${BUSINESS_INFO.area}`,
    "Premier Gym",
    "Female gym shift",
    "Air conditioned gym",
    "Modern fitness center",
    "Best gym",
  ],
  openGraph: {
    title: `${BUSINESS_INFO.name} (${BUSINESS_INFO.nameBangla}) - ${BUSINESS_INFO.area}`,
    description:
      `Premier 100% air-conditioned gym in ${BUSINESS_INFO.area}. World-class equipment, certified trainers, and separate male and female shifts.`,
    url: `https://${BUSINESS_INFO.website}`,
    siteName: BUSINESS_INFO.name,
    images: [
      {
        url: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=1200&q=80",
        width: 1200,
        height: 630,
        alt: `${BUSINESS_INFO.name} Main Floor`,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${BUSINESS_INFO.name} (${BUSINESS_INFO.nameBangla}) - ${BUSINESS_INFO.area}`,
    description:
      `Premier 100% air-conditioned gym in ${BUSINESS_INFO.area}. ${BUSINESS_INFO.googleRating} Google rating (${BUSINESS_INFO.reviewCount} reviews).`,
    images: [
      "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=1200&q=80",
    ],
  },
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <LiveEnergyTicker />
      <AboutSection />
      <FacilitiesSection />
      <ScheduleSection />
      <TrainersSection />
      <PricingSection />
      <TransformationSection />
      <GallerySection />
      <ReviewsSection />
      <FaqSection />
      <ContactSection />
    </>
  );
}
