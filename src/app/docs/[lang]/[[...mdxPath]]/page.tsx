import { generateStaticParamsFor, importPage } from "nextra/pages";
import { useMDXComponents as getMDXComponents } from "@/mdx-components";
import { DocFeedback } from "@/components/docs/DocFeedback";

export const generateStaticParams = generateStaticParamsFor("mdxPath");

type PageProps = {
  params: Promise<{ lang: string; mdxPath?: string[] }>;
};

export async function generateMetadata(props: PageProps) {
  const params = await props.params;
  const { metadata } = await importPage(params.mdxPath, params.lang);
  return metadata;
}

const Wrapper = getMDXComponents({}).wrapper;

export default async function DocsPage(props: PageProps) {
  const params = await props.params;
  const { default: MDXContent, toc, metadata, sourceCode } = await importPage(
    params.mdxPath,
    params.lang
  );
  const docPath = `/docs/${params.lang}${params.mdxPath?.length ? `/${params.mdxPath.join("/")}` : ""}`;

  return (
    <Wrapper
      toc={toc}
      metadata={metadata}
      sourceCode={sourceCode}
      bottomContent={<DocFeedback docPath={docPath} docLocale={params.lang} />}
    >
      <MDXContent {...props} params={params} />
    </Wrapper>
  );
}
