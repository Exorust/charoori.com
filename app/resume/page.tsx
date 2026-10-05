import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { EXPERIENCE } from "../site";

export const metadata = { title: "Resume" };

export default function Resume() {
  return (
    <main>
      <Navbar />
      <section className="plain">
        <h1>Resume</h1>
        <ul className="index">
          {EXPERIENCE.map((e) => (
            <li className="row" key={e.company}>
              <span>{e.period}</span>
              <b>{e.company}</b>
              <span>{e.role}<br />{e.text}<br />{e.stack.join(" · ")}</span>
            </li>
          ))}
        </ul>
      </section>
      <Footer />
    </main>
  );
}
