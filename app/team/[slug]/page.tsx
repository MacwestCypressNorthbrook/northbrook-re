import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { team } from "@/lib/team"
import { FadeIn } from "@/components/ui/fade-in"
import { Section } from "@/components/ui/section"
import { CtaBand } from "@/components/ui/cta-band"
import { SmartImage } from "@/components/ui/smart-image"

function ArrowLeft({ size, className }: { size: number; className?: string }) {
  return <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m12 19-7-7 7-7" /><path d="M19 12H5" /></svg>
}

function ArrowRight({ size, className }: { size: number; className?: string }) {
  return <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
}

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return team.map((m) => ({ slug: m.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const member = team.find((m) => m.slug === slug)
  if (!member) return {}
  return {
    title: `${member.name} | ${member.role}`,
    description: member.bio[0].split(".")[0] + ".",
  }
}

export default async function TeamMemberPage({ params }: Props) {
  const { slug } = await params
  const member = team.find((m) => m.slug === slug)
  if (!member) notFound()

  const memberIndex = team.findIndex((m) => m.slug === slug)
  const indexLabel = String(memberIndex + 1).padStart(2, "0")

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: member.name,
    jobTitle: member.role,
    url: `https://northbrook.com.gh/team/${slug}`,
    image: `https://northbrook.com.gh/images/team/${member.slug}.webp`,
    worksFor: {
      "@type": "Organization",
      name: "North-Brook Limited",
      url: "https://northbrook.com.gh",
    },
    description: member.bio[0],
  }

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://northbrook.com.gh" },
      { "@type": "ListItem", position: 2, name: "About", item: "https://northbrook.com.gh/about" },
      { "@type": "ListItem", position: 3, name: member.name, item: `https://northbrook.com.gh/team/${slug}` },
    ],
  }

  const bioTeaser = member.bio[0].split(".")[0] + "."

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />

      {/* HERO */}
      <section className="bg-[#0D0D0D] min-h-[90vh] flex flex-col lg:flex-row overflow-hidden">

        {/* Mobile portrait */}
        <div className="lg:hidden relative w-full aspect-3/4 shrink-0">
          <SmartImage
            src={`/images/team/${member.slug}.webp`}
            alt={`Portrait of ${member.name}`}
            fill
            sizes="100vw"
            className="object-cover object-top"
            priority
            placeholderTone="primary"
            placeholderLabel={member.name.charAt(member.name.startsWith("Mr.") ? 4 : 0)}
            placeholderHint={member.role}
          />
          <div aria-hidden className="absolute inset-x-0 top-0 h-32 bg-linear-to-b from-black/60 to-transparent" />
          <div aria-hidden className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-[#0D0D0D] to-transparent" />
        </div>

        {/* LEFT */}
        <div className="relative lg:w-[45%] shrink-0 flex flex-col justify-end px-6 lg:px-14 pt-10 lg:pt-40 pb-14 lg:pb-20 overflow-hidden">

          {/* Ghosted index number */}
          <span
            aria-hidden
            className="absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 font-black leading-none select-none pointer-events-none text-white/4"
            style={{ fontSize: "clamp(8rem, 18vw, 20rem)" }}
          >
            {indexLabel}
          </span>

          {/* Back pill */}
          <div className="mb-10">
            <Link
              href="/about#board"
              className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-sm border border-white/10 px-4 py-2 rounded-sm text-accent text-[10px] uppercase tracking-widest hover:bg-white/10 hover:border-accent/40 transition-all duration-200 group cursor-pointer"
            >
              <ArrowLeft size={10} className="transition-transform duration-200 group-hover:-translate-x-0.5" />
              Our People
            </Link>
          </div>

          {/* Role tag */}
          <div className="inline-flex items-center gap-3 mb-5">
            <span className="block w-6 h-px bg-accent shrink-0" aria-hidden />
            <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-accent">
              {member.role}
            </span>
          </div>

          {/* Name */}
          <h1 className="font-display font-bold text-white leading-[0.95] tracking-tight mb-7"
            style={{ fontSize: "clamp(2.4rem, 5vw, 5.2rem)" }}>
            {member.name}
          </h1>

          {/* Org line */}
          <div className="flex items-center gap-3 mb-8">
            <span className="h-px w-8 bg-white/15 shrink-0" aria-hidden />
            <span className="text-white/30 text-[10px] uppercase tracking-[0.22em] font-mono">
              North-Brook Limited · Ghana
            </span>
          </div>

          {/* Bio teaser */}
          <p className="text-white/45 text-sm leading-relaxed max-w-sm line-clamp-3">
            {bioTeaser}
          </p>

          {/* Ambient red glow */}
          <div
            aria-hidden
            className="absolute bottom-0 left-0 w-[70%] h-[50%] pointer-events-none"
            style={{ background: "radial-gradient(ellipse at bottom left, rgba(227,30,36,0.09) 0%, transparent 70%)" }}
          />
        </div>

        {/* Vertical accent divider*/}
        <div aria-hidden className="hidden lg:block w-px bg-white/[0.07] shrink-0 self-stretch" />

        {/* RIGHT */}
        <div className="hidden lg:block relative flex-1 min-h-full">
          {/* Bleed gradient left edge into content */}
          <div aria-hidden className="absolute inset-y-0 left-0 w-20 bg-linear-to-r from-[#0D0D0D] to-transparent z-10 pointer-events-none" />
          {/* Nav protection */}
          <div aria-hidden className="absolute inset-x-0 top-0 h-36 bg-linear-to-b from-black/55 to-transparent z-10 pointer-events-none" />
          <SmartImage
            src={`/images/team/${member.slug}.webp`}
            alt={`Portrait of ${member.name}`}
            fill
            sizes="55vw"
            className="object-cover object-top"
            priority
            placeholderTone="primary"
            placeholderLabel={member.name.charAt(member.name.startsWith("Mr.") ? 4 : 0)}
            placeholderHint={member.role}
          />
        </div>
      </section>

      {/*BIO */}
      <Section>
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16">
          <div className="lg:col-span-8">
            {member.bio.map((para, i) => (
              <FadeIn key={i} delay={i * 0.08}>
                <p className="text-body leading-relaxed mb-6 text-base">{para}</p>
              </FadeIn>
            ))}
          </div>
          <div className="lg:col-span-4">
            <FadeIn delay={0.15}>
              <div className="border border-black/8 rounded-lg p-8 sticky top-28">
                <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-accent mb-5">Profile</p>
                <div className="space-y-4">
                  <div>
                    <p className="text-[9px] text-caption uppercase tracking-widest mb-1 font-mono">Name</p>
                    <p className="text-sm font-medium text-foreground">{member.name}</p>
                  </div>
                  <div>
                    <p className="text-[9px] text-caption uppercase tracking-widest mb-1 font-mono">Role</p>
                    <p className="text-sm font-medium text-foreground">{member.role}</p>
                  </div>
                  <div>
                    <p className="text-[9px] text-caption uppercase tracking-widest mb-1 font-mono">Organisation</p>
                    <p className="text-sm font-medium text-foreground">North-Brook Limited</p>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </Section>

      {/* OTHER LEADERS */}
      <Section gray>
        <FadeIn>
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="eyebrow mb-3">Other Leaders</p>
              <h2 className="font-display font-bold text-3xl lg:text-4xl text-foreground tracking-tight leading-tight">
                Meet the rest of the team
              </h2>
            </div>
            <Link
              href="/about#board"
              className="hidden sm:inline-flex items-center gap-2 text-accent text-xs uppercase tracking-[0.14em] hover:gap-3 transition-all"
            >
              <ArrowLeft size={12} /> All leaders
            </Link>
          </div>
        </FadeIn>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
          {team
            .filter((m) => m.slug !== slug)
            .slice(0, 4)
            .map((m, i) => (
              <FadeIn key={m.slug} delay={i * 0.08}>
                <Link
                  href={`/team/${m.slug}`}
                  className="group relative block overflow-hidden rounded-lg cursor-pointer"
                >
                  <div className="relative aspect-3/4 overflow-hidden">
                    <SmartImage
                      src={`/images/team/${m.slug}.webp`}
                      alt={`Portrait of ${m.name}`}
                      fill
                      sizes="(min-width: 1024px) 25vw, 50vw"
                      className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.04]"
                      placeholderTone="primary"
                      placeholderLabel={m.name.charAt(m.name.startsWith("Mr.") ? 4 : 0)}
                      placeholderHint={m.role}
                    />
                    <div aria-hidden className="absolute inset-0 bg-linear-to-t from-black/85 via-black/20 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-4 lg:p-5">
                      <h3 className="text-white text-sm font-medium leading-snug mb-1 group-hover:text-accent transition-colors duration-200">
                        {m.name}
                      </h3>
                      <p className="text-white/45 text-[9px] uppercase tracking-wider font-mono">{m.role}</p>
                    </div>
                    {/* Arrow reveal on hover */}
                    <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-accent/0 group-hover:bg-accent flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100">
                      <ArrowRight size={12} className="text-white" />
                    </div>
                  </div>
                </Link>
              </FadeIn>
            ))}
        </div>

        <FadeIn>
          <div className="mt-6 sm:hidden">
            <Link
              href="/about#board"
              className="inline-flex items-center gap-2 text-accent text-xs uppercase tracking-[0.14em] hover:gap-3 transition-all"
            >
              <ArrowLeft size={12} /> All leaders
            </Link>
          </div>
        </FadeIn>
      </Section>

      <CtaBand />
    </>
  )
}
