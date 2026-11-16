/**
 * Solid's package exports make the client runtime importable by explicit path
 * but do not ship a sibling .d.ts for that path. The public API types are
 * identical to the package root.
 */
declare module "solid-js/dist/solid.js" {
  export * from "solid-js";
}
