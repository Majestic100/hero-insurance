import {
  LandingPage,
  landingPageMetadata,
} from "@/components/marketing/landing-page";
import { LANDING_PAGES } from "@/config/landing-pages";

const page = LANDING_PAGES.motorcycle_atv_moped;

export const metadata = landingPageMetadata(page);

export default function MotorcycleInsurancePage() {
  return <LandingPage page={page} />;
}
