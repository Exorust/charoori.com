import SectionPrompt from '@/components/layout/SectionPrompt';
import Tag from '@/components/ui/Tag';
import ExternalLink from '@/components/ui/ExternalLink';
import type { Project } from '@/types';

interface ProjectsSectionProps {
  projects: Project[];
}

function statusVariant(status: Project['status']) {
  if (status === 'active') return 'active';
  if (status === 'wip') return 'wip';
  return 'archived';
}

export default function ProjectsSection({ projects }: ProjectsSectionProps) {
  return (
    <section className="mb-10">
      <SectionPrompt command="ls projects/" />

      <div className="pl-4 space-y-5">
        {projects.map((project) => (
          <div
            key={project.name}
            className="bg-[var(--color-od-bg-light)] border border-[var(--color-od-border)] rounded-md p-4"
          >
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="text-[var(--color-od-yellow)] text-sm font-semibold">
                {project.name}
              </span>
              <Tag label={project.status} variant={statusVariant(project.status)} />
            </div>

            <p className="text-[var(--color-od-fg)] text-xs mb-3 leading-relaxed">
              {project.description}
            </p>

            <div className="flex flex-wrap gap-1 mb-3">
              {project.techStack.map((tech) => (
                <Tag key={tech} label={tech} />
              ))}
            </div>

            <div className="flex gap-4 text-xs">
              {project.repoUrl && (
                <ExternalLink href={project.repoUrl}>
                  [repo]
                </ExternalLink>
              )}
              {project.liveUrl && (
                <ExternalLink href={project.liveUrl}>
                  [live]
                </ExternalLink>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
