/**
 * 后端 API 客户端。
 * 地址来自 NEXT_PUBLIC_API_BASE_URL；不配置时视为“纯静态模式”。
 * 这个变量会进入前端代码，只能放公开地址，不能放密钥。
 */
/**
 * 后端地址优先级：
 * 1. 环境变量 NEXT_PUBLIC_API_BASE_URL（本地开发 .env.local 指向 127.0.0.1:8000）
 * 2. 未配置时用云端地址，保证 GitHub Pages 构建后也能连上后端
 */
export const API_BASE = (
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://ningxia-tourism-api.onrender.com"
).replace(/\/$/, "");

export function hasApi(): boolean {
  return API_BASE.length > 0;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
  });
  if (!res.ok) throw new Error(`API ${res.status}`);
  return (await res.json()) as T;
}

export interface ScenicSpot {
  scenic_id: number;
  name: string;
  city: string;
  level: string;
  address: string | null;
  tags: string | null;
  longitude: string | null;
  latitude: string | null;
}

export interface ScenicPage {
  total: number;
  page: number;
  size: number;
  items: ScenicSpot[];
}

export interface DialectWord {
  id: string;
  mandarin: string;
  dialect: string;
  city: string;
  county: string | null;
  pinyin: string | null;
  ipa: string | null;
  meaning: string | null;
  scenario: string | null;
  example_dialect: string | null;
  category: string | null;
  source_name: string | null;
  author: string | null;
  pub_year: string | null;
  page: string | null;
}

export interface DialectPage {
  total: number;
  page: number;
  size: number;
  items: DialectWord[];
}

export interface ChatReply {
  answer: string;
  matched: number;
  dialect_matched?: number;
  source?: "db" | "ai";
  context_preview?: string | null;
}

export interface TranslateReply {
  answer: string;
  matched: number;
  context_preview?: string | null;
}

export async function fetchAllScenic(): Promise<ScenicSpot[]> {
  const all: ScenicSpot[] = [];
  let page = 1;
  while (page <= 5) {
    const data = await request<ScenicPage>(`/api/scenic?page=${page}&size=100`);
    all.push(...data.items);
    if (all.length >= data.total || data.items.length === 0) break;
    page += 1;
  }
  return all;
}

export async function fetchDialect(params: { q?: string; city?: string; page?: number; size?: number }) {
  const search = new URLSearchParams();
  if (params.q) search.set("q", params.q);
  if (params.city) search.set("city", params.city);
  search.set("page", String(params.page ?? 1));
  search.set("size", String(params.size ?? 50));
  return request<DialectPage>(`/api/dialect?${search.toString()}`);
}

export async function chat(question: string): Promise<ChatReply> {
  return request<ChatReply>("/api/chat", {
    method: "POST",
    body: JSON.stringify({ question }),
  });
}

export interface PlanSpot {
  scenic_id: number;
  name: string;
  level: string;
  city: string;
  address: string | null;
  tags: string | null;
  desc: string | null;
}

export interface PlanDayApi {
  day: number;
  city: string;
  spots: PlanSpot[];
  note: string;
}

export interface ItineraryPlan {
  days: number;
  budget_estimate: number;
  budget_note: string;
  plan: PlanDayApi[];
  summary: string;
  disclaimer: string;
}

export async function planItinerary(input: {
  days: number;
  areas?: string[];
  interests?: string[];
  budget?: string;
  must_see?: string[];
}): Promise<ItineraryPlan> {
  return request<ItineraryPlan>("/api/itinerary/plan", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function translateDialect(text: string, city?: string): Promise<TranslateReply> {
  return request<TranslateReply>("/api/dialect/translate", {
    method: "POST",
    body: JSON.stringify({ text, city: city || null }),
  });
}
