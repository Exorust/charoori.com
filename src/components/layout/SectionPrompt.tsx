interface SectionPromptProps {
  command: string;
}

export default function SectionPrompt({ command }: SectionPromptProps) {
  return (
    <div className="flex items-center gap-2 mb-4 text-sm select-none">
      <span className="prompt-dollar">$</span>
      <span className="prompt-command">{command}</span>
    </div>
  );
}
