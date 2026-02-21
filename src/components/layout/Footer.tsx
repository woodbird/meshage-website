import { site } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-6xl text-center text-sm text-gray-600">
        <p>© {new Date().getFullYear()} {site.name}. All rights reserved.</p>
      </div>
    </footer>
  );
}
