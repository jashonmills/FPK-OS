import Header from "./Header";
import Hero from "./Hero";
import AudienceSegments from "./AudienceSegments";
import ProductPillars from "./ProductPillars";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Header />
      <main>
        <Hero />
        <AudienceSegments />
        <ProductPillars />
      </main>
    </div>
  );
};

export default LandingPage;
