# miuo's blog

一个基于 [AstroPaper](https://github.com/satnaing/astro-paper) 深度定制的个人博客，采用 Clean Fit 极简设计风格。

<https://blog.miuo.me/>

## 功能

- **中英双语** — 通过 `/en/` 路径前缀自动切换，UI 文案统一在 `src/i18n.ts` 管理
- **AniList 追番** — 每周自动同步已看完的动画，卡片网格展示，按年份分组
- **友链交换** — 垂直名片式卡片布局，通过 [Artalk](https://artalk.js.org/) 评论区交换
- **静态搜索** — [Pagefind](https://pagefind.app/) 离线全文搜索
- **文章 OG 图片** — 使用 Satori 自动生成社交分享图
- **KaTeX 数学公式** — 行内与块级公式渲染
- **Shiki 代码高亮** — 双主题（github-light / night-owl），文件名提示、diff 与 highlight 注解
- **深浅色模式** — `data-theme` 属性驱动，跟随系统或手动切换
- **响应式设计** — 移动端全屏覆盖式导航，文章卡片自适应
- **RSS 订阅 & Sitemap** — 自动生成
- **草稿 & 分页** — 按发布时间过滤，首页与文章列表分页

## 目录结构

```
/
├── public/                    # 静态资源（头像、favicon、Pagefind 索引）
├── src/
│   ├── assets/
│   │   └── icons/             # 26 个 SVG 线框图标
│   ├── components/            # 20 个可复用组件
│   │   ├── SiteTopbar.astro   # 顶栏（Logo、导航、搜索、主题切换）
│   │   ├── HomeTabs.astro     # 桌面端导航标签
│   │   ├── CodeSnippet.astro  # 代码块（含复制按钮）
│   │   ├── BackToTopButton.astro  # 返回顶部（毛玻璃悬浮）
│   │   ├── TableOfContents.astro  # 文章目录（悬浮弹窗）
│   │   ├── ArtalkComments.astro   # Artalk 评论集成
│   │   └── ...
│   ├── data/
│   │   ├── blog/              # Markdown 文章
│   │   ├── anime.generated.json    # 自动同步的追番数据
│   │   └── friends.ts         # 友链数据
│   ├── layouts/
│   │   ├── Layout.astro       # 全局基础布局
│   │   ├── PostDetails.astro  # 文章详情布局
│   │   ├── Main.astro         # 通用页面布局
│   │   └── AboutLayout.astro  # 关于页面布局
│   ├── pages/
│   │   ├── index.astro        # 首页（分页文章列表）
│   │   ├── about.md           # 关于页（Markdown）
│   │   ├── anime.astro        # 追番页（网格展示）
│   │   ├── friends.astro      # 友链页（名片卡片）
│   │   ├── search.astro       # 搜索页（Pagefind）
│   │   ├── 404.astro          # 404 页面
│   │   ├── robots.txt.ts      # robots.txt
│   │   ├── rss.xml.ts         # RSS 源
│   │   ├── og.png.ts          # 默认 OG 图片
│   │   ├── archives/          # 归档页
│   │   ├── posts/             # 文章详情 + 分页列表
│   │   ├── tags/              # 标签聚合 + 标签筛选
│   │   └── en/                # 英文版全量页面
│   ├── scripts/               # 客户端脚本（主题切换、返回按钮）
│   ├── styles/
│   │   ├── global.css         # 全局样式 + Tailwind v4 配置
│   │   └── typography.css     # 排版与代码块样式
│   ├── types/                 # TypeScript 类型定义
│   ├── utils/                 # 工具函数（排序、过滤、OG 生成）
│   ├── config.ts              # 站点配置
│   ├── constants.ts           # 社交链接与分享配置
│   ├── content.config.ts      # 内容集合 Schema
│   └── i18n.ts                # 中英文 UI 文案
├── scripts/
│   ├── sync-anime.mjs         # AniList 追番数据同步
│   └── copy-pagefind.mjs      # 构建后复制 Pagefind 资源
├── .github/workflows/
│   ├── ci.yml                 # PR 构建与格式检查
│   └── anime-sync.yml         # 每周自动同步追番
├── Dockerfile                 # 多阶段 Docker 构建
├── docker-compose.yml         # Docker Compose 配置
├── astro.config.ts            # Astro 配置
├── package.json
└── pnpm-lock.yaml
```

## 技术栈

| 领域 | 技术 |
|------|------|
| 框架 | [Astro](https://astro.build/) v5 |
| 语言 | TypeScript |
| 样式 | [Tailwind CSS](https://tailwindcss.com/) v4 + [@tailwindcss/typography](https://tailwindcss.com/docs/typography-plugin) |
| 搜索 | [Pagefind](https://pagefind.app/) |
| 代码高亮 | [Shiki](https://shiki.style/) |
| 数学公式 | [KaTeX](https://katex.org/) |
| OG 图片 | [Satori](https://github.com/vercel/satori) + [Sharp](https://sharp.pixelplumbing.com/) |
| 评论 | [Artalk](https://artalk.js.org/) |
| 格式化 | [Prettier](https://prettier.io/) + [prettier-plugin-astro](https://github.com/withastro/prettier-plugin-astro) |
| Lint | [ESLint](https://eslint.org/) Flat Config |
| CI/CD | GitHub Actions |
| 部署 | Cloudflare Pages / Docker |

## 本地运行

```bash
# 安装依赖（需要 pnpm）
pnpm install

# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build

# 预览构建结果
pnpm preview
```

### Docker

```bash
docker compose up -d

# 或手动构建
docker build -t miuo-blog .
docker run -p 4321:80 miuo-blog
```

## 可用命令

| 命令 | 说明 |
|------|------|
| `pnpm dev` | 启动开发服务器 |
| `pnpm build` | 生产构建 |
| `pnpm preview` | 预览构建 |
| `pnpm sync` | 生成 Astro 类型 |
| `pnpm anime:sync` | 同步 AniList 追番数据 |
| `pnpm format` | Prettier 格式化 |
| `pnpm format:check` | 检查格式 |
| `pnpm lint` | ESLint 检查 |

## 站点配置

编辑 `src/config.ts` 可修改：

- `website` — 站点 URL
- `author` / `title` — 作者与标题
- `desc` — 站点描述
- `lightAndDarkMode` — 是否启用深浅色切换
- `postPerIndex` / `postPerPage` — 首页与列表页每页文章数
- `showArchives` — 是否显示归档页
- `editPost` — 文章底部"编辑此页"链接

## 自定义

- **追番同步**：运行 `pnpm anime:sync` 从 AniList 同步数据，生成 `src/data/anime.generated.json`。GitHub Actions 每周一自动执行。
- **友链**：编辑 `src/data/friends.ts` 添加或修改友链，页面底部的 Artalk 评论区用于交换申请。
- **双语内容**：UI 文案在 `src/i18n.ts`，英文页面放在 `src/pages/en/` 下，通过 `/en/` 路径访问。
- **文章**：Markdown 文件放在 `src/data/blog/`，头部 frontmatter 需包含 `title`、`pubDatetime`、`description`、`tags`。

## License

MIT

---

基于 [AstroPaper](https://github.com/satnaing/astro-paper) 构建，由 [miuo](https://blog.miuo.me/) 定制维护。
