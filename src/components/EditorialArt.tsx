import Image from "next/image";
import type { Attraction, Food, TravelRoute } from "@/types/content";
import { assetPath } from "@/lib/asset-path";
import { RockGlyph, glyphForAttraction, type RockGlyphKind } from "./RockArt";

export function DestinationArt({
  attraction,
  className = "",
  priority = false,
}: {
  attraction: Attraction;
  className?: string;
  priority?: boolean;
}) {
  const glyph = glyphForAttraction(attraction.name, attraction.tags);
  const imageSrc = assetPath(attraction.image ?? `/images/attractions/${attraction.slug}.jpg`);

  return (
    <div
      className={`destination-art photo-art relative isolate overflow-hidden border border-line bg-paper-deep ${className}`}
      aria-label={`${attraction.name}实景照片`}
      role="img"
    >
      <Image
        src={imageSrc}
        alt=""
        fill
        priority={priority}
        sizes="(min-width: 1024px) 36vw, (min-width: 640px) 48vw, 100vw"
        className="object-cover transition-transform duration-500 group-hover:scale-[1.025]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-ink/55 via-transparent to-ink/80"
      />

      <div className="absolute inset-x-0 top-0 flex items-center justify-between p-3 font-ui text-[10px] tracking-[0.12em] text-paper-light md:p-4 md:text-[11px]">
        <span>{attraction.region}</span>
        <span>{attraction.type}</span>
      </div>

      <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between gap-4 px-3 pb-3 pt-14 text-paper-light md:px-4 md:pb-4">
        <div>
          <p className="font-display text-[clamp(22px,3vw,42px)] leading-none tracking-[0.04em]">{attraction.name}</p>
          <p className="mt-2 max-w-md text-[10px] leading-relaxed text-paper-light/75 md:text-[11px]">
            {attraction.bestSeason}
          </p>
        </div>
        <span className="grid h-9 w-9 shrink-0 place-items-center border border-paper-light/35 bg-ink/20 backdrop-blur-sm md:h-11 md:w-11">
          <RockGlyph kind={glyph} className="h-6 w-6 md:h-7 md:w-7" strokeWidth={1.8} />
        </span>
      </div>
    </div>
  );
}

export function DishArt({
  food,
  className = "",
}: {
  food: Food;
  className?: string;
}) {
  const imageSrc = assetPath(`/images/foods/${food.slug}.jpg`);

  return (
    <div
      className={`dish-art photo-art relative isolate overflow-hidden border border-line bg-paper-deep ${className}`}
      aria-label={`${food.name}实景照片`}
      role="img"
    >
      <Image
        src={imageSrc}
        alt=""
        fill
        sizes="(min-width: 1024px) 32vw, (min-width: 640px) 45vw, 100vw"
        className="object-cover transition-transform duration-500 group-hover:scale-[1.025]"
      />
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ink/55 via-transparent to-transparent" />
      <span className="absolute right-3 top-3 border border-paper-light/45 bg-ink/30 px-2 py-1 font-mono-ui text-[9px] uppercase tracking-[0.16em] text-paper-light backdrop-blur-sm">
        实景
      </span>
      <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 p-3">
        <span className="bg-paper-light/92 px-2 py-1 font-ui text-[10px] tracking-[0.1em] text-ink-700 md:text-[11px]">
          {food.region}
        </span>
        <span className="bg-paper-light/92 px-2 py-1 font-ui text-[10px] text-ink-700 md:text-[11px]">
          {food.priceRange}
        </span>
      </div>
    </div>
  );
}

export function RouteBand({ route, className = "" }: { route: TravelRoute; className?: string }) {
  return (
    <div className={`route-band ${className}`} aria-label={`路线经过：${route.regions.join("、")}`}>
      <div className="flex items-start">
        {route.regions.map((region, index) => (
          <div key={region} className="relative min-w-0 flex-1">
            {index < route.regions.length - 1 && (
              <span className="absolute left-2 right-0 top-[5px] h-px bg-line-strong" aria-hidden="true" />
            )}
            <span className="relative z-10 block h-2.5 w-2.5 rotate-45 bg-vermilion" aria-hidden="true" />
            <span className="mt-2 block truncate pr-2 font-ui text-[11px] text-ink-500">{region}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
