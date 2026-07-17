import { Shield, ArrowUpRight, Activity, BarChart3, BellRing,TerminalSquare,Rocket } from "lucide-react";

const FeaturesRow = () => {
const cards = [
  {
    title: "Real-Time Monitoring",
    tag: "Observability",
    description:
      "Monitor pods, deployments, nodes, namespaces, services, and cluster health with continuously updated operational insights.",
    icon: <Activity size={22} strokeWidth={2} />,
    gradient: "from-[#22C55E] to-[#16A34A]",
    glow:
      "shadow-[0_16px_40px_-12px_rgba(34,197,94,0.45)]",
  },

  {
    title: "Cluster Metrics",
    tag: "Performance",
    description:
      "View CPU, memory, node capacity, workload statistics, namespace utilization, and overall cluster resource usage in one place.",
    icon: <BarChart3 size={22} strokeWidth={2} />,
    gradient: "from-[#F59E0B] to-[#EA580C]",
    glow:
      "shadow-[0_16px_40px_-12px_rgba(245,158,11,0.45)]",
  },

  {
    title: "Instant Alerts",
    tag: "Reliability",
    description:
      "Automatically detect CrashLoopBackOff, ImagePullBackOff, high restart counts, failed pods, and other unhealthy workloads with Telegram and Discord notifications.",
    icon: <BellRing size={22} strokeWidth={2} />,
    gradient: "from-[#EF4444] to-[#DC2626]",
    glow:
      "shadow-[0_16px_40px_-12px_rgba(239,68,68,0.45)]",
  },

  {
    title: "Secure RBAC",
    tag: "Security",
    description:
      "Every operation is authorized through Kubernetes RBAC with least-privilege permissions, ensuring administrators retain full control.",
    icon: <Shield size={22} strokeWidth={2} />,
    gradient: "from-[#9333EA] to-[#7E22CE]",
    glow:
      "shadow-[0_16px_40px_-12px_rgba(147,51,234,0.45)]",
  },

  {
    title: "kubectl Anywhere",
    tag: "Operations",
    description:
      "Execute approved kubectl commands from chat, including get, describe, logs, rollout restart, top, and other operational workflows.",
    icon: <TerminalSquare size={22} strokeWidth={2} />,
    gradient: "from-[#0F172A] to-[#334155]",
    glow:
      "shadow-[0_16px_40px_-12px_rgba(15,23,42,0.45)]",
  },

  {
    title: "Deployment Automation",
    tag: "DevOps",
    description:
      "Restart deployments, inspect workloads, stream logs, troubleshoot incidents, and perform common operational tasks without opening kubectl.",
    icon: <Rocket size={22} strokeWidth={2} />,
    gradient: "from-[#06B6D4] to-[#2563EB]",
    glow:
      "shadow-[0_16px_40px_-12px_rgba(6,182,212,0.45)]",
  },
];

  return (
    <section className="relative overflow-hidden bg-[#FCFCFD] py-28 px-6">
      {/* soft ambient gradient blobs instead of a flat grid */}
      <div
        className="pointer-events-none absolute -top-40 left-1/2 h-[560px] w-[900px] -translate-x-1/2 rounded-full opacity-[0.16] blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side, #326CE5, transparent)",
        }}
      />
      <div
        className="pointer-events-none absolute -top-10 right-[8%] h-[300px] w-[300px] rounded-full opacity-[0.12] blur-3xl"
        style={{
          background: "radial-gradient(closest-side, #7C3AED, transparent)",
        }}
      />

      <div className="relative mx-auto max-w-6xl">
        {/* Heading */}
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#E5E8EC] bg-white/80 px-4 py-1.5 backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-[#326CE5] to-[#7C3AED]" />
            <span className="text-xs font-semibold tracking-wide text-[#4B5563]">
              FEATURES
            </span>
          </div>

          <h2 className="mt-6 text-4xl font-bold tracking-tight text-[#0F172A] sm:text-5xl">
            Everything you need to run{" "}
            <span className="bg-gradient-to-r from-[#326CE5] to-[#7C3AED] bg-clip-text text-transparent">
              Kubernetes from chat
            </span>
          </h2>

          <p className="mt-5 text-lg leading-8 text-[#64748B]">
            Secure chat commands, a lightweight cluster agent, and
            role-based access control — wired together so ops stays fast
            without cutting corners on security.
          </p>
        </div>

        {/* Bento grid */}
        <div className="mt-16 grid gap-5 lg:grid-cols-3">
          {cards.map((card) => (
            <div
              key={card.title}
              className={`group relative flex flex-col justify-between overflow-hidden rounded-[28px] border border-[#ECEEF1] bg-white p-8 transition-all duration-300 hover:-translate-y-1.5 hover:border-transparent hover:shadow-[0_30px_60px_-25px_rgba(15,23,42,0.25)] `}
            >
              {/* subtle corner glow on hover */}
              <div
                className={`pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-gradient-to-br ${card.gradient} opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-[0.18]`}
              />

              <div className="relative">
                <div className="flex items-start justify-between">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br text-white ${card.gradient} ${card.glow}`}
                  >
                    {card.icon}
                  </div>
                  <ArrowUpRight
                    size={18}
                    className="mt-1 text-[#CBD2DA] transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#0F172A]"
                  />
                </div>

                <span className="mt-6 inline-block text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">
                  {card.tag}
                </span>

                <h3 className="mt-2 text-xl font-bold text-[#0F172A]">
                  {card.title}
                </h3>

                <p className="mt-3 max-w-md text-[15px] leading-7 text-[#64748B]">
                  {card.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesRow;