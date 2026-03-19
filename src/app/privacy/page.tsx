import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-[700px] px-4 sm:px-6 py-12 sm:py-16">
        <h1 className="text-[28px] sm:text-[36px] font-semibold tracking-tight mb-8">Privacy Policy</h1>
        <p className="text-[14px] text-muted-foreground mb-8">Last updated: March 19, 2026</p>

        <div className="space-y-8 text-[15px] leading-relaxed text-foreground">
          <section>
            <h2 className="text-[18px] font-medium mb-3">1. Information We Collect</h2>
            <p>When you use RemoteGig, we collect the following information:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1 text-foreground">
              <li>Account information (name, email) when you sign in with Google</li>
              <li>Usage data (pages viewed, jobs clicked) via OpenPanel analytics</li>
              <li>Payment information processed securely through Stripe</li>
              <li>Contact form submissions (name, email, message)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-[18px] font-medium mb-3">2. How We Use Your Information</h2>
            <ul className="list-disc pl-6 space-y-1 text-foreground">
              <li>To provide and improve the RemoteGig service</li>
              <li>To process payments and manage subscriptions</li>
              <li>To send job alerts and notifications (with your consent)</li>
              <li>To respond to your support requests</li>
              <li>To analyze usage patterns and improve user experience</li>
            </ul>
          </section>

          <section>
            <h2 className="text-[18px] font-medium mb-3">3. Third-Party Services</h2>
            <p>We use the following third-party services:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1 text-foreground">
              <li><strong>Neon</strong> (database hosting and authentication)</li>
              <li><strong>Stripe</strong> (payment processing)</li>
              <li><strong>Google OAuth</strong> (sign-in authentication)</li>
              <li><strong>OpenPanel</strong> (self-hosted analytics)</li>
              <li><strong>Cloudflare</strong> (hosting and CDN)</li>
              <li><strong>ZeptoMail</strong> (transactional emails)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-[18px] font-medium mb-3">4. Data Security</h2>
            <p>We implement appropriate security measures to protect your personal information. Payment data is handled entirely by Stripe and never stored on our servers.</p>
          </section>

          <section>
            <h2 className="text-[18px] font-medium mb-3">5. Your Rights</h2>
            <p>You can request to access, update, or delete your personal data at any time by contacting us. You can also cancel your subscription directly from your account page.</p>
          </section>

          <section>
            <h2 className="text-[18px] font-medium mb-3">6. Contact</h2>
            <p>For any privacy-related questions, reach out at <a href="/contact" className="text-primary hover:underline">remotegig.pro/contact</a>.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
