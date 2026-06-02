"use client";

import React, { useRef } from "react";
import { gsap, useGSAP, SplitText } from "@/lib/gsap";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

const FEATURES = [
  {
    title: "Ship Agency & Husbandry",
    description: "Complete vessel husbandry services, from port clearance and documentation to coordination and onboard provisioning.",
    stat: "Managed calls: Safeen Argus 2, Luna Nelle",
    image: "/images/service-1.png",
    category: "Vessel Operations",
  },
  {
    title: "Air & Sea Freight Solutions",
    description: "Cost-effective, secure transport across borders powered by a global network and deep regional expertise.",
    stat: "West Africa Focus / Ghana Hub",
    image: "/images/hero.png",
    category: "Logistics",
  },
  {
    title: "Bunkering & Fuel Logistics",
    description: "Reliable fuel sourcing and delivery with transparent supply chains, ensuring offshore assets keep moving.",
    stat: "Supporting Borr Drilling Operations",
    image: "/images/projects/borr-drilling-heavy-lift.jpg",
    category: "Energy Support",
  },
  {
    title: "Warehousing & Consolidation",
    description: "Secure, optimized storage with smart supply chain planning to reduce costs and improve efficiency.",
    stat: "Industrial & Bulk Commodities",
    image: "/images/project-4.png",
    category: "Supply Chain",
  },
];

export default function Features() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // Header: h2 lines animate in — all screens
      const split = new SplitText(".features-heading", { type: "lines" });
      gsap.from(split.lines, {
        y: 70,
        opacity: 0,
        stagger: 0.12,
        duration: 1,
        ease: "power4.out",
        scrollTrigger: {
          trigger: ".features-heading",
          start: "top 85%",
        },
      });

      // Subtitle paragraph — all screens
      gsap.from(".features-subtitle", {
        y: 30,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".features-subtitle",
          start: "top 88%",
        },
      });

      // Cards: building-block clip-path reveal — all screens
      gsap.from(".feature-card", {
        clipPath: "inset(100% 0 0 0)",
        duration: 1,
        ease: "power4.inOut",
        stagger: {
          each: 0.15,
          from: "start",
        },
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 70%",
        },
      });
    },
    { scope: containerRef }
  );

  return (
    <section ref={containerRef} className="bg-background py-16 md:py-24 lg:py-40">
      <div className="px-6 md:px-12 lg:px-24">
        {/* Section header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 md:gap-12 mb-12 md:mb-24">
          <div className="space-y-3">
            <div className="section-eyebrow text-accent">Service Pillars</div>
            <h2 className="features-heading font-display text-4xl sm:text-5xl font-bold tracking-tighter text-balance lg:text-8xl">
              INTEGRATED <br />
              SOLUTIONS.
            </h2>
          </div>
          <div className="max-w-xs pb-0 md:pb-4">
            <p className="features-subtitle text-sm md:text-base text-muted-foreground leading-relaxed text-pretty">
              High-performance logistics built on over a decade of West African sub-region expertise.
            </p>
          </div>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
          {FEATURES.map((feature, i) => (
            <div
              key={feature.title}
              className="feature-card rounded-md group relative overflow-hidden bg-card border border-border"
              style={{ aspectRatio: "16/10" }}
            >
              <div className="absolute inset-0 z-0 transition-transform duration-700 group-hover:scale-105">
                <Image
                  src={feature.image}
                  alt={feature.title}
                  fill
                  sizes="(max-width: 640px) 100vw, 50vw"
                  className="object-cover opacity-100 md:opacity-50 transition-all duration-700 md:group-hover:opacity-80"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/55 to-black/15" />
              </div>

              <div className="relative z-10 flex h-full flex-col justify-end p-5 sm:p-7 lg:p-12 gap-3">
                {/* Category pill + arrow */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 bg-accent/90 backdrop-blur-sm px-2.5 py-1.5 shrink-0 rounded-md">
                    <div className="h-1 w-1 rounded-full bg-white/80" />
                    <span className="font-mono text-[8px] sm:text-[9px] font-bold uppercase tracking-[0.35em] text-white">
                      {feature.category}
                    </span>
                  </div>
                  <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-md flex items-center justify-center border border-white/30 text-white group-hover:bg-accent group-hover:border-accent transition-all shrink-0">
                    <ArrowUpRight size={13} />
                  </div>
                </div>

                {/* Title */}
                <h3 className="font-display text-xl sm:text-2xl lg:text-4xl font-bold tracking-tighter leading-none text-white group-hover:text-accent transition-colors drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                  {feature.title}
                </h3>

                {/* Description */}
                <div className="md:grid md:grid-rows-[0fr] md:group-hover:grid-rows-[1fr] transition-[grid-template-rows] duration-500">
                  <p className="overflow-hidden text-xs sm:text-sm text-white/75 max-w-sm text-pretty md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-500 drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)] leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                {/* Stat */}
                <div className="flex items-center gap-2">
                  <div className="h-1 w-1 rounded-full bg-accent shrink-0" />
                  <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-accent drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">
                    {feature.stat}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
