"use client";

import { useEffect, useMemo, useState } from "react";
import { API_BASE, fetchAllScenic, type ScenicSpot } from "@/lib/api";
import { EmptyState } from "./ui";
import { MapPin, Search } from "./icons";

const CITIES = ["全部", "银川市", "石嘴山市", "吴忠市", "固原市", "中卫市"];
const LEVELS = ["全部", "5A", "4A", "3A", "2A", "1A"];
const TAGS = ["全部", "自然风光", "历史人文", "美食", "亲子", "摄影", "徒步", "冬季"];
const PAGE_SIZE = 20;

/**
 * 官方 A 级景区名录（146 条），数据来自 MySQL / FastAPI。
 * 与上方「精选目的地」互补：这里是全量名录，可按城市、等级、标签筛选。
 */
export function ScenicSpotList() {
  const [spots, setSpots] = useState<ScenicSpot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [city, setCity] = useState("全部");
  const [level, setLevel] = useState("全部");
  const [tag, setTag] = useState("全部");
  const [query, setQuery] = useState("");
  const [limit, setLimit] = useState(PAGE_SIZE);

  useEffect(() => {
    let alive = true;
    if (!API_BASE) {
      setLoading(false);
      setError("未配置后端地址（NEXT_PUBLIC_API_BASE_URL），当前为静态模式。");
      return;
    }
    fetchAllScenic()
      .then((data) => {
        if (alive) setSpots(data);
      })
      .catch(() => {
        if (alive) setError("接口连接失败，请确认后端已启动。");
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim();
    return spots.filter((s) => {
      if (city !== "全部" && s.city !== city) return false;
      if (level !== "全部" && s.level !== level) return false;
      if (tag !== "全部" && !(s.tags ?? "").includes(tag)) return false;
      if (q && !`${s.name}${s.address ?? ""}${s.tags ?? ""}`.includes(q)) return false;
      return true;
    });
  }, [spots, city, level, tag, query]);

  const visible = filtered.slice(0, limit);
  const remaining = filtered.length - visible.length;

  return (
    <section className="mt-16 border-t border-line pt-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3 border-b border-line pb-3">
        <div>
          <h2 className="font-display text-[28px] tracking-[0.04em]">官方名录 · A 级景区</h2>
          <p className="mt-1 font-ui text-[11px] text-ink-500">
            数据来源：宁夏文化和旅游厅 A 级旅游景区名录，共 {spots.length || 146} 家
          </p>
        </div>
        <span className="font-ui text-[11px] text-ink-500">
          {loading ? "加载中…" : `${filtered.length} 个结果`}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-y border-line py-3">
        {CITIES.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => {
              setCity(c);
              setLimit(PAGE_SIZE);
            }}
            className={`focus-ring font-ui text-[12px] transition-colors ${
              city === c ? "text-vermilion" : "text-ink-500 hover:text-ink"
            }`}
          >
            {c}
          </button>
        ))}
        <select
          value={level}
          onChange={(e) => {
            setLevel(e.target.value);
            setLimit(PAGE_SIZE);
          }}
          className="focus-ring border border-line bg-paper-light px-2 py-1.5 font-ui text-[12px] text-ink-700"
          aria-label="按等级筛选"
        >
          {LEVELS.map((l) => (
            <option key={l} value={l}>
              {l === "全部" ? "全部等级" : l}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
        {TAGS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => {
              setTag(t);
              setLimit(PAGE_SIZE);
            }}
            className={`focus-ring border px-2 py-1 font-ui text-[11px] transition-colors ${
              tag === t ? "border-vermilion text-vermilion" : "border-line text-ink-500 hover:text-ink"
            }`}
          >
            {t}
          </button>
        ))}
        <label className="relative ml-auto block">
          <span className="sr-only">搜索景区</span>
          <Search size={14} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-500" />
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setLimit(PAGE_SIZE);
            }}
            placeholder="搜名称或地址"
            className="focus-ring w-40 border border-line bg-paper-light py-1.5 pl-8 pr-2 text-[12px]"
          />
        </label>
      </div>

      {error && <p className="mt-6 text-[12px] text-vermilion">{error}</p>}

      {!error && loading && <p className="mt-6 font-ui text-[12px] text-ink-500">正在读取数据库…</p>}

      {!error && !loading && visible.length === 0 && (
        <div className="mt-6">
          <EmptyState
            title="没有符合条件的景区"
            description="换个关键词，或清除城市、等级与标签筛选。"
          />
        </div>
      )}

      <ul className="mt-2 border-t border-line">
        {visible.map((s) => (
          <li key={s.scenic_id} className="border-b border-line py-2.5">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <div className="flex flex-wrap items-baseline gap-2">
                <span className="font-display text-[17px] tracking-[0.03em] text-ink">{s.name}</span>
                <span className="border border-vermilion px-1.5 py-0.5 font-mono-ui text-[10px] text-vermilion">
                  {s.level}
                </span>
                <span className="inline-flex items-center gap-1 font-ui text-[11px] text-ink-500">
                  <MapPin size={12} />
                  {s.city}
                </span>
              </div>
              <span className="font-ui text-[11px] text-ink-500">{s.tags ?? ""}</span>
            </div>
            {s.address && (
              <p className="mt-1 max-w-3xl text-[11px] leading-[1.8] text-ink-500">{s.address}</p>
            )}
          </li>
        ))}
      </ul>

      {remaining > 0 && (
        <div className="mt-6">
          <button
            type="button"
            onClick={() => setLimit((v) => v + PAGE_SIZE)}
            className="focus-ring border border-line px-4 py-2 font-mono-ui text-[11px] tracking-[0.12em] transition-colors hover:border-vermilion hover:text-vermilion"
          >
            再显示 {PAGE_SIZE} 条（还剩 {remaining} 条）
          </button>
        </div>
      )}
    </section>
  );
}
