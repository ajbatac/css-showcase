import { createFileRoute } from "@tanstack/react-router";
import { LegalPage, LegalSection } from "@/components/legal-page";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service — CSS Showcase" },
      { name: "description", content: "Terms of service for CSS Showcase." },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <LegalPage title="Terms of Service">
      <LegalSection heading="The site">
        <p>
          CSS Showcase is a free, educational collection of live CSS demos. By using the site you
          accept these terms. If you do not agree, please do not use the site.
        </p>
      </LegalSection>
      <LegalSection heading="Using the code">
        <p>
          The demo code shown on this site is available in our public repository at
          github.com/ajbatac/css-showcase. You may read, copy, and adapt it for your own projects
          under the license that applies to the repository.
        </p>
      </LegalSection>
      <LegalSection heading="No warranty">
        <p>
          The site and its code are provided as is, without warranty of any kind. Demos are written
          for teaching, so they may omit production concerns such as accessibility edge cases,
          browser quirks, or security hardening.
        </p>
      </LegalSection>
      <LegalSection heading="Limitation of liability">
        <p>
          We are not liable for any damage or loss arising from your use of the site or reliance on
          its content.
        </p>
      </LegalSection>
      <LegalSection heading="Changes">
        <p>
          We may update these terms and the site at any time. Continued use of the site after a
          change means you accept the updated terms.
        </p>
      </LegalSection>
      <LegalSection heading="Contact">
        <p>
          Questions about these terms can be raised in a GitHub issue at
          github.com/ajbatac/css-showcase/issues.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
