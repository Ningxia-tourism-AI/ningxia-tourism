export type Region = "银川" | "石嘴山" | "吴忠" | "固原" | "中卫";

export const REGIONS: Region[] = ["银川", "石嘴山", "吴忠", "固原", "中卫"];

export interface Citation {
  id: string;
  title: string;
  href: string;
}

export interface Attraction {
  slug: string;
  name: string;
  region: Region;
  type: "自然" | "历史" | "人文" | "综合";
  summary: string;
  highlights: string[];
  hours: string;
  ticket: string;
  transport: string;
  bestSeason: string;
  coords: { lat: number; lng: number };
  tags: string[];
  /** 可选图片覆盖；默认读取 /images/attractions/<slug>.jpg */
  image?: string;
  sources: Citation[];
  verified: boolean;
  updatedAt: string;
}

export interface Food {
  slug: string;
  name: string;
  region: Region;
  summary: string;
  flavorTags: string[];
  priceRange: string;
  story: string;
  /** 与该美食最搭的景区 slug，用于「吃完去哪」联动 */
  pairWith?: string[];
  sources: Citation[];
  verified: boolean;
  updatedAt: string;
}

export type RouteItemKind = "景区" | "美食" | "交通" | "住宿" | "其他";

export interface RouteItem {
  time: string;
  title: string;
  detail: string;
  kind: RouteItemKind;
  /** 关联景区 / 美食 slug，便于站内跳转 */
  refSlug?: string;
}

export interface RouteDayPlan {
  day: number;
  region: Region;
  title: string;
  items: RouteItem[];
  tips?: string;
}

export interface TravelRoute {
  slug: string;
  title: string;
  days: number;
  theme: string;
  regions: Region[];
  summary: string;
  budget: string;
  tags: string[];
  dayPlans: RouteDayPlan[];
  sources: Citation[];
  verified: boolean;
  updatedAt: string;
}

export type DialectRegion = "银川" | "吴忠" | "石嘴山" | "固原" | "通用";

export type DialectCategory =
  | "问候"
  | "饮食"
  | "日常"
  | "人物"
  | "程度"
  | "动作"
  | "语气"
  | "时间";

export interface DialectExample {
  mandarin: string;
  dialect: string;
  note?: string;
}

export interface DialectEntry {
  id: string;
  /** 普通话词或句子 */
  mandarin: string;
  /** 方言写法（汉字记音） */
  dialect: string;
  /** 近似读音提示（拼音） */
  pinyin: string;
  region: DialectRegion;
  category: DialectCategory;
  note: string;
  /** 3=较可靠，2=一般，1=存疑待核实 */
  confidence: 1 | 2 | 3;
  examples: DialectExample[];
  sources: Citation[];
  verified: boolean;
}

export interface AskCitation {
  id: string;
  title: string;
  href: string;
  snippet: string;
}

export interface AskResponse {
  answer: string;
  /** 答案依据：db=命中词库/数据库，ai=模型推测 */
  source?: "db" | "ai";
  citations: AskCitation[];
  mode: "llm" | "retrieval";
  confidence: number;
  disclaimer: string;
}

export interface DialectSegment {
  src: string;
  out: string;
  note?: string;
  confidence: 1 | 2 | 3;
  matched: boolean;
}

export interface DialectResponse {
  translation: string;
  segments: DialectSegment[];
  confidence: 1 | 2 | 3;
  unmatched: string[];
  note: string;
}
