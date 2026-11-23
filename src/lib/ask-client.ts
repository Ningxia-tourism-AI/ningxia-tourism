import { buildRetrievalAnswer } from "@/lib/retriever";
import type { AskResponse } from "@/types/content";
import { API_BASE, chat } from "@/lib/api";

export class ExternalApiError extends Error {
  constructor(public readonly status: number) {
    super(`External API request failed with status ${status}`);
    this.name = "ExternalApiError";
  }
}

export function hasExternalApi(): boolean {
  return API_BASE.length > 0;
}

/**
 * 优先调用后端 /api/chat（FastAPI + MySQL + DeepSeek）；
 * 后端未配置或请求失败时，退回浏览器本地检索，保证页面不会空着。
 */
export async function askQuestion(question: string): Promise<AskResponse> {
  if (!API_BASE) {
    return buildRetrievalAnswer(question);
  }

  try {
    const data = await chat(question);
    return {
      answer: data.answer,
      source: data.source ?? "ai",
      citations: [],
      mode: "llm",
      confidence: data.matched > 0 ? 0.9 : 0.6,
      disclaimer:
        data.matched > 0
          ? "答案基于数据库内的景区与方言数据生成，门票、开放时间以官方发布为准。"
          : "问题未命中数据库中的景区或方言词条，回答仅供参考。",
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (!message.startsWith("API ")) {
      // 后端没启动等网络层失败：退回本地检索
      return buildRetrievalAnswer(question);
    }
    const status = Number(message.replace("API ", "")) || 500;
    if (status >= 500) {
      return buildRetrievalAnswer(question);
    }
    throw new ExternalApiError(status);
  }
}
