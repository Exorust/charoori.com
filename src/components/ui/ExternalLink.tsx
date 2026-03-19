import { clsx } from 'clsx';

interface ExternalLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export default function ExternalLink({
  href,
  children,
  className,
}: ExternalLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={clsx('text-[var(--color-od-blue)] hover:text-[var(--color-od-cyan)]', className)}
    >
      {children}
    </a>
  );
}
