import nextra from 'nextra';

const withNextra = nextra({
  latex: true,
  search: { codeblocks: false },
  contentDirBasePath: '/docs',
});

/** @type {import('next').NextConfig} */
export default withNextra({
  i18n: {
    locales: ['zh', 'en'],
    defaultLocale: 'zh',
  },
  redirects: async () => [
    { source: '/docs', destination: '/docs/zh', permanent: false },
    { source: '/docs/', destination: '/docs/zh', permanent: false },
  ],
});
