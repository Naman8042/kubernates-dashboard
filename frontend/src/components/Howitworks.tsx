
import { MessageSquare, Bot, Database, CheckCircle2, ArrowRight } from "lucide-react";

const HowItWorksSection = () => {
  const steps = [
    {
      number: 1,
      title: "You ask",
      description: "Send a command or question from Telegram, Discord, or Slack.",
      icon: <MessageSquare size={26} strokeWidth={2} />,
      gradient: "from-[#38BDF8] to-[#0EA5E9]",
      glow: "shadow-[0_14px_32px_-10px_rgba(14,165,233,0.5)]",
    },
    {
      number: 2,
      title: "Agent understands",
      description: "The KubeChatOps agent parses your intent instantly.",
      icon: <Bot size={26} strokeWidth={2} />,
      gradient: "from-[#818CF8] to-[#6366F1]",
      glow: "shadow-[0_14px_32px_-10px_rgba(99,102,241,0.5)]",
    },
    {
      number: 3,
      title: "Runs on cluster",
      description: "The agent securely executes against your Kubernetes cluster.",
      icon: (
        <svg
          className="h-[26px] w-[26px]"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <polygon points="12 2 22 7 22 17 12 22 2 17 2 7" />
          <line x1="12" y1="2" x2="12" y2="22" />
          <line x1="2" y1="7" x2="22" y2="17" />
          <line x1="2" y1="17" x2="22" y2="7" />
        </svg>
      ),
      gradient: "from-[#4C8DF0] to-[#326CE5]",
      glow: "shadow-[0_14px_32px_-10px_rgba(50,108,229,0.5)]",
    },
    {
      number: 4,
      title: "Result formatted",
      description: "Output is parsed and shaped into a clear, readable reply.",
      icon: <Database size={26} strokeWidth={2} />,
      gradient: "from-[#2DD4BF] to-[#0D9488]",
      glow: "shadow-[0_14px_32px_-10px_rgba(13,148,136,0.5)]",
    },
    {
      number: 5,
      title: "You get an answer",
      description: "A clear, actionable response lands back in the same chat.",
      icon: <CheckCircle2 size={26} strokeWidth={2} />,
      gradient: "from-[#34D399] to-[#059669]",
      glow: "shadow-[0_14px_32px_-10px_rgba(5,150,105,0.5)]",
    },
  ];

  return (
    <section className="relative overflow-hidden bg-[#FCFCFD] py-28 px-6">
      {/* ambient gradient blobs, consistent with the features section */}
      <div
        className="pointer-events-none absolute -top-32 left-[12%] h-[420px] w-[420px] rounded-full opacity-[0.14] blur-3xl"
        style={{ background: "radial-gradient(closest-side, #326CE5, transparent)" }}
      />
      <div
        className="pointer-events-none absolute -bottom-24 right-[10%] h-[380px] w-[380px] rounded-full opacity-[0.14] blur-3xl"
        style={{ background: "radial-gradient(closest-side, #059669, transparent)" }}
      />

      <div className="relative mx-auto max-w-6xl">
        {/* Heading */}
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#E5E8EC] bg-white/80 px-4 py-1.5 backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-[#326CE5] to-[#059669]" />
            <span className="text-xs font-semibold tracking-wide text-[#4B5563]">
              HOW IT WORKS
            </span>
          </div>

          <h2 className="mt-6 text-4xl font-bold tracking-tight text-[#0F172A] sm:text-5xl">
            From chat message to{" "}
            <span className="bg-gradient-to-r from-[#326CE5] to-[#059669] bg-clip-text text-transparent">
              cluster action
            </span>
          </h2>

          <p className="mt-5 text-lg leading-8 text-[#64748B]">
            Five steps, end to end — no dashboard, no context switch, just
            the chat window you already have open.
          </p>
        </div>

        {/* Steps */}
        <div className="mt-20 grid grid-cols-1 gap-y-14 md:grid-cols-5 md:gap-x-4 md:gap-y-0">
          {steps.map((step, idx) => (
            <div key={step.number} className="relative flex flex-col items-center text-center">
              {/* connecting arrow between steps, desktop only */}
              {idx < steps.length - 1 && (
                <div className="absolute left-[calc(50%+44px)] top-9 hidden w-[calc(100%-88px)] items-center md:flex">
                  <div className="h-px w-full bg-gradient-to-r from-[#D8DEE6] to-[#D8DEE6]/0" />
                  <ArrowRight size={14} className="ml-[-2px] shrink-0 text-[#CBD2DA]" />
                </div>
              )}

              <div className="relative">
                <div
                  className={`flex h-[72px] w-[72px] items-center justify-center rounded-2xl bg-gradient-to-br text-white ${step.gradient} ${step.glow}`}
                >
                  {step.icon}
                </div>
                <div className="absolute -bottom-2.5 left-1/2 flex h-6 w-6 -translate-x-1/2 items-center justify-center rounded-full border-2 border-[#FCFCFD] bg-[#0F172A] text-[11px] font-bold text-white">
                  {step.number}
                </div>
              </div>

              <h3 className="mt-6 text-base font-bold text-[#0F172A]">
                {step.title}
              </h3>
              <p className="mt-2 max-w-[190px] text-sm leading-6 text-[#64748B]">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;