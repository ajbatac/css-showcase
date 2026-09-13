import { createFileRoute } from "@tanstack/react-router";
import { LegalPage, LegalSection } from "@/components/legal-page";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — CSS Showcase" },
      { name: "description", content: "Privacy policy for CSS Showcase." },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy">
      <LegalSection heading="What we collect">
        <p>
          Nothing. CSS Showcase has no accounts, no newsletters, no analytics, no advertising, and
          no third-party trackers. We do not collect personal information.
        </p>
      </LegalSection>
      <LegalSection heading="Forms on the site are demos">
        <p>
          Login screens, forms, and uploads you see on demo pages are visual examples. They run in
          your browser and do not submit, send, or store any data anywhere.
        </p>
      </LegalSection>
      <LegalSection heading="Local storage">
        <p>
          The site stores one preference on your device: your light or dark theme choice, kept in
          your browser's local storage. It never leaves your device and you can clear it any time
          through your browser settings.
        </p>
      </LegalSection>
      <LegalSection heading="Hosting">
        <p>
          The site is served by a hosting provider, which may keep standard server access logs, such
          as IP addresses, for security and abuse prevention. We do not use those logs to identify
          visitors.
        </p>
      </LegalSection>
      <LegalSection heading="Changes">
        <p>
          If this policy ever changes, we will update this page. Any question can be raised in a
          GitHub issue at github.com/ajbatac/css-showcase/issues.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
