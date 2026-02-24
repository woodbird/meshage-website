"use client";

import { cta } from "@/lib/constants";
import { WaitlistForm } from "@/components/ui/WaitlistForm";
import { MeshageName } from "@/components/ui/MeshageName";

function scrollToForm() {
  document.getElementById("waitlist-form-anchor")?.scrollIntoView({ behavior: "smooth" });
}

export function CtaSection() {
  return (
    <section
      id="cta"
      className="mx-auto max-w-2xl px-4 py-16 text-center"
      aria-labelledby="cta-heading"
    >
      <h2 id="cta-heading" className="text-2xl font-bold text-gray-900">
        Get early access
      </h2>
      <p className="mt-4 text-gray-600">
        Join the waitlist and we&apos;ll notify you when <MeshageName /> is ready.
      </p>
      <button
        type="button"
        onClick={scrollToForm}
        className="mt-6 inline-flex rounded-lg bg-gray-900 px-6 py-3 text-white hover:bg-gray-800 focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2"
      >
        {cta.primary}
      </button>
      <div id="waitlist-form-anchor" className="mt-12" aria-live="polite">
        <WaitlistForm />
      </div>
    </section>
  );
}
