import { NAME, EMAIL, LINKS } from "../site";

export default function Footer() {
  return (
    <section id="contact" className="plain">
      <div className="cols four">
        <p>{NAME} · San Francisco</p>
        <p><a href={`mailto:${EMAIL}`}>{EMAIL}</a></p>
        <p><a href={LINKS.x}>X</a> · <a href={LINKS.github}>GitHub</a></p>
        <p><a href={LINKS.linkedin}>LinkedIn</a></p>
      </div>
    </section>
  );
}
