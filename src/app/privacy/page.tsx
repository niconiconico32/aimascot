import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Crowned Portraits",
  description: "Privacy Policy for Crowned Portraits operated by GGRetro LLC.",
};

export default function PrivacyPage() {
  return (
    <main className="bg-[var(--background)] px-6 py-12 sm:py-16">
      <div className="mx-auto max-w-4xl rounded-[var(--radius-xl)] border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] p-6 shadow-sm sm:p-10">
        <h1 className="type-headline-md text-[var(--on-surface)]">Privacy Policy</h1>
        <p className="mt-2 text-sm text-[var(--on-surface-variant)]">Last updated: May 19, 2026</p>

        <section className="mt-8 space-y-3">
          <p className="type-body-md text-[var(--on-surface)]">
            This Privacy Policy describes how GGRetro LLC (the "Company", "Crowned Portraits", "we", "us", or "our"), operating the brand Crowned Portraits and the website ai.turnmeroyal.com (the "Site"), collects, uses, and shares your personal information when you use our automated AI portrait generation service. By utilizing the Site, you agree to the collection and use of information in accordance with this policy.
          </p>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-lg font-bold text-[var(--on-surface)]">1. Information We Collect</h2>
          <p className="type-body-md text-[var(--on-surface)]">
            We collect several types of information depending on how you interact with our Site:
          </p>

          <h3 className="pt-2 text-base font-semibold text-[var(--on-surface)]">1.1 Photos You Upload</h3>
          <p className="type-body-md text-[var(--on-surface)]">
            When you use our AI portrait generation service, you upload digital photographs. These files are transmitted securely to our cloud infrastructure to be processed by our automated system to generate your customized portraits.
          </p>
          <p className="type-body-md text-[var(--on-surface)]">
            Strict Purpose Limitation: We use your uploaded photos solely to fulfill your portrait requests. We do not sell, rent, or distribute your photographs to third parties, nor do we utilize your images to train baseline commercial AI models.
          </p>

          <h3 className="pt-2 text-base font-semibold text-[var(--on-surface)]">1.2 Order and Transaction Information</h3>
          <p className="type-body-md text-[var(--on-surface)]">
            When you complete a purchase, we collect information necessary to process your transaction and logistics fulfillment:
          </p>
          <ul className="list-disc space-y-2 pl-6 text-[var(--on-surface)]">
            <li>
              <span className="font-semibold">Customer Metadata:</span> Email address, product selections, and specific order preferences.
            </li>
            <li>
              <span className="font-semibold">Fulfillment Data:</span> A physical shipping address (required strictly for canvas and physical framed print orders).
            </li>
            <li>
              <span className="font-semibold">Payment Safeguards:</span> Financial details and credit card processing are handled directly and securely by our PCI-DSS compliant third-party payment gateway (Stripe). We do not store or process raw credit card numbers on our servers.
            </li>
          </ul>

          <h3 className="pt-2 text-base font-semibold text-[var(--on-surface)]">1.3 Device and Usage Information</h3>
          <p className="type-body-md text-[var(--on-surface)]">
            To ensure operational stability and protect our platform from automated abuse, we automatically collect certain technical metadata when you visit the Site, including:
          </p>
          <ul className="list-disc space-y-2 pl-6 text-[var(--on-surface)]">
            <li>IP address and approximate geographic region.</li>
            <li>Browser type, device operational system, and screen layout specifications.</li>
            <li>Anonymized user interaction patterns, pages visited, and core conversion funnel metrics.</li>
          </ul>

          <h3 className="pt-2 text-base font-semibold text-[var(--on-surface)]">1.4 Dynamic Session Cookies</h3>
          <p className="type-body-md text-[var(--on-surface)]">
            Our service features an anonymous, session-based user experience. A unique identifier is stored within your browser cookies to link your uploaded photos and generated previews to your current visit without forcing you to register a password-protected user profile.
          </p>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-lg font-bold text-[var(--on-surface)]">2. How We Use Your Information</h2>
          <p className="type-body-md text-[var(--on-surface)]">
            We utilize the collected information strictly for the following operational workflows:
          </p>
          <ul className="list-disc space-y-2 pl-6 text-[var(--on-surface)]">
            <li>
              <span className="font-semibold">Fulfillment:</span> Processing your files through our graphics pipeline, deploying high-resolution digital downloads, and printing/shipping physical canvases.
            </li>
            <li>
              <span className="font-semibold">Communication:</span> Despachando order confirmations, automated tracking links, high-res download keys, and responding directly to your support tickets via help@crownedportraits.com.
            </li>
            <li>
              <span className="font-semibold">Platform Protection:</span> Monitoring for fraudulent credit card charges, malicious script attacks, or structural abuse of our free transformation preview tools.
            </li>
            <li>
              <span className="font-semibold">Marketing:</span> With your implicit or explicit consent, sending tailored brand discounts, seasonal template drops, or promotional canvas offers. You may opt out instantly via the footer link in any marketing email.
            </li>
          </ul>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-lg font-bold text-[var(--on-surface)]">3. Strict Photo Data Handling & Retaining Lifecycles</h2>
          <p className="type-body-md text-[var(--on-surface)]">
            We implement rigid constraints regarding how long your graphic assets live on our systems:
          </p>
          <ul className="list-disc space-y-2 pl-6 text-[var(--on-surface)]">
            <li>
              <span className="font-semibold">The 14-Day Automated Purge:</span> To preserve user privacy and manage cloud network overhead, all customer-uploaded photographs and generated preview assets are automatically and permanently deleted from our servers exactly fourteen (14) calendar days following their upload. This data destruction is irreversible.
            </li>
            <li>
              <span className="font-semibold">Immediate Deletion Requests:</span> If you want your images removed from our active server cache before the automated 14-day window expires, you can file an immediate request by messaging us at help@crownedportraits.com.
            </li>
            <li>
              <span className="font-semibold">Transactional Records Retention:</span> Standard commercial logs, order invoices, transactional email interactions, and tax compliance accounting data are stored securely for standard legally mandated timeframes (typically up to 7 years).
            </li>
          </ul>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-lg font-bold text-[var(--on-surface)]">4. Data Sharing and Third-Party Cloud Processing</h2>
          <p className="type-body-md text-[var(--on-surface)]">
            We do not sell your data. To execute the automated features of Crowned Portraits, we securely stream limited information to highly protected external cloud providers under strict data-processing agreements:
          </p>
          <ul className="list-disc space-y-2 pl-6 text-[var(--on-surface)]">
            <li>
              <span className="font-semibold">Payment Integration:</span> Financial details are managed entirely via secure tokens by our payment processor (Stripe).
            </li>
            <li>
              <span className="font-semibold">Infrastructure and Core Processing:</span> Our backend uses secure, encrypted cloud data centers to process web request logic, distribute image files, and run the real-time AI computational models required to alter your portraits.
            </li>
            <li>
              <span className="font-semibold">Marketing & Analytics:</span> We utilize industry-standard analytics tools, conversion tracking pixels (such as the Meta Pixel and Google Tags), and delivery platforms to distribute our email updates, track ad efficiency, and optimize frontend design features.
            </li>
          </ul>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-lg font-bold text-[var(--on-surface)]">5. Cookies and Targeted Advertising Preferences</h2>
          <p className="type-body-md text-[var(--on-surface)]">
            We implement functional cookies to maintain your active cart data and transformation sessions. We also leverage promotional tracking layers to display relevant targeted advertisements to previous site visitors on external platforms (such as Facebook, Instagram, and Google).
          </p>
          <p className="type-body-md text-[var(--on-surface)]">
            You can control your cookie parameters or opt out of customized behavioral tracking through your native browser configurations or by updating your preferences directly on external advertising dashboards (e.g., Facebook Ad Settings or Google Ads Settings).
          </p>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-lg font-bold text-[var(--on-surface)]">6. Your Rights (GDPR & CCPA Compliance)</h2>
          <p className="type-body-md text-[var(--on-surface)]">
            Depending on your regional jurisdiction (such as the European Economic Area under GDPR or the State of California under CCPA), you are granted distinct legal privileges over your data:
          </p>
          <ul className="list-disc space-y-2 pl-6 text-[var(--on-surface)]">
            <li>The right to request comprehensive disclosure regarding the specific elements of personal info we maintain.</li>
            <li>The right to command immediate correction of typos or inaccurate operational records.</li>
            <li>The right to demand full erasure of your communication history, data profiles, or asset uploads ("the right to be forgotten").</li>
          </ul>
          <p className="type-body-md text-[var(--on-surface)]">
            To execute any of your data rights, contact us at help@crownedportraits.com. We respond to all verified customer privacy requests within thirty (30) days.
          </p>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-lg font-bold text-[var(--on-surface)]">7. Data Security Safeguards</h2>
          <p className="type-body-md text-[var(--on-surface)]">
            We implement high-grade industrial protection standards to shield your information. All connections to the site are forced through Transport Layer Security (TLS/SSL) encryption protocols, data centers maintain rigid encryption at rest, and server-side folder access controls prevent unauthenticated session breaches. While we enforce maximum systemic protection, no web architecture is absolutely impenetrable; we cannot guarantee flawless security.
          </p>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-lg font-bold text-[var(--on-surface)]">8. Children&apos;s Privacy Bound</h2>
          <p className="type-body-md text-[var(--on-surface)]">
            Our AI generation utilities are not structured for, nor directed toward, children under the age of 16. We do not intentionally harvest data from minors. If you discover that an unauthorized minor has supplied data to our systems, alert us immediately so we can take steps to erase the files.
          </p>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-lg font-bold text-[var(--on-surface)]">9. Policy Amendments</h2>
          <p className="type-body-md text-[var(--on-surface)]">
            GGRetro LLC reserves the right to adjust, rewrite, or update this Privacy Policy at any time. Modified versions will become binding the moment they are committed to this live URL. We encourage you to review this page periodically to remain updated on our privacy workflows.
          </p>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-lg font-bold text-[var(--on-surface)]">10. Contact Us</h2>
          <p className="type-body-md text-[var(--on-surface)]">
            For data requests, systemic concerns, or formal policy inquiries, reach out to our administration desk:
          </p>
          <p className="type-body-md text-[var(--on-surface)]">Brand Name: Crowned Portraits</p>
          <p className="type-body-md text-[var(--on-surface)]">Operating Corporate Entity: GGRetro LLC</p>
          <p className="type-body-md text-[var(--on-surface)]">
            Support Email Address:{" "}
            <a className="font-semibold text-[var(--primary)] underline" href="mailto:help@crownedportraits.com">
              help@crownedportraits.com
            </a>
          </p>
          <p className="type-body-md text-[var(--on-surface)]">
            Core Application Domain:{" "}
            <a className="font-semibold text-[var(--primary)] underline" href="https://ai.turnmeroyal.com" target="_blank" rel="noreferrer">
              ai.turnmeroyal.com
            </a>
          </p>
        </section>
      </div>
    </main>
  );
}
