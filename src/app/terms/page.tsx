import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | Crowned Portraits",
  description: "Terms of Service for Crowned Portraits operated by GGRetro LLC.",
};

export default function TermsPage() {
  return (
    <main className="bg-[var(--background)] px-6 py-12 sm:py-16">
      <div className="mx-auto max-w-4xl rounded-[var(--radius-xl)] border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] p-6 shadow-sm sm:p-10">
        <h1 className="type-headline-md text-[var(--on-surface)]">Terms of Service</h1>
        <p className="mt-2 text-sm text-[var(--on-surface-variant)]">Last updated: May 19, 2026</p>

        <section className="mt-8 space-y-3">
          <h2 className="text-lg font-bold text-[var(--on-surface)]">1. Overview</h2>
          <p className="type-body-md text-[var(--on-surface)]">
            This website, crownedportraits.com/ (the "Site"), and the brand Crowned Portraits are operated by GGRetro LLC (the "Company", "Crowned Portraits", "we", "us", or "our"). Throughout the Site, the terms "you" and "your" refer to the user of the Site.
          </p>
          <p className="type-body-md text-[var(--on-surface)]">
            By accessing, browsing, or using the Site, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any part of these terms, you are strictly prohibited from using the Site or its services.
          </p>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-lg font-bold text-[var(--on-surface)]">2. Service Description</h2>
          <p className="type-body-md text-[var(--on-surface)]">
            Crowned Portraits provides an automated, proprietary artificial intelligence (AI) portrait generation service. Users may upload digital photographs of human subjects or pets. Our system processes these images via secure cloud infrastructure to transform them into customized historical, royal, and Renaissance-style artistic portraits.
          </p>
          <p className="type-body-md text-[var(--on-surface)]">
            We grant users the ability to review watermarked preview versions of the artwork for evaluation at no initial cost. Users may subsequently purchase a license to download high-resolution, unwatermarked digital files or order physical customized print-on-demand products, including but not limited to canvases and framed canvases.
          </p>
          <p className="type-body-md text-[var(--on-surface)]">
            We explicitly reserve the right to modify, suspend, restrict, or discontinue the service (or any technical component thereof) at any time, for any reason, and without prior notice. The Company shall not be liable to you or any third party for any operational modification, pricing adjustment, or service suspension.
          </p>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-lg font-bold text-[var(--on-surface)]">3. Sessions, Accounts, and Data Life Cycle</h2>
          <p className="type-body-md text-[var(--on-surface)]">
            Our platform operates on a frictionless, anonymous, session-based framework. You are not required to register a profile or create a password-protected account to access the image generation features. An anonymous unique identifier session is deployed via browser cookies upon entry.
          </p>
          <h3 className="pt-2 text-base font-semibold text-[var(--on-surface)]">3.1 Session Persistence and Storage Limits</h3>
          <p className="type-body-md text-[var(--on-surface)]">
            Data Lifecycle: To optimize cloud infrastructure costs and enforce absolute privacy boundaries, user-uploaded photographs and generated previews are stored securely within our encrypted cloud environment for a strict and maximum period of fourteen (14) calendar days from the date of upload.
          </p>
          <p className="type-body-md text-[var(--on-surface)]">
            Automated Permanent Deletion: Upon the expiration of this 14-day window, all source images and temporary generations are permanently and irreversibly purged from our live servers.
          </p>
          <p className="type-body-md text-[var(--on-surface)]">
            User Responsibility: Clearing your browser cache, deleting cookies, or attempting to access the platform via an alternate device or private browsing mode may result in immediate loss of your session connection and metadata. Preview URLs are persistent only during the active 14-day lifecycle.
          </p>
          <p className="type-body-md text-[var(--on-surface)]">
            Communication Data: A valid email address is mandatory during the checkout sequence to facilitate transactional fulfillment, secure digital file delivery links, and physical logistics updates. You bear sole responsibility for the typing accuracy of the email address provided.
          </p>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-lg font-bold text-[var(--on-surface)]">4. Uploaded Content & User Warranties</h2>
          <p className="type-body-md text-[var(--on-surface)]">
            You retain all preexisting intellectual property and ownership rights to the photographic files you transmit to the Site. By uploading any file, you grant GGRetro LLC a limited, worldwide, non-exclusive, royalty-free, fully paid-up, sublicensable license to host, transfer, process, store, alter via AI computational algorithms, and transmit said content solely and exclusively to execute the portrait generation and physical fulfillment requested by you.
          </p>
          <h3 className="pt-2 text-base font-semibold text-[var(--on-surface)]">4.1 Strict User Representations and Warranties</h3>
          <p className="type-body-md text-[var(--on-surface)]">By uploading any photograph to our platform, you unconditionally represent, warrant, and covenant that:</p>
          <ul className="list-disc space-y-2 pl-6 text-[var(--on-surface)]">
            <li>
              <span className="font-semibold">Intellectual Property Compliance:</span> You possess absolute legal ownership, valid licenses, or explicit, documented consent from the copyright holder to utilize and process the photograph through a commercial AI image-to-image pipeline.
            </li>
            <li>
              <span className="font-semibold">Consent of Subjects:</span> You have obtained unambiguous, express permission from every identifiable human individual depicted in the source file to have their facial features, likeness, and biological structure analyzed, modified, and printed.
            </li>
            <li>
              <span className="font-semibold">Protection of Minors:</span> You shall not upload images of any individual under the age of eighteen (18) or the age of majority in your jurisdiction unless you are the biological parent or legal guardian of said minor, or hold certified written authorization from them.
            </li>
            <li>
              <span className="font-semibold">Prohibition of Illicit Content:</span> The uploaded material does not contain, display, or promote nudity, partial nudity, sexually suggestive materials, exploitation, extreme violence, self-harm, hate speech, harassment, defamation, or any illegal or unlawful acts.
            </li>
            <li>
              <span className="font-semibold">Anti-Deception and Deepfake Restrictions:</span> You will not utilize this service to execute malicious impersonation, non-consensual deepfakes of private individuals, or unauthorized commercial exploitation of public figures or celebrities.
            </li>
          </ul>
          <h3 className="pt-2 text-base font-semibold text-[var(--on-surface)]">4.2 Disclaimer of Content and Indemnity Mandate</h3>
          <p className="type-body-md text-[var(--on-surface)]">
            GGRetro LLC operates automated backend systems and does not manually pre-screen or continuously moderate every customer upload. We assume zero civil or criminal liability for the nature of the files uploaded by users. You are solely and exclusively liable for ensuring your actions adhere to local, national, and international intellectual property, privacy, and child protection laws.
          </p>
          <p className="type-body-md text-[var(--on-surface)]">
            Any violation of this Section 4 will result in the immediate termination of your active session, permanent blocking of network access, and the immediate preservation of asset data to be turned over to federal law enforcement or corresponding international agencies (including NCMEC) without liability to the Company.
          </p>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-lg font-bold text-[var(--on-surface)]">5. Intellectual Property and Licensing</h2>
          <h3 className="pt-1 text-base font-semibold text-[var(--on-surface)]">5.1 Digital Asset License</h3>
          <p className="type-body-md text-[var(--on-surface)]">
            Upon successful payment clearance for a generated portrait, the Company grants you a perpetual, non-exclusive, non-transferable, worldwide license to use the unwatermarked digital artwork strictly for Personal, Non-Commercial Use. This encompasses:
          </p>
          <ul className="list-disc space-y-2 pl-6 text-[var(--on-surface)]">
            <li>Displaying the asset on personal digital devices and personal social media profiles.</li>
            <li>Printing physical copies for domestic home decor or personal gifting purposes.</li>
          </ul>
          <p className="type-body-md text-[var(--on-surface)]">
            Strict Commercial Prohibitions: You are expressly forbidden from reselling, sublicensing, bulk-redistributing, or exploiting the digital asset or any derivative print thereof for commercial gain, marketplace sales, merchandise lines, or paid advertising campaigns without a separate corporate commercial contract signed by GGRetro LLC.
          </p>
          <h3 className="pt-1 text-base font-semibold text-[var(--on-surface)]">5.2 Watermarked Content</h3>
          <p className="type-body-md text-[var(--on-surface)]">
            All preview graphics generated on screen contain a permanent digital watermark. This asset structural element remains the exclusive property of the Company. Any attempt to remove, mask, crop, circumvent, or obscure the digital watermark using editing software, screenshot capture manipulations, or script modifications constitutes a material breach of these terms and a violation of copyright law.
          </p>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-lg font-bold text-[var(--on-surface)]">6. Pricing, Financial Transactions, and Refund Framework</h2>
          <h3 className="pt-1 text-base font-semibold text-[var(--on-surface)]">6.1 Monetary Terms</h3>
          <p className="type-body-md text-[var(--on-surface)]">
            All monetary listings on the Site are framed in United States Dollars (USD). Prices are subject to dynamic restructuring at the sole discretion of the Company. Orders completed prior to a pricing modification are insulated from retroactive adjustments.
          </p>
          <h3 className="pt-1 text-base font-semibold text-[var(--on-surface)]">6.2 Payment Settlement and Security</h3>
          <p className="type-body-md text-[var(--on-surface)]">
            Financial checkouts are managed through the secure, PCI-DSS compliant infrastructure of Stripe. Crowned Portraits does not process or retain raw credit/debit card numbers on its corporate servers. By initiating a payment transaction, you bind yourself to Stripe's separate consumer terms. You remain liable for any regional conversion fees or cross-border processing premiums instituted by your banking institution.
          </p>
          <h3 className="pt-1 text-base font-semibold text-[var(--on-surface)]">6.3 Digital Product Refund Policy</h3>
          <p className="type-body-md text-[var(--on-surface)]">
            Due to the instant, high-resolution delivery nature of unwatermarked digital goods, all sales of digital download products are final, binding, and non-refundable once the payment clearing process has finalized and the secure link is generated.
          </p>
          <h3 className="pt-1 text-base font-semibold text-[var(--on-surface)]">6.4 Physical Print-On-Demand Products (Canvases & Frames)</h3>
          <p className="type-body-md text-[var(--on-surface)]">
            Physical items are manufactured dynamically to order through specialized third-party fulfillment networks. These custom-made goods are structurally exempt from standard consumer cooling-off periods or standard unconditional return frameworks.
          </p>
          <p className="type-body-md text-[var(--on-surface)]">
            Damaged or Defective Shipments: If a physical canvas or frame arrives with documented physical damage or severe manufacturing anomalies, you must contact help@turnmeroyal.com within fourteen (14) calendar days from the verified carrier delivery timestamp. You must provide high-resolution photographic evidence of the defective item and packaging. Verified claims will receive a complimentary reprint and replacement dispatch at no supplementary cost.
          </p>
          <p className="type-body-md text-[var(--on-surface)]">
            Aesthetic Dissatisfaction: Disputes regarding perceived artistic quality, color grading variations resulting from uncalibrated monitor screens, or automated stylistic choices made by the AI model are reviewed strictly on a case-by-case basis and do not entitle the user to an automatic refund.
          </p>
          <p className="type-body-md text-[var(--on-surface)]">
            Absolute 14-Day Disputation Bar: By finalizing a transaction on our Site, you explicitly agree that Crowned Portraits is under no legal or financial obligation to process corrections, reprints, or monetary returns if you contact our support infrastructure or open an external financial dispute more than 14 days after the documented carrier delivery date.
          </p>
          <h3 className="pt-1 text-base font-semibold text-[var(--on-surface)]">6.5 Logistics and Carrier Delays</h3>
          <p className="type-body-md text-[var(--on-surface)]">
            Standard transit matrix ranges between 5 to 10 business days depending on the target jurisdiction. While the Company triggers optimized routing to manufacture assets near the consumer's location to mitigate cross-border friction, Crowned Portraits holds no liability for shipping carrier backlogs, customs processing holds, sorting errors, or weather-induced transit delays.
          </p>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-lg font-bold text-[var(--on-surface)]">7. Anti-Abuse and Prohibited Platform Actions</h2>
          <p className="type-body-md text-[var(--on-surface)]">
            You explicitly agree that you shall not utilize the Site, its backend servers, or its application programming interfaces (APIs) to:
          </p>
          <ul className="list-disc space-y-2 pl-6 text-[var(--on-surface)]">
            <li>Deploy automated scrapers, data-mining bots, rapid-peticion scripts, or algorithmic tools designed to bypass frontend elements or extract watermarked content without purchase authorization.</li>
            <li>Overload, stress-test, execute denial-of-service (DoS) strikes, or compromise the integrity of our hosting setups and database arrays.</li>
            <li>Decompile, reverse-engineer, mirror, or extract the specific prompt structures, system parameters, or architectural code defining our connection to underlying model layers.</li>
          </ul>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-lg font-bold text-[var(--on-surface)]">8. Artificial Intelligence Operational Disclaimer</h2>
          <p className="type-body-md font-semibold uppercase tracking-wide text-[var(--on-surface)]">
            PORTRAITS ARE PROCESSED VIA STOCHASTIC COMPUTATIONAL ARTIFICIAL INTELLIGENCE MODELS. THE COMPANY DOES NOT WARRANT OR GUARANTEE METRIC FACIAL EXACTITUDE, PHOTO-REALISTIC REPLICATION, OR PERFECT ANATOMICAL HARMONY. ARTIFACTS, CHROMATIC INCONSISTENCIES, OR UNEXPECTED GENERATIVE INTERPRETATIONS ARE AN INHERENT COMPONENT OF THE TECHNOLOGY. THE FREE PREVIEW PIPELINE IS PROVIDED SPECIFICALLY TO ENABLE SYSTEM CONFORMANCE ASSESSMENT PRIOR TO FINANCIAL EXPENDITURE. SERVICES ARE RENDERED ON AN "AS IS" AND "AS AVAILABLE" MATRIX WITHOUT EXPRESS OR STATUTORY WARRANTIES OF ANY NATURE.
          </p>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-lg font-bold text-[var(--on-surface)]">9. Comprehensive Limitation of Liability</h2>
          <p className="type-body-md font-semibold uppercase tracking-wide text-[var(--on-surface)]">
            TO THE MAXIMUM EXTENT PERMITTED UNDER APPLICABLE LAW, GGRETRO LLC, ALONG WITH ITS DIRECTORS, EMPLOYEES, AFFILIATES, AND THIRD-PARTY LOGISTICS PARTNERS, SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, CONSEQUENTIAL, SPECIAL, OR PUNITIVE DAMAGES. THIS INCLUDES LOSS OF OPERATIONAL REVENUE, PERSONAL DATA LOSS, DOMESTIC DISPUTES, INTELLECTUAL PROPERTY REPRIMANDS, OR MORAL DAMAGES ARISING FROM YOUR EXPLOITATION OF THE SITE'S OUTPUTS.
          </p>
          <p className="type-body-md font-semibold uppercase tracking-wide text-[var(--on-surface)]">
            IN NO EVENT SHALL THE COMBINED AGGREGATE FINANCIAL LIABILITY OF THE COMPANY EXCEED THE LITERAL TOTAL AMOUNT OF MONETARY FUNDS ACQUIRED FROM YOU BY CROWNED PORTRAITS DURING THE TRANSACTION GIVING RISE TO THE SPECIFIC DAMAGE CLAIM.
          </p>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-lg font-bold text-[var(--on-surface)]">10. Indemnification Contract</h2>
          <p className="type-body-md text-[var(--on-surface)]">
            You agree to indemnify, defend, and hold completely harmless GGRetro LLC, its parent structures, corporate officers, operational staff, and infrastructure providers from any third-party legal claims, damage suits, financial fines, civil liabilities, and operational expenses (including administrative legal fees) arising from:
          </p>
          <ul className="list-disc space-y-2 pl-6 text-[var(--on-surface)]">
            <li>Your explicit breach of the warranties and terms contained within this document.</li>
            <li>The copyright, privacy, or moral rights infringement of any photo file you upload into our live server environment.</li>
          </ul>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-lg font-bold text-[var(--on-surface)]">11. Governing Law and Jurisdiction</h2>
          <p className="type-body-md text-[var(--on-surface)]">
            These Terms of Service, along with any external administrative agreements through which we supply features to you, shall be governed by, interpreted, and enforced in accordance with the laws of the United States and the State in which GGRetro LLC is registered, without regard to conflict of law principles. Any explicit legal action, arbitration, or court dispute arising directly from these terms must be litigated exclusively within the competent state or federal courts holding jurisdiction over GGRetro LLC's principal place of business.
          </p>
          <p className="type-body-md text-[var(--on-surface)]">
            If any unique subsection or specific clause within these terms is ruled invalid, illegal, or unenforceable by an authoritative judicial tribunal, that component shall be severed cleanly from the document, and such separation shall not compromise the structural validity and enforceability of all remaining parameters.
          </p>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-lg font-bold text-[var(--on-surface)]">12. Terms Modifications</h2>
          <p className="type-body-md text-[var(--on-surface)]">
            We reserve the exclusive right to update, rewrite, or alter these Terms of Service at any given moment. Any change goes into immediate operational effect the moment it is committed to this webpage URL layout. It remains your duty to monitor this page for textual updates. Your continued interaction with our image generation engine following an update constitutes definitive contract acceptance.
          </p>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-lg font-bold text-[var(--on-surface)]">13. Corporate Contact Information</h2>
          <p className="type-body-md text-[var(--on-surface)]">
            For formal legal notices, system complaints, quality disputes, or data management queries, utilize our dedicated digital help desk:
          </p>
          <p className="type-body-md text-[var(--on-surface)]">Brand Name: Crowned Portraits</p>
          <p className="type-body-md text-[var(--on-surface)]">Operating Entity: GGRetro LLC</p>
          <p className="type-body-md text-[var(--on-surface)]">
            Support Email Address:{" "}
            <a className="font-semibold text-[var(--primary)] underline" href="mailto:help@crownedportraits.com">
              help@crownedportraits.com
            </a>
          </p>
          <p className="type-body-md text-[var(--on-surface)]">
            Core Application Domain:{" "}
            <a className="font-semibold text-[var(--primary)] underline" href="https://www.crownedportraits.com/m" target="_blank" rel="noreferrer">
                www.crownedportraits.com
            </a>
          </p>
        </section>
      </div>
    </main>
  );
}
