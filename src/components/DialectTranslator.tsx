"use client";

import { useMemo, useState } from "react";
import { translate, type Direction } from "@/lib/dialect";
import { dialectEntries } from "@/content/dialect";
import type { DialectCategory, DialectRegion } from "@/types/content";
import { dialectCategories, dialectRegions } from "@/content/dialect";
import { API_BASE, translateDialect } from "@/lib/api";

const CONFIDENCE_LABEL = { 1: "低", 2: "中", 3: "较高" } as const;

export function DialectTranslator() {
  const [direction, setDirection] = useState<Direction>("m2d");
  const [aiAnswer, setAiAnswer] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [region, setRegion] = useState<DialectRegion | "">("");
  const [text, setText] = useState("吃饭了吗？今天下午有空吗？");

  const result = useMemo(
    () => (text.trim() ? translate(text, direction, region || undefined) : null),
    [text, direction, region],
  );

  const askApi = async () => {
    const trimmed = text.trim();
    if (!trimmed || !API_BASE) return;
    setAiLoading(true);
    try {
      const data = await translateDialect(trimmed, region || undefined);
      setAiAnswer(data.answer);
    } catch {
      setAiAnswer("服务暂时不可用，请确认后端已启动。");
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="border border-line bg-paper-light font-ui">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-4 py-3 md:px-6">
        <div className="flex items-center gap-5">
          <button
            type="button"
            onClick={() => setDirection("m2d")}
            className={`focus-ring pb-1 font-mono-ui text-[11px] tracking-[0.16em] transition-colors ${
              direction === "m2d" ? "border-b-2 border-vermilion text-vermilion" : "text-ink-500 hover:text-ink"
            }`}
          >
            普通话 → 方言
          </button>
          <button
            type="button"
            onClick={() => setDirection("d2m")}
            className={`focus-ring pb-1 font-mono-ui text-[11px] tracking-[0.16em] transition-colors ${
              direction === "d2m" ? "border-b-2 border-vermilion text-vermilion" : "text-ink-500 hover:text-ink"
            }`}
          >
            方言 → 普通话
          </button>
        </div>

        <div className="flex items-center gap-3">
          <label htmlFor="region" className="font-ui text-[11px] text-ink-500">
            区域
          </label>
          <select
            id="region"
            value={region}
            onChange={(e) => setRegion(e.target.value as DialectRegion | "")}
            className="focus-ring border border-line bg-paper px-2.5 py-1.5 font-mono-ui text-[11px]"
          >
            <option value="">不限</option>
            {dialectRegions
              .filter((r) => r !== "通用")
              .map((r) => (
                <option key={r} value={r}>
                  {r}话
                </option>
              ))}
          </select>
        </div>
      </div>

      <div className="grid md:grid-cols-2">
        <div className="border-line p-4 md:border-r md:p-6">
          <label htmlFor="dialect-input" className="font-ui text-[11px] tracking-[0.08em] text-ink-500">
            {direction === "m2d" ? "普通话" : "方言（汉字记音）"}
          </label>
          <textarea
            id="dialect-input"
            value={text}
            onChange={(e) => setText(e.target.value.slice(0, 200))}
            rows={4}
            className="focus-ring mt-2 w-full resize-y border-0 border-b border-line bg-transparent pb-2 font-display text-[20px] leading-[1.7] outline-none placeholder:text-ink-500/50"
            placeholder={direction === "m2d" ? "例如：吃饭了吗？" : "例如：咥了没？"}
          />
          <p className="mt-1 text-right font-ui text-[11px] text-ink-500">{text.length}/200</p>
        </div>

        <div className="p-4 md:p-6">
          <div className="flex items-center justify-between gap-3">
            <p className="font-ui text-[11px] text-ink-500">译文</p>
            {result && (
              <span className="font-ui text-[11px] text-ink-500">
                置信度 {CONFIDENCE_LABEL[result.confidence]}
              </span>
            )}
          </div>

          {result ? (
            <>
              <p className="mt-2 min-h-[3.4em] font-display text-[26px] leading-[1.4] tracking-[0.03em] text-ink">
                {result.translation}
              </p>

              {result.segments.length > 0 && (
                <ul className="mt-4 flex flex-wrap gap-1.5 border-t border-line pt-3">
                  {result.segments.map((s, i) => (
                    <li
                      key={`${s.src}-${i}`}
                      className={`border px-2 py-1 font-ui text-[11px] ${
                        s.matched ? "border-teal/35 text-teal" : "border-ochre/40 text-ochre"
                      }`}
                      title={s.note ?? undefined}
                    >
                      {s.src}
                      {s.matched ? ` → ${s.out}` : " · 未收录"}
                    </li>
                  ))}
                </ul>
              )}

              <p className="mt-3 text-[11px] leading-[1.85] text-ink-500">{result.note}</p>

              {API_BASE && result.unmatched.length > 0 && (
                <div className="mt-3 border-t border-line pt-3">
                  <button
                    type="button"
                    onClick={() => {
                      setAiAnswer(null);
                      void askApi();
                    }}
                    disabled={aiLoading}
                    className="focus-ring border border-line px-3 py-1.5 font-ui text-[11px] text-vermilion transition-colors hover:border-vermilion disabled:opacity-60"
                  >
                    {aiLoading ? "查询中…" : "本地未收录，用数据库词库/AI 再查一次"}
                  </button>
                  {aiAnswer && (
                    <p className="mt-2 whitespace-pre-wrap text-[12px] leading-[1.9] text-ink-700">{aiAnswer}</p>
                  )}
                </div>
              )}
            </>
          ) : (
            <p className="mt-3 text-[12px] text-ink-500">输入内容后即时翻译。</p>
          )}
        </div>
      </div>
    </div>
  );
}

export function DialectDictionary() {
  const [category, setCategory] = useState<DialectCategory | "全部">("全部");
  const [query, setQuery] = useState("");
  const [limit, setLimit] = useState(30);

  const filtered = useMemo(() => {
    const q = query.trim();
    return dialectEntries.filter((d) => {
      if (category !== "全部" && d.category !== category) return false;
      if (q && !`${d.mandarin}${d.dialect}${d.note}`.includes(q)) return false;
      return true;
    });
  }, [category, query]);

  const visible = filtered.slice(0, limit);
  const remaining = filtered.length - visible.length;

  return (
    <div>
      <div className="flex flex-wrap items-center gap-x-5 gap-y-3 border-y border-line py-3">
        <button
          type="button"
          onClick={() => {
            setCategory("全部");
            setLimit(30);
          }}
          className={`font-mono-ui text-[11px] tracking-[0.14em] transition-colors focus-ring ${
            category === "全部" ? "text-vermilion" : "text-ink-500 hover:text-ink"
          }`}
        >
          全部
        </button>
        {dialectCategories.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => {
              setCategory(category === c ? "全部" : c);
              setLimit(30);
            }}
            className={`font-mono-ui text-[11px] tracking-[0.14em] transition-colors focus-ring ${
              category === c ? "text-vermilion" : "text-ink-500 hover:text-ink"
            }`}
          >
            {c}
          </button>
        ))}
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setLimit(30);
          }}
          placeholder="搜词条"
          aria-label="搜索方言词条"
          className="focus-ring ml-auto w-36 border border-line bg-paper-light px-2.5 py-1.5 text-[12px]"
        />
      </div>

      <p className="mt-4 font-ui text-[11px] text-ink-500">
        共 {filtered.length} 条 · 显示 {visible.length} 条 · 全部待核实
      </p>

      <ul className="mt-2 border-t border-line">
        {visible.map((d) => (
          <li key={d.id} className="border-b border-line py-2.5">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <div className="flex flex-wrap items-baseline gap-2">
                <span className="text-[14px] text-ink-700">{d.mandarin}</span>
                <span aria-hidden="true" className="text-ink-500/60">→</span>
                <span className="font-display text-[17px] tracking-[0.03em] text-vermilion">{d.dialect}</span>
                <span className="font-ui text-[11px] text-ink-500">{d.pinyin}</span>
              </div>
              <span className="font-ui text-[11px] text-ink-500">
                {d.region} · {d.category}
              </span>
            </div>
            {d.note && <p className="mt-1 max-w-3xl text-[11px] leading-[1.8] text-ink-500">{d.note}</p>}
            {d.examples.length > 0 && (
              <p className="mt-1 font-ui text-[11px] text-ink-500">
                例：{d.examples.map((x) => x.dialect).join(" / ")}
              </p>
            )}
          </li>
        ))}
      </ul>

      {remaining > 0 && (
        <div className="mt-6">
          <button
            type="button"
            onClick={() => setLimit((v) => v + 60)}
            className="focus-ring border border-line px-4 py-2 font-mono-ui text-[11px] tracking-[0.12em] transition-colors hover:border-vermilion hover:text-vermilion"
          >
            再显示 60 条（还剩 {remaining} 条）
          </button>
        </div>
      )}
    </div>
  );
}
