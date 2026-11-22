import Image from "next/image";
import { assetPath } from "@/lib/asset-path";

/**
 * 头版实景：腾格里沙漠边缘的黄河。
 * 照片以纸面图版的版式装裱，层级作为远处墨色处理。
 */
export function HeroArt() {
  return (
    <div className="photo-art relative h-full w-full bg-ink">
      <Image
        src={assetPath("/images/hero-ningxia.jpg")}
        alt="沙坡头附近，黄河从腾格里沙漠边缘流过"
        fill
        priority
        sizes="(min-width: 1024px) 50vw, 100vw"
        className="object-cover"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/5 to-ink/35"
      />
      <div className="absolute inset-x-0 top-0 flex items-start justify-between p-5 font-mono-ui text-[10px] tracking-[0.2em] text-paper-light/80">
        <span>PHOTO 01 / NINGXIA</span>
        <span>38.47°N · 104.90°E</span>
      </div>
      <div className="absolute inset-x-0 bottom-0 p-5 text-paper-light">
        <span className="mb-3 block h-1.5 w-1.5 rotate-45 bg-vermilion" aria-hidden="true" />
        <p className="font-display text-[clamp(30px,4vw,48px)] leading-none tracking-[0.05em]">
          黄河与腾格里
        </p>
        <p className="mt-3 font-mono-ui text-[10px] uppercase tracking-[0.18em] text-paper-light/65">
          沙坡头 · 中卫 / 实景摄影
        </p>
      </div>
    </div>
  );
}
