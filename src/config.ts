export const SITE = {
  website: "https://blog.miuo.me/",
  author: "miuo",
  startYear: 2025,
  profile: "",
  desc: "记录文章、笔记、实验和暂时不想丢掉的内容。",
  title: "miuo",
  ogImage: "favicon.png",
  lightAndDarkMode: true,
  postPerIndex: 4,
  postPerPage: 4,
  scheduledPostMarginMs: 15 * 60 * 1000, // 15 minutes
  showArchives: true,
  showBackButton: true, // show back button in post detail
  editPost: {
    enabled: false,
    text: "编辑页面",
    url: "https://github.com/mistn/blog11/edit/main/",
  },
  dynamicOgImage: true,
  dir: "ltr", // "rtl" | "auto"
  lang: "zh-CN", // html lang code. Set this empty and default will be "en"
  timezone: "Asia/Shanghai", // Default global timezone (IANA format) https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
} as const;
