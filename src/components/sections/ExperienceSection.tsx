import SectionPrompt from '@/components/layout/SectionPrompt';
import Tag from '@/components/ui/Tag';
import type { Experience } from '@/types';

interface ExperienceSectionProps {
  experience: Experience[];
}

export default function ExperienceSection({ experience }: ExperienceSectionProps) {
  return (
    <section className="mb-10">
      <SectionPrompt command="cat experience.json" />

      <div className="pl-4 space-y-5">
        {experience.map((job, i) => (
          <div key={i} className="text-sm">
            <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5">
              <span className="text-[var(--color-od-muted)]">company</span>
              <span className="text-[var(--color-od-green)]">{job.company}</span>

              <span className="text-[var(--color-od-muted)]">role</span>
              <span className="text-[var(--color-od-yellow)]">{job.role}</span>

              <span className="text-[var(--color-od-muted)]">period</span>
              <span className="text-[var(--color-od-fg)]">{job.period}</span>

              {job.location && (
                <>
                  <span className="text-[var(--color-od-muted)]">location</span>
                  <span className="text-[var(--color-od-fg)]">{job.location}</span>
                </>
              )}
            </div>

            {job.description && (
              <p className="mt-2 text-[var(--color-od-fg)] text-xs leading-relaxed">
                {job.description}
              </p>
            )}

            {job.techStack && job.techStack.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {job.techStack.map((tech) => (
                  <Tag key={tech} label={tech} />
                ))}
              </div>
            )}

            {i < experience.length - 1 && (
              <div className="mt-4 border-t border-[var(--color-od-border)]" />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
