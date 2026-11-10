import {
  LandingPage,
  landingPageMetadata,
} from "@/components/marketing/landing-page";
import { LANDING_PAGES } from "@/config/landing-pages";

const page = LANDING_PAGES.pet;

export const metadata = landingPageMetadata(page);

export default function PetInsurancePage() {
  return <LandingPage page={page} />;
}
