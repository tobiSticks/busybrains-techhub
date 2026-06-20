export function TopUtilityBar() {
  return (
    <div className="border-b border-paper/10 bg-navy-deep">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-5 py-2 font-[family-name:var(--font-mono)] text-[11px] text-paper/60">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-ok" />
            ACTIVE STATUS
          </span>
          <span aria-hidden>·</span>
          <span>CAC RC: 9584510</span>
          <span aria-hidden>·</span>
          <span>Abuja, Nigeria</span>
        </div>
        <div className="flex items-center gap-4">
          <a href="tel:+2348161164007" className="focus-ring rounded hover:text-paper">
            +234 816 116 4007
          </a>
          <a href="mailto:info@busybrainstech-hub.com.ng" className="focus-ring rounded hover:text-paper">
            info@busybrainstech-hub.com.ng
          </a>
        </div>
      </div>
    </div>
  )
}
