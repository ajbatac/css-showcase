import { createFileRoute } from "@tanstack/react-router";
import { LegalPage, LegalSection } from "@/components/legal-page";

export const Route = createFileRoute("/dmca")({
  head: () => ({
    meta: [
      { title: "DMCA Policy — CSS Showcase" },
      { name: "description", content: "Copyright complaint policy for CSS Showcase." },
    ],
  }),
  component: DmcaPage,
});

function DmcaPage() {
  return (
    <LegalPage title="DMCA Policy">
      <LegalSection heading="Copyright complaints">
        <p>
          CSS Showcase respects copyright. If you believe material on this site infringes your
          copyright, open an issue at github.com/ajbatac/css-showcase/issues with the following
          information:
        </p>
        <ul className="list-disc space-y-1.5 pl-5">
          <li>Identification of the copyrighted work you claim has been infringed.</li>
          <li>The URL of the page on this site containing the material in question.</li>
          <li>Your name, contact information, and signature (physical or electronic).</li>
          <li>
            A statement that you have a good-faith belief the use is not authorized by the copyright
            owner, its agent, or the law.
          </li>
          <li>
            A statement, under penalty of perjury, that the information in your notice is accurate
            and that you are the copyright owner or authorized to act on their behalf.
          </li>
        </ul>
      </LegalSection>
      <LegalSection heading="Our response">
        <p>
          We review complete notices and remove or disable access to infringing material promptly.
          Repeat infringers lose contribution access in the repository.
        </p>
      </LegalSection>
      <LegalSection heading="Counter-notice">
        <p>
          If you believe your material was removed by mistake or misidentification, you may submit a
          counter-notice through the same GitHub issue tracker with your contact information and a
          statement, under penalty of perjury, that the material was removed in error.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
