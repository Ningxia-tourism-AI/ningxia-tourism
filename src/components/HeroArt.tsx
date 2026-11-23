"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { assetPath } from "@/lib/asset-path";

/**
 * 想换图/换文案，只改这个数组。
 * coord：只有查到可靠坐标才填；没有就留空，页面显示“—”，不编造。
 */
const SLIDES = [
  {
    src: "/images/main1.jpg",
    alt: "沙坡头附近，黄河从腾格里沙漠边缘流过",
    title: "黄河与腾格里",
    subtitle: "沙坡头 · 中卫 / 实景摄影",
    place: "沙坡头",
    coord: "37.47°N · 105.00°E",
  },
  {
    src: "/images/main2.jpg",
    alt: "腾格里沙漠中的蒙眼人面雕塑，薄纱被风掀起",
    title: "闭眼的人，替沙漠看天",
    subtitle: "中卫 · 腾格里沙漠 / 漠里安沙漠美术馆",
    place: "中卫",
    coord: "37.53°N · 104.96°E",
  },
  {
    src: "/images/main3.jpg",
    alt: "黄昏时分，银川览山公园的罗马柱廊被夕阳染成金色，台阶上坐满人",
    title: "罗马不在罗马，在银川",
    subtitle: "银川 · 览山公园 / 黄昏",
    place: "览山公园",
    coord: "38.54°N · 106.22°E",
  },
  {
    src: "/images/main4.jpg",
    alt: "一条柏油公路穿过赭红色荒山，消失在垭口",
    title: "路一直向西",
    subtitle: "宁夏 · 山口公路",
    place: "公路",
    coord: "",
  },
  {
    src: "/images/main5.jpg",
    alt: "西夏陵的夯土陵塔矗立在贺兰山前，山脊覆雪，天空呈粉紫色",
    title: "一千年，只是一场日落",
    subtitle: "西夏陵 · 银川 / 贺兰山东麓",
    place: "西夏陵",
    coord: "38.43°N · 105.99°E",
  },
];

const INTERVAL = 6000;

export function HeroArt() {
  const [index, setIndex] = useState(0);

  const go = useCallback((next: number) => setIndex((next + SLIDES.length) % SLIDES.length), []);

  useEffect(() => {
    const timer = setInterval(() => setIndex((i) => (i + 1) % SLIDES.length), INTERVAL);
    return () => clearInterval(timer);
  }, []);

  const current = SLIDES[index];

  return (
    <div className="photo-art relative h-full w-full bg-ink">
      {SLIDES.map((slide, i) => (
        <Image
          key={slide.src}
          src={assetPath(slide.src)}
          alt={slide.alt}
          fill
          priority={i === 0}
          sizes="(min-width: 1024px) 50vw, 100vw"
          className={`object-cover transition-opacity duration-1000 ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}

      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/5 to-ink/35" />

      <div className="absolute inset-x-0 top-0 flex items-start justify-between p-5 font-mono-ui text-[10px] tracking-[0.2em] text-paper-light/80">
        <span>PHOTO {String(index + 1).padStart(2, "0")} / NINGXIA</span>
        <span>{current.coord || "—"}</span>
      </div>

      <div className="absolute inset-x-0 bottom-0 p-5 text-paper-light">
        <span className="mb-3 block h-1.5 w-1.5 rotate-45 bg-vermilion" aria-hidden="true" />
        <p className="font-display text-[clamp(30px,4vw,48px)] leading-none tracking-[0.05em]">
          {current.title}
        </p>
        <p className="mt-3 font-mono-ui text-[10px] uppercase tracking-[0.18em] text-paper-light/65">
          {current.subtitle}
        </p>
      </div>

      <div className="absolute inset-x-0 bottom-0 flex items-center justify-between px-5 pb-16">
        <div className="flex items-center gap-2" role="tablist" aria-label="首页图片切换">
          {SLIDES.map((slide, i) => (
            <button
              key={slide.place}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`查看第 ${i + 1} 张：${slide.place}`}
              onClick={() => go(i)}
              className={`h-1.5 transition-all ${
                i === index ? "w-8 bg-vermilion" : "w-4 bg-paper-light/40 hover:bg-paper-light/70"
              }`}
            />
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => go(index - 1)}
            aria-label="上一张"
            className="focus-ring border border-paper-light/40 px-2 py-1 font-mono-ui text-[10px] text-paper-light/80 transition-colors hover:border-vermilion hover:text-vermilion"
          >
            ‹
          </button>
          <span className="font-mono-ui text-[10px] text-paper-light/60">
            {index + 1}/{SLIDES.length}
          </span>
          <button
            type="button"
            onClick={() => go(index + 1)}
            aria-label="下一张"
            className="focus-ring border border-paper-light/40 px-2 py-1 font-mono-ui text-[10px] text-paper-light/80 transition-colors hover:border-vermilion hover:text-vermilion"
          >
            ›
          </button>
        </div>
      </div>
    </div>
  );
}
