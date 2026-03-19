import type { Metadata } from "next";

export const metadata: Metadata = { title: "Terms of Service" };

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-[700px] px-4 sm:px-6 py-12 sm:py-16">
        <h1 className="text-[28px] sm:text-[36px] font-semibold tracking-tight mb-8">Terms of Service</h1>
        <p className="text-[14px] text-muted-foreground mb-8">Last updated: March 19, 2026</p>

        <div className="space-y-8 text-[15px] leading-relaxed text-foreground">
          <section>
            <h2 className="text-[18px] font-medium mb-3">1. Service Description</h2>
            <p>RemoteGig is a remote job aggregator that collects job listings from public sources across the internet. We do not guarantee the accuracy, availability, or legitimacy of any job listing. Users should independently verify all opportunities before applying.</p>
          </section>

          <section>
            <h2 className="text-[18px] font-medium mb-3">2. Accounts</h2>
            <p>You can create an account using Google sign-in. You are responsible for maintaining the security of your account. You must provide accurate information when creating your account.</p>
          </section>

          <section>
            <h2 className="text-[18px] font-medium mb-3">3. Subscriptions and Payments</h2>
            <ul className="list-disc pl-6 space-y-1 text-foreground">
              <li><strong>Free plan:</strong> Browse all jobs with limited detail views (3 per day)</li>
              <li><strong>Pro plan:</strong> $9/month, unlimited access, email alerts, application tracker</li>
              <li>Payments are processed through Stripe</li>
              <li>Subscriptions renew automatically each month</li>
              <li>You can cancel anytime from your account page. No refunds for partial months</li>
            </ul>
          </section>

          <section>
            <h2 className="text-[18px] font-medium mb-3">4. Acceptable Use</h2>
            <p>You agree not to:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1 text-foreground">
              <li>Scrape, copy, or redistribute job listings from RemoteGig</li>
              <li>Use the service for any unlawful purpose</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Create multiple accounts to bypass free tier limits</li>
            </ul>
          </section>

          <section>
            <h2 className="text-[18px] font-medium mb-3">5. Disclaimer</h2>
            <p>RemoteGig is provided &quot;as is&quot; without warranties of any kind. We aggregate jobs from third-party sources and are not responsible for the content of those listings. We do not guarantee employment outcomes.</p>
          </section>

          <section>
            <h2 className="text-[18px] font-medium mb-3">6. Changes to Terms</h2>
            <p>We may update these terms from time to time. Continued use of RemoteGig after changes constitutes acceptance of the new terms.</p>
          </section>

          <section>
            <h2 className="text-[18px] font-medium mb-3">7. Contact</h2>
            <p>Questions about these terms? Reach out at <a href="/contact" className="text-primary hover:underline">remotegig.pro/contact</a>.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
