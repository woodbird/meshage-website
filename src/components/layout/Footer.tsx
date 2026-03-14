import { site, author } from "@/lib/constants";
import { MeshageName } from "@/components/ui/MeshageName";

export function Footer() {
  return (
    <footer
      id="contact"
      className="border-t border-gray-200 bg-gray-50 px-4 py-10 dark:border-neutral-700 dark:bg-neutral-800"
      aria-labelledby="contact-heading"
    >
      <div className="mx-auto max-w-6xl text-gray-900 dark:text-gray-100">
        <h2 id="contact-heading" className="mb-4 text-center text-sm font-semibold">
          Contact author
        </h2>
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-gray-600 dark:text-gray-300">
          <a
            href={`mailto:${author.email}`}
            className="hover:text-gray-900 focus-visible:rounded focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 dark:hover:text-gray-100 dark:focus-visible:ring-gray-100"
          >
            {author.email}
          </a>
          <span className="text-gray-400 dark:text-gray-500" aria-hidden>
            ·
          </span>
          <span>
            <MeshageName /> ID: <strong className="font-medium text-gray-700 dark:text-gray-200">{author.meshageId}</strong>
          </span>
        </div>
        <p className="mt-8 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-gray-500 dark:text-gray-400">
          <span>© {new Date().getFullYear()} <MeshageName />. All rights reserved.</span>
          <a
            href={site.github}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-700 focus-visible:rounded focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 dark:hover:text-gray-200 dark:focus-visible:ring-gray-100"
          >
            GitHub
          </a>
        </p>
      </div>
    </footer>
  );
}
