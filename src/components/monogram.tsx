export function Monogram({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true" role="presentation">
      <rect width="64" height="64" rx="14" className="fill-transparent" />
      <rect
        x="0.9"
        y="0.9"
        width="62.2"
        height="62.2"
        rx="13.4"
        fill="none"
        stroke="currentColor"
        strokeOpacity="0.28"
        strokeWidth="1.2"
      />
      <g fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="square">
        <path d="M13 19 L23 31 L33 19" />
        <path d="M23 31 L23 46" />
        <circle cx="43" cy="34.5" r="11.5" />
      </g>
    </svg>
  );
}
