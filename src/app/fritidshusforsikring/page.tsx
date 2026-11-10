import {
  LandingPage,
  landingPageMetadata,
} from "@/components/marketing/landing-page";
import { LANDING_PAGES } from "@/config/landing-pages";

const page = LANDING_PAGES.holiday_home;

export const metadata = landingPageMetadata(page);

export default function HolidayHomeInsurancePage() {
  return <LandingPage page={page} />;
}
