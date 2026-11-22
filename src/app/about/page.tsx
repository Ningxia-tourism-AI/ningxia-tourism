import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui";
import { attractions } from "@/content/attractions";
import { foods } from "@/content/foods";
import { routes } from "@/content/routes";
import { dialectEntries } from "@/content/dialect";
import { IMAGE_CREDITS } from "@/content/imageCredits";

export const metadata: Metadata = {
  title: "关于本站",
  description: "内容来源、整理方法、待核实说明与免责声明。",
};

const SECTIONS = [
  {
    no: "01",
    title: "内容从哪来",
    body: "景区、美食、路线内容基于政府与文旅部门的公开信息、百科条目与媒体报道整理；方言词条参考西北官话的公开研究资料，并以银川话为主。每一条内容都记录了来源，页面上标注「待核实」表示尚未逐条人工确认。",
  },
  {
    no: "02",
    title: "为什么标注「待核实」",
    body: "门票、开放时间、班次这类信息变化快，个人整理很难保证实时准确。与其假装权威，不如明确标注状态：结构可用、内容待核。你可以看到每条内容的来源与更新时间，再对照官方渠道做决定。",
  },
  {
    no: "03",
    title: "站内问答怎么工作",
    body: "默认使用本地检索：把问题与站内内容做分词匹配（bigram + BM25），抽出最相关的段落作答并给出引用；相关度太低时直接拒答。配置大模型接口后，会把同样的检索结果作为上下文交给模型组织语言，但超纲问题仍然拒答——减少幻觉比多答几句更重要。",
  },
  {
    no: "04",
    title: "怎么改内容",
    body: "内容都在 src/content/ 下的 TypeScript 文件里，按类型定义直接改；每条都有 sources 与 verified 字段，确认后把 verified 改成 true，页面上的「待核实」标记就会消失。",
  },
];

export default function AboutPage() {
  const stats = [
    ["景区", attractions.length],
    ["美食", foods.length],
    ["路线", routes.length],
    ["方言词条", dialectEntries.length],
  ] as const;

  return (
    <>
      <PageHeader
        eyebrow="说明 / Colophon"
        title="关于本站"
        ghost="志"
        description="一个关于宁夏文旅的中文信息站：把散落的公开资料整理成可查、可排、可问的形态。"
      />

      <div className="container-page grid gap-14 py-10 md:py-14 lg:grid-cols-[minmax(0,1fr)_260px] lg:gap-20">
        <div>
          {SECTIONS.map((s) => (
            <section key={s.no} className="grid gap-3 border-b border-line py-7 first:pt-0 md:grid-cols-[180px_1fr] md:gap-8">
              <div>
                <p className="font-mono-ui text-[10px] tracking-[0.2em] text-ink-500">{s.no}</p>
                <h2 className="mt-1.5 font-display text-[20px] tracking-[0.04em]">{s.title}</h2>
              </div>
              <p className="max-w-2xl text-[12px] leading-[2] text-ink-700">{s.body}</p>
            </section>
          ))}

          <section className="grid gap-3 border-b border-line py-7 md:grid-cols-[180px_1fr] md:gap-8">
            <div>
              <p className="font-mono-ui text-[10px] tracking-[0.2em] text-ink-500">05</p>
              <h2 className="mt-1.5 font-display text-[20px] tracking-[0.04em]">实景图片来源</h2>
            </div>
            <div className="max-w-2xl">
              <p className="text-[12px] leading-[2] text-ink-700">
                景区与美食页的写实照片均下载为站内静态资源，原始文件来自 Wikimedia Commons。
                下面保留作者、开放许可与原始文件页；标注「实景示意」的图片用于缺少对应开放授权照片的页面。
              </p>
              <ol className="mt-4 divide-y divide-line border-y border-line">
                {IMAGE_CREDITS.map((credit) => (
                  <li
                    key={credit.sourceUrl}
                    className="grid gap-1 py-2.5 text-[11px] leading-[1.7] text-ink-500 sm:grid-cols-[1fr_auto] sm:gap-4"
                  >
                    <span>
                      <span className="text-ink-700">{credit.asset}</span>
                      <span className="mx-1.5 text-line-strong">/</span>
                      {credit.creator}
                    </span>
                    <span className="font-mono-ui text-[10px]">
                      <a
                        href={credit.sourceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="underline decoration-line-strong underline-offset-2 hover:text-vermilion"
                      >
                        原图
                      </a>
                      <span className="mx-1.5">·</span>
                      {credit.licenseUrl ? (
                        <a
                          href={credit.licenseUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="underline decoration-line-strong underline-offset-2 hover:text-vermilion"
                        >
                          {credit.license}
                        </a>
                      ) : (
                        credit.license
                      )}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </section>

          <section className="grid gap-3 border-b border-line py-7 md:grid-cols-[180px_1fr] md:gap-8">
            <div>
              <p className="font-mono-ui text-[10px] tracking-[0.2em] text-ink-500">06</p>
              <h2 className="mt-1.5 font-display text-[20px] tracking-[0.04em]">免责声明</h2>
            </div>
            <ul className="max-w-2xl space-y-1.5 text-[12px] leading-[1.95] text-ink-700">
              <li>· 本站为个人学习与演示项目，不提供商业旅游服务。</li>
              <li>· 门票、开放时间、交通班次以景区与官方发布为准。</li>
              <li>· 方言内容存在区域差异，标注了置信度，仅供参考。</li>
              <li>· 图片授权与署名见上方清单；再次转载时请同时遵守对应许可。</li>
            </ul>
          </section>

          <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3 font-mono-ui text-[11px] tracking-[0.12em]">
            <Link href="/attractions" className="link-line">看景区 →</Link>
            <Link href="/routes/plan" className="link-line">用规划器 →</Link>
            <Link href="/ask" className="link-line">去提问 →</Link>
          </div>
        </div>

        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="border border-line bg-paper-light p-5">
            <p className="font-mono-ui text-[10px] uppercase tracking-[0.22em] text-ink-500">规模</p>
            <dl className="mt-4 border-t border-line">
              {stats.map(([label, value]) => (
                <div key={label} className="flex items-baseline justify-between border-b border-line py-2.5">
                  <dt className="text-[12px] text-ink-500">{label}</dt>
                  <dd className="font-display text-[22px] leading-none">{value}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 font-ui text-[11px] leading-relaxed text-ink-500">
              数据更新 2026-11 · 全部条目待人工核实
            </p>
          </div>
        </aside>
      </div>
    </>
  );
}
