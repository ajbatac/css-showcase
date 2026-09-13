import { createFileRoute } from "@tanstack/react-router";
import { LegalPage, LegalSection } from "@/components/legal-page";

export const Route = createFileRoute("/disclaimer")({
  head: () => ({
    meta: [
      { title: "Disclaimer — CSS Showcase" },
      { name: "description", content: "Content disclaimer for CSS Showcase." },
    ],
  }),
  component: DisclaimerPage,
});

function DisclaimerPage() {
  return (
    <LegalPage title="Disclaimer">
      <LegalSection heading="Educational content">
        <p>
          Everything on CSS Showcase is published for learning and demonstration. Demos simplify or
          omit details on purpose so the underlying CSS stays visible.
        </p>
      </LegalSection>
      <LegalSection heading="No guarantee of completeness">
        <p>
          Code examples may not account for every browser, device, accessibility need, or security
          concern. Verify behavior in your own project before shipping it to production.
        </p>
      </LegalSection>
      <LegalSection heading="External links">
        <p>
          The site links to its GitHub repository. We do not control that platform's content and are
          not responsible for it.
        </p>
      </LegalSection>
      <LegalSection heading="No liability">
        <p>
          Use of the site and its code is at your own risk. We are not liable for any loss or damage
          connected to that use.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
