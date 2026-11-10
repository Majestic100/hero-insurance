import {
  LandingPage,
  landingPageMetadata,
} from "@/components/marketing/landing-page";
import { LANDING_PAGES } from "@/config/landing-pages";

const page = LANDING_PAGES.house;

export const metadata = landingPageMetadata(page);

export default function HouseInsurancePage() {
  return <LandingPage page={page} />;
}
