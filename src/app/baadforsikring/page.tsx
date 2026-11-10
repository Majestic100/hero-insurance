import {
  LandingPage,
  landingPageMetadata,
} from "@/components/marketing/landing-page";
import { LANDING_PAGES } from "@/config/landing-pages";

const page = LANDING_PAGES.boat;

export const metadata = landingPageMetadata(page);

export default function BoatInsurancePage() {
  return <LandingPage page={page} />;
}
