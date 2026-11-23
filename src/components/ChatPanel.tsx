"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import type { AskResponse } from "@/types/content";
import {
  ExternalApiError,
  askQuestion,
  hasExternalApi,
} from "@/lib/ask-client";
import { ArrowRight, RotateCcw, Search, Send } from "./icons";

interface Turn {
  id: number;
  question: string;
  response?: AskResponse;
  error?: string;
  loading?: boolean;
}

/** 极简渲染：把答案里的 `- **标题**：正文` 变成有条目的段落，避免露出星号。 */
function AnswerText({ text }: { text: string }) {
  const lines = text.split("\n");
  return (
    <div className="space-y-1.5 font-body">
      {lines.map((line, i) => {
        if (!line.trim()) return <span key={i} className="block h-1.5" />;
        const item = line.match(/^-\s+\*\*(.+?)\*\*[：:]\s*(.*)$/);
        if (item) {
          return (
            <p key={i} className="flex gap-2 text-[13px] leading-[1.95] text-ink-700">
              <span aria-hidden="true" className="mt-[0.6em] h-1.5 w-1.5 shrink-0 bg-vermilion" />
              <span>
                <span className="font-medium">{item[1]}</span>：{item[2]}
              </span>
            </p>
          );
        }
        return (
          <p key={i} className="text-[13px] leading-[1.95] text-ink-700">
            {line.replace(/\*\*/g, "")}
          </p>
        );
      })}
    </div>
  );
}

const SAMPLES = [
  "沙坡头怎么玩？门票多少？",
  "宁夏有哪些必吃美食？",
  "三天时间怎么安排路线？",
  "「咥饭」在宁夏话里是什么意思？",
  "带小孩去哪个景区合适？",
];

export function ChatPanel() {
  const [input, setInput] = useState("");
  const [turns, setTurns] = useState<Turn[]>([]);
  const idRef = useRef(1);

  const ask = async (question: string) => {
    const trimmed = question.trim();
    if (!trimmed) return;
    const id = idRef.current++;
    setTurns((prev) => [...prev, { id, question: trimmed, loading: true }]);
    setInput("");

    try {
      const data = await askQuestion(trimmed);
      setTurns((prev) => prev.map((t) => (t.id === id ? { ...t, loading: false, response: data } : t)));
    } catch (error) {
      const tooFrequent =
        error instanceof ExternalApiError && error.status === 429;
      setInput(trimmed);
      setTurns((prev) =>
        prev.map((t) =>
          t.id === id
            ? {
                ...t,
                loading: false,
                error: tooFrequent
                  ? "提问太频繁了，请稍后再试。"
                  : "服务暂时不可用，问题已保留，请重试。",
              }
            : t,
        ),
      );
    }
  };

  return (
    <div className="grid gap-8 font-ui lg:grid-cols-[minmax(0,1fr)_260px] lg:gap-12">
      <div className="flex flex-col border border-line bg-paper-light">
        <div className="flex items-center justify-between border-b border-line px-4 py-3 md:px-6">
          <p className="flex items-center gap-2 font-ui text-[11px] tracking-[0.08em] text-ink-500">
            <Search size={15} />
            站内资料问答
          </p>
          <span className="font-ui text-[11px] text-vermilion">
            {hasExternalApi() ? "外部 API 模式" : "本地检索模式"}
          </span>
        </div>

        <div className="min-h-[250px] flex-1 space-y-7 p-4 md:p-6" aria-live="polite">
          {turns.length === 0 && (
            <div className="flex min-h-[210px] flex-col justify-center py-6">
              <p className="font-display text-[clamp(28px,4vw,42px)] leading-[1.25] tracking-[0.02em]">
                先问一个
                <br />
                真正要决定的事
              </p>
              <p className="mt-4 max-w-md text-[13px] leading-[1.9] text-ink-500">
                门票、玩多久、怎么顺路、吃什么，都可以直接问。答案只来自站点已整理的资料。
              </p>
            </div>
          )}

          {turns.map((turn) => (
            <div key={turn.id} className="space-y-3">
              <div className="flex justify-end">
                <p className="max-w-[85%] bg-ink px-4 py-2.5 text-[13px] leading-[1.7] text-paper">{turn.question}</p>
              </div>

              <div className="border-l-2 border-vermilion pl-4">
                {turn.loading && (
                  <div className="space-y-2 py-1" aria-label="正在检索站内资料">
                    <span className="block h-3 w-4/5 animate-pulse bg-line" />
                    <span className="block h-3 w-3/5 animate-pulse bg-line" />
                    <span className="block h-3 w-2/5 animate-pulse bg-line" />
                  </div>
                )}
                {turn.error && (
                  <div>
                    <p className="text-[13px] text-vermilion">{turn.error}</p>
                    <button
                      type="button"
                      onClick={() => void ask(turn.question)}
                      className="focus-ring mt-3 inline-flex items-center gap-2 border border-line px-3 py-2 font-ui text-[11px] text-ink-700 transition-colors hover:border-vermilion hover:text-vermilion"
                    >
                      <RotateCcw size={14} />
                      重新发送
                    </button>
                  </div>
                )}
                {turn.response && (
                  <>
                    <AnswerText text={turn.response.answer} />

                    {turn.response.citations.length > 0 && (
                      <div className="mt-4 border-t border-line pt-3">
                        <p className="font-ui text-[11px] text-ink-500">引用来源</p>
                        <ul className="mt-2 flex flex-wrap gap-1.5">
                          {turn.response.citations.map((c) => (
                            <li key={c.id}>
                              <Link
                                href={c.href}
                                className="inline-block border border-line px-2 py-1 text-[11px] text-teal transition-colors hover:border-teal"
                              >
                                {c.title}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <p className="mt-3 flex flex-wrap items-center gap-2 font-ui text-[11px] text-ink-500">
                      {turn.response.source && (
                        <span
                          className={`border px-1.5 py-0.5 text-[10px] ${
                            turn.response.source === "db"
                              ? "border-teal/50 text-teal"
                              : "border-ochre/50 text-ochre"
                          }`}
                        >
                          {turn.response.source === "db" ? "来源：词库/数据库" : "AI 推测"}
                        </span>
                      )}
                      {turn.response.mode === "llm" ? "大模型" : "本地检索"} · 置信度{" "}
                      {Math.round(turn.response.confidence * 100)}%
                    </p>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            void ask(input);
          }}
          className="border-t border-line p-3 md:p-4"
        >
          <div className="flex items-end gap-3">
            <label htmlFor="ask-input" className="sr-only">
              输入问题
            </label>
            <input
              id="ask-input"
              value={input}
              onChange={(e) => setInput(e.target.value.slice(0, 500))}
              placeholder="例如：沙坡头门票多少钱？"
              className="focus-ring w-full border-0 border-b border-line bg-transparent px-1 py-2 text-[13px] outline-none placeholder:text-ink-500/60"
            />
            <button
              type="submit"
              className="focus-ring inline-flex shrink-0 items-center gap-2 bg-ink px-5 py-2.5 font-ui text-[12px] tracking-[0.06em] text-paper transition-colors hover:bg-vermilion"
            >
              发送
              <Send size={14} />
            </button>
          </div>
        </form>
      </div>

      <aside className="lg:sticky lg:top-28 lg:self-start">
        <p className="flex items-center gap-2 font-ui text-[11px] text-ink-500">
          <ArrowRight size={14} />
          从这些问题开始
        </p>
        <ol className="mt-3 border-t border-line">
          {SAMPLES.map((s, i) => (
            <li key={s} className="border-b border-line">
              <button
                type="button"
                onClick={() => void ask(s)}
                className="group flex w-full items-baseline gap-3 py-2.5 text-left focus-ring"
              >
                <span className="font-ui text-[10px] text-ink-500">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-[12px] leading-[1.7] text-ink-700 transition-colors group-hover:text-vermilion">
                  {s}
                </span>
              </button>
            </li>
          ))}
        </ol>
        <p className="mt-4 text-[11px] leading-[1.9] text-ink-500">
          语料：146 家 A 级景区、85 条可溯源方言词条、20 道美食、8 条路线。不提供实时天气、班次与实时票价。
        </p>
      </aside>
    </div>
  );
}
