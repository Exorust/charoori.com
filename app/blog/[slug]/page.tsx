import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { getPost, getPosts, html } from "../../posts";

export const dynamicParams = false;
export const generateStaticParams = () => getPosts().map((p) => ({ slug: p.slug }));

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const p = getPost((await params).slug);
  return { title: p.title, description: p.description };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const p = getPost((await params).slug);
  return (
    <main>
      <Navbar />
      <article className="plain post">
        <p className="meta">{p.date} · <a href="/blog">All writing</a></p>
        <h1>{p.title}</h1>
        {/* ponytail: posts are files in this repo, so the HTML is trusted. Sanitize if posts ever come from outside. */}
        <div className="prose" dangerouslySetInnerHTML={{ __html: html(p.body) }} />
      </article>
      <Footer />
    </main>
  );
}
