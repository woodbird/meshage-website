import Image from "next/image";
import { site, valuePropositions } from "@/lib/constants";

export function Hero() {
  return (
    <section
      className="relative overflow-hidden px-4 py-16 md:py-24"
      aria-labelledby="hero-heading"
    >
      <div className="mx-auto mb-8 flex justify-center">
        <Image
          src={site.logoPath}
          alt=""
          width={200}
          height={200}
          className="h-32 w-32 object-contain md:h-40 md:w-40"
          priority
          fetchPriority="high"
        />
      </div>
      <div className="mx-auto max-w-3xl text-center">
        <h1
          id="hero-heading"
          className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl lg:text-5xl"
        >
          {site.name}
        </h1>
        <p className="mt-4 text-lg font-medium text-gray-700 md:text-xl">
          {site.slogan}
        </p>
        <p className="mt-6 text-base text-gray-600">
          {valuePropositions[0]}
        </p>
      </div>
    </section>
  );
}
