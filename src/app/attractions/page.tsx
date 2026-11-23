import type { Metadata } from "next";
import Link from "next/link";
import { AttractionExplorer } from "@/components/AttractionExplorer";
import { ScenicSpotList } from "@/components/ScenicSpotList";
import { attractions } from "@/content/attractions";
import { ArrowUpRight, Compass, MapPin } from "@/components/icons";

export const metadata: Metadata = {
  title: "宁夏景区介绍",
  description:
    "沙坡头、沙湖、西夏王陵、镇北堡西部影城、贺兰山岩画、水洞沟等宁夏核心景区介绍，含开放时间、门票参考、交通与最佳季节。",
};

export default function AttractionsPage() {
  return (
    <>
      <section className="grain relative overflow-hidden border-b border-line">
        <div className="container-page grid gap-10 py-12 md:py-16 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-end">
          <div>
            <p className="font-ui text-[11px] tracking-[0.14em] text-vermilion">目的地 / DESTINATIONS</p>
            <h1 className="mt-4 max-w-4xl font-display text-[clamp(48px,8vw,92px)] leading-[0.95] tracking-[0.01em]">
              先看沙与河
              <br />再看山与城
            </h1>
            <p className="mt-6 max-w-2xl border-l border-line-strong pl-4 text-[14px] leading-[1.95] text-ink-500">
              沙从腾格里漫过来，河在峡谷里拐了一道弯；山是贺兰山上的凿痕，林是六盘山间的松风。按城市与类型慢慢筛，季节、车程与门票，都是要算进去的事。
            </p>
          </div>

          <div className="border-t border-line pt-5 lg:border-l lg:border-t-0 lg:pl-7 lg:pt-0">
            <div className="grid grid-cols-2 gap-x-5 gap-y-5">
              <div>
                <Compass size={18} className="text-vermilion" />
                <p className="mt-2 font-display text-[34px] leading-none">146</p>
                <p className="mt-1 font-ui text-[11px] text-ink-500">家 A 级景区</p>
              </div>
              <div>
                <MapPin size={18} className="text-vermilion" />
                <p className="mt-2 font-display text-[34px] leading-none">
                  {new Set(attractions.map((item) => item.region)).size}
                </p>
                <p className="mt-1 font-ui text-[11px] text-ink-500">座城市</p>
              </div>
            </div>
            <Link
              href="/routes/plan"
              className="focus-ring mt-6 inline-flex items-center gap-3 bg-ink px-5 py-3 font-ui text-[12px] tracking-[0.08em] text-paper transition-colors hover:bg-vermilion"
            >
              按天数安排路线
              <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <div className="container-page py-8 md:py-10">
        <AttractionExplorer attractions={attractions} />
        <ScenicSpotList />
      </div>
    </>
  );
}
