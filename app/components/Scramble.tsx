"use client";
import { useEffect, useState } from "react";

const CHARS = "abcdefghijklmnopqrstuvwxyz    ";

export function mutate(s: string, rate: number) {
  const a = s.split("");
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== "\n" && Math.random() < rate) {
      a[i] = Math.random() < 0.5 ? " " : CHARS[(Math.random() * CHARS.length) | 0];
    }
  }
  return a.join("");
}

// Scrambled monospace text as a background layer (the 2xA look).
// ponytail: mutates 1.5% of chars every 120ms from a fresh copy, so it drifts but never fully decays.
export default function Scramble({ text, cols = 4 }: { text: string; cols?: number }) {
  const [out, setOut] = useState(text);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setOut(mutate(text, 0.015 + Math.random() * 0.03)), 120);
    return () => clearInterval(id);
  }, [text]);
  const lines = out.split("\n");
  const per = Math.ceil(lines.length / cols);
  return (
    <div aria-hidden className="scramble" style={{ gridTemplateColumns: `repeat(auto-fit, minmax(240px, 1fr))` }}>
      {Array.from({ length: cols }, (_, c) => (
        <pre key={c}>{lines.slice(c * per, (c + 1) * per).join("\n\n")}</pre>
      ))}
    </div>
  );
}

// Clean text that glitches for a moment every few seconds, then snaps back.
// The real text stays in aria-label so screen readers never hear the scrambled version.
export function Flicker({ text }: { text: string }) {
  const [out, setOut] = useState(text);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let back: ReturnType<typeof setTimeout>;
    let next: ReturnType<typeof setTimeout>;
    const tick = () => {
      setOut(mutate(text, 0.11));
      back = setTimeout(() => setOut(text), 200);
      next = setTimeout(tick, 1200 + Math.random() * 2800);
    };
    next = setTimeout(tick, 800 + Math.random() * 2000);
    return () => { clearTimeout(back); clearTimeout(next); };
  }, [text]);
  return <p aria-label={text}>{out}</p>;
}
