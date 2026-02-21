import { site, author } from "@/lib/constants";

export function Footer() {
  return (
    <footer
      id="contact"
      className="border-t border-gray-200 bg-gray-50 px-4 py-10"
      aria-labelledby="contact-heading"
    >
      <div className="mx-auto max-w-6xl">
        <h2 id="contact-heading" className="mb-4 text-center text-sm font-semibold text-gray-900">
          Contact author
        </h2>
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-gray-600">
          <a
            href={`mailto:${author.email}`}
            className="hover:text-gray-900 focus-visible:rounded focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2"
          >
            {author.email}
          </a>
          <span className="text-gray-400" aria-hidden>
            ·
          </span>
          <span>
            Meshage ID: <strong className="font-medium text-gray-700">{author.meshageId}</strong>
          </span>
        </div>
        <p className="mt-8 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-gray-500">
          <span>© {new Date().getFullYear()} {site.name}. All rights reserved.</span>
          <a
            href={site.github}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-700 focus-visible:rounded focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2"
          >
            GitHub
          </a>
        </p>
      </div>
    </footer>
  );
}
