import { type ReactElement, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BarChart,
  Calendar,
  CheckCircle,
  Library as LibraryIcon,
  Shield,
  ShoppingCart,
  Users,
} from "lucide-react";

type Tier = "Free" | "Premium";

type Product = {
  id: string;
  name: string;
  description: string;
  category: string;
  pricingModel: "flat" | "usage";
  price?: number;
  pricePerUnit?: number;
  unit?: string;
  dependency?: string;
  tier: Tier;
  icon: ReactElement;
  includedFeatures: string[];
};

type PresetPackage = {
  id: string;
  name: string;
  description: string;
  products: string[];
  patrons: number;
};

const productCatalog: Product[] = [
  {
    id: "aegis",
    name: "FPK Aegis for Public Access",
    description: "CIPA-compliant content filtering and patron data privacy.",
    pricingModel: "usage",
    pricePerUnit: 0,
    unit: "active patron/mo",
    category: "Foundation",
    tier: "Free",
    icon: <Shield className="h-6 w-6" />,
    includedFeatures: [
      "AI-powered content filtering (CIPA aligned)",
      "Patron data anonymization",
      "Secure public Wi-Fi integration",
      "Threat & misuse reporting",
    ],
  },
  {
    id: "resource_hub_basic",
    name: "Digital Resource Hub (Basic)",
    description: "Core digital books and media for every patron.",
    pricingModel: "flat",
    price: 0,
    category: "Applications",
    tier: "Free",
    icon: <LibraryIcon className="h-6 w-6" />,
    includedFeatures: [
      "E-book & audiobook integration (public domain)",
      "Access to FPK open courseware",
      "Basic patron dashboards",
    ],
  },
  {
    id: "resource_hub_premium",
    name: "Digital Resource Hub (Premium)",
    description: "Licensed content, premium courses, and streaming.",
    pricingModel: "flat",
    price: 500,
    category: "Applications",
    tier: "Premium",
    icon: <LibraryIcon className="h-6 w-6" />,
    includedFeatures: [
      "All Basic features",
      "Licensed courseware access (e.g., LinkedIn Learning)",
      "Video & media streaming partnerships",
      "Personalized learning paths",
    ],
  },
  {
    id: "events_platform",
    name: "Community Events Platform",
    description: "Manage event calendars, registrations, and virtual events.",
    pricingModel: "flat",
    price: 250,
    category: "Applications",
    tier: "Premium",
    icon: <Calendar className="h-6 w-6" />,
    includedFeatures: [
      "Public event calendar",
      "Online registration & ticketing",
      "Virtual & hybrid event hosting",
      "Attendance tracking",
    ],
  },
  {
    id: "community_nexus",
    name: "Patron Community Nexus",
    description: "Safe, moderated forums for book clubs and local groups.",
    pricingModel: "flat",
    price: 300,
    category: "Applications",
    tier: "Premium",
    icon: <Users className="h-6 w-6" />,
    includedFeatures: [
      "AI-moderated discussion groups",
      "Local interest group spaces",
      "Librarian-led forums",
      "Patron-to-patron messaging control",
    ],
  },
  {
    id: "patron_analytics",
    name: "Patron Analytics",
    description: "Understand resource usage and community engagement.",
    pricingModel: "flat",
    price: 400,
    category: "Features",
    tier: "Premium",
    dependency: "resource_hub_premium",
    icon: <BarChart className="h-6 w-6" />,
    includedFeatures: [
      "Resource circulation reports",
      "Patron engagement dashboards",
      "Community needs analysis",
      "Demographic usage insights (anonymized)",
    ],
  },
];

const categories = ["Foundation", "Applications", "Features"];

const presetPackages: PresetPackage[] = [
  {
    id: "free",
    name: "Community Access Plan",
    description: "Essential digital tools, completely free.",
    products: ["aegis", "resource_hub_basic"],
    patrons: 1000,
  },
  {
    id: "single_branch",
    name: "Single Branch Essentials",
    description: "Core premium services for a local library.",
    products: ["aegis", "resource_hub_premium", "events_platform"],
    patrons: 5000,
  },
  {
    id: "county_system",
    name: "County System",
    description: "Multi-branch system with analytics.",
    products: ["aegis", "resource_hub_premium", "events_platform", "patron_analytics"],
    patrons: 50000,
  },
  {
    id: "digital_first",
    name: "Digital-First Library",
    description: "Complete suite for the modern digital branch.",
    products: [
      "aegis",
      "resource_hub_premium",
      "events_platform",
      "community_nexus",
      "patron_analytics",
    ],
    patrons: 100000,
  },
];

const LibrariesConfigurePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [expandedProducts, setExpandedProducts] = useState<string[]>([]);
  const [patrons, setPatrons] = useState<number>(1000);
  const [activePackage, setActivePackage] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("plan") === "free") {
      const freePkg = presetPackages.find((p) => p.id === "free");
      if (freePkg) {
        setActivePackage(freePkg.id);
        setSelectedProducts(freePkg.products);
        setPatrons(freePkg.patrons);
      }
    }
  }, [location.search]);

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
      setPatrons(pkg.patrons);
    }
  };

  const { flatPrice, usageBasedPrice } = useMemo(() => {
    const flat = selectedProducts.reduce((total, productId) => {
      const product = productCatalog.find(
        (p) => p.id === productId && p.pricingModel === "flat"
      );
      return total + (product?.price || 0);
    }, 0);

    const aegis = productCatalog.find((p) => p.id === "aegis");
    const usage =
      selectedProducts.includes("aegis") && aegis?.pricePerUnit
        ? aegis.pricePerUnit * patrons
        : 0;

    return { flatPrice: flat, usageBasedPrice: usage };
  }, [selectedProducts, patrons]);

  const totalPrice = flatPrice + usageBasedPrice;

  const handleCreateOrganization = () => {
    const params = new URLSearchParams();
    params.append("plan", "library_custom");
    params.append("patrons", patrons.toString());
    selectedProducts.forEach((id) => params.append("products", id));
    navigate(`/access?${params.toString()}`);
  };

  const renderPrice = (product: Product) => {
    if ((product.price ?? 0) === 0 && (product.pricePerUnit ?? 0) === 0) {
      return <span className="font-bold text-green-600">Free</span>;
    }
    if (product.pricingModel === "flat") return `+$${product.price}/mo`;
    return `+$${product.pricePerUnit}/${product.unit}`;
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-14 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            Build Your Library&apos;s Digital Branch
          </h1>
          <p className="mt-4 mx-auto max-w-2xl text-lg text-slate-600">
            Select a curated package or compose the perfect digital solution for your community.
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
                                    <div className="flex items-center gap-2">
                                      <p className="text-base font-semibold text-slate-900">
                                        {product.name}
                                      </p>
                                      <span
                                        className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                                          product.tier === "Free"
                                            ? "bg-green-100 text-green-800"
                                            : "bg-purple-100 text-purple-800"
                                        }`}
                                      >
                                        {product.tier}
                                      </span>
                                    </div>
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
                    Number of Active Patrons
                  </label>
                  <input
                    id="patrons"
                    type="number"
                    min={0}
                    step={100}
                    value={patrons}
                    onChange={(e) => {
                      const next = parseInt(e.target.value, 10);
                      setPatrons(Number.isNaN(next) ? 0 : next);
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
                        <ShoppingCart className="mx-auto mb-2 h-6 w-6" />
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
                    ${totalPrice.toLocaleString()}
                    <span className="text-lg font-medium text-slate-500">
                      {" "}
                      / mo
                    </span>
                  </p>
                  <p className="text-xs font-medium text-slate-500">
                    Based on flat-rate and usage-based pricing.
                  </p>
                </div>

                <button
                  onClick={handleCreateOrganization}
                  disabled={selectedProducts.length === 0}
                  className="inline-flex w-full items-center justify-center rounded-full bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-indigo-500/30 transition hover:-translate-y-0.5 hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-400"
                >
                  Create Institution <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LibrariesConfigurePage;
