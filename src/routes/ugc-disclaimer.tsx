import { createFileRoute } from "@tanstack/react-router";
import { LegalPage, LegalSection } from "@/components/legal-page";

export const Route = createFileRoute("/ugc-disclaimer")({
  head: () => ({
    meta: [
      { title: "UGC Disclaimer — CSS Showcase" },
      { name: "description", content: "User-generated content disclaimer for CSS Showcase." },
    ],
  }),
  component: UgcDisclaimerPage,
});

function UgcDisclaimerPage() {
  return (
    <LegalPage title="UGC Disclaimer">
      <LegalSection heading="User-generated content">
        <p>
          CSS Showcase does not host user-generated content. There are no accounts, comments,
          reviews, or public submissions on this site. All demos and copy are authored by the
          project maintainers.
        </p>
      </LegalSection>
      <LegalSection heading="Demo data is fictional">
        <p>
          Names, email addresses, messages, and file entries shown inside demos are invented sample
          data. They refer to real people or companies only by coincidence.
        </p>
      </LegalSection>
      <LegalSection heading="Contributions">
        <p>
          Code contributions arrive through pull requests on GitHub, where they are reviewed before
          becoming part of the site. Their content is the responsibility of the project maintainers
          once merged.
        </p>
      </LegalSection>
      <LegalSection heading="If that changes">
        <p>
          If the site ever adds interactive features that accept public content, this page will be
          updated with moderation and takedown practices before those features launch.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
