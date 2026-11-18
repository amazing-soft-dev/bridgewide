import { LoadingImage } from "@/components/ui/LoadingImage";

export function ContentImage({
  src,
  alt,
  sizes,
  className,
}: {
  src: string;
  alt: string;
  sizes: string;
  className?: string;
}) {
  return (
    <div className={`relative overflow-hidden bg-ink-soft ${className ?? ""}`}>
      <LoadingImage
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        loading="lazy"
        className="object-cover"
      />
    </div>
  );
}
