import {
  LandingPage,
  landingPageMetadata,
} from "@/components/marketing/landing-page";
import { LANDING_PAGES } from "@/config/landing-pages";

const page = LANDING_PAGES.travel;

export const metadata = landingPageMetadata(page);

export default function TravelInsurancePage() {
  return <LandingPage page={page} />;
}
