"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { BUDGET_LEVELS, INTERESTS, planRoute, type BudgetLevel, type Interest, type PlanResult } from "@/lib/planner";
import { API_BASE, planItinerary, type ItineraryPlan } from "@/lib/api";
import { ApiPlanView } from "./ApiPlanView";
import type { Region } from "@/types/content";
import { REGIONS } from "@/types/content";
import { ArrowRight, Check, RouteIcon } from "./icons";

export function PlannerForm() {
  const [days, setDays] = useState(3);
  const [regions, setRegions] = useState<Region[]>([]);
  const [interests, setInterests] = useState<Interest[]>(["自然风光", "历史人文"]);
  const [budget, setBudget] = useState<BudgetLevel>("舒适");
  const [result, setResult] = useState<PlanResult | null>(null);
  const [apiPlan, setApiPlan] = useState<ItineraryPlan | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setResult(null);
    setApiPlan(null);
  }, [days, regions, interests, budget]);

  const preview = result ?? planRoute({ days, regions, interests, budget });

  const toggle = <T,>(list: T[], value: T, set: (v: T[]) => void) => {
    set(list.includes(value) ? list.filter((x) => x !== value) : [...list, value]);
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!API_BASE) {
      setResult(planRoute({ days, regions, interests, budget }));
      return;
    }
    setLoading(true);
    try {
      const data = await planItinerary({
        days,
        areas: regions.length ? regions.map((r) => `${r}市`) : undefined,
        interests,
        // 前端深度对后端品质
        budget: budget === "深度" ? "品质" : budget,
      });
      setApiPlan(data);
      setResult(null);
    } catch {
      // 后端不可用就退回本地规则，页面不会空着
      setApiPlan(null);
      setResult(planRoute({ days, regions, interests, budget }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-10 font-ui lg:grid-cols-[300px_minmax(0,1fr)] lg:gap-14">
      <form onSubmit={onSubmit} className="h-fit border border-line bg-paper-light p-5 lg:sticky lg:top-28">
        <div className="flex items-center gap-2 text-vermilion">
          <RouteIcon size={17} />
          <p className="font-ui text-[11px] tracking-[0.1em]">设置你的条件</p>
        </div>

        <div className="mt-5 border-t border-line pt-4">
          <label htmlFor="days" className="flex items-baseline justify-between">
            <span className="font-display text-[17px] tracking-[0.04em]">玩几天</span>
            <span className="font-display text-[22px] text-vermilion">{days}</span>
          </label>
          <input
            id="days"
            type="range"
            min={1}
            max={7}
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="mt-3 w-full accent-vermilion"
          />
          <div className="flex justify-between font-ui text-[11px] text-ink-500">
            <span>1 天</span>
            <span>7 天</span>
          </div>
        </div>

        <fieldset className="mt-5 border-t border-line pt-4">
          <legend className="font-ui text-[11px] tracking-[0.08em] text-ink-500">
            区域（不选 = 全宁夏）
          </legend>
          <div className="mt-2.5 flex flex-wrap gap-2">
            {REGIONS.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => toggle(regions, r, setRegions)}
                className={`focus-ring border px-2.5 py-1 text-[12px] transition-colors ${
                  regions.includes(r)
                    ? "border-vermilion bg-vermilion text-paper-light"
                    : "border-line bg-paper text-ink-700 hover:border-line-strong"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className="mt-5 border-t border-line pt-4">
          <legend className="font-ui text-[11px] tracking-[0.08em] text-ink-500">兴趣</legend>
          <div className="mt-2.5 flex flex-wrap gap-2">
            {INTERESTS.map((i) => (
              <button
                key={i}
                type="button"
                onClick={() => toggle(interests, i, setInterests)}
                className={`focus-ring border px-2.5 py-1 text-[12px] transition-colors ${
                  interests.includes(i)
                    ? "border-vermilion bg-vermilion text-paper-light"
                    : "border-line bg-paper text-ink-700 hover:border-line-strong"
                }`}
              >
                {i}
              </button>
            ))}
          </div>
        </fieldset>

        <div className="mt-5 border-t border-line pt-4">
          <label htmlFor="budget" className="font-ui text-[11px] tracking-[0.08em] text-ink-500">
            预算档位
          </label>
          <select
            id="budget"
            value={budget}
            onChange={(e) => setBudget(e.target.value as BudgetLevel)}
            className="focus-ring mt-2 w-full border border-line bg-paper px-3 py-2 text-[13px]"
          >
            {BUDGET_LEVELS.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="focus-ring mt-6 flex w-full items-center justify-between gap-4 bg-ink px-4 py-3 font-ui text-[12px] tracking-[0.08em] text-paper transition-colors hover:bg-vermilion"
        >
          {loading ? "生成中…" : "生成行程"}
          <ArrowRight size={16} />
        </button>
        <p className="mt-3 text-[11px] leading-[1.8] text-ink-500">
          规则为区域聚拢 + 兴趣匹配，结果是建议而非最优解；门票与时间以官方为准。
        </p>
      </form>

      <div aria-live="polite">
        {apiPlan ? (
          <ApiPlanView plan={apiPlan} />
        ) : (
          <div className={result ? "" : "opacity-90"}>
            <div className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-4">
              <div>
                <p className="flex items-center gap-2 font-ui text-[11px] text-vermilion">
                  {result ? <Check size={15} /> : <RouteIcon size={15} />}
                  {result ? "已按当前条件生成" : "实时路线预览"}
                </p>
                <p className="mt-2 font-display text-[36px] leading-none tracking-[0.03em]">
                  {preview.days.length} 天
                </p>
              </div>
              <div className="text-right">
                <p className="font-ui text-[12px] text-ink-700">{preview.budgetEstimate}</p>
                <p className="mt-1 text-[11px] text-ink-500">
                  {result ? "修改左侧条件可重新生成" : "先看一版，再在左侧调整"}
                </p>
              </div>
            </div>

            {preview.warnings.length > 0 && (
              <ul className="mt-4 border-l-2 border-ochre bg-ochre/[0.06] px-3 py-2 text-[11px] leading-[1.9] text-ink-700">
                {preview.warnings.map((w) => (
                  <li key={w}>· {w}</li>
                ))}
              </ul>
            )}

            <ol className="mt-2">
              {preview.days.map((day) => (
                <li key={day.day} className="grid gap-4 border-b border-line py-6 sm:grid-cols-[72px_1fr] sm:gap-6">
                  <div>
                    <p className="font-ui text-[10px] tracking-[0.08em] text-ink-500">Day</p>
                    <p className="font-display text-[40px] leading-none text-vermilion">
                      {String(day.day).padStart(2, "0")}
                    </p>
                    <p className="mt-1 font-ui text-[11px] text-ink-500">{day.region}</p>
                  </div>

                  <div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {day.attractions.map((a) => (
                        <Link
                          key={a.slug}
                          href={`/attractions/${a.slug}`}
                          className="group border border-line bg-paper-light p-3 transition-colors hover:border-line-strong focus-ring"
                        >
                          <p className="font-display text-[16px] transition-colors group-hover:text-vermilion">{a.name}</p>
                          <p className="mt-1 line-clamp-2 text-[11px] leading-[1.8] text-ink-500">{a.summary}</p>
                          <p className="mt-2 font-mono-ui text-[10px] text-vermilion">{a.ticket}</p>
                        </Link>
                      ))}

                      {day.food && (
                        <Link
                          href={`/foods/${day.food.slug}`}
                          className="group border border-dashed border-vermilion/35 bg-paper p-3 transition-colors hover:border-vermilion focus-ring"
                        >
                          <p className="font-ui text-[11px] text-vermilion">当日推荐吃</p>
                          <p className="mt-1 font-display text-[16px] transition-colors group-hover:text-vermilion">
                            {day.food.name}
                          </p>
                          <p className="mt-1 line-clamp-2 text-[11px] leading-[1.8] text-ink-500">{day.food.summary}</p>
                        </Link>
                      )}
                    </div>
                    <p className="mt-2 text-[11px] leading-relaxed text-ink-500">{day.note}</p>
                  </div>
                </li>
              ))}
            </ol>

            <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-5">
              <p className="max-w-lg text-[11px] leading-[1.9] text-ink-500">
                行程由规则生成，未考虑实时路况与景区闭园；出发前请核对开放时间，必要时用精品路线做底稿。
              </p>
              <Link href="/routes" className="link-line shrink-0 text-[11px] tracking-[0.08em]">
                看精品路线 →
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
