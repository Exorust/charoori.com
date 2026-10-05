"use client";
import { useEffect, useState } from "react";
import { SHORT } from "../site";
import MatrixRain from "./MatrixRain";

// ponytail: theme is a data attribute on <html>; CSS does the rest. Toggle only exists on desktop.
export default function Navbar() {
  const [matrix, setMatrix] = useState(false);
  useEffect(() => {
    try { setMatrix(localStorage.getItem("theme") === "matrix"); } catch {}
  }, []);
  useEffect(() => {
    document.documentElement.dataset.theme = matrix ? "matrix" : "";
    try { localStorage.setItem("theme", matrix ? "matrix" : "paper"); } catch {}
  }, [matrix]);
  return (
    <>
      <nav className="bar top">
        <a href="/">{SHORT}</a>
        <button className="hide-sm theme" onClick={() => setMatrix((m) => !m)} aria-pressed={matrix}>
          {matrix ? "EXIT THE MATRIX" : "ENTER THE MATRIX"}
        </button>
        <span className="links">
          <a className="hide-sm" href="/#manifesto">MANIFESTO</a>
          <a href="/blog">WRITING</a>
          <a href="/resume">RESUME</a>
          <a href="/#contact">CONTACT</a>
        </span>
      </nav>
      {matrix && <div className="rain"><MatrixRain /></div>}
    </>
  );
}
