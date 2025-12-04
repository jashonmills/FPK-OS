import { type ReactElement, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Bot,
  CheckCircle,
  FileText,
  Shield,
  Users,
  Workflow,
} from "lucide-react";

type Product = {
  id: string;
  name: string;
  description: string;
  category: string;
  pricingModel: "per_seat" | "usage";
  pricePerSeat?: number;
  pricePerUnit?: number;
  unit?: string;
  dependency?: string;
  icon: ReactElement;
  includedFeatures: string[];
};

type PresetPackage = {
  id: string;
  name: string;
  description: string;
  products: string[];
  seats: number;
};

const productCatalog: Product[] = [
  {
    id: "aegis",
    name: "FPK Aegis for Healthcare",
    description: "HIPAA-compliant AI safety and data privacy layer.",
    pricingModel: "usage",
    pricePerUnit: 1,
    unit: "PHI record/mo",
    category: "Foundation",
    icon: <Shield className="h-6 w-6" />,
    includedFeatures: [
      "End-to-end encryption (E2EE)",
      "Business Associate Agreement (BAA) included",
      "PHI access logging & audits",
      "AI content moderation for PHI",
    ],
  },
  {
    id: "x",
    name: "FPK-X Clinical Data",
    description: "Core clinical data intelligence and reporting platform.",
    pricingModel: "per_seat",
    pricePerSeat: 49,
    category: "Applications",
    icon: <Bot className="h-6 w-6" />,
    includedFeatures: [
      "Behavior & skill tracking (27+ chart types)",
      "Session note generation",
      "FBA and BIP tools",
      "Real-time clinical data dashboards",
    ],
  },
  {
    id: "pulse",
    name: "FPK Pulse for Clinics",
    description: "Practice operations and staff management.",
    pricingModel: "per_seat",
    pricePerSeat: 25,
    category: "Applications",
    icon: <Workflow className="h-6 w-6" />,
    includedFeatures: [
      "Staff scheduling & timesheets",
      "Internal task management",
      "Secure document storage",
      "Team communication channels",
    ],
  },
  {
    id: "parent_portal",
    name: "FPK Nexus Parent Portal",
    description: "Secure communication and progress sharing with families.",
    pricingModel: "per_seat",
    pricePerSeat: 10,
    category: "Applications",
    icon: <Users className="h-6 w-6" />,
    includedFeatures: [
      "Secure messaging with parents",
      "Shareable progress reports & graphs",
      "Appointment & document sharing",
      "Family-facing resource library",
    ],
  },
  {
    id: "billing_automation",
    name: "Insurance Billing Automation",
    description: "Automate claims and reduce administrative overhead.",
    pricingModel: "per_seat",
    pricePerSeat: 30,
    category: "Features",
    dependency: "x",
    icon: <FileText className="h-6 w-6" />,
    includedFeatures: [
      "CPT code suggestion engine",
      "Automated claim form generation (CMS 1500)",
      "Clearinghouse integration",
      "Rejection & denial management",
    ],
  },
];

const categories = ["Foundation", "Applications", "Features"];

const presetPackages: PresetPackage[] = [
  {
    id: "solo",
    name: "Solo Practitioner",
    description: "Essential tools for an independent practice.",
    products: ["aegis", "x"],
    seats: 1,
  },
  {
    id: "small_clinic",
    name: "Small Clinic Suite",
    description: "For growing teams that need collaboration.",
    products: ["aegis", "x", "pulse"],
    seats: 5,
  },
  {
    id: "full_family",
    name: "Family Engagement Package",
    description: "Clinical data plus parent communication.",
    products: ["aegis", "x", "parent_portal"],
    seats: 10,
  },
  {
    id: "enterprise",
    name: "Multi-Location Enterprise",
    description: "The complete, automated practice OS.",
    products: ["aegis", "x", "pulse", "parent_portal", "billing_automation"],
    seats: 50,
  },
];

const TherapyConfigurePage = () => {
  const navigate = useNavigate();
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [expandedProducts, setExpandedProducts] = useState<string[]>([]);
  const [seats, setSeats] = useState<number>(10);
  const [activePackage, setActivePackage] = useState<string | null>(null);

  const handleProductToggle = (product: Product) => {
    setActivePackage(null);
    const isSelected = selectedProducts.includes(product.id);
    let nextSelection = [...selectedProducts];

    if (isSelected) {
      nextSelection = nextSelection.filter((id) => id !== product.id);
      productCatalog.forEach((p) => {
        if (p.dependency === product.id) {
          nextSelection = nextSelection.filter((id) => id !== p.id);
        }
      });
    } else {
      nextSelection.push(product.id);
      if (product.dependency && !nextSelection.includes(product.dependency)) {
        nextSelection.push(product.dependency);
      }
    }

    setSelectedProducts(nextSelection);
  };

  const toggleExpanded = (id: string) => {
    setExpandedProducts((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };

  const selectPackage = (pkg: PresetPackage) => {
    if (activePackage === pkg.id) {
      setActivePackage(null);
      setSelectedProducts([]);
    } else {
      setActivePackage(pkg.id);
      setSelectedProducts(pkg.products);
      setSeats(pkg.seats);
    }
  };

  const { seatBasedPrice, usageBasedItems } = useMemo(() => {
    const seatBasedCostPerSeat = selectedProducts.reduce((total, productId) => {
      const product = productCatalog.find(
        (p) => p.id === productId && p.pricingModel === "per_seat"
      );
      return total + (product?.pricePerSeat || 0);
    }, 0);

    const usageItems = selectedProducts
      .map((id) =>
        productCatalog.find(
          (p) => p.id === id && p.pricingModel === "usage"
        )
      )
      .filter(Boolean) as Product[];

    return { seatBasedPrice: seatBasedCostPerSeat * seats, usageBasedItems: usageItems };
  }, [selectedProducts, seats]);

  const handleCreateOrganization = () => {
    const params = new URLSearchParams();
    params.append("plan", "therapy_custom");
    params.append("seats", seats.toString());
    selectedProducts.forEach((id) => params.append("products", id));
    navigate(`/access?${params.toString()}`);
  };

  const renderPrice = (product: Product) =>
    product.pricingModel === "per_seat"
      ? `+$${product.pricePerSeat}/seat/mo`
      : `+$${product.pricePerUnit}/${product.unit}`;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-14 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            Build Your Practice&apos;s OS
          </h1>
          <p className="mt-4 mx-auto max-w-2xl text-lg text-slate-600">
            Select a curated package or compose the perfect solution for your clinic.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
          <div className="space-y-8 lg:col-span-2">
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-md">
              <div className="border-b border-slate-100 px-6 py-4">
                <h2 className="text-xl font-semibold text-slate-900">
                  1. Start with a Package
                </h2>
              </div>
              <div className="grid gap-4 bg-white/60 p-6 sm:grid-cols-2 lg:grid-cols-3">
                {presetPackages.map((pkg) => (
                  <button
                    key={pkg.id}
                    onClick={() => selectPackage(pkg)}
                    className={`h-full rounded-xl border-2 p-4 text-left transition-all duration-200 ${
                      activePackage === pkg.id
                        ? "border-indigo-500 bg-indigo-50 shadow-lg shadow-indigo-200"
                        : "border-slate-200 bg-white hover:-translate-y-0.5 hover:border-indigo-400 hover:shadow-md"
                    }`}
                  >
                    <span className="text-base font-bold text-slate-900">
                      {pkg.name}
                    </span>
                    <p className="mt-1 text-sm text-slate-600">{pkg.description}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white shadow-md">
              <div className="border-b border-slate-100 px-6 py-4">
                <h2 className="text-xl font-semibold text-slate-900">
                  2. Compose Your Solution
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  Expand any item to see what&apos;s included. Dependencies are handled automatically.
                </p>
              </div>
              <div className="space-y-8 bg-white/60 p-6">
                {categories.map((category) => (
                  <div key={category}>
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-600">
                      {category}
                    </h3>
                    <div className="mt-3 space-y-4">
                      {productCatalog
                        .filter((p) => p.category === category)
                        .map((product) => {
                          const isSelected = selectedProducts.includes(product.id);
                          const dependencyMet =
                            !product.dependency ||
                            selectedProducts.includes(product.dependency);
                          const isExpanded = expandedProducts.includes(product.id);

                          return (
                            <div
                              key={product.id}
                              className={`rounded-xl border p-4 transition-all duration-200 ${
                                isSelected
                                  ? "border-indigo-300 bg-indigo-50 shadow-sm"
                                  : "border-slate-200 bg-white hover:border-indigo-200 hover:shadow"
                              } ${!dependencyMet ? "opacity-80" : ""}`}
                            >
                              <button
                                type="button"
                                onClick={() => toggleExpanded(product.id)}
                                className="flex w-full items-center justify-between text-left"
                              >
                                <div className="flex items-center gap-4">
                                  <div className="text-indigo-600">{product.icon}</div>
                                  <div>
                                    <p className="text-base font-semibold text-slate-900">
                                      {product.name}
                                    </p>
                                    <p className="text-sm text-slate-600">
                                      {product.description}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-3">
                                  <span className="text-sm font-semibold text-indigo-600">
                                    {renderPrice(product)}
                                  </span>
                                  <input
                                    type="checkbox"
                                    className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-2 focus:ring-indigo-500"
                                    checked={isSelected}
                                    disabled={!dependencyMet}
                                    onChange={(e) => {
                                      e.stopPropagation();
                                      handleProductToggle(product);
                                    }}
                                    onClick={(e) => e.stopPropagation()}
                                  />
                                </div>
                              </button>

                              {product.dependency && (
                                <p className="mt-2 pl-10 text-xs text-slate-500">
                                  Requires{" "}
                                  {
                                    productCatalog.find(
                                      (p) => p.id === product.dependency
                                    )?.name
                                  }
                                </p>
                              )}

                              {isExpanded && (
                                <div className="mt-4 border-t border-slate-200 pt-3 pl-10">
                                  <h4 className="text-sm font-semibold text-slate-800">
                                    What&apos;s included
                                  </h4>
                                  <ul className="mt-2 space-y-1 text-sm text-slate-600">
                                    {product.includedFeatures.map((feature) => (
                                      <li key={feature} className="flex items-start gap-2">
                                        <CheckCircle className="mt-[2px] h-3.5 w-3.5 text-emerald-500" />
                                        <span>{feature}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          );
                        })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-10 rounded-2xl border-2 border-indigo-200 bg-white shadow-lg shadow-indigo-500/10">
              <div className="border-b border-indigo-100 px-6 py-5">
                <h3 className="text-2xl font-semibold text-slate-900">
                  Your Custom Solution
                </h3>
                <p className="mt-1 text-sm text-slate-600">
                  Review selections and proceed to create your organization.
                </p>
              </div>
              <div className="space-y-6 px-6 py-5">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-800">
                    Number of Clinicians (Seats)
                  </label>
                  <input
                    id="seats"
                    type="number"
                    min={0}
                    step={1}
                    value={seats}
                    onChange={(e) => {
                      const next = parseInt(e.target.value, 10);
                      setSeats(Number.isNaN(next) ? 0 : next);
                    }}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-inner focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                  />
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-slate-800">
                    Selected Products:
                  </h4>
                  <div className="mt-3 space-y-3 rounded-md bg-slate-50 p-3 text-sm">
                    {selectedProducts.length === 0 && (
                      <div className="text-center text-slate-500">
                        Select a product to begin.
                      </div>
                    )}
                    {productCatalog
                      .filter((p) => selectedProducts.includes(p.id))
                      .sort(
                        (a, b) =>
                          categories.indexOf(a.category) -
                          categories.indexOf(b.category)
                      )
                      .map((product) => (
                        <div key={product.id} className="space-y-1">
                          <div className="flex items-start text-slate-800">
                            <CheckCircle className="mr-2 mt-[2px] h-4 w-4 text-green-500" />
                            <span className="font-medium">{product.name}</span>
                          </div>
                          <ul className="ml-6 list-disc space-y-1 text-xs text-slate-600">
                            {product.includedFeatures.map((feature) => (
                              <li key={feature}>{feature}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                  </div>
                </div>

                <div className="rounded-xl bg-indigo-50 p-4">
                  <p className="text-sm font-semibold text-indigo-800">
                    Estimated Monthly Price
                  </p>
                  <p className="text-4xl font-bold text-slate-900">
                    ${seatBasedPrice.toLocaleString()}
                    <span className="text-lg font-medium text-slate-500">
                      {" "}
                      / mo
                    </span>
                  </p>
                  {usageBasedItems.map((item) => (
                    <p
                      key={item.id}
                      className="text-xs font-medium text-slate-600"
                    >
                      + ${item.pricePerUnit} / {item.unit}
                    </p>
                  ))}
                </div>

                <button
                  onClick={handleCreateOrganization}
                  disabled={selectedProducts.length === 0}
                  className="inline-flex w-full items-center justify-center rounded-full bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-indigo-500/30 transition hover:-translate-y-0.5 hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-400"
                >
                  Create Practice <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TherapyConfigurePage;
