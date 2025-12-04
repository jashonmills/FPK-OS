import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CookiePolicy = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          <h1 className="text-4xl font-bold mb-2">Cookie Policy</h1>
          <p className="text-muted-foreground mb-8">Last updated: {new Date().toLocaleDateString()}</p>

          <div className="prose prose-slate dark:prose-invert max-w-none space-y-6">
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">1. What Are Cookies?</h2>
              <p className="text-muted-foreground">
                Cookies are small text files placed on your device when you visit our app. They help us provide and improve our services, remember your preferences, and understand how you use our platform.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">2. Types of Cookies We Use</h2>
              
              <h3 className="text-xl font-semibold">2.1 Essential Cookies</h3>
              <p className="text-muted-foreground">
                These cookies are necessary for the app to function properly. They enable core functionality such as:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>User authentication and session management</li>
                <li>Security features and fraud prevention</li>
                <li>Load balancing and performance optimization</li>
                <li>Remembering your privacy preferences</li>
              </ul>
              <p className="text-muted-foreground mt-2">
                <strong>Duration:</strong> Session cookies (deleted when you close the app) or up to 1 year
              </p>

              <h3 className="text-xl font-semibold mt-4">2.2 Functional Cookies</h3>
              <p className="text-muted-foreground">
                These cookies remember your choices and preferences:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Selected family and student profiles</li>
                <li>Language and region preferences</li>
                <li>Theme settings (dark/light mode)</li>
                <li>Customized dashboard layouts</li>
              </ul>
              <p className="text-muted-foreground mt-2">
                <strong>Duration:</strong> Up to 1 year
              </p>

              <h3 className="text-xl font-semibold mt-4">2.3 Analytics Cookies</h3>
              <p className="text-muted-foreground">
                These cookies help us understand how you use the app so we can improve it:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Pages visited and features used</li>
                <li>Time spent on different sections</li>
                <li>Error reports and performance metrics</li>
                <li>User flow and navigation patterns</li>
              </ul>
              <p className="text-muted-foreground mt-2">
                <strong>Duration:</strong> Up to 2 years
              </p>
              <p className="text-muted-foreground">
                We use anonymized data and do not track personal health information through analytics cookies.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">3. Local Storage and Session Storage</h2>
              <p className="text-muted-foreground">
                In addition to cookies, we use browser local storage and session storage to:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Cache data for offline functionality</li>
                <li>Store temporary form data to prevent loss</li>
                <li>Improve app performance and loading times</li>
                <li>Remember your app state between sessions</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">4. Third-Party Cookies</h2>
              <p className="text-muted-foreground">
                We use carefully selected third-party services that may set their own cookies:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li><strong>Authentication Services:</strong> For secure login functionality</li>
                <li><strong>Cloud Infrastructure:</strong> For data storage and hosting</li>
                <li><strong>Payment Processing:</strong> For subscription management (Stripe)</li>
                <li><strong>Analytics Services:</strong> For understanding app usage (anonymized)</li>
              </ul>
              <p className="text-muted-foreground mt-2">
                All third-party services are HIPAA-compliant and bound by strict data protection agreements.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">5. How to Control Cookies</h2>
              
              <h3 className="text-xl font-semibold">5.1 Cookie Preferences</h3>
              <p className="text-muted-foreground">
                You can manage your cookie preferences through our Cookie Consent banner when you first use the app, or by accessing Settings → Privacy → Cookie Preferences.
              </p>

              <h3 className="text-xl font-semibold mt-4">5.2 Browser Settings</h3>
              <p className="text-muted-foreground">
                Most browsers allow you to:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>View and delete cookies</li>
                <li>Block third-party cookies</li>
                <li>Block all cookies (may affect functionality)</li>
                <li>Delete cookies when you close the browser</li>
              </ul>

              <h3 className="text-xl font-semibold mt-4">5.3 Mobile App Settings</h3>
              <p className="text-muted-foreground">
                On mobile devices, you can manage tracking through:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li><strong>iOS:</strong> Settings → Privacy & Security → Tracking</li>
                <li><strong>Android:</strong> Settings → Google → Ads → Opt out of Ads Personalization</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">6. Impact of Disabling Cookies</h2>
              <p className="text-muted-foreground">
                If you disable certain cookies, some features may not work properly:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>You may need to log in each time you use the app</li>
                <li>Your preferences and settings won't be saved</li>
                <li>Some features may not function correctly</li>
                <li>You may experience reduced performance</li>
              </ul>
              <p className="text-muted-foreground mt-2">
                Essential cookies cannot be disabled as they are necessary for the app to function.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">7. GDPR Compliance</h2>
              <p className="text-muted-foreground">
                Under GDPR, you have the right to:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Know what cookies we use and why</li>
                <li>Give or withdraw consent for non-essential cookies</li>
                <li>Access information stored in cookies</li>
                <li>Request deletion of cookie data</li>
              </ul>
              <p className="text-muted-foreground mt-2">
                We only use non-essential cookies with your explicit consent, which you can withdraw at any time.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">8. Updates to This Policy</h2>
              <p className="text-muted-foreground">
                We may update this Cookie Policy to reflect changes in technology, legal requirements, or our practices. We will notify you of significant changes through the app or by email.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">9. Cookie List</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse border border-border">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border border-border p-2 text-left">Cookie Name</th>
                      <th className="border border-border p-2 text-left">Type</th>
                      <th className="border border-border p-2 text-left">Purpose</th>
                      <th className="border border-border p-2 text-left">Duration</th>
                    </tr>
                  </thead>
                  <tbody className="text-muted-foreground">
                    <tr>
                      <td className="border border-border p-2">sb-access-token</td>
                      <td className="border border-border p-2">Essential</td>
                      <td className="border border-border p-2">User authentication</td>
                      <td className="border border-border p-2">1 hour</td>
                    </tr>
                    <tr>
                      <td className="border border-border p-2">sb-refresh-token</td>
                      <td className="border border-border p-2">Essential</td>
                      <td className="border border-border p-2">Session renewal</td>
                      <td className="border border-border p-2">30 days</td>
                    </tr>
                    <tr>
                      <td className="border border-border p-2">user-preferences</td>
                      <td className="border border-border p-2">Functional</td>
                      <td className="border border-border p-2">Store user settings</td>
                      <td className="border border-border p-2">1 year</td>
                    </tr>
                    <tr>
                      <td className="border border-border p-2">selected-family</td>
                      <td className="border border-border p-2">Functional</td>
                      <td className="border border-border p-2">Remember active family</td>
                      <td className="border border-border p-2">1 year</td>
                    </tr>
                    <tr>
                      <td className="border border-border p-2">cookie-consent</td>
                      <td className="border border-border p-2">Essential</td>
                      <td className="border border-border p-2">Remember cookie choices</td>
                      <td className="border border-border p-2">1 year</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">10. Contact Us</h2>
              <p className="text-muted-foreground">
                If you have questions about our use of cookies:
              </p>
              <div className="text-muted-foreground pl-6 space-y-1">
                <p>Email: privacy@fpxcns.app</p>
                <p>Support: support@fpxcns.app</p>
              </div>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CookiePolicy;