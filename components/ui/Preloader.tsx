"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

export default function Preloader() {
  const containerRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [percentage, setPercentage] = useState(0);
  const [skip, setSkip] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("nb_preloader_seen")) {
      setSkip(true);
      if (containerRef.current) containerRef.current.style.display = "none";
      (window as any).__preloaderDone = true;
      window.dispatchEvent(new CustomEvent("preloader:complete"));
    } else {
      sessionStorage.setItem("nb_preloader_seen", "1");
    }
  }, []);

  useGSAP(
    () => {
      if (skip) return;

      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReduced) {
        if (containerRef.current) containerRef.current.style.display = "none";
        (window as any).__preloaderDone = true;
        window.dispatchEvent(new CustomEvent("preloader:complete"));
        return;
      }

      const DURATION = 1.2; // Optimized slightly more from 1.4s
      const tl = gsap.timeline({
        onComplete: () => {
          if (containerRef.current) containerRef.current.style.display = "none";
          (window as any).__preloaderDone = true;
          window.dispatchEvent(new CustomEvent("preloader:complete"));
        }
      });

      const countObj = { value: 0 };

      // 1. Progress counter fill
      tl.to(countObj, {
        value: 100,
        duration: DURATION,
        ease: "power2.out",
        onUpdate: () => setPercentage(Math.floor(countObj.value)),
      });

      tl.to(progressRef.current, {
        scaleX: 1,
        duration: DURATION,
        ease: "power2.out",
      }, 0);

      // 2. Quickly clear preloader typography
      tl.to(".preloader-text", {
        y: -15,
        opacity: 0,
        stagger: 0.05,
        duration: 0.25,
        ease: "power2.in"
      }, "-=0.15");

      // 3. Reveal Hero instantly via clipPath swipe-up while text is finishing fade
      tl.to(containerRef.current, {
        clipPath: "inset(0 0 100% 0)",
        duration: 0.65,
        ease: "power4.inOut",
      }, "-=0.1"); // Creates a beautiful overlapping reveal sequence
    },
    { scope: containerRef, dependencies: [skip] }
  );

  if (skip) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-foreground text-background will-change-transform"
      style={{ clipPath: "inset(0 0 0% 0)" }}
    >
      <div className="relative flex flex-col items-center gap-4">
        <div className="preloader-text overflow-hidden">
          <div className="text-xs font-bold uppercase tracking-[0.4em] opacity-60">
            North-Brook Operations
          </div>
        </div>

        <div ref={counterRef} className="preloader-text font-display text-8xl font-bold tracking-tighter lg:text-[12vw]">
          {percentage.toString().padStart(3, "0")}
        </div>

        <div className="preloader-text overflow-hidden">
          <div className="text-[10px] font-mono uppercase tracking-widest">
            System Initialization / West Africa
          </div>
        </div>

        <div className="mt-12 h-[1px] w-64 overflow-hidden bg-background/10 lg:w-96">
          <div
            ref={progressRef}
            className="h-full w-full origin-left scale-x-0 bg-accent"
          />
        </div>
      </div>

      <div className="absolute bottom-12 left-12 font-mono text-[9px] uppercase tracking-widest opacity-40">
        Status: High Priority / Integrated Logistics
      </div>
    </div>
  );
}