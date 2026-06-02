# miuo's blog

一个基于 [AstroPaper](https://github.com/satnaing/astro-paper) 主题深度定制的个人博客。

<https://blog.miuo.me/>

## 功能

- 中英双语支持（zh-CN / en），通过 `src/i18n.ts` 统一管理 UI 文案
- AniList 追番列表，每周自动同步已看完的动画（[Anime Sync 工作流](.github/workflows/anime-sync.yml)）
- 友链页面，通过评论区交换友链（[Artalk](https://artalk.js.org/) 评论系统）
- 静态搜索（[Pagefind](https://pagefind.app/)）
- 文章 OG 图片自动生成
- KaTeX 数学公式渲染
- Shiki 代码语法高亮（含文件名提示、diff / highlight 注解）
- 浅色 / 深色模式切换
- RSS 订阅 & Sitemap
- Draft 草稿 & 分页

## 目录结构

```
/
├── public/                 # 静态资源
├── src/
│   ├── assets/             # 图标、图片等
│   ├── components/         # 通用组件
│   ├── data/
│   │   ├── blog/           # 博客文章（.md）
│   │   ├── anime.generated.json  # 自动同步的追番数据
│   │   └── friends.ts      # 友链数据
│   ├── layouts/            # 页面布局
│   ├── pages/              # 路由页面
│   │   ├── about.md        # 关于页
│   │   ├── anime.astro     # 追番页
│   │   ├── archives/       # 归档页
│   │   ├── en/             # 英文版页面
│   │   ├── friends.astro   # 友链页
│   │   ├── index.astro     # 首页
│   │   ├── posts/          # 文章详情页
│   │   ├── search.astro    # 搜索页
│   │   └── tags/           # 标签页
│   ├── scripts/            # 客户端脚本
│   ├── styles/             # 全局样式
│   ├── utils/              # 工具函数
│   ├── config.ts           # 站点配置
│   ├── constants.ts        # 社交链接
│   ├── i18n.ts             # 国际化文案
│   └── content.config.ts   # 内容集合定义
├── scripts/                # 构建 / 同步脚本（clone 后可执行为 npm scripts）
│   ├── sync-anime.mjs      # 从 AniList 同步追番数据
│   └── copy-pagefind.mjs   # 构建后复制 Pagefind 资源
├── .github/workflows/
│   ├── ci.yml              # PR 构建 & 格式检查
│   └── anime-sync.yml      # 每周自动同步追番数据
├── astro.config.ts
├── tsconfig.json
├── package.json
└── pnpm-lock.yaml
```

## 技术栈

| 领域 | 技术 |
|------|------|
| 框架 | [Astro](https://astro.build/) |
| 语言 | TypeScript |
| 样式 | [TailwindCSS](https://tailwindcss.com/) v4 |
| 搜索 | [Pagefind](https://pagefind.app/) |
| 代码高亮 | [Shiki](https://shiki.style/) |
| 数学公式 | [KaTeX](https://katex.org/) |
| 评论 | [Artalk](https://artalk.js.org/) |
| 代码格式化 | [Prettier](https://prettier.io/) |
| Lint | [ESLint](https://eslint.org/) |
| 部署 | Cloudflare Pages / Docker |

## 本地运行

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm run dev

# 构建生产版本
pnpm run build

# 预览构建结果
pnpm run preview
```

### Docker

```bash
docker compose up -d

# 或者
docker build -t miuo-blog .
docker run -p 4321:80 miuo-blog
```

## 可用命令

| 命令 | 说明 |
|------|------|
| `pnpm install` | 安装依赖 |
| `pnpm run dev` | 启动本地开发服务器（localhost:4321） |
| `pnpm run build` | 生产构建（输出到 `dist/`） |
| `pnpm run preview` | 预览生产构建 |
| `pnpm run sync` | 生成 Astro 类型 |
| `pnpm run format` | Prettier 格式化代码 |
| `pnpm run format:check` | 检查代码格式 |
| `pnpm run lint` | ESLint 检查 |
| `pnpm run anime:sync` | 同步 AniList 追番数据 |
| `docker compose up -d` | Docker 启动 |
| `docker build -t miuo-blog .` | Docker 构建镜像 |
| `docker run -p 4321:80 miuo-blog` | Docker 运行 |

## 自定义内容

- **追番同步**：脚本 `npm run anime:sync` 会从 AniList 用户 `miuol` 的 `normal` 列表中拉取已完成的动画，生成 `src/data/anime.generated.json`。GitHub Actions 每周自动运行一次。
- **友链交换**：友链数据在 `src/data/friends.ts` 中维护，评论系统使用 Artalk。
- **中英双语**：UI 文案集中在 `src/i18n.ts`，支持路径前缀 `/en/` 切换语言。
- **站点配置**：主配置在 `src/config.ts`，包括站点标题、描述、时区等。

## License

MIT

---

基于 [AstroPaper](https://github.com/satnaing/astro-paper) 构建，由 [miuo](https://blog.miuo.me/) 定制维护。
