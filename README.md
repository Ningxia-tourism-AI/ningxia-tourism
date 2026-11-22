# 宁夏文旅指南

一个用 Next.js 做的宁夏文旅信息站：**景区介绍、美食推荐、路线规划、方言翻译、AI 问答**。

站点内容全部由本地 TypeScript 数据驱动，默认构建为纯静态站点，
**不依赖数据库、外部图床、地图 API、服务端接口或大模型密钥**即可完整运行。
问答与方言翻译在浏览器本地执行；如另有独立 API，可通过公开的
`NEXT_PUBLIC_API_BASE_URL` 接入。

> ⚠️ 内容基于公开资料整理，每条都标注「待核实」与来源。门票、开放时间、班次请以官方发布为准。
> 方言存在区域差异，词条标注了区域与置信度。

## 功能

| 模块 | 说明 |
| --- | --- |
| 景区介绍 | 10 个核心景区，区域/类型筛选、五市示意图联动、JSON-LD 结构化数据 |
| 美食推荐 | 20 道地方美食，按区域分组，与景区互链 |
| 路线设计 | 8 条精品路线 + 规划器：按天数/区域/兴趣/预算生成逐日行程 |
| 方言翻译 | 160 条词条，普通话⇄银川话双向翻译，最长匹配、置信度、例句 |
| AI 问答 | 浏览器内 BM25 检索 + 抽取式作答 + 引用；相关度不足直接拒答；支持可选外部 API |

## 技术栈

- Next.js 15（App Router）+ React 19 + TypeScript
- Tailwind CSS v4
- 纯 TypeScript 检索（bigram 分词 + BM25）与规则规划器，无额外运行时依赖
- Vitest 单测；Playwright（复用系统 Edge）截图验收

## 运行

本项目在一台没有全局 Node 的机器上开发，用的是 DSH 自带运行时。如果你本机已装 Node 20+，直接用 `pnpm` 即可。

### 使用自带运行时（本仓库的默认方式）

```powershell
$node = "C:\Users\刘海\.dsh\dsh-runtimes\dsh-primary-runtime\dependencies\node\bin\node.exe"
$pnpm = "C:\Users\刘海\.dsh\dsh-runtimes\dsh-primary-runtime\dependencies\pnpm\bin\pnpm.mjs"
$env:PATH = "C:\Users\刘海\.dsh\dsh-runtimes\dsh-primary-runtime\dependencies\node\bin;$env:PATH"

& $node $pnpm install
& $node $pnpm dev          # http://127.0.0.1:3000
```

### 常规方式

```bash
pnpm install
pnpm dev        # 开发服务器
pnpm build      # 生成静态站点到 out/
pnpm preview    # 预览 out/ 静态站点
pnpm test       # 单元测试
pnpm screenshot # 截图（需先启动 pnpm dev）
```

## 外部 API（可选）

复制 `.env.example` 为 `.env.local`，按部署位置填写：

```dotenv
NEXT_PUBLIC_SITE_URL=https://example.com
NEXT_PUBLIC_BASE_PATH=
NEXT_PUBLIC_API_BASE_URL=
```

不填写 `NEXT_PUBLIC_API_BASE_URL` 时，问答直接调用浏览器内的站内检索，
不发送问题到服务器。填写独立 API 的公开地址后，面板会请求
`<API 地址>/api/ask`。任何密钥都不能放进以 `NEXT_PUBLIC_` 开头的变量。

## 目录

```
src/
├─ app/                 # 纯静态页面
│  ├─ attractions/      # 景区列表 + 详情
│  ├─ foods/            # 美食列表 + 详情
│  ├─ routes/           # 路线列表 + 详情 + /plan 规划器
│  ├─ dialect/          # 方言翻译与词典
│  ├─ ask/              # AI 问答
│  ├─ sitemap.ts robots.ts
├─ components/          # 卡片、地图、规划器、翻译器、对话面板
├─ content/             # 全部内容数据（改内容只改这里）
├─ lib/                 # 检索、规划器、方言、可选外部 API 适配
└─ types/content.ts     # 数据模型
tests/                  # Vitest 单测
scripts/screenshot.mjs  # Playwright 截图验收
scripts/serve-static.mjs # 本地预览 out/
.github/workflows/      # GitHub Pages 自动部署
docs/                   # 方案、部署说明、待核实清单、截图
```

## 内容维护

1. 编辑 `src/content/` 下对应文件；
2. 每条内容都有 `sources: Citation[]` 与 `verified: boolean`；
3. 人工核实后把 `verified` 改为 `true`，页面的「待核实」标记会自动消失；
4. 运行 `pnpm validate` 校验数量、唯一性、引用完整性。

待核实明细见 [`docs/内容待核实清单.md`](docs/内容待核实清单.md)，整体情况见 [`docs/网站总结.md`](docs/网站总结.md)。

## 部署到 GitHub Pages

推送 `main` 分支后，GitHub Actions 会自动测试、静态构建并发布
`out/`。完整步骤、首次设置、子路径和外部 API 说明见
[`docs/GitHub-Pages部署.md`](docs/GitHub-Pages部署.md)。

## 截图

所有页面在桌面（1440×900）与移动（390×844）下的实拍见 `docs/screenshots/`，其中：

- `01-home-*.png` 首页
- `02-attractions-*.png` / `03-attraction-detail-*.png` 景区
- `04-foods-*.png` / `05-food-detail-*.png` 美食
- `06-routes-*.png` / `07-route-plan-*.png` / `07b-route-plan-result-desktop.png` 路线与规划器（含生成结果）
- `08-dialect-*.png` 方言
- `09-ask-*.png` / `09b-ask-answer-desktop.png` 问答（含返回答案）
- `10-about-*.png` 关于

## 已知限制

- 未接入真实地图 SDK：五市地图是 SVG 示意图，不含导航/距离计算。
- 图片全部本地托管：景区与美食页使用写实摄影，作者与开放许可见 `/about`。
- 方言为汉字记音 + 拼音近似，非国际音标；部分词条置信度低，已在数据中标注。
- AI 问答不提供实时天气、班次、实时票价。
- 静态站点默认不调用服务端；如配置外部 API，限流、密钥和监控由该 API 独立负责。
- GitHub Pages 在中国大陆的访问速度和可用性不受本项目控制。

## 免责声明

本项目为学习/演示用途，非商业旅游服务。内容准确性以官方渠道为准。
