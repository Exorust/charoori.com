import TerminalWindow from '@/components/layout/TerminalWindow';
import SectionPrompt from '@/components/layout/SectionPrompt';
import AboutSection from '@/components/sections/AboutSection';
import BlogSection from '@/components/sections/BlogSection';
import ProjectsSection from '@/components/sections/ProjectsSection';
import ExperienceSection from '@/components/sections/ExperienceSection';
import ContactSection from '@/components/sections/ContactSection';

import about from '@/data/about';
import projects from '@/data/projects';
import experience from '@/data/experience';
import { getAllPostsMeta } from '@/lib/posts';

export default function Home() {
  const posts = getAllPostsMeta();

  return (
    <TerminalWindow>
      <AboutSection data={about} />

      <section className="mb-10">
        <SectionPrompt command="whoamireally" />
        <div className="pl-4">
          <p className="text-sm text-[var(--color-od-fg)]">
            Follow my unfiltered thoughts on{' '}
            <a
              href="https://x.com/charoori_ai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--color-od-accent)] hover:underline"
            >
              Twitter/X →
            </a>
          </p>
        </div>
      </section>

      <ProjectsSection projects={projects} />
      <BlogSection posts={posts.slice(0, 2)} />
      <ExperienceSection experience={experience} />
      <ContactSection links={about.links} />
    </TerminalWindow>
  );
}
