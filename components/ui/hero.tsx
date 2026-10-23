"use client"

import { Reveal } from "@/components/ui/reveal"
import { SplitText } from "@/components/ui/split-text"
import { ParallaxBackground } from "@/components/ui/parallax"
import { SmartImage } from "@/components/ui/smart-image"

interface HeroProps {
  eyebrow?: string
  heading: string
  subheading?: string
  children?: any
  dark?: boolean
  image?: string
  imageAlt?: string
}

export function Hero({
  eyebrow,
  heading,
  subheading,
  children,
  dark = true,
  image,
  imageAlt,
}: HeroProps) {
  return (
    <section
      className={`relative pt-32 pb-20 md:pt-40 md:pb-28 px-6 lg:px-12 overflow-hidden ${dark ? "section-dark" : ""
        }`}
      style={!dark ? { backgroundColor: "var(--nb-gray-bg)" } : undefined}
    >
      {/* Background image with parallax + dark gradient */}
      {image && dark && (
        <>
          <ParallaxBackground offset={140}>
            <SmartImage
              src={`/images/hero/${image}`}
              alt={imageAlt ?? ""}
              fill
              sizes="100vw"
              priority
              className="object-cover"
              placeholderTone="primary"
              placeholderLabel="NB"
              placeholderHint="Hero image"
            />
          </ParallaxBackground>
          <div
            aria-hidden
            className="absolute inset-0 bg-linear-to-r from-ink/60 via-ink/25 to-ink/5"
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-linear-to-t from-ink/40 via-transparent to-transparent"
          />
        </>
      )}

      <div className="max-w-7xl mx-auto relative">
        {eyebrow && (
          <Reveal variant="fade" delay={0}>
            {dark ? (
              <div className="inline-flex items-center gap-2 mb-6">
                <span className="block w-5 h-px bg-[#FF2A30]" aria-hidden />
                <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-[#FF2A30] bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-sm">
                  {eyebrow}
                </span>
              </div>
            ) : (
              <p className="eyebrow mb-6">{eyebrow}</p>
            )}
          </Reveal>
        )}
        <SplitText
          as="h1"
          text={heading}
          by="word"
          delay={0.1}
          stagger={0.05}
          className={`text-5xl lg:text-7xl font-light max-w-4xl leading-[1.05] mb-6 ${dark ? "text-white" : "text-ink"
            }`}
        />
        {subheading && (
          <Reveal variant="rise" delay={0.45}>
            <p
              className={`text-base lg:text-lg max-w-2xl leading-relaxed ${dark ? "text-white/75" : "text-caption"
                }`}
            >
              {subheading}
            </p>
          </Reveal>
        )}
        {children && (
          <Reveal variant="rise" delay={0.6}>
            <div className="mt-10">{children}</div>
          </Reveal>
        )}
      </div>
    </section>
  )
}
