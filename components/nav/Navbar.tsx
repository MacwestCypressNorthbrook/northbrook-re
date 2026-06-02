"use client";

import React, { useRef, useState, useCallback, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { gsap, useGSAP } from "@/lib/gsap";
import { buttonVariants } from "../ui/button";
import { cn } from "@/lib/utils";
import RequestQuoteLink from "../request-quote-link";

const NAV_LINKS = [
  { name: "About", href: "/about" },
  { name: "Services", href: "/services" },
  { name: "QHSE Policy", href: "/qhse" },
  { name: "Projects", href: "/projects" },
  { name: "Partners", href: "/partners" },
];

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);
  const ctaOverlayRef = useRef<HTMLDivElement>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const openMenu = useCallback(() => {
    setIsOpen(true);
    document.body.style.overflow = "hidden";

    const overlay = overlayRef.current;
    const links = linksRef.current?.querySelectorAll<HTMLElement>(".nb-link-wrap");
    const ctaEl = ctaOverlayRef.current;

    // Set initial states via GSAP so React inline styles don't fight the animation
    if (links && links.length) gsap.set(links, { clipPath: "inset(0 0 100% 0)", y: 40 });
    if (ctaEl) gsap.set(ctaEl, { opacity: 0, y: 20 });

    const tl = gsap.timeline();
    tlRef.current = tl;

    // Overlay reveal
    tl.fromTo(
      overlay,
      { clipPath: "inset(0 0 100% 0)" },
      { clipPath: "inset(0 0 0% 0)", duration: 0.65, ease: "expo.inOut" }
    );

    // Links stagger in
    if (links && links.length) {
      tl.to(
        links,
        { clipPath: "inset(0 0 0% 0)", y: 0, duration: 0.55, ease: "expo.out", stagger: 0.07 },
        0.45
      );
    }

    // CTA
    if (ctaEl) {
      tl.to(ctaEl, { opacity: 1, y: 0, duration: 0.4, ease: "expo.out" }, 0.85);
    }
  }, []);

  const closeMenu = useCallback(() => {
    const overlay = overlayRef.current;
    const links = linksRef.current?.querySelectorAll(".nb-link-wrap");
    const ctaEl = ctaOverlayRef.current;

    const tl = gsap.timeline({
      onComplete: () => {
        setIsOpen(false);
        document.body.style.overflow = "";
      },
    });
    tlRef.current = tl;

    if (ctaEl) tl.to(ctaEl, { opacity: 0, y: 10, duration: 0.2 }, 0);
    if (links && links.length) {
      tl.to(links, { clipPath: "inset(0 0 100% 0)", y: -20, duration: 0.3, ease: "expo.in", stagger: 0.04 }, 0);
    }
    tl.to(overlay, { clipPath: "inset(0 0 100% 0)", duration: 0.5, ease: "expo.inOut" }, 0.15);
  }, []);

  const toggleMenu = useCallback(() => {
    if (isOpen) closeMenu();
    else openMenu();
  }, [isOpen, openMenu, closeMenu]);

  return (
    <>
      <nav
        ref={navRef}
        style={{ zIndex: 200 }}
        className={cn(
          "fixed top-0 left-0 w-full flex items-center justify-between px-5 sm:px-8 lg:px-14 transition-all duration-500",
          "py-5 lg:py-6 bg-transparent",
        )}
        aria-label="Main navigation"
      >
        {/* Logo */}
        <Link href="/" className="relative shrink-0" style={{ zIndex: 201 }}>
          <div className="relative h-10 w-[160px] sm:w-[190px] lg:w-[210px] duration-300"
            style={isScrolled ? { filter: "drop-shadow(0 1px 3px rgba(0,0,0,0.55)) drop-shadow(0 1px 8px rgba(0,0,0,0.35))" } : undefined}
          >
            <Image
              src="/images/logo.png"
              alt="North-Brook Ltd."
              fill
              sizes="(max-width: 640px) 160px, (max-width: 1024px) 190px, 210px"
              className="object-contain object-left"
              priority
            />
          </div>
        </Link>

        {/* Right controls */}
        <div className="relative flex items-center gap-3 sm:gap-4" style={{ zIndex: 201 }}>
          {/* Menu toggle */}
          <button
            onClick={toggleMenu}
            className="hover:text-primary pointer-events-auto flex items-center gap-3 font-sans text-xl md:text-2xl font-bold tracking-wide transition-colors group text-white"
            aria-label="Toggle menu"
            aria-expanded={isOpen}
            style={isScrolled ? { textShadow: "0 1px 4px rgba(0,0,0,0.6), 0 2px 12px rgba(0,0,0,0.4)" } : undefined}
          >
            <span className="uppercase tracking-wider text-[0.95rem]">{isOpen ? "Close" : "Menu"}</span>
            <svg
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={cn(
                "h-[1.4rem] w-[1.4rem] transform origin-center transition-transform duration-300 ease-linear text-white",
                isOpen ? "rotate-45" : "rotate-0"
              )}
              style={isScrolled ? { filter: "drop-shadow(0 1px 3px rgba(0,0,0,0.6))" } : undefined}
            >
              <path d="M12.0005 5.49894V6.99894H8.50047V5.49894H12.0005Z" fill="currentColor" />
              <path d="M3.5 5.49756V6.99756L0 6.99756L6.55637e-08 5.49756L3.5 5.49756Z" fill="currentColor" />
              <path d="M6.50106 11.9982H5.00106V8.49824H6.50106V11.9982Z" fill="currentColor" />
              <path d="M6.49968 3.49777L4.99968 3.49777L4.99968 -0.00222778L6.49968 -0.00222759L6.49968 3.49777Z" fill="currentColor" />
            </svg>
          </button>
        </div>
      </nav>

      {/* Fullscreen overlay */}
      <div
        ref={overlayRef}
        className="fixed inset-0 flex flex-col justify-between bg-[#0D0D0D] px-5 sm:px-10 lg:px-20 py-28 sm:py-32"
        style={{ zIndex: 190, clipPath: "inset(0 0 100% 0)", pointerEvents: isOpen ? "auto" : "none" }}
        aria-hidden={!isOpen}
      >
        {/* Background texture */}
        <div className="absolute inset-0 opacity-[0.04] bg-[url('/images/logo.png')] bg-center bg-no-repeat bg-size-[600px_auto] pointer-events-none" />

        {/* Red accent bar */}
        <div className="absolute top-0 left-0 h-1 w-full bg-accent" />

        {/* Nav links */}
        <div ref={linksRef} className="flex flex-col gap-1 sm:gap-2 mt-auto">
          {NAV_LINKS.map((link, i) => (
            <div key={link.name} className="nb-link-wrap overflow-hidden">
              <a
                href={link.href}
                onClick={closeMenu}
                className="group flex items-baseline gap-4 sm:gap-6 py-2 sm:py-3"
              >
                <span className="font-mono text-[10px] text-white/30 tracking-widest tabular-nums">
                  0{i + 1}
                </span>
                <span className="text-[clamp(2.5rem,8vw,6rem)] font-black uppercase leading-none tracking-[-0.03em] text-white transition-colors duration-200 group-hover:text-primary">
                  {link.name}
                </span>
              </a>
            </div>
          ))}
        </div>

        {/* Bottom row */}
        <div
          ref={ctaOverlayRef}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pt-10 border-t border-white/10"
          style={{ opacity: 0, willChange: "opacity, transform" }}
        >
          <div className="flex flex-col gap-1">
            <span className="text-[10px] uppercase tracking-[0.3em] text-white/30 font-mono">Headquarters</span>
            <span className="text-sm font-bold text-white/70">No 12 Joseph Richard Asiedu St, Accra, Ghana</span>
          </div>

          <RequestQuoteLink />
        </div>
      </div>
    </>
  );
}
