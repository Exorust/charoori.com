interface TerminalWindowProps {
  title?: string;
  children: React.ReactNode;
}

export default function TerminalWindow({
  title = 'charoori.com — zsh',
  children,
}: TerminalWindowProps) {
  return (
    <div className="terminal-chrome max-w-4xl mx-auto my-6 shadow-2xl">
      <div className="terminal-titlebar">
        <span className="dot dot-red" />
        <span className="dot dot-yellow" />
        <span className="dot dot-green" />
        <span className="title">{title}</span>
      </div>
      <div className="px-6 py-5">{children}</div>
    </div>
  );
}
