"use client";

import React, { useRef } from "react";
import { gsap, useGSAP, SplitText } from "@/lib/gsap";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import { cn } from "@/lib/utils";
import Image from "next/image";

const STATS = [
  { value: 11, label: "Years Experience", suffix: "+", image: "/images/project-1.png" },
  { value: 8, label: "Service Lines", suffix: "+", image: "/images/project-2.png" },
  { value: 6, label: "Global Certs", suffix: "+", image: "/images/project-3.png" },
  { value: 100, label: "QHSE Compliance", suffix: "%", image: "/images/project-4.png" },
];

export default function Stats() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // H2 animate in — all screens
      const split = new SplitText(".stats-heading", { type: "lines" });
      gsap.from(split.lines, {
        y: 60,
        opacity: 0,
        stagger: 0.12,
        duration: 1,
        ease: "power4.out",
        scrollTrigger: {
          trigger: ".stats-heading",
          start: "top 85%",
        },
      });

      mm.add("(min-width: 768px)", () => {
        const panels = gsap.utils.toArray(".stat-panel");

        panels.forEach((panel: any, i: number) => {
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: panel,
              start: "top 80%",
              toggleActions: "play none none none",
            }
          });

          tl.from(panel.querySelector(".stat-bg"), {
            clipPath: "inset(100% 0 0 0)",
            duration: 1.2,
            ease: "power4.inOut",
          })
            .from(panel.querySelector(".stat-content"), {
              y: 40,
              opacity: 0,
              duration: 0.8,
              ease: "power3.out",
            }, "-=0.6");
        });
      });

      mm.add("(max-width: 767px)", () => {
        gsap.from(".stat-panel-mobile", {
          y: 40,
          opacity: 0,
          stagger: 0.1,
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
          },
        });
      });
    },
    { scope: containerRef }
  );

  return (
    <section ref={containerRef} className="bg-background py-24 lg:py-40">
      <div className="px-6 lg:px-24">
        <div className="mb-24 space-y-4">
          <div className="section-eyebrow text-accent">Proven Track Record</div>
          <h2 className="stats-heading font-display text-5xl font-bold tracking-tighter text-balance lg:text-7xl">
            DELIVERING TRUST <br />
            AT EVERY TURN.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-1">
    
        </div>
      </div>
    </section>
  );
}
