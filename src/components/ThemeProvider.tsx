"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

type Props = { children: React.ReactNode };

/**
 * 整站主题：默认 light，用 class 控制 dark（与 Tailwind darkMode: 'class' 一致）.
 * 文档页的 nextThemes 会与此处共享 localStorage，保持切换一致。
 */
export function ThemeProvider({ children }: Props) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}
