import katex from "katex";
import "katex/dist/katex.min.css";

// Fungsi ini akan cari LaTeX inline ($...$) dan block ($$...$$)
export function renderKatexFromHtml(rawHtml: string | null): string {
  if (!rawHtml) return "";
  return rawHtml.replace(
    /\$\$(.+?)\$\$|\$(.+?)\$/g,
    (_, blockExpr, inlineExpr) => {
      try {
        const expr = blockExpr || inlineExpr;
        const html = katex.renderToString(expr, {
          displayMode: !!blockExpr,
          throwOnError: false,
        });
        return html;
      } catch (e) {
        return `<span class="text-red-500">[Invalid LaTeX]</span>`;
      }
    },
  );
}
