import type { Metadata } from "next"
import Link from "next/link"
import { Hero } from "@/components/ui/hero"
import { Section } from "@/components/ui/section"
import { FadeIn } from "@/components/ui/fade-in"
import { CtaBand } from "@/components/ui/cta-band"
import { SmartImage } from "@/components/ui/smart-image"
import { ArrowRight } from "lucide-react"
import { AboutQuote } from "@/components/about-quote"
import { PillarGrid } from "@/components/pillar-grid"
import { CommunityImpact } from "@/components/community-impact"
// import { VelocityMarquee } from "@/components/ui/velocity-marquee"
import { SplitText } from "@/components/ui/split-text"
import { team } from "@/lib/team"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "About North-Brook Limited | West Africa Logistics Since 2014",
  description:
    "Founded November 2014 in Accra, North-Brook Limited delivers total onshore and offshore logistics across Ghana and West Africa. Meet our board, leadership, and CSR commitments.",
  openGraph: {
    title: "About North-Brook Limited | West Africa Logistics Since 2014",
    description: "Founded November 2014. Meet the board, leadership, and the CSR commitments behind West Africa's premier logistics partner.",
    url: "https://northbrook.com.gh/about",
    images: [{ url: "https://northbrook.com.gh/images/hero/about.jpg", width: 1200, height: 630, alt: "North-Brook Limited — About Us" }],
  },
}


const pillars = [
  {
    title: "Built Around Your Requirements",
    body: "Every engagement starts with your deadlines, not a standard package. We design the service around your operation, not the other way around.",
  },
  {
    title: "Tools That Actually Work",
    body: "We adopt technology that improves speed, visibility, and compliance: real-time cargo tracking, digital port documentation, automated scheduling.",
  },
  {
    title: "Performance You Can Measure",
    body: "100% on-time delivery targets. Zero safety incidents. Full regulatory compliance on every operation we run.",
  },
  {
    title: "Local Authority, Global Standards",
    body: "Decade-long relationships with Ghana's port authorities, customs, and maritime regulators give our partners a genuine speed advantage.",
  },
  {
    title: "Certified. And Then Some.",
    body: "DNV-GL certified. Six international classification body registrations. Every subcontractor we engage meets our safety standard, not just the industry average.",
  },
]

const values = [
  {
    title: "Customer-Centric",
    body: "We place our clients at the heart of everything we do, designing tailored and responsive services that address unique operational requirements and deliver measurable results.",
  },
  {
    title: "Innovation & Solutions",
    body: "We embrace emerging technologies and forward-thinking approaches, ensuring our solutions evolve in line with the dynamic needs of the maritime and offshore industries.",
  },
  {
    title: "Operational Excellence",
    body: "Our commitment is to superior performance across every service line. From logistics coordination to technical support, we focus on efficiency, accuracy, and reliability at every stage.",
  },
  {
    title: "Adaptability",
    body: "Through strategic alliances with international partners and a deep understanding of local markets, we deliver solutions that are both globally competitive and locally relevant.",
  },
  {
    title: "Safety & Compliance",
    body: "We uphold the highest international safety standards and regulatory requirements, ensuring that every operation is secure, compliant, and audit-ready.",
  },
  {
    title: "Integrity & Reliability",
    body: "We operate with transparency, professionalism, and ethical responsibility, building long-term partnerships founded on trust and consistent delivery.",
  },
]

const csr = [
  {
    area: "Education & Skills Development",
    body: "Donation of books, computers, and school supplies to coastal community schools.",
  },
  {
    area: "Community Support",
    body: "Sponsorship of local sports events that promote youth development and discipline. Distribution of basic PPE (gloves, helmets, masks) to local contractors and artisans.",
  },
  {
    area: "Environmental Protection",
    body: "Tree planting projects to reduce carbon impact and restore green spaces. Promotion of waste segregation and recycling within our warehouses and partner facilities.",
  },
  {
    area: "Local Employment & Capacity Building",
    body: "Partnerships with vocational institutions to develop a pipeline of skilled technicians.",
  },
]

const breadcrumb = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://northbrook.com.gh" },
    { "@type": "ListItem", position: 2, name: "About", item: "https://northbrook.com.gh/about" },
  ],
}

export default function AboutPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />

      <Hero
        eyebrow="About Us"
        heading="Built for the operations that can't fail."
        subheading="Eleven years running the logistics operations that others find too complex, too remote, or too time-critical. Here's who built that record."
        image="about.jpg"
        imageAlt="North-Brook leadership and operations team"
      />

      {/* <VelocityMarquee variant="stats" /> */}

      {/* Stat band */}
      <section className="py-16 px-6 lg:px-12 border-y border-black/8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Years Operating", value: "11+", note: "Est. November 2014" },
              { label: "Port Calls", value: "347", note: "Vessels handled" },
              { label: "Class Certifications", value: "6", note: "International societies" },
              { label: "Lost Time Injuries", value: "0", note: "Since operations began" },
            ].map((stat, i) => (
              <FadeIn key={stat.label} delay={i * 0.1}>
                <div className={cn(
                  "flex flex-col py-8 lg:py-4 px-4 lg:px-10",
                  // mobile: right border on col1 (i%2===0), top border on row2 (i>=2)
                  i % 2 === 0 && "border-r border-black/8",
                  i >= 2 && "border-t border-black/8",
                  // desktop: reset mobile borders, use right border on first 3
                  "lg:border-t-0",
                  i < 3 ? "lg:border-r lg:border-black/8" : "lg:border-r-0",
                  i === 0 && "pl-0 lg:pl-0",
                  i === 3 && "pr-0 lg:pr-0",
                )}>
                  <span className="text-muted-foreground text-[9px] uppercase tracking-[0.3em] mb-2 font-mono">{stat.label}</span>
                  <span className="text-accent font-display font-bold text-5xl lg:text-6xl tracking-tight leading-none mb-2">{stat.value}</span>
                  <span className="text-caption text-[10px] font-mono">{stat.note}</span>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Who We Are */}
      <Section>
        <div className="grid lg:grid-cols-12 gap-16">
          <div className="lg:col-span-3">
            <FadeIn>
              <p className="eyebrow mb-6">Who We Are</p>
              <SplitText
                as="h2"
                text="North-Brook Limited"
                by="word"
                delay={0.1}
                stagger={0.06}
                className="text-4xl lg:text-5xl font-display font-bold text-foreground tracking-tight leading-[1.1]"
              />
            </FadeIn>
          </div>
          <div className="lg:col-span-9">
            <FadeIn delay={0.15}>
              <p className="text-body leading-relaxed text-base">
                Rigs off the coast of Takoradi. Cargo to remote inland sites. Vessels on tight port turnarounds. Since 2014, North-Brook has handled the kind of logistics where a single missed step costs clients millions. We cover air and sea freight, cargo consolidation, crew management, bunkering, warehousing, and full-service ship agency: not as separate offerings bolted together, but as one integrated operation designed to move without friction.
              </p>
            </FadeIn>
          </div>
        </div>
      </Section>

      {/* Mission & Vision */}
      <Section gray>
        <div className="grid lg:grid-cols-2 gap-px bg-black/8 border border-black/8">
          {[
            {
              label: "Our Mission",
              body: "To deliver industry-leading onshore and offshore logistics solutions by forging mission-focused partnerships that achieve precision-guided outcomes for our clients.",
            },
            {
              label: "Our Vision",
              body: "To set the global standard in offshore and onshore logistics by pioneering innovation, operational excellence, and safety benchmarks across the sub-region.",
            },
          ].map((item, i) => (
            <FadeIn key={item.label} delay={i * 0.12}>
              <div className="h-full bg-white p-10 lg:p-14">
                <p className="eyebrow mb-6">{item.label}</p>
                <p className="text-2xl lg:text-3xl font-display font-light text-foreground leading-[1.35] tracking-tight">
                  {item.body}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </Section>

      {/* Leadership */}
      <Section id="board">
        <FadeIn>
          <p className="eyebrow mb-4">Our People</p>
          <SplitText
            as="h2"
            text="The leadership behind the operation."
            by="word"
            delay={0.1}
            stagger={0.05}
            className="text-4xl lg:text-6xl font-display font-bold text-foreground tracking-tight mb-4 leading-[1.05]"
          />
          <p className="text-caption max-w-xl mb-14">
            The board and executive team shaping strategy for West Africa&apos;s most trusted offshore logistics operator.
          </p>
        </FadeIn>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {team.map((m, i) => (
            <FadeIn key={m.slug} delay={(i % 3) * 0.1}>
              <Link
                href={`/team/${m.slug}`}
                className="group block border border-black/8 hover:border-accent/30 transition-all duration-500 lift-card overflow-hidden rounded-lg"
              >
                <div className="relative aspect-4/5 zoom-frame">
                  <SmartImage
                    src={`/images/team/${m.slug}.webp`}
                    alt={`Portrait of ${m.name}`}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover"
                    placeholderTone="primary"
                    placeholderLabel={m.name.charAt(m.name.startsWith("Mr.") ? 4 : 0)}
                    placeholderHint={m.role}
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-base font-medium text-primary mb-1 group-hover:text-accent transition-colors leading-snug">
                    {m.name}
                  </h3>
                  <p className="text-xs text-caption uppercase tracking-wider mb-3">{m.role}</p>
                  <p className="text-sm text-body leading-relaxed line-clamp-2 mb-3">{m.bio[0]}</p>
                  <span className="inline-flex items-center gap-1 text-xs text-accent uppercase tracking-[0.14em] group-hover:gap-2 transition-all">
                    Read bio <ArrowRight size={11} />
                  </span>
                </div>
              </Link>
            </FadeIn>
          ))}
        </div>
      </Section>

      {/* CEO Quote */}
      <AboutQuote />

      {/* How We Work */}
      <Section>
        <SplitText
          as="h2"
          text="How We Work"
          by="word"
          delay={0.1}
          stagger={0.08}
          className="text-5xl lg:text-6xl font-display font-bold text-foreground tracking-tight mb-14 leading-[1.05]"
        />

        <PillarGrid pillars={pillars} />
      </Section>

      {/* Core Values */}
      <Section gray>
        <FadeIn>
          <p className="eyebrow mb-4">Our Core Values</p>
          <SplitText
            as="h2"
            text="What we hold ourselves to."
            by="word"
            delay={0.1}
            stagger={0.05}
            className="text-4xl lg:text-6xl font-display font-bold text-foreground tracking-tight mb-14 leading-[1.05]"
          />
        </FadeIn>

        <PillarGrid pillars={values} />
      </Section>

      {/* CSR */}
      <Section>
        <FadeIn>
          <p className="eyebrow mb-4">CSR</p>
          <SplitText
            as="h2"
            text="Our Community Impact"
            by="word"
            delay={0.1}
            stagger={0.05}
            className="text-4xl lg:text-6xl font-display font-bold text-foreground tracking-tight mb-6 leading-[1.05]"
          />
          <p className="text-caption max-w-2xl leading-relaxed mb-14">
            Commercial performance is one measure. Community impact is another. We run both with the same discipline: books and PPE for coastal schools, tree planting, waste reduction in our warehouses, and vocational pipelines for the next generation of technicians.
          </p>
        </FadeIn>

        <CommunityImpact items={csr} />
      </Section>

      <CtaBand />
    </>
  )
}
