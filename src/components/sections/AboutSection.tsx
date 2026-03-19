import SectionPrompt from '@/components/layout/SectionPrompt';
import ExternalLink from '@/components/ui/ExternalLink';
import BlinkingCursor from '@/components/ui/BlinkingCursor';
import type { AboutData } from '@/types';

interface AboutSectionProps {
  data: AboutData;
}

export default function AboutSection({ data }: AboutSectionProps) {
  return (
    <section className="mb-10">
      <SectionPrompt command="whoami" />

      <div className="pl-4 space-y-3">
        <p className="text-[var(--color-od-green)] text-lg font-semibold">
          {data.name}
          <BlinkingCursor />
        </p>
        <p className="text-[var(--color-od-yellow)] text-sm">{data.headline}</p>

        <div className="mt-3 space-y-2 text-sm text-[var(--color-od-fg)]">
          {data.bio.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-sm">
          {data.links.map((link) => (
            <ExternalLink key={link.label} href={link.url}>
              <span className="text-[var(--color-od-muted)]">~/</span>
              {link.label}
            </ExternalLink>
          ))}
        </div>
      </div>
    </section>
  );
}
