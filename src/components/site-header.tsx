"use client";

import { ArrowRightIcon, MenuIcon, ShieldCheckIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { INSURANCE_ICONS } from "@/components/insurance-icons";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { INSURANCE_TYPE_INFO } from "@/config/forms/insurance-types";
import { LANDING_PAGE_LIST } from "@/config/landing-pages";
import { SITE } from "@/config/site";
import { cn } from "@/lib/utils";

/** Top-level links next to the "Forsikringer" menu. */
const NAV_LINKS = [
  { href: "/#saadan-virker-det", label: "Sådan virker det" },
  { href: "/om-os", label: "Om os" },
  { href: "/kontakt", label: "Kontakt" },
] as const;

const INSURANCES = LANDING_PAGE_LIST.map((page) => ({
  href: page.path,
  label: INSURANCE_TYPE_INFO[page.insuranceType].label,
  shortLabel: INSURANCE_TYPE_INFO[page.insuranceType].shortLabel,
  Icon: INSURANCE_ICONS[page.insuranceType],
}));

function Wordmark() {
  // Placeholder wordmark until the logo is ready.
  return (
    <Link
      href="/"
      className="flex min-h-11 shrink-0 items-center gap-2 font-heading text-lg font-semibold text-primary"
    >
      <ShieldCheckIcon aria-hidden className="size-6 text-brand" />
      {SITE.name}
    </Link>
  );
}

/**
 * Header on every page. Desktop: a menu with all insurances, the main
 * links and "Få tilbud". Mobile: the same in a drawer. Inside the form only
 * the wordmark, so nothing pulls the user out of the funnel.
 */
export function SiteHeader() {
  const pathname = usePathname();
  const inForm = pathname === "/tilbud" || pathname.startsWith("/tilbud/");

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4">
        <Wordmark />
        {!inForm && (
          <>
            <DesktopNav pathname={pathname} />
            <div className="flex items-center gap-2">
              <Button asChild variant="cta" className="hidden h-11 px-5 md:inline-flex">
                <Link href="/tilbud">
                  Få tilbud
                  <ArrowRightIcon aria-hidden />
                </Link>
              </Button>
              <MobileNav pathname={pathname} />
            </div>
          </>
        )}
      </div>
    </header>
  );
}

function DesktopNav({ pathname }: { pathname: string }) {
  return (
    <NavigationMenu viewport={false} className="hidden md:flex" aria-label="Hovedmenu">
      <NavigationMenuList className="gap-1">
        <NavigationMenuItem>
          <NavigationMenuTrigger className="h-11 bg-transparent">Forsikringer</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[34rem] grid-cols-2 gap-1 p-2 lg:w-[44rem] lg:grid-cols-3">
              {INSURANCES.map(({ href, label, Icon }) => (
                <li key={href}>
                  <NavigationMenuLink asChild active={pathname === href}>
                    <Link href={href} className="flex-row items-center gap-3 px-3 py-2.5">
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-secondary">
                        <Icon aria-hidden className="size-5 text-brand" />
                      </span>
                      <span className="font-medium text-foreground">{label}</span>
                    </Link>
                  </NavigationMenuLink>
                </li>
              ))}
            </ul>
            <div className="m-2 mt-0 flex items-center justify-between gap-4 rounded-md bg-secondary px-4 py-3">
              <p className="text-sm text-secondary-foreground">
                Vil du have tilbud på flere forsikringer på én gang?
              </p>
              <NavigationMenuLink asChild>
                <Link
                  href="/tilbud"
                  className="flex-row items-center gap-1 font-semibold text-primary underline-offset-4 hover:underline"
                >
                  Vælg flere
                  <ArrowRightIcon aria-hidden className="size-4 text-primary" />
                </Link>
              </NavigationMenuLink>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
        {NAV_LINKS.map((link) => (
          <NavigationMenuItem key={link.href}>
            <NavigationMenuLink
              asChild
              active={pathname === link.href}
              className={cn(navigationMenuTriggerStyle(), "h-11 bg-transparent")}
            >
              <Link href={link.href}>{link.label}</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

function MobileNav({ pathname }: { pathname: string }) {
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="size-11 md:hidden" aria-label="Åbn menu">
          <MenuIcon aria-hidden className="size-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full gap-0 overflow-y-auto sm:max-w-sm">
        <SheetHeader className="border-b">
          <SheetTitle className="font-heading text-lg text-primary">{SITE.name}</SheetTitle>
          <SheetDescription className="sr-only">Menu</SheetDescription>
        </SheetHeader>
        <nav aria-label="Menu" className="flex flex-1 flex-col gap-6 p-4">
          <div>
            <p className="mb-2 text-sm font-semibold text-muted-foreground">Forsikringer</p>
            <ul className="grid grid-cols-2 gap-2">
              {INSURANCES.map(({ href, shortLabel, Icon }) => (
                <li key={href}>
                  <SheetClose asChild>
                    <Link
                      href={href}
                      aria-current={pathname === href ? "page" : undefined}
                      className="flex min-h-11 items-center gap-2 rounded-md border bg-card px-3 py-2 text-sm font-medium hover:bg-accent aria-[current=page]:border-brand"
                    >
                      <Icon aria-hidden className="size-4 shrink-0 text-brand" />
                      {shortLabel}
                    </Link>
                  </SheetClose>
                </li>
              ))}
            </ul>
          </div>
          <ul className="flex flex-col border-t pt-2">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <SheetClose asChild>
                  <Link
                    href={link.href}
                    className="flex min-h-12 items-center border-b text-base font-medium"
                  >
                    {link.label}
                  </Link>
                </SheetClose>
              </li>
            ))}
          </ul>
          <SheetClose asChild>
            <Button asChild variant="cta" className="mt-auto h-12 w-full text-base">
              <Link href="/tilbud">
                Få tilbud
                <ArrowRightIcon aria-hidden />
              </Link>
            </Button>
          </SheetClose>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
