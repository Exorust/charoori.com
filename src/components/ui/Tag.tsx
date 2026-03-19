import { clsx } from 'clsx';

interface TagProps {
  label: string;
  variant?: 'default' | 'wip' | 'active' | 'archived';
}

const variantClasses: Record<NonNullable<TagProps['variant']>, string> = {
  default:  'border-[var(--color-od-border)] text-[var(--color-od-muted)]',
  active:   'border-[var(--color-od-green)] text-[var(--color-od-green)]',
  wip:      'border-[var(--color-od-yellow)] text-[var(--color-od-yellow)]',
  archived: 'border-[var(--color-od-muted)] text-[var(--color-od-muted)]',
};

export default function Tag({ label, variant = 'default' }: TagProps) {
  return (
    <span
      className={clsx(
        'inline-block px-2 py-0.5 text-xs border rounded font-mono',
        variantClasses[variant]
      )}
    >
      {label}
    </span>
  );
}
