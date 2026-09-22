import { useState } from "react";
import { Check, Clock, Copy, MapPin, Navigation, Phone, UtensilsCrossed } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/site/Reveal";
import { SectionHeading } from "@/components/site/SectionHeading";
import { mapsDirectionsUrl, mapsEmbedUrl, restaurant } from "@/data/restaurant";

export function LocationSection() {
  const [copied, setCopied] = useState(false);

  const handleCopyAddress = () => {
    navigator.clipboard?.writeText(restaurant.mapsQuery);
    setCopied(true);
    toast.success("Hungry Hub address copied to clipboard!");
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section className="bg-secondary/60 px-4 py-20 sm:px-6 lg:px-8 border-t border-border/60">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Find Us"
          title="Visit Hungry Hub"
          subtitle="Open around the clock on MLA Road, Neelpur, Rajpura. Dine-in, takeaway and fast delivery."
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {/* Info Card */}
          <Reveal direction="left">
            <div className="hh-shadow h-full rounded-3xl border border-border/80 bg-card p-8 flex flex-col justify-between">
              <ul className="space-y-6">
                <li className="flex gap-4">
                  <div className="relative mt-1">
                    <span className="absolute inset-0 rounded-full bg-accent/30 animate-radar-ping" />
                    <MapPin className="relative h-6 w-6 shrink-0 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-bold">Address</h3>
                    <address className="mt-1 text-sm leading-relaxed text-muted-foreground not-italic">
                      {restaurant.addressLines.map((line) => (
                        <span key={line} className="block">
                          {line}
                        </span>
                      ))}
                    </address>
                  </div>
                </li>

                <li className="flex gap-4">
                  <Phone className="mt-1 h-5 w-5 shrink-0 text-primary animate-bounce-subtle" />
                  <div>
                    <h3 className="font-display text-lg font-bold">Phone</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      <a href={restaurant.phoneHref} className="hover:text-primary font-semibold">
                        {restaurant.phone}
                      </a>
                      <br />
                      Home delivery: {restaurant.deliveryPhones.join(" · ")}
                    </p>
                  </div>
                </li>

                <li className="flex gap-4">
                  <Clock className="mt-1 h-5 w-5 shrink-0 text-emerald-600 animate-spin-slow" />
                  <div>
                    <h3 className="font-display text-lg font-bold">Operating Hours</h3>
                    <p className="mt-1 text-sm font-semibold text-emerald-600">
                      {restaurant.hours} (24/7 Service)
                    </p>
                  </div>
                </li>

                <li className="flex gap-4">
                  <UtensilsCrossed className="mt-1 h-5 w-5 shrink-0 text-accent" />
                  <div>
                    <h3 className="font-display text-lg font-bold">Available Services</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {restaurant.services.join(" · ")}
                    </p>
                  </div>
                </li>
              </ul>

              <div className="mt-8 flex flex-wrap gap-3 pt-4 border-t border-border/60">
                <Button
                  asChild
                  size="lg"
                  className="rounded-full px-7 font-bold uppercase btn-3d-primary btn-shimmer-sweep cursor-pointer"
                >
                  <a href={restaurant.phoneHref}>
                    <Phone className="h-4 w-4 mr-1.5" /> Call Restaurant
                  </a>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={handleCopyAddress}
                  className="rounded-full px-5 font-bold uppercase btn-3d-outline cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 mr-1.5 text-primary" /> Address Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-1.5" /> Copy Address
                    </>
                  )}
                </Button>
              </div>
            </div>
          </Reveal>

          {/* Interactive Google Maps Frame */}
          <Reveal direction="right" delay={100}>
            <div className="hh-shadow relative h-full min-h-[380px] overflow-hidden rounded-3xl border border-border/80 bg-card group">
              <iframe
                title="Google Maps location of Hungry Hub Rajpura"
                src={mapsEmbedUrl}
                width="100%"
                height="100%"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-full min-h-[380px] w-full border-0 transition-opacity duration-300 group-hover:opacity-95"
              />
              <div className="absolute right-4 bottom-4">
                <Button
                  asChild
                  size="sm"
                  variant="outline"
                  className="rounded-full font-bold btn-3d-outline backdrop-blur-md cursor-pointer"
                >
                  <a href={mapsDirectionsUrl} target="_blank" rel="noopener noreferrer">
                    <Navigation className="h-4 w-4 mr-1 text-primary" /> Get Directions
                  </a>
                </Button>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
