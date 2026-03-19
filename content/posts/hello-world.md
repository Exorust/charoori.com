---
title: Hello, World
date: 2026-02-01
description: The obligatory first post — what this site is, why I built it, and what to expect next.
tags: [meta, writing]
---

# Hello, World

Every blog starts with a "hello world" post, and who am I to break tradition?

## Why another personal site?

I've been meaning to have a proper home on the internet for a while. Not a GitHub profile or a LinkedIn page, but a place I actually own and control — somewhere to write about things I'm working on, thinking about, or learning.

The terminal aesthetic felt right. I spend most of my day in a terminal anyway, so it made sense to bring that energy to the design.

## What I built it with

- **Next.js 15** (App Router) — static generation for fast pages with no server required
- **Tailwind CSS v4** — CSS-first config, `@theme` tokens for the colour palette
- **MDX** via `next-mdx-remote` — write posts in Markdown, render as React components
- **rehype-pretty-code + Shiki** — syntax highlighting with the One Dark Pro theme

Here's a quick code snippet to prove the highlighting works:

```typescript
// Fibonacci with memoization
function fib(n: number, memo: Map<number, number> = new Map()): number {
  if (n <= 1) return n;
  if (memo.has(n)) return memo.get(n)!;
  const result = fib(n - 1, memo) + fib(n - 2, memo);
  memo.set(n, result);
  return result;
}

console.log(fib(40)); // 102334155
```

## What's next

I'll be writing about:

- Systems programming (Go, Rust)
- Developer tooling and CLI design
- Lessons from building things in public
- Occasional takes on engineering culture

Thanks for stopping by.
