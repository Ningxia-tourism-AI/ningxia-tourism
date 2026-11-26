export type RockGlyphKind =
  | "sun"      // 太阳神人面（贺兰口标志图腾）
  | "deer"     // 鹿
  | "ibex"     // 岩羊
  | "camel"    // 骆驼
  | "hand"     // 手印
  | "wave"     // 黄河水波
  | "mountain" // 山脊
  | "dune"     // 沙丘
  | "pagoda"   // 夯土陵塔（西夏陵）
  | "grotto"   // 石窟拱龛
  | "fort";    // 城堡垛口（镇北堡）

const PATHS: Record<RockGlyphKind, string[]> = {
  // 太阳：同心圆面 + 双眼一嘴 + 长短不一的放射光芒
  sun: [
    "M24 15 a9 9 0 1 0 0.1 0",
    "M20 22 v2 M28 22 v2 M21 29 h6",
    "M24 15 a14.5 14.5 0 1 0 0.1 0",
    "M24 6.5 v-4 M24 45.5 v-4 M6.5 24 h-4 M45.5 24 h-4",
    "M11.6 11.6 l-2.8 -2.8 M36.4 36.4 l2.8 2.8 M36.4 11.6 l2.8 -2.8 M11.6 36.4 l-2.8 2.8",
    "M15.3 7.8 l-1.6 -3.2 M32.7 40.2 l1.6 3.2 M7.8 32.7 l-3.2 1.6 M40.2 15.3 l3.2 -1.6",
  ],
  // 鹿：横身、细腿、扬颈、分叉大角
  deer: [
    "M8 28 q10 -3 20 -1 q6 1 10 -2",
    "M12 29 l-2 12 M18 28 l-1 13 M28 28 l1 13 M34 27 l2 12",
    "M36 26 q3 -6 6 -9",
    "M41 15 q-1 -6 -5 -8 M41 15 q3 -5 7 -6 M41 17 q5 -2 7 1",
    "M42 17 q3 2 2 5",
  ],
  // 岩羊：低身、粗腿、向后大弯角
  ibex: [
    "M10 30 q8 -4 18 -3 q7 1 12 -1",
    "M13 31 l-1 11 M19 30 l0 12 M30 29 l1 12 M36 28 l2 11",
    "M37 27 q4 -3 4 -8",
    "M41 19 q6 -3 4 -10 q-2 -4 -6 -2",
    "M41 19 q-3 -1 -4 2",
  ],
  // 骆驼：双峰、垂尾、长颈
  camel: [
    "M6 32 q4 -10 9 -11 q4 -1 6 3 q2 -6 7 -6 q5 0 7 8",
    "M35 26 q2 -8 6 -11",
    "M41 15 q3 -1 4 2",
    "M10 33 l-1 9 M16 33 l0 9 M28 33 l1 9 M34 32 l2 9",
    "M6 32 q-3 3 -2 6",
  ],
  // 手印：五指张开（祭祀符号）
  hand: [
    "M14 40 q-2 -10 0 -16",
    "M14 24 q-2 -5 1 -5 q2 0 2 5",
    "M18 24 v-8 q0 -3 2 -3 q2 0 2 3 v8",
    "M24 24 v-9 q0 -3 2 -3 q2 0 2 3 v9",
    "M30 25 v-6 q0 -3 2 -3 q2 0 2 3 v7",
    "M36 26 q3 -2 4 1 q1 2 -2 6 q-4 5 -4 7",
    "M14 40 q10 4 20 0",
  ],
  // 黄河：三条递进的波浪
  wave: [
    "M4 18 q6 -6 12 0 t12 0 t12 0",
    "M6 26 q6 -6 12 0 t12 0 t12 0",
    "M8 34 q6 -6 12 0 t12 0",
  ],
  // 山脊：锯齿折线 + 坡面排线
  mountain: [
    "M4 36 L14 16 L21 27 L28 12 L37 29 L44 20",
    "M10 36 L16 24 M22 36 L27 20 M34 36 L38 28",
  ],
  // 沙丘：两道风成的弧
  dune: [
    "M4 30 q10 -12 22 -10 q12 2 18 8",
    "M4 38 q12 -8 24 -6 q10 2 16 6",
    "M14 22 q4 -2 8 -2",
  ],
  // 夯土陵塔：梯形分层收分
  pagoda: [
    "M12 42 h24",
    "M15 34 h18 l-2 8 h-14 Z",
    "M18 26 h12 l-1.5 8 h-9 Z",
    "M21 18 h7 l-1 8 h-5 Z",
    "M24 8 v10",
    "M24 8 l3 3 M24 8 l-3 3",
  ],
  // 石窟：尖拱龛 + 内坐像
  grotto: [
    "M10 42 v-16 q0 -14 14 -18 q14 4 14 18 v16",
    "M10 42 h28",
    "M20 38 q-1 -8 4 -12 q5 4 4 12",
    "M22 22 a2 2 0 1 0 0.1 0",
    "M16 42 h16",
  ],
  // 城堡：城墙 + 垛口 + 门洞
  fort: [
    "M8 42 v-20 h4 v-4 h5 v4 h6 v-4 h5 v4 h6 v-4 h5 v4 h1 v20",
    "M8 42 h32",
    "M20 42 v-8 q0 -4 4 -4 q4 0 4 4 v8",
    "M12 28 h2 M34 28 h2",
  ],
};

export function RockGlyph({
  kind,
  className,
  strokeWidth = 2,
}: {
  kind: RockGlyphKind;
  className?: string;
  strokeWidth?: number;
}) {
  return (
    <svg
      viewBox="0 0 48 48"
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {PATHS[kind].map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
}

/** 按景区名称 / 标签挑选最贴合的凿刻符号 */
export function glyphForAttraction(name: string, tags: string[]): RockGlyphKind {
  const text = `${name} ${tags.join(" ")}`;
  if (/岩画/.test(text)) return "sun";
  if (/石窟|须弥/.test(text)) return "grotto";
  if (/王陵|陵/.test(text)) return "pagoda";
  if (/影城|镇北堡|城/.test(text)) return "fort";
  if (/沙漠|沙坡头|腾格里/.test(text)) return "camel";
  if (/峡谷|水洞沟/.test(text)) return "mountain";
  if (/湖|黄河|湿地/.test(text)) return "wave";
  if (/六盘山|贺兰山|山|森林|避暑/.test(text)) return "mountain";
  return "ibex";
}

/** 图录编号分隔带：太阳神居中，两侧刻度线 */
export function PetroRule({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`flex items-center gap-4 ${className}`}>
      <span className="h-px flex-1 bg-line" />
      <RockGlyph kind="sun" className="h-5 w-5 text-ink-500/70" strokeWidth={2.4} />
      <span className="h-px flex-1 bg-line" />
    </div>
  );
}

/** 无限滚动符号带：拓片墨底上的岩画符号队列（footer 上方 / 首页分隔） */
const MARQUEE_KINDS: RockGlyphKind[] = [
  "sun", "deer", "ibex", "wave", "camel", "mountain", "hand", "dune", "pagoda", "grotto",
];

export function SymbolMarquee({ dark = false }: { dark?: boolean }) {
  const row = (
    <div className="flex shrink-0 items-center">
      {MARQUEE_KINDS.map((kind, i) => (
        <span key={`${kind}-${i}`} className="mx-7 flex items-center gap-7">
          <RockGlyph kind={kind} className="h-7 w-7" strokeWidth={1.8} />
          <span className="h-1 w-1 rotate-45 bg-current opacity-40" />
        </span>
      ))}
    </div>
  );
  return (
    <div
      aria-hidden="true"
      className={`overflow-hidden py-4 select-none ${
        dark ? "text-paper/50" : "text-ink/45"
      }`}
    >
      <div className="marquee-track">
        {row}
        {row}
      </div>
    </div>
  );
}
