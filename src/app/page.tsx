"use client";
import { Hero } from "@/components/modules/Hero";
import { HistoriaSection } from "@/components/modules/HistoriaSection";
import { ExperienceGrid } from "@/components/modules/ExperienceGrid";
import { ClientFeedback } from "@/components/modules/ClientFeedback";
import { CustomExperience } from "@/components/modules/CustomExperience";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "TouristInformationCenter",
  name: "Jonco Expediciones",
  description:
    "Expediciones personalizadas en Argentina: pesca con mosca, kayak, avistamiento de fauna y naturaleza en el Delta del Paraná.",
  url: "https://jonco.pro",
  address: {
    "@type": "PostalAddress",
    addressCountry: "AR",
  },
};

export default function Home() {
  return (
    <div className="relative bg-zinc-950 min-h-screen overflow-x-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main>
        <Hero />
        <HistoriaSection />

        {/* SECCIÓN EXPERIENCIAS */}
        <section id="experiencias" className="relative z-10 bg-zinc-950 scroll-mt-32">
          <ExperienceGrid />
          <section id="feedback" className="scroll-mt-32">
            <ClientFeedback />
          </section>
          <CustomExperience />
        </section>
      </main>
    </div>
  );
}