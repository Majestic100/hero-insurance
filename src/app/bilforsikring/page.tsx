import {
  LandingPage,
  landingPageMetadata,
} from "@/components/marketing/landing-page";
import { LANDING_PAGES } from "@/config/landing-pages";

const page = LANDING_PAGES.car;

export const metadata = landingPageMetadata(page);

export default function CarInsurancePage() {
  return <LandingPage page={page} />;
}
