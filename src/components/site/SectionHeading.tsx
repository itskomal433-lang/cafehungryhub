import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  className,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "center" | "left";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "max-w-3xl",
        align === "center" ? "mx-auto text-center" : "text-left",
        className,
      )}
    >
      {eyebrow ? (
        <div
          className={cn(
            "mb-4 inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-gold/10 px-4 py-1 text-[0.68rem] font-extrabold tracking-[0.22em] text-gold uppercase backdrop-blur-xs shadow-xs",
            align === "center" ? "mx-auto" : "",
          )}
        >
          <Sparkles className="h-3 w-3 text-gold" />
          <span>{eyebrow}</span>
        </div>
      ) : null}
      <h2 className="text-balance-pretty font-display text-3xl leading-[1.08] font-extrabold text-foreground sm:text-4xl md:text-[2.85rem] tracking-tight">
        {title}
      </h2>
      {subtitle ? (
        <p className="text-balance-pretty mt-4 text-base sm:text-lg text-muted-foreground font-medium leading-relaxed max-w-2xl mx-auto">
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}
