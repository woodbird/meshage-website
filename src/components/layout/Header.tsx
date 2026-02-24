"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { site, navLinks } from "@/lib/constants";
import { MeshageName } from "@/components/ui/MeshageName";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link
          href="/"
          className="flex items-center gap-2 focus-visible:rounded focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2"
          aria-label={`${site.name} home`}
        >
          <Image
            src={site.logoPath}
            alt=""
            width={40}
            height={40}
            className="h-10 w-10 shrink-0 object-contain"
            priority
          />
          <MeshageName className="text-xl font-semibold text-gray-900" />
        </Link>
        <nav
          className="flex items-center gap-6"
          aria-label="Main navigation"
        >
          {/* Desktop nav */}
          <ul className="hidden gap-6 md:flex">
            {navLinks.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="text-gray-600 hover:text-gray-900 focus-visible:rounded focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
          {/* Mobile menu button */}
          <button
            type="button"
            className="rounded p-2 md:hidden focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((o) => !o)}
          >
            <span className="block h-0.5 w-6 bg-gray-700" aria-hidden />
            <span className="mt-1 block h-0.5 w-6 bg-gray-700" aria-hidden />
            <span className="mt-1 block h-0.5 w-6 bg-gray-700" aria-hidden />
          </button>
        </nav>
      </div>
      {/* Mobile menu panel */}
      <div
        id="mobile-menu"
        className={`overflow-hidden border-t border-gray-100 md:hidden ${menuOpen ? "block" : "hidden"}`}
        aria-hidden={!menuOpen}
      >
        <ul className="flex flex-col gap-2 px-4 py-4">
          {navLinks.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className="block py-2 text-gray-600 hover:text-gray-900 focus-visible:rounded focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2"
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
