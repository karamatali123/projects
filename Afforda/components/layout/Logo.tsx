import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

export function Logo({ inverted = false }: { inverted?: boolean }) {
  return (
    <Link
      href="/"
      className={cn(
        "flex items-center gap-2 transition-transform duration-200 hover:scale-[1.03]",
        inverted ? "text-navy-foreground" : "text-navy",
      )}
    >
      <Image
        src="/images/afforda-logo-mark.jpg"
        alt=""
        width={36}
        height={36}
        className={cn(
          "h-9 w-9 rounded-lg",
          inverted && "ring-1 ring-white/20",
        )}
        priority
      />
      <span className="font-serif text-xl tracking-tight">{siteConfig.name}</span>
    </Link>
  );
}
