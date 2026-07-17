import { Check, Zap, Server, Rocket, Sparkles } from "lucide-react";
import React from "react";

// Types
interface PricingCardProps {
  title: string;
  price: string;
  description: string;
  features: string[];
  isPopular?: boolean;
  isUpcoming?: boolean;
  buttonText?: string;
  onSelect?: (title: string) => void;
  icon: React.ElementType;
  badgeText?: string;
}

// interface FeatureHighlightProps {
//   icon: React.ElementType;
//   title: string;
//   description: string;
// }

// Pricing Card Component
const PricingCard = ({
  title,
  price,
  description,
  features,
  isPopular = false,
  isUpcoming = false,
  buttonText = "Get Started",
  onSelect,
  icon: Icon,
  badgeText,
}: PricingCardProps) => {
  return (
    <div
      className={`relative rounded-3xl border bg-white p-8 transition-all hover:shadow-xl ${
        isPopular ? "border-blue-600 shadow-lg" : "border-slate-200"
      } ${isUpcoming ? "opacity-75 grayscale" : ""}`}
    >
      {isPopular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 px-4 py-1 text-sm font-semibold text-white">
          Most Popular
        </div>
      )}
      
      {isUpcoming && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-orange-500 px-4 py-1 text-sm font-semibold text-white">
          {badgeText || "Coming Soon"}
        </div>
      )}

      <div className="flex items-center gap-3">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
            isPopular
              ? "bg-blue-100 text-blue-600"
              : isUpcoming
              ? "bg-orange-100 text-orange-600"
              : "bg-slate-100 text-slate-600"
          }`}
        >
          {Icon && <Icon size={24} />}
        </div>
        <div>
          <h3 className="text-xl font-bold">{title}</h3>
        </div>
      </div>

      <div className="mt-4">
        {price === "Custom" ? (
          <span className="text-4xl font-bold">{price}</span>
        ) : (
          <>
            <span className="text-4xl font-bold">${price}</span>
            <span className="text-slate-500">/month</span>
          </>
        )}
      </div>

      <p className="mt-2 text-slate-600">{description}</p>

      <ul className="mt-6 space-y-3">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3">
            <Check size={18} className="mt-0.5 shrink-0 text-green-600" />
            <span className="text-sm text-slate-600">{feature}</span>
          </li>
        ))}
      </ul>

      <button
        onClick={() => onSelect && onSelect(title)}
        disabled={isUpcoming}
        className={`mt-8 w-full rounded-xl px-4 py-3 font-semibold transition ${
          isUpcoming
            ? "cursor-not-allowed bg-slate-300 text-slate-600"
            : isPopular
            ? "bg-blue-600 text-white hover:bg-blue-700"
            : "border-2 border-slate-200 text-slate-700 hover:bg-slate-50"
        }`}
      >
        {isUpcoming ? "Coming Soon" : buttonText}
      </button>
    </div>
  );
};

// Feature Highlight Component
// const FeatureHighlight = ({ icon: Icon, title, description }: FeatureHighlightProps) => {
//   return (
//     <div className="rounded-xl border p-6 text-center">
//       <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">
//         <Icon size={24} />
//       </div>
//       <h3 className="font-semibold">{title}</h3>
//       <p className="mt-2 text-sm text-slate-600">{description}</p>
//     </div>
//   );
// };

// Main Pricing Page Component
export default function PricingPage() {
//   const [selectedPlan, setSelectedPlan] = React.useState<string | null>(null);
  const [isYearly, setIsYearly] = React.useState(false);

  const plans = [
    {
      title: "Free",
      price: "0",
      description: "Perfect for getting started with ChatOps for a single cluster",
      icon: Rocket,
      isPopular: true,
      features: [
        "1 Kubernetes cluster",
        "1 agent per cluster",
        "Telegram integration",
        "Discord integration",
        "Slack integration (Coming Soon)",
        "Real-time alerts",
        "Community support",
        "Basic analytics",
      ],
    },
    {
      title: "Pro",
      price: isYearly ? "49" : "79",
      description: "Ideal for growing teams needing advanced features",
      icon: Zap,
      isUpcoming: true,
      badgeText: "Coming Q3 2026",
      features: [
        "5 Kubernetes clusters",
        "3 agents per cluster",
        "3 chat platform integrations",
        "500 WebSocket connections",
        "30-day log retention",
        "20 alert rules",
        "Priority support",
        "Advanced analytics",
        "Custom integrations",
        "99.9% SLA guarantee",
      ],
    },
    {
      title: "Enterprise",
      price: "Custom",
      description: "For large organizations with complex requirements",
      icon: Server,
      isUpcoming: true,
      badgeText: "Coming Q4 2026",
      features: [
        "Unlimited clusters",
        "10 agents per cluster",
        "All chat platforms",
        "Unlimited WebSocket connections",
        "90-day log retention",
        "Unlimited alert rules",
        "24/7 dedicated support",
        "Custom analytics & reporting",
        "White-label options",
        "99.99% SLA guarantee",
        "On-premise deployment",
        "SOC2 compliance",
      ],
      buttonText: "Contact Sales",
    },
  ];

//   const features = [
//     {
//       icon: MessageCircle,
//       title: "Chat Platforms",
//       description: "Telegram and Discord available now. Slack coming soon!",
//     },
//     {
//       icon: Server,
//       title: "Cluster Management",
//       description: "Scale from 1 to unlimited clusters",
//     },
//     {
//       icon: Bell,
//       title: "Real-time Alerts",
//       description: "Get instant notifications for cluster events",
//     },
//     {
//       icon: Zap,
//       title: "Fast Performance",
//       description: "Lightning-fast response times for all operations",
//     },
//   ];

  const handlePlanSelect = (planTitle: string) => {
    // setSelectedPlan(planTitle);
    console.log(`Selected plan: ${planTitle}`);
    alert(
      `You selected the ${planTitle} plan! In a real app, this would proceed to checkout.`,
    );
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="border-b bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
            <Sparkles size={16} />
            Simple, transparent pricing
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 md:text-5xl lg:text-6xl">
            Start managing your clusters
            <br />
            <span className="text-blue-600">for free today</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
            Get started with our Free plan and scale up as your needs grow.
            Pro and Enterprise plans coming soon!
          </p>

          {/* Billing Toggle - Only show for plans that have pricing */}
          <div className="mt-8 flex items-center justify-center gap-4">
            <span
              className={`text-sm ${!isYearly ? "font-semibold text-slate-900" : "text-slate-500"}`}
            >
              Monthly
            </span>
            <button
              onClick={() => setIsYearly(!isYearly)}
              className={`relative h-8 w-16 rounded-full transition ${isYearly ? "bg-blue-600" : "bg-slate-300"}`}
            >
              <div
                className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow transition ${
                  isYearly ? "left-9" : "left-1"
                }`}
              />
            </button>
            <span
              className={`text-sm ${isYearly ? "font-semibold text-slate-900" : "text-slate-500"}`}
            >
              Yearly
              <span className="ml-1.5 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                Save 20%
              </span>
            </span>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="grid gap-8 md:grid-cols-3">
          {plans.map((plan) => (
            <PricingCard
              key={plan.title}
              {...plan}
              onSelect={handlePlanSelect}
            />
          ))}
        </div>

        {/* Trust Badges */}
        {/* <div className="mt-12 text-center">
          <p className="text-sm text-slate-500">Trusted by teams at</p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-8 opacity-50">
            <span className="text-lg font-semibold text-slate-600">Acme Corp</span>
            <span className="text-lg font-semibold text-slate-600">TechFlow</span>
            <span className="text-lg font-semibold text-slate-600">DataCore</span>
            <span className="text-lg font-semibold text-slate-600">CloudWise</span>
            <span className="text-lg font-semibold text-slate-600">DevOpsPro</span>
          </div>
        </div> */}
      </section>

      {/* Feature Highlights */}
      {/* <section className="border-t bg-white py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-slate-900">What's included in Free plan</h2>
            <p className="mt-2 text-slate-600">
              Everything you need to manage your Kubernetes cluster from chat
            </p>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <FeatureHighlight key={index} {...feature} />
            ))}
          </div>
        </div>
      </section> */}

      {/* CTA Section */}
      {/* <section className="border-t bg-blue-600 py-16 text-white">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <h2 className="text-3xl font-bold">Ready to get started?</h2>
          <p className="mx-auto mt-4 max-w-2xl text-blue-100">
            Join thousands of teams already managing their Kubernetes clusters
            from chat apps. Start with our free plan today!
          </p>
          <button className="mt-8 rounded-xl bg-white px-8 py-3 font-semibold text-blue-600 transition hover:bg-blue-50">
            Get Started for Free
          </button>
        </div>
      </section> */}
    </div>
  );
}