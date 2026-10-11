/** Decorative action arrow: diagonal on desktop, a stationary right arrow on touch screens. */
export default function ResponsiveArrow({ className = "" }: { className?: string }) {
  return <span className={`responsive-arrow ${className}`.trim()} aria-hidden="true">
    <svg viewBox="0 0 24 24" fill="none" focusable="false"><path d="M5 19 19 5M5 5h14v14" /></svg>
  </span>;
}
