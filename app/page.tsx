import Hero from "@/components/sections/Hero";
import LogoMarquee from "@/components/sections/LogoMarquee";
import Stats from "@/components/sections/Stats";
import Process from "@/components/sections/Process";
import MorphTransition from "@/components/sections/MorphTransition";
import Features from "@/components/sections/Features";
import Showcase from "@/components/sections/Showcase";
// import WorkMapSection from "@/components/sections/WorkMapSection";
import CTA from "@/components/sections/CTA";
import SectionReveal from "@/components/ui/SectionReveal";

export default function Home() {
  return (
    <>
      <Hero />

      <SectionReveal id="about">
        <LogoMarquee />
        <Stats />
      </SectionReveal>

      {/* <SectionReveal>
        <Process />
      </SectionReveal> */}

      <SectionReveal>
        <MorphTransition />
      </SectionReveal>

      <SectionReveal id="services">
        <Features />
      </SectionReveal>

      <SectionReveal id="projects">
        <Showcase />
      </SectionReveal>

      {/* <SectionReveal>
        <WorkMapSection />
      </SectionReveal> */}

      {/* <SectionReveal id="contact">
        <CTA />
      </SectionReveal> */}
    </>
  );
}
