import type { Metadata } from "next";
import { PageHeader } from "@/components/ui";
import { ChatPanel } from "@/components/ChatPanel";

export const metadata: Metadata = {
  title: "站内资料问答",
  description: "基于站内景区、美食、路线与方言语料的问答助手，答案附引用来源，超出范围会如实拒答。",
};

export default function AskPage() {
  return (
    <>
      <PageHeader
        eyebrow="资料问答 / ASK"
        title="问清这一趟"
        description="答案只从这片土地的资料里找：景区、吃食、路线与方言，都带着出处。门票、玩法、方言尽管问，查不到的，它也会直说不知道。"
        aside={
          <div className="border-y border-line py-4">
            <p className="font-ui text-[11px] text-vermilion">回答范围</p>
            <p className="mt-2 font-display text-[25px] leading-[1.35]">景区玩法 · 路线安排 · 当地饮食 · 方言词义</p>
            <p className="mt-3 text-[11px] leading-[1.8] text-ink-500">不提供实时天气、班次和实时票价。</p>
          </div>
        }
      />
      <div className="container-page py-10 md:py-14">
        <ChatPanel />

        <div className="mt-12 grid gap-6 border-t border-line pt-8 md:grid-cols-3">
          {[
            ["语料", "146 家 A 级景区，85 条能追到出处的方言词条；另有 10 篇景区散记、20 道吃食、8 条路线。"],
            ["边界", "天气、班次、当日票价，这里没有；与宁夏无关的问题，也不勉强作答。"],
            ["模式", "检索负责找到依据，模型负责把话说顺；资料之外的，仍然直言不答。"],
          ].map(([title, body]) => (
            <div key={title} className="border-l-2 border-line pl-4 first:border-vermilion">
              <p className="font-ui text-[11px] tracking-[0.08em] text-ink-500">{title}</p>
              <p className="mt-2 text-[12px] leading-[1.95] text-ink-700">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
