"use client";

import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { gsap } from "@/lib/gsap";

export default function CustomCursor() {
  const containerRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  // Step 1: mount the portal so refs get attached
  useEffect(() => {
    setMounted(true);
  }, []);

  // Step 2: run cursor logic only after portal is in the DOM
  useEffect(() => {
    if (!mounted) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const container = containerRef.current;
    const ring = ringRef.current;
    const dot = dotRef.current;
    if (!container || !ring || !dot) return;

    const style = document.createElement("style");
    style.id = "hide-default-cursor";
    style.textContent = "*, *::before, *::after { cursor: none !important; }";
    document.head.appendChild(style);

    const xTo = gsap.quickTo(container, "x", { duration: 0.35, ease: "power3" });
    const yTo = gsap.quickTo(container, "y", { duration: 0.35, ease: "power3" });

    let visible = false;

    const onMove = (e: MouseEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
      if (!visible) {
        gsap.to(container, { opacity: 1, duration: 0.2 });
        visible = true;
      }
    };

    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      const isInteractive = t.closest("a, button, [role='button'], input, select, label, .hover-trigger");
      const isHeading = t.closest("h1, h2, h3, h4, .hero-title");

      if (isInteractive) {
        gsap.to(ring, { scale: 1.6, backgroundColor: "hsla(339,100%,29%,0.12)", borderColor: "hsl(339,100%,29%)", duration: 0.3 });
        gsap.to(dot, { scale: 0, opacity: 0, duration: 0.2 });
      } else if (isHeading) {
        gsap.to(ring, { scale: 2.4, backgroundColor: "transparent", borderColor: "hsla(339,100%,29%,0.25)", duration: 0.4 });
        gsap.to(dot, { scale: 1.4, opacity: 1, duration: 0.3 });
      } else {
        gsap.to(ring, { scale: 1, backgroundColor: "transparent", borderColor: "hsla(339,100%,29%,0.55)", duration: 0.3 });
        gsap.to(dot, { scale: 1, opacity: 1, duration: 0.3 });
      }
    };

    const onLeave = () => { gsap.to(container, { opacity: 0, duration: 0.3 }); visible = false; };
    const onEnter = () => { gsap.to(container, { opacity: 1, duration: 0.2 }); visible = true; };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);

    return () => {
      document.getElementById("hide-default-cursor")?.remove();
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
    };
  }, [mounted]);

  if (!mounted) return null;

  return createPortal(
    <div
      ref={containerRef}
      className="pointer-events-none fixed left-0 top-0 z-999999 opacity-0 will-change-transform"
    >
      {/* Outer ring */}
      <div
        ref={ringRef}
        className="absolute rounded-full border border-accent/65"
        style={{
          width: 40,
          height: 40,
          top: -20,
          left: -20,
          boxShadow: "0 0 0 1.5px rgba(255, 255, 255, 0.8), inset 0 0 0 1px rgba(255, 255, 255, 0.25)",
        }}
      />
      {/* Inner dot */}
      <div
        ref={dotRef}
        className="absolute rounded-full bg-accent"
        style={{
          width: 6,
          height: 6,
          top: -3,
          left: -3,
          boxShadow: "0 0 8px hsl(339 100% 29% / 0.65), 0 0 0 1px rgba(255, 255, 255, 0.95)",
        }}
      />
    </div>,
    document.body
  );
}
