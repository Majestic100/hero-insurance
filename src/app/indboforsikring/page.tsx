import {
  LandingPage,
  landingPageMetadata,
} from "@/components/marketing/landing-page";
import { LANDING_PAGES } from "@/config/landing-pages";

const page = LANDING_PAGES.home_contents;

export const metadata = landingPageMetadata(page);

export default function HomeContentsInsurancePage() {
  return <LandingPage page={page} />;
}
