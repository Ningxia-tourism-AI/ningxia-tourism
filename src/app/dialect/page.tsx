import type { Metadata } from "next";
import { PageHeader } from "@/components/ui";
import { DialectTranslator, DialectDictionary } from "@/components/DialectTranslator";
import { DialectDbPanel } from "@/components/DialectDbPanel";

export const metadata: Metadata = {
  title: "宁夏方言翻译",
  description:
    "普通话与银川话双向翻译，85 条可溯源方言词条（另附 160 条本地词典），含读音提示、例句与出处。",
};

export default function DialectPage() {
  return (
    <>
      <PageHeader
        eyebrow="听懂 / DIALECT"
        title="先听懂宁夏话"
        description="黄河穿过的北边，说的是兰银官话；六盘山下的南边，更近中原官话。同一句家常话，银川与固原未必同音。这里以银川话为主，每条都标了来处与把握程度——听不准的，还得以当地人的说法为准。"
        aside={
          <div className="border-y border-line py-4">
            <p className="font-display text-[40px] leading-none">85</p>
            <p className="mt-1 font-ui text-[11px] text-ink-500">条可溯源词条</p>
            <p className="mt-3 text-[11px] leading-[1.8] text-ink-500">按区域与可信度标注，不确定的说法会明确提示。</p>
          </div>
        }
      />

      <div className="container-page py-10 md:py-14">
        <DialectTranslator />

        <DialectDbPanel />

        <section className="mt-14">
          <div className="mb-6 flex items-end justify-between border-b border-line pb-3">
            <h2 className="font-display text-[28px] tracking-[0.04em]">方言词典</h2>
            <span className="font-ui text-[11px] text-ink-500">词典</span>
          </div>
          <DialectDictionary />
        </section>

        <section className="mt-14 grid gap-6 border-t border-line pt-8 md:grid-cols-[200px_1fr]">
          <h2 className="font-display text-[22px] tracking-[0.04em]">关于准确性</h2>
          <div className="max-w-3xl space-y-3 text-[12px] leading-[1.95] text-ink-700">
            <p>
              方言写法是「汉字记音」，不等于本字；读音用拼音近似标注，实际声调与音值以当地口音为准。
              部分词条（置信度标「低」或备注「待核实」）来自资料推断，本地读者如发现错误，欢迎指正后替换。
            </p>
            <p>
              另外，「宁夏话」本身不是一个统一概念：银川、吴忠、石嘴山与固原的用词、腔调差异明显，
              跨区域交流时请留意。
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
