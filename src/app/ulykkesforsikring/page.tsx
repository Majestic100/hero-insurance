import {
  LandingPage,
  landingPageMetadata,
} from "@/components/marketing/landing-page";
import { LANDING_PAGES } from "@/config/landing-pages";

const page = LANDING_PAGES.accident_health;

export const metadata = landingPageMetadata(page);

export default function AccidentInsurancePage() {
  return <LandingPage page={page} />;
}
