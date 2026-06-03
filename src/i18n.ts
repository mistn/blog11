export const locales = ["zh", "en"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "zh";

export const localeLabels: Record<Locale, string> = {
  zh: "中文",
  en: "English",
};

export const ui = {
  zh: {
    site: {
      desc: "记录文章、笔记、实验和暂时不想丢掉的内容。",
    },
    nav: {
      home: "首页",
      archives: "归档",
      anime: "追番",
      friends: "友链",
      about: "关于",
      search: "搜索",
      skipToContent: "跳到正文",
      theme: "切换浅色/深色模式",
      language: "EN",
      languageLabel: "Switch to English",
      email: "发送邮件",
    },
    pages: {
      postsTitle: "文章",
      postsDesc: "这里是我发布过的所有文章。",
      tagsTitle: "标签",
      tagsDesc: "所有文章里用到的标签。",
      tagTitle: "标签：",
      tagDescPrefix: "所有带有“",
      tagDescSuffix: "”标签的文章。",
      archivesTitle: "归档",
      archivesEyebrow: "Archive",
      searchTitle: "搜索",
      searchDesc: "搜索站内文章。",
      animeTitle: "追番列表",
      animeFullTitle: "追番列表 | miuo",
      animeDesc: "可按年份或全部查看 AniList normal 列表中已看完的动画。",
      animeEyebrow: "Anime Archive",
      friendsTitle: "友链",
      friendsDesc: "交换友链的小站。",
      friendsEyebrow: "Link Exchange",
      aboutTitle: "关于",
      aboutEyebrow: "About",
      notFoundTitle: "页面未找到",
      notFoundCta: "返回首页",
    },
    sidebar: {
      notebook: "笔记",
      recent: "最近",
    },
    actions: {
      goBack: "返回",
      backToTop: "回到顶部",
      editPage: "编辑页面",
      comments: "评论",
      previousPost: "上一篇",
      nextPost: "下一篇",
      copy: "复制",
      copied: "已复制",
      copyPostLink: "复制文章链接",
      postLinkCopied: "链接已复制",
      updated: "更新：",
      previousPage: "上一页",
      nextPage: "下一页",
      previousPageLabel: "前往上一页",
      nextPageLabel: "前往下一页",
      tocTitle: "文章目录",
      tocToggle: "打开文章目录",
      tocClose: "关闭文章目录",
    },
    anime: {
      unknownYear: "未标年份",
      countUnit: "部",
      dataFrom: "数据来自",
      updatedAt: "更新于",
      viewMode: "展示",
      viewAll: "全部",
      viewByYear: "按年份",
      empty: "这里还没有同步到追番数据。",
      emptyHelp:
        "运行脚本会抓取 miuol 的 AniList 数据，并保留 normal 列表里状态为 COMPLETED 的动画。",
      itemListName: "追番列表",
    },
    dev: {
      searchWarning:
        "开发模式提示：需要至少构建一次项目，才能在开发环境里看到搜索结果。",
    },
    months: [
      "一月",
      "二月",
      "三月",
      "四月",
      "五月",
      "六月",
      "七月",
      "八月",
      "九月",
      "十月",
      "十一月",
      "十二月",
    ],
  },
  en: {
    site: {
      desc: "Notes, essays, experiments, and the bits worth keeping around.",
    },
    nav: {
      home: "Home",
      archives: "Archive",
      anime: "Anime",
      friends: "Friends",
      about: "About",
      search: "Search",
      skipToContent: "Skip to content",
      theme: "Toggle light and dark mode",
      language: "中",
      languageLabel: "Switch to Chinese",
      email: "Send an email",
    },
    pages: {
      postsTitle: "Posts",
      postsDesc: "All the articles I have posted.",
      tagsTitle: "Tags",
      tagsDesc: "All the tags used in posts.",
      tagTitle: "Tag: ",
      tagDescPrefix: 'All posts tagged "',
      tagDescSuffix: '".',
      archivesTitle: "Archive",
      archivesEyebrow: "Archive",
      searchTitle: "Search",
      searchDesc: "Search articles on this site.",
      animeTitle: "Anime List",
      animeFullTitle: "Anime List | miuo",
      animeDesc:
        "Completed anime from the AniList normal list, viewable by year or as a full list.",
      animeEyebrow: "Anime Archive",
      friendsTitle: "Friends",
      friendsDesc: "Sites exchanged as friend links.",
      friendsEyebrow: "Link Exchange",
      aboutTitle: "About",
      aboutEyebrow: "About",
      notFoundTitle: "Page Not Found",
      notFoundCta: "Go back home",
    },
    sidebar: {
      notebook: "Notebook",
      recent: "Recent",
    },
    actions: {
      goBack: "Go back",
      backToTop: "Back to top",
      editPage: "Edit page",
      comments: "Comments",
      previousPost: "Previous Post",
      nextPost: "Next Post",
      copy: "Copy",
      copied: "Copied",
      copyPostLink: "Copy article link",
      postLinkCopied: "Link copied",
      updated: "Updated:",
      previousPage: "Prev",
      nextPage: "Next",
      previousPageLabel: "Go to previous page",
      nextPageLabel: "Go to next page",
      tocTitle: "Table of contents",
      tocToggle: "Open table of contents",
      tocClose: "Close table of contents",
    },
    anime: {
      unknownYear: "Unknown year",
      countUnit: "items",
      dataFrom: "Data from",
      updatedAt: "Updated",
      viewMode: "View",
      viewAll: "All",
      viewByYear: "By year",
      empty: "No anime data has been synced yet.",
      emptyHelp:
        "Run the sync script to fetch miuol's AniList data and keep completed items from the normal list.",
      itemListName: "Anime List",
    },
    dev: {
      searchWarning:
        "DEV mode warning: build the project at least once to see search results during development.",
    },
    months: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
  },
} as const;

export function getLocaleFromPath(pathname: string): Locale {
  return /^\/en(?:\/|$)/.test(pathname) ? "en" : defaultLocale;
}

export function stripLocaleFromPath(pathname: string) {
  const withoutLocale = pathname.replace(/^\/en(?=\/|$)/, "") || "/";
  return withoutLocale.startsWith("/") ? withoutLocale : `/${withoutLocale}`;
}

export function normalizePath(pathname: string) {
  return pathname.endsWith("/") && pathname !== "/"
    ? pathname.slice(0, -1)
    : pathname;
}

export function localizePath(pathname: string, locale: Locale) {
  const basePath = stripLocaleFromPath(pathname);
  if (locale === defaultLocale) return basePath;
  return basePath === "/" ? `/${locale}/` : `/${locale}${basePath}`;
}

export function getAlternateLocale(locale: Locale): Locale {
  return locale === "en" ? "zh" : "en";
}

export function getDateLocale(locale: Locale) {
  return locale === "en" ? "en-US" : "zh-CN";
}
