import { features } from "@/lib/constants";

export function Features() {
  return (
    <section
      id="features"
      className="mx-auto max-w-4xl px-4 py-16 text-gray-900 dark:text-gray-100"
      aria-labelledby="features-heading"
    >
      <h2 id="features-heading" className="text-2xl font-bold">
        Core capabilities
      </h2>
      <ul className="mt-8 grid gap-8 sm:grid-cols-1 md:grid-cols-2">
        {features.map(({ id, title, description }) => (
          <li key={id} className="min-w-0 break-words rounded-lg border border-gray-200 p-6 dark:border-neutral-700">
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="mt-2 text-gray-600 dark:text-gray-300">{description}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
