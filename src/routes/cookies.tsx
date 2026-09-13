import { createFileRoute } from "@tanstack/react-router";
import { LegalPage, LegalSection } from "@/components/legal-page";

export const Route = createFileRoute("/cookies")({
  head: () => ({
    meta: [
      { title: "Cookie Policy — CSS Showcase" },
      { name: "description", content: "Cookie policy for CSS Showcase." },
    ],
  }),
  component: CookiesPage,
});

function CookiesPage() {
  return (
    <LegalPage title="Cookie Policy">
      <LegalSection heading="Cookies on this site">
        <p>
          CSS Showcase does not set cookies. There are no tracking cookies, advertising cookies, or
          session cookies of any kind.
        </p>
      </LegalSection>
      <LegalSection heading="Local storage">
        <p>
          The site keeps one preference on your device using local storage: whether you picked the
          light or dark theme. Local storage is not a cookie and is not sent to any server. Clearing
          your browser's site data removes it.
        </p>
      </LegalSection>
      <LegalSection heading="Third parties">
        <p>
          Links to GitHub leave this site, and GitHub's own cookie practices apply once you are
          there. This site loads no third-party scripts, fonts, or embeds that could set cookies.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
