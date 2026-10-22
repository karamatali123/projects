import { cn } from "@/lib/utils";
import Image, { type ImageProps } from "next/image";

type AiImageProps = Omit<ImageProps, "alt"> & {
  alt: string;
  caption?: string;
  figureClassName?: string;
};

export function AiImage({
  alt,
  caption = "AI-generated illustration",
  figureClassName,
  className,
  ...props
}: AiImageProps) {
  return (
    <figure className={figureClassName}>
      <Image alt={alt} className={className} {...props} />
      {caption ? (
        <figcaption className={cn("mt-2 text-xs text-muted-foreground")}>{caption}</figcaption>
      ) : null}
    </figure>
  );
}
