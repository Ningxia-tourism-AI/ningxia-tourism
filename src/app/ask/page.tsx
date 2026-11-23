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
        description="只依据站内资料作答并给出来源。门票、玩法、路线和方言都可以问；无法确认的内容会直接说不知道。"
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
            ["语料", "146 家 A 级景区、85 条可溯源方言词条、10 篇景区介绍、20 道美食、8 条路线。"],
            ["边界", "不回答实时天气、班次、实时票价，也不回答与宁夏文旅无关的问题。"],
            ["模式", "未配置大模型 key 时为本地检索；配置后切换大模型，超纲问题仍然拒答。"],
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
