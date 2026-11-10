import { COMPANY, SITE } from "@/config/site";

/** Company details for the legal pages: only the fields that are set. */
export function CompanyDetails() {
  return (
    <address className="rounded-lg border bg-cream p-4 not-italic">
      <strong>{COMPANY.name}</strong>
      {COMPANY.address && (
        <>
          <br />
          {COMPANY.address}
        </>
      )}
      {COMPANY.cvr && (
        <>
          <br />
          CVR: {COMPANY.cvr}
        </>
      )}
      <br />
      E-mail: <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
    </address>
  );
}
