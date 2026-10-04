import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Scramble, { Flicker } from "./components/Scramble";
import { NAME, TAGLINE, ABOUT, PROJECTS, MANIFESTO } from "./site";
import { getPosts } from "./posts";

const TICKER = ["BUILD", "WRITE", "SHIP", "REPEAT"];

export default function Home() {
  const paras = ABOUT.split("\n");
  const posts = getPosts().slice(0, 4);
  const bg = MANIFESTO.map((p) => p.text.replace(/\n+/g, " ")).join("\n");
  return (
    <main>
      <Navbar />

      <section className="hero">
        <Scramble text={Array(14).fill(bg).join("\n")} cols={4} />
        <div className="title">
          <h1>{NAME}</h1>
          <p>{TAGLINE}</p>
        </div>
        <div className="bar bottom">
          {TICKER.map((w) => <span key={w}>{w}</span>)}
        </div>
      </section>

      <section id="manifesto" className="plain">
        <h2>My manifesto</h2>
        <div className="pillars">
          {MANIFESTO.map((p) => (
            <div className="pillar" key={p.word}>
              <h3>{p.word}</h3>
              <Flicker text={p.text} />
            </div>
          ))}
        </div>
      </section>

      <section id="about" className="plain">
        <h2>About</h2>
        <div className="cols">
          <div>{paras.slice(0, 2).map((p) => <p key={p}>{p}</p>)}</div>
          <div>{paras.slice(2).map((p) => <p key={p}>{p}</p>)}</div>
        </div>
      </section>

      <section id="writing" className="plain">
        <h2>Writing</h2>
        <div className="cols">
          {posts.map((p) => (
            <a className="card" key={p.slug} href={`/blog/${p.slug}`}>
              <b>{p.title}</b>
              <p>{p.date}</p>
              <p>{p.description}</p>
            </a>
          ))}
        </div>
        <a className="btn" href="/blog">All posts</a>
      </section>

      <section id="projects" className="plain">
        <h2>Projects</h2>
        <div className="cols">
          {PROJECTS.map((p) => (
            <a className="card" key={p.name} href={p.url} target="_blank" rel="noopener noreferrer">
              <b>{p.name}</b>
              <p>{p.text}</p>
            </a>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
