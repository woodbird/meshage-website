import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { Features } from "@/components/sections/Features";
import { CtaSection } from "@/components/sections/CtaSection";
import { MeshageName } from "@/components/ui/MeshageName";

export default function Home() {
  return (
    <main id="main-content">
      <Header />
      <Hero />
      <section
        id="value"
        className="mx-auto max-w-3xl px-4 py-12"
        aria-labelledby="value-heading"
      >
        <h2 id="value-heading" className="text-xl font-semibold text-gray-900">
          Why <MeshageName />?
        </h2>
        <p className="mt-4 text-gray-600">
          Not just another chat app. A multi-agent collaboration hub with
          intent-driven native UI (A2UI), human-in-the-loop workflows, and
          enterprise-grade security.
        </p>
      </section>
      <Features />
      <CtaSection />
      <Footer />
    </main>
  );
}
