// run: node posts.check.ts
import assert from "node:assert";
import { parse } from "./app/posts.ts";

const { meta, body } = parse(`---\ntitle: "A: b"\ndate: 2026-10-04\n---\nHi\n`);
assert.equal(meta.title, "A: b");
assert.equal(meta.date, "2026-10-04");
assert.equal(body, "Hi\n");
assert.equal(parse("no frontmatter").body, "no frontmatter");
console.log("ok");
