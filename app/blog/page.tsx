import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getPosts } from "../posts";

export const metadata = { title: "Writing" };

export default function Blog() {
  return (
    <main>
      <Navbar />
      <section className="plain">
        <h1>Writing</h1>
        <ul className="index">
          {getPosts().map((p) => (
            <li key={p.slug}>
              <a href={`/blog/${p.slug}`}>
                <span>{p.date}</span>
                <b>{p.title}</b>
                <span>{p.description}</span>
              </a>
            </li>
          ))}
        </ul>
      </section>
      <Footer />
    </main>
  );
}
