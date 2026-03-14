import { Layout as DocsLayout, LastUpdated, Navbar } from "nextra-theme-docs";
import { Search } from "nextra/components";
import { getPageMap } from "nextra/page-map";
import "nextra-theme-docs/style-prefixed.css";
import "../docs-overrides.css";
import { docsDictionary } from "@/lib/docs-dictionary";
import { LangSwitch } from "@/components/docs/LangSwitch";

const LOCALE_TAG: Record<string, string> = { zh: "zh-CN", en: "en-US" };

export default async function DocsLangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict =
    docsDictionary[lang as keyof typeof docsDictionary] ?? docsDictionary.zh;
  const pageMap = await getPageMap(`/${lang}`);

  return (
    <DocsLayout
      docsRepositoryBase="https://github.com/woodbird/meshage-website"
      editLink={dict.editPage}
      feedback={{ content: dict.feedback }}
      footer={null}
      i18n={[]}
      lastUpdated={
        <LastUpdated locale={LOCALE_TAG[lang] ?? "zh-CN"}>
          {dict.lastUpdated}
        </LastUpdated>
      }
      navbar={
        <Navbar logo={<span className="font-semibold">Meshage 文档</span>}>
          <LangSwitch />
        </Navbar>
      }
      nextThemes={{ defaultTheme: "light" }}
      pageMap={pageMap}
      search={
        <Search
          emptyResult={dict.searchEmptyResult}
          errorText={dict.searchError}
          loading={dict.searchLoading}
          placeholder={dict.searchPlaceholder}
        />
      }
      themeSwitch={{
        dark: dict.dark,
        light: dict.light,
        system: dict.system,
      }}
      toc={{
        backToTop: dict.backToTop,
        title: dict.tocTitle,
      }}
    >
      {children}
    </DocsLayout>
  );
}
