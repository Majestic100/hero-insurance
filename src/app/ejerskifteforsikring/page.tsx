import {
  LandingPage,
  landingPageMetadata,
} from "@/components/marketing/landing-page";
import { LANDING_PAGES } from "@/config/landing-pages";

const page = LANDING_PAGES.change_of_ownership;

export const metadata = landingPageMetadata(page);

export default function ChangeOfOwnershipInsurancePage() {
  return <LandingPage page={page} />;
}
