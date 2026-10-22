import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-20 text-center">
      <h1 className="font-serif text-4xl text-navy">Page not found</h1>
      <p className="mt-4 text-muted-foreground">
        That URL is not in the calculator catalog. Try search or browse all tools.
      </p>
      <Link
        href="/calculators/"
        className={cn(buttonVariants({ variant: "primary", size: "lg" }), "mt-8")}
      >
        Browse calculators
      </Link>
    </div>
  );
}
