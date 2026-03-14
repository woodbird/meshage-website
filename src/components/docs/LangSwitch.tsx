"use client";

import { usePathname, useRouter } from "next/navigation";

const LOCALES = [
  { code: "zh", label: "简体中文" },
  { code: "en", label: "English" },
] as const;

export function LangSwitch() {
  const pathname = usePathname();
  const router = useRouter();

  const segments = pathname.split("/");
  const langIdx = segments.indexOf("docs") + 1;
  const current = segments[langIdx] || "zh";

  return (
    <select
      value={current}
      onChange={(e) => {
        const next = [...segments];
        next[langIdx] = e.target.value;
        router.push(next.join("/"));
      }}
      className="rounded border border-gray-300 bg-transparent px-2 py-1 text-sm dark:border-neutral-600"
      aria-label="Switch language"
    >
      {LOCALES.map((l) => (
        <option key={l.code} value={l.code}>
          {l.label}
        </option>
      ))}
    </select>
  );
}
