// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { matchRoute, createRouter } from "../src/router.js";

describe("matchRoute", () => {
  it("matches static patterns with params", () => {
    expect(matchRoute("/users/:id", "/users/7")).toEqual({ path: "/users/7", params: { id: "7" }, query: {} });
  });
  it("decodes params and query strings", () => {
    expect(matchRoute("/files/:name", "/files/a%20b?tag=x&n=2")).toEqual({
      path: "/files/a%20b",
      params: { name: "a b" },
      query: { tag: "x", n: "2" },
    });
  });
  it("supports wildcard tails", () => {
    expect(matchRoute("/docs/*", "/docs/a/b/c")).toEqual({ path: "/docs/a/b/c", params: { "*": "a/b/c" }, query: {} });
  });
  it("rejects mismatch with extra segments", () => {
    expect(matchRoute("/users/:id", "/users/1/profile")).toBeNull();
  });
  it("rejects missing pattern segment", () => {
    expect(matchRoute("/users/:id/notes", "/users/1")).toBeNull();
  });
});

describe("createRouter", () => {
  it("reports an initial path resolved from options", () => {
    const router = createRouter(["/", "/dashboard"], { initial: "/dashboard" });
    expect(router.current().path).toBe("/dashboard");
  });
  it("push() updates reactive current()", () => {
    const router = createRouter(["/users/:id"], { initial: "/users/1" });
    router.push("/users/2");
    expect(router.current().params.id).toBe("2");
    router.replace("/users/3?tab=a");
    expect(router.current().params.id).toBe("3");
    expect(router.current().query.tab).toBe("a");
  });
  it("falls back to an unknown path shape rather than throwing", () => {
    const router = createRouter(["/a", "/b"], { initial: "/not-listed" });
    expect(router.current().path).toBe("/not-listed");
  });
  it("base prefix is stripped when comparing routes", () => {
    const router = createRouter(["/dashboard"], { initial: "/app/dashboard", base: "/app" });
    router.replace("/dashboard");
    expect(router.current().path).toBe("/dashboard");
  });
});
