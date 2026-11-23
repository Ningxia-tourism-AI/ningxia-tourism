import type { ItineraryPlan } from "@/lib/api";
import { Check } from "./icons";

/** 后端返回的行程（真实景区数据 + AI 说明）。 */
export function ApiPlanView({ plan }: { plan: ItineraryPlan }) {
  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-4">
        <div>
          <p className="flex items-center gap-2 font-ui text-[11px] text-vermilion">
            <Check size={15} />
            已按当前条件生成
          </p>
          <p className="mt-2 font-display text-[36px] leading-none tracking-[0.03em]">{plan.days} 天</p>
        </div>
        <div className="text-right">
          <p className="font-ui text-[12px] text-ink-700">
            人均约 {plan.budget_estimate} 元
          </p>
          <p className="mt-1 text-[11px] text-ink-500">{plan.budget_note}</p>
        </div>
      </div>

      {plan.summary && (
        <p className="mt-4 border-l-2 border-line pl-4 text-[12px] leading-[1.95] text-ink-700">
          {plan.summary}
        </p>
      )}

      <ol className="mt-2">
        {plan.plan.map((day) => (
          <li key={day.day} className="grid gap-4 border-b border-line py-6 sm:grid-cols-[72px_1fr] sm:gap-6">
            <div>
              <p className="font-ui text-[10px] tracking-[0.08em] text-ink-500">Day</p>
              <p className="font-display text-[40px] leading-none text-vermilion">
                {String(day.day).padStart(2, "0")}
              </p>
              <p className="mt-1 font-ui text-[11px] text-ink-500">{day.city}</p>
            </div>

            <div>
              <div className="grid gap-3 sm:grid-cols-2">
                {day.spots.map((s) => (
                  <div key={s.scenic_id} className="border border-line bg-paper-light p-3">
                    <div className="flex items-baseline justify-between gap-2">
                      <p className="font-display text-[16px]">{s.name}</p>
                      <span className="border border-vermilion px-1.5 py-0.5 font-mono-ui text-[10px] text-vermilion">
                        {s.level}
                      </span>
                    </div>
                    <p className="mt-1 line-clamp-2 text-[11px] leading-[1.8] text-ink-500">{s.desc}</p>
                    {s.tags && <p className="mt-2 font-mono-ui text-[10px] text-teal">{s.tags}</p>}
                  </div>
                ))}
              </div>
              <p className="mt-2 text-[11px] leading-relaxed text-ink-500">{day.note}</p>
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-5">
        <p className="max-w-lg text-[11px] leading-[1.9] text-ink-500">{plan.disclaimer}</p>
        <span className="font-mono-ui text-[10px] text-ink-500">数据来源：宁夏文旅厅 A 级景区名录</span>
      </div>
    </div>
  );
}
