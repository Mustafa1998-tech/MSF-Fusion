import { describe, expect, it } from "vitest";
import { createSignal } from "../src/core.ts";
import { escapeHtml, h, renderToString } from "../src/server.ts";

describe("SSR server renderer", () => {
  it("escapes text and attributes", () => {
    expect(escapeHtml(`<div class="x">&'`)).toBe(
      "&lt;div class=&quot;x&quot;&gt;&amp;&#39;",
    );
  });

  it("renders elements, children, and void tags", () => {
    const html = renderNodeLike(
      h("div", { class: "box", "data-id": "1" }, "Hello ", h("br"), h("span", null, "<safe>")),
    );
    expect(html).toContain('<div class="box" data-id="1">');
    expect(html).toContain("Hello <br><span>&lt;safe&gt;</span>");
  });

  it("renderToString renders a snapshot without tracking", () => {
    const [name, setName] = createSignal("Ada");
    const html = renderToString(() => h("p", null, "Hi ", name()));
    expect(html).toBe("<p>Hi Ada</p>");
    setName("Lin");
    expect(renderToString(() => h("p", null, "Hi ", name()))).toBe("<p>Hi Lin</p>");
  });
});

function renderNodeLike(node: ReturnType<typeof h>): string {
  // helper to test h() output via renderToString
  return renderToString(() => node);
}
