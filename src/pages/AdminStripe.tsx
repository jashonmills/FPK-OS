import { AppLayout } from "@/components/layout/AppLayout";
import { StripeIntegrationStatus } from "@/components/admin/StripeIntegrationStatus";

const AdminStripe = () => {
  return (
    <AppLayout>
      <div className="container max-w-4xl mx-auto py-6 px-3 sm:px-4 md:px-6">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold">Stripe Integration</h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-2">
            Monitor and test your Stripe payment integration
          </p>
        </div>
        <StripeIntegrationStatus />
      </div>
    </AppLayout>
  );
};

export default AdminStripe;
