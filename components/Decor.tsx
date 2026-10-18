// Small hand-drawn decorations shared across the site. Purely decorative,
// so they are hidden from screen readers.

interface DecorProps {
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

export function Star({ size = 20, className = "", style }: DecorProps) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      style={style}
    >
      <path
        d="M12 2.8l2.7 5.6 6.1.8-4.5 4.2 1.2 6-5.5-3-5.5 3 1.2-6-4.5-4.2 6.1-.8z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function SleepyMoon({ size = 64, className = "", style }: DecorProps) {
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 64 64" className={className} style={style}>
      <path d="M40 6a26 26 0 1 0 18 40A22 22 0 0 1 40 6z" fill="#f4cc75" />
      <path d="M22 34q3 3 6 0" stroke="#5c4033" strokeWidth="2" fill="none" strokeLinecap="round" />
      <circle cx="21" cy="40" r="2.6" fill="#f1a7b9" opacity="0.8" />
    </svg>
  );
}

export function Cloud({ className = "", style }: DecorProps) {
  return (
    <svg aria-hidden="true" viewBox="0 0 200 80" className={className} style={style} preserveAspectRatio="none">
      <path
        d="M20 70c-14 0-18-20-4-24 0-16 22-22 30-10 6-18 34-20 42-2 10-12 32-6 32 10 14-6 30 4 26 18 14 2 14 20-2 20z"
        fill="currentColor"
      />
    </svg>
  );
}
