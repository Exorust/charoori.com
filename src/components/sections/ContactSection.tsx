import SectionPrompt from '@/components/layout/SectionPrompt';
import ExternalLink from '@/components/ui/ExternalLink';
import BlinkingCursor from '@/components/ui/BlinkingCursor';
import type { SocialLink } from '@/types';

interface ContactSectionProps {
  links: SocialLink[];
}

export default function ContactSection({ links }: ContactSectionProps) {
  return (
    <section className="mb-6">
      <SectionPrompt command="contact --list" />

      <div className="pl-4 space-y-1 text-sm">
        {links.map((link) => (
          <div key={link.label} className="flex items-center gap-2">
            <span className="text-[var(--color-od-muted)] w-16 shrink-0">{link.label}</span>
            <span className="text-[var(--color-od-muted)]">→</span>
            <ExternalLink href={link.url}>{link.url}</ExternalLink>
          </div>
        ))}
      </div>

      <div className="mt-6 pl-4 flex items-center gap-2 text-sm">
        <span className="prompt-dollar">$</span>
        <BlinkingCursor />
      </div>
    </section>
  );
}
