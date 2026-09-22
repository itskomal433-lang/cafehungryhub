import { Link } from "@tanstack/react-router";
import { Clock, Facebook, Instagram, MapPin, Phone, Sparkles } from "lucide-react";
import { LogoMark } from "@/components/site/Logo";
import { mapsDirectionsUrl, navLinks, restaurant } from "@/data/restaurant";

export function Footer() {
  return (
    <footer className="mt-24 bg-primary-deep text-primary-foreground relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-0 right-1/4 h-64 w-64 rounded-full bg-gold/5 blur-3xl pointer-events-none" />

      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8 relative z-10">
        <div>
          <div className="flex items-center gap-3">
            <LogoMark className="h-11 w-11" />
            <div>
              <p className="font-display text-xl font-bold tracking-wide">HUNGRY HUB</p>
              <p className="text-[0.62rem] tracking-[0.26em] text-gold font-bold uppercase">
                Botanical Café & 24/7 Lounge
              </p>
            </div>
          </div>
          <p className="font-script mt-4 text-2xl text-gold/90">
            Good Food · Good Mood · Good Vibes
          </p>

          <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-emerald-400">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Café Lounge & Kitchen Open 24 Hours
          </div>

          <div className="mt-6 flex gap-3">
            <a
              href={restaurant.socials.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="grid h-10 w-10 place-items-center rounded-full border border-primary-foreground/25 transition-all duration-300 hover:scale-115 hover:bg-gold hover:text-gold-foreground hover:border-gold shadow-xs btn-press"
            >
              <Instagram className="h-4 w-4" />
            </a>
            <a
              href={restaurant.socials.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="grid h-10 w-10 place-items-center rounded-full border border-primary-foreground/25 transition-all duration-300 hover:scale-115 hover:bg-gold hover:text-gold-foreground hover:border-gold shadow-xs btn-press"
            >
              <Facebook className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div>
          <h2 className="font-display text-sm font-bold tracking-[0.2em] uppercase">Explore</h2>
          <ul className="mt-5 space-y-2.5 text-sm text-primary-foreground/80">
            {navLinks.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  activeOptions={{ exact: link.to === "/" }}
                  className="transition-all duration-200 hover:text-gold hover:translate-x-1 inline-block"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="font-display text-sm font-bold tracking-[0.2em] uppercase">Visit us</h2>
          <ul className="mt-5 space-y-3 text-sm text-primary-foreground/80">
            <li className="flex gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
              <a
                href={mapsDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gold transition-colors"
              >
                MLA Road, Banwari Village, Neelpur, Rajpura, Punjab 140401
              </a>
            </li>
            <li className="flex gap-3">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-gold animate-bounce-subtle" />
              <span>
                <a href={restaurant.phoneHref} className="hover:text-gold font-bold">
                  {restaurant.phone}
                </a>
                <br />
                Home delivery: {restaurant.deliveryPhones.join(" · ")}
              </span>
            </li>
            <li className="flex gap-3">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-gold animate-spin-slow" />
              {restaurant.hours} · {restaurant.services.join(" · ")}
            </li>
          </ul>

          <h2 className="mt-7 font-display text-sm font-bold tracking-[0.2em] uppercase">
            Also on
          </h2>
          <div className="mt-3 flex gap-2">
            {restaurant.deliveryPartners.map((partner) => (
              <a
                key={partner.name}
                href={partner.url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-primary-foreground/25 px-4 py-1.5 text-xs font-semibold transition-all hover:bg-primary-foreground/15 hover:border-gold hover:text-gold btn-press"
              >
                {partner.name}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-primary-foreground/15 relative z-10">
        <div className="mx-auto flex max-w-7xl flex-col sm:flex-row items-center justify-between gap-2 px-4 py-6 text-xs text-primary-foreground/65 sm:px-6 lg:px-8">
          <p>© 2026 Hungry Hub Rajpura. All Rights Reserved.</p>
          <Link
            to="/admin"
            className="text-primary-foreground/60 hover:text-gold transition-colors inline-flex items-center gap-1.5"
          >
            🔒 Staff & Admin Portal
          </Link>
        </div>
      </div>
    </footer>
  );
}
