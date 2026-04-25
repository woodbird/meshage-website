/**
 * Docs theme copy. 当前仅 zh/en；新增语言需在此添加对应 key，并在 `content/<lang>/`
 * 下添加对应的 MDX/MD 文件以及 `_meta.js` 菜单。
 * Used by app/docs/[lang]/layout.tsx.
 */
export const docsDictionary = {
  zh: {
    editPage: "编辑此页",
    feedback: "有疑问？给我们反馈",
    lastUpdated: "最后更新",
    searchPlaceholder: "搜索文档",
    searchLoading: "加载中…",
    searchEmptyResult: "未找到结果",
    searchError: "加载失败",
    tocTitle: "本页目录",
    backToTop: "回到顶部",
    dark: "深色",
    light: "浅色",
    system: "系统",
  },
  en: {
    editPage: "Edit this page",
    feedback: "Question? Give us feedback",
    lastUpdated: "Last updated",
    searchPlaceholder: "Search documentation",
    searchLoading: "Loading…",
    searchEmptyResult: "No results found",
    searchError: "Failed to load",
    tocTitle: "On this page",
    backToTop: "Back to top",
    dark: "Dark",
    light: "Light",
    system: "System",
  },
} as const;
