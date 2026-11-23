"use client";

import { useCallback, useEffect, useState } from "react";
import {
  API_BASE,
  fetchDialect,
  translateDialect,
  type DialectWord,
} from "@/lib/api";

const CITIES = ["全部", "银川市", "固原市"];

/**
 * 数据库方言词条（来自 MySQL）+ AI 翻译。
 * 与本地词典并存：本地词典用于离线检索，这里展示已核实的 47 条来源词条。
 */
export function DialectDbPanel() {
  const [words, setWords] = useState<DialectWord[]>([]);
  const [total, setTotal] = useState(0);
  const [query, setQuery] = useState("");
  const [city, setCity] = useState("全部");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [text, setText] = useState("他这个人办事拖拉");
  const [answer, setAnswer] = useState<string | null>(null);
  const [translating, setTranslating] = useState(false);
  const [matched, setMatched] = useState<number | null>(null);

  const load = useCallback(async () => {
    if (!API_BASE) {
      setError("未配置后端地址（NEXT_PUBLIC_API_BASE_URL）。");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await fetchDialect({
        q: query.trim() || undefined,
        city: city === "全部" ? undefined : city,
        size: 100,
      });
      setWords(data.items);
      setTotal(data.total);
    } catch {
      setError("接口连接失败，请确认后端已启动。");
    } finally {
      setLoading(false);
    }
  }, [query, city]);

  useEffect(() => {
    const timer = setTimeout(() => void load(), 250);
    return () => clearTimeout(timer);
  }, [load]);

  const onTranslate = async () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setTranslating(true);
    setAnswer(null);
    try {
      const data = await translateDialect(trimmed);
      setAnswer(data.answer);
      setMatched(data.matched);
    } catch {
      setAnswer("服务暂时不可用，请确认后端已启动。");
      setMatched(null);
    } finally {
      setTranslating(false);
    }
  };

  return (
    <section className="mt-16 border-t border-line pt-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3 border-b border-line pb-3">
        <div>
          <h2 className="font-display text-[28px] tracking-[0.04em]">数据库词条 · AI 翻译</h2>
          <p className="mt-1 font-ui text-[11px] text-ink-500">
            来自《银川方言词典》《固原方言四字格词语研究》，共 {total || 47} 条，逐条标注页码
          </p>
        </div>
      </div>

      <div className="border border-line bg-paper-light p-4 md:p-6">
        <label htmlFor="api-dialect-input" className="font-ui text-[11px] tracking-[0.08em] text-ink-500">
          普通话句子
        </label>
        <textarea
          id="api-dialect-input"
          value={text}
          onChange={(e) => setText(e.target.value.slice(0, 200))}
          rows={3}
          className="focus-ring mt-2 w-full resize-y border-0 border-b border-line bg-transparent pb-2 font-display text-[18px] leading-[1.7] outline-none"
        />
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => void onTranslate()}
            disabled={translating}
            className="focus-ring bg-ink px-4 py-2 font-ui text-[12px] tracking-[0.06em] text-paper transition-colors hover:bg-vermilion disabled:opacity-60"
          >
            {translating ? "翻译中…" : "翻译成宁夏话"}
          </button>
          {matched !== null && (
            <span className="font-ui text-[11px] text-ink-500">
              词表命中 {matched} 条{matched === 0 ? "（未匹配到，保持原句）" : ""}
            </span>
          )}
        </div>
        {answer && (
          <p className="mt-4 border-l-2 border-vermilion pl-4 text-[13px] leading-[1.95] text-ink-700">
            {answer}
          </p>
        )}
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-3 border-y border-line py-3">
        {CITIES.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCity(c)}
            className={`focus-ring font-ui text-[12px] transition-colors ${
              city === c ? "text-vermilion" : "text-ink-500 hover:text-ink"
            }`}
          >
            {c}
          </button>
        ))}
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="搜方言词或普通话词"
          className="focus-ring ml-auto w-48 border border-line bg-paper-light px-3 py-1.5 text-[12px]"
        />
        <span className="font-ui text-[11px] text-ink-500">{loading ? "加载中…" : `${total} 条`}</span>
      </div>

      {error && <p className="mt-4 text-[12px] text-vermilion">{error}</p>}

      <ul className="mt-2 border-t border-line">
        {words.map((w) => (
          <li key={w.id} className="border-b border-line py-2.5">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <div className="flex flex-wrap items-baseline gap-2">
                <span className="text-[13px] text-ink-700">{w.mandarin}</span>
                <span aria-hidden="true" className="text-ink-500/60">→</span>
                <span className="font-display text-[17px] tracking-[0.03em] text-vermilion">{w.dialect}</span>
                <span className="font-ui text-[11px] text-ink-500">{w.category ?? ""}</span>
              </div>
              <span className="font-ui text-[11px] text-ink-500">
                {w.city} · {w.source_name ?? ""} {w.page ?? ""}
              </span>
            </div>
            {w.meaning && (
              <p className="mt-1 max-w-3xl text-[11px] leading-[1.8] text-ink-500">{w.meaning}</p>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
