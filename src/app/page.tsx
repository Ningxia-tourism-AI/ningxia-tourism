import Link from "next/link";
import { HeroArt } from "@/components/HeroArt";
import { Reveal } from "@/components/Reveal";
import { PetroRule, RockGlyph } from "@/components/RockArt";
import { AttractionCard, RouteCard } from "@/components/cards";
import { Disclaimer, SectionTitle } from "@/components/ui";
import { attractions } from "@/content/attractions";
import { foods } from "@/content/foods";
import { routes } from "@/content/routes";
import { dialectEntries } from "@/content/dialect";

const FEATURES = [
  { href: "/attractions", title: "景区", desc: "沙坡头、沙湖、西夏王陵……十个核心目的地，附全量 A 级名录", meta: "146 家" },
  { href: "/foods", title: "美食", desc: "手抓羊肉、羊杂碎、辣糊糊，吃对地方", meta: "20 道" },
  { href: "/routes", title: "路线", desc: "八条精品线，或按天数自动生成", meta: "8 条 + 规划器" },
  { href: "/dialect", title: "方言", desc: "普通话与银川话互译，带读音与例句", meta: "85 条" },
  { href: "/ask", title: "问答", desc: "只答站内资料，超范围如实拒答", meta: "本地检索" },
];

export default function HomePage() {
  const featuredAttractions = [attractions[0], attractions[2], attractions[4]];
  const menuFoods = foods.slice(0, 7);
  const featuredRoutes = [routes[0], routes[1], routes[2]];

  return (
    <>
      {/* ── 刊头：大标题出血 + 拓片图版错位重叠 ─────────────── */}
      <section className="grain relative overflow-hidden border-b border-line">
        <div className="container-page relative py-12 md:py-16 lg:py-20">
          <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
            <div className="relative flex flex-col justify-between">
              <div>
                <Reveal>
                  <div className="flex items-center gap-3">
                    <RockGlyph kind="sun" className="h-4 w-4 text-vermilion" strokeWidth={2.6} />
                    <p className="kicker">宁夏 · 中国 / 田野旅行志</p>
                  </div>
                </Reveal>

                <Reveal delay={90}>
                  <h1 className="mt-7 font-display text-[clamp(48px,7.6vw,92px)] leading-[0.98] tracking-[0.01em]">
                    一半沙漠
                    <br />
                    一半河
                    <span
                      aria-hidden="true"
                      className="ml-2 inline-block h-[12px] w-[12px] -translate-y-[12px] rotate-45 bg-vermilion md:ml-3"
                    />
                  </h1>
                </Reveal>

                <Reveal delay={180}>
                  <p className="mt-8 max-w-md border-l-2 border-vermilion/60 pl-4 text-[13px] leading-[2.1] text-ink-500">
                    从沙坡头的黄河拐弯，到贺兰山下的西夏王陵；从手抓羊肉到「咥饭」怎么说。
                    五个入口，把这片地方拆开来看。
                  </p>
                </Reveal>
              </div>

              <Reveal delay={260}>
                <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
                  <Link
                    href="/routes/plan"
                    className="group inline-flex items-center gap-4 bg-ink px-6 py-3.5 font-ui text-[13px] tracking-[0.14em] text-paper transition-colors hover:bg-vermilion focus-ring"
                  >
                    安排行程
                    <span aria-hidden="true" className="font-mono-ui text-[11px] opacity-60 transition-transform group-hover:translate-x-1">
                      →
                    </span>
                  </Link>
                  <Link href="/attractions" className="sweep font-ui text-[13px] tracking-[0.1em]">
                    先看景区
                  </Link>
                </div>
              </Reveal>
            </div>

            {/* 拓片图版：向左压出、略旋转，朱砂印章压角 */}
            <Reveal delay={160}>
              <figure className="relative lg:-ml-4">
                <div className="plate rotate-[0.6deg] p-3 shadow-[10px_14px_0_rgba(26,20,16,0.08)]">
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <HeroArt />
                  </div>
                </div>
                <span
                  aria-hidden="true"
                  className="seal absolute -left-3 -top-3 rotate-[-8deg]"
                >
                  <RockGlyph kind="sun" className="h-6 w-6" strokeWidth={2.6} />
                </span>
                <figcaption className="mt-4 flex items-end justify-between gap-4">
                   <p className="font-display text-[15px] leading-[1.95] tracking-[0.04em] text-ink-700">
                        一半黄沙，一半流水，
                       <br />
                    中间是人。
                   </p>
  <span className="shrink-0 font-mono-ui text-[10px] uppercase tracking-[0.16em] text-ink-500">
    宁夏 · 实景图录
  </span>
</figcaption>
              </figure>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── 目次数字条 ──────────────────────────────── */}
      <div className="border-b border-line bg-paper-deep/35">
        <div className="container-page grid grid-cols-2 divide-x divide-line md:grid-cols-4">
          {[
            // 景区与方言取数据库统计（146 家 A 级景区 / 85 条可溯源词条）；美食与路线为站内精选内容
            ["景区", 146],
            ["美食", foods.length],
            ["路线", routes.length],
            ["方言词条", 85],
          ].map(([label, value]) => (
            <div key={String(label)} className="flex items-baseline gap-3 px-4 py-5 first:pl-0 md:px-6">
              <span className="font-display text-[30px] leading-none">{value}</span>
              <span className="font-mono-ui text-[10px] tracking-[0.2em] text-ink-500">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── 五个入口：图录目录 ──────────────────────── */}
      <section>
        <div className="container-page grid lg:grid-cols-[300px_1fr]">
          <div className="border-line py-10 lg:sticky lg:top-24 lg:self-start lg:border-r lg:py-14 lg:pr-10">
            <div className="flex items-center gap-3">
              <span aria-hidden="true" className="h-1.5 w-1.5 rotate-45 bg-vermilion" />
              <p className="kicker">目次 / Contents</p>
            </div>
            <h2 className="mt-4 font-display text-[36px] leading-none tracking-[0.04em]">五个入口</h2>
            <p className="mt-4 max-w-[16rem] text-[13px] leading-[1.95] text-ink-500">
              五栏各自独立，先看哪一栏都行。
            </p>
            <p className="vertical mt-8 hidden font-display text-[15px] text-ink-500/50 lg:block">
              朔方之野 · 山河人间
            </p>
          </div>

          <ol className="divide-y divide-line lg:pl-10">
            {FEATURES.map((f, i) => (
              <li key={f.href}>
                <Link
                  href={f.href}
                  className="group grid grid-cols-[32px_1fr_auto] items-center gap-4 py-5 transition-colors hover:bg-ink hover:text-paper focus-ring"
                >
                  <span className="font-mono-ui text-[10px] tracking-[0.18em] text-ink-500 transition-colors group-hover:text-paper/50">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
                    <span className="font-display text-[22px] leading-none tracking-[0.06em]">{f.title}</span>
                    <span className="font-ui text-[12px] text-ink-500 transition-colors group-hover:text-paper/60">{f.desc}</span>
                  </span>
                  <span className="pr-1 font-mono-ui text-[10px] tracking-[0.12em] text-ink-500 transition-colors group-hover:text-paper/50">
                    {f.meta} →
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <div className="container-page py-2">
        <PetroRule />
      </div>

      {/* ── 选辑：三张拓片卡纵向错落 ──────────────────── */}
      <section className="py-12 md:py-16">
        <div className="container-page">
          <SectionTitle
            index="02"
            title="先看这三个"
            description="第一次来宁夏，绕不开的三处。"
            action={
              <Link href="/attractions" className="link-line">
                全部景区 →
              </Link>
            }
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featuredAttractions.map((a, i) => (
              <Reveal key={a.slug} delay={i * 90} className={i === 1 ? "lg:mt-10" : ""}>
                <AttractionCard attraction={a} index={i + 1} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── 味觉：名录 + 墨底主味卡 ──────────────────── */}
      <section className="bg-paper-deep/25 py-12 md:py-16">
        <div className="container-page grid gap-12 lg:grid-cols-[1fr_330px] lg:gap-16">
          <div>
            <SectionTitle
              index="03"
              title="吃在宁夏"
              description="羊肉是主角，但也别错过蒿子面和辣糊糊。"
              action={
                <Link href="/foods" className="link-line">
                  全部美食 →
                </Link>
              }
            />
            <ul className="border-t border-line">
              {menuFoods.map((f, i) => (
                <li key={f.slug} className="border-b border-line">
                  <Link href={`/foods/${f.slug}`} className="group flex items-baseline gap-4 py-3.5 focus-ring">
                    <span className="font-mono-ui text-[10px] text-ink-500/60">{String(i + 1).padStart(2, "0")}</span>
                    <span className="font-display text-[19px] leading-none tracking-[0.03em] transition-colors group-hover:text-vermilion">
                      {f.name}
                    </span>
                    <span aria-hidden="true" className="hidden flex-1 border-b border-dotted border-line-strong/50 sm:block" />
                    <span className="shrink-0 font-mono-ui text-[10px] text-ink-500">
                      {f.region} · {f.priceRange}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <aside className="rubbing relative self-start p-6">
            <p className="font-mono-ui text-[10px] uppercase tracking-[0.26em] text-paper/45">本期主味</p>
            <p className="mt-4 font-display text-[26px] leading-[1.35] tracking-[0.04em] text-paper">
              「手抓」二字，
              <br />
              既是吃法，也是脾气
            </p>
            <p className="mt-4 text-[13px] leading-[2] text-paper/65">
              盐池滩羊因肉质细嫩、膻味轻而出名。清汤只放花椒、姜、盐，考验的是羊本身。
            </p>
            <Link
              href="/foods/shouzhua-yangrou"
              className="mt-5 inline-block font-mono-ui text-[11px] tracking-[0.14em] text-vermilion underline decoration-vermilion/50 underline-offset-4 transition-colors hover:text-paper"
            >
              读手抓羊肉 →
            </Link>
            <span aria-hidden="true" className="absolute -right-3 -top-3 seal rotate-6">
              <RockGlyph kind="ibex" className="h-6 w-6" strokeWidth={2.4} />
            </span>
          </aside>
        </div>
      </section>

      {/* ── 路线 ──────────────────────────────── */}
      <section className="py-12 md:py-16">
        <div className="container-page">
          <SectionTitle
            index="04"
            title="路线不用自己拼"
            description="精品线直接抄，或用规划器按天数生成。"
            action={
              <Link href="/routes" className="link-line">
                全部路线 →
              </Link>
            }
          />
          <div className="border-t border-line">
            {featuredRoutes.map((r, i) => (
              <Reveal key={r.slug} delay={i * 70}>
                <RouteCard route={r} index={i + 1} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <div className="container-page py-2">
        <PetroRule />
      </div>

      {/* ── 方言 / 问答 ──────────────────────────── */}
      <section className="py-12 md:py-16">
        <div className="container-page grid gap-5 md:grid-cols-2">
          <div className="relative border border-line bg-paper-light p-6 md:p-8">
            <div className="flex items-center gap-3">
              <span aria-hidden="true" className="h-1.5 w-1.5 rotate-45 bg-vermilion" />
              <p className="kicker">05 / 方言</p>
            </div>
            <h3 className="mt-4 font-display text-[28px] leading-[1.3] tracking-[0.04em]">
              「咥饭」是吃饭，
              <br />
              「嫑」是不要
            </h3>
            <p className="mt-4 text-[13px] leading-[2] text-ink-500">
              宁夏北部川区属兰银官话，南部更接近中原官话，没有统一的「宁夏话」。
              词典按区域标注，存疑条目都降了置信度。
            </p>
            <Link href="/dialect" className="mt-6 inline-flex items-center gap-3 border border-line px-4 py-2.5 font-ui text-[12px] tracking-[0.12em] transition-colors hover:border-vermilion hover:text-vermilion focus-ring">
              去翻译
              <span aria-hidden="true" className="font-mono-ui text-[10px]">→</span>
            </Link>
          </div>

          <div className="rubbing relative overflow-hidden p-6 md:p-8">
            <span aria-hidden="true" className="pointer-events-none absolute -right-8 -top-10 select-none">
              <RockGlyph kind="hand" className="h-40 w-40 text-paper/[0.07]" strokeWidth={1.4} />
            </span>
            <p className="font-mono-ui text-[10px] uppercase tracking-[0.3em] text-paper/45">06 / 问答</p>
            <h3 className="mt-4 font-display text-[28px] leading-[1.3] tracking-[0.04em] text-paper">
              问点站里有的，
              <br />
              不知道就说不知道
            </h3>
            <p className="mt-4 text-[13px] leading-[2] text-paper/65">
              答案只来自站内资料，附引用来源；问题超出范围会直接说不确定，不猜。
            </p>
            <Link href="/ask" className="mt-6 inline-flex items-center gap-3 border border-paper/30 px-4 py-2.5 font-ui text-[12px] tracking-[0.12em] text-paper transition-colors hover:border-paper hover:bg-paper hover:text-ink focus-ring">
              去提问
              <span aria-hidden="true" className="font-mono-ui text-[10px]">→</span>
            </Link>
          </div>
        </div>
      </section>

      <div className="container-page py-10">
        <Disclaimer />
      </div>
    </>
  );
}
