type AdSlotName =
  | "in-content"
  | "below-calculator"
  | "sidebar"
  | "related";

type AdSlotProps = {
  slot: AdSlotName;
  className?: string;
};

/**
 * Reserved for Google AdSense. Renders nothing until NEXT_PUBLIC_ADSENSE_CLIENT is set.
 * Do not use this to show fake ads during development.
 */
export function AdSlot({ slot, className }: AdSlotProps) {
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
  if (!client) return null;

  return (
    <aside
      data-ad-slot={slot}
      aria-label="Advertisement"
      className={className}
    />
  );
}
