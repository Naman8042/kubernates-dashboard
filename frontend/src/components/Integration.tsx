

const IntegrationsSection = () => {
  const integrations = [
    {
      name: "Discord",
      description:
        "Run kubectl-style commands and get real-time cluster alerts straight in your server channels.",
      command: "/k8s get pods -n prod",
      status: "Live",
      available: true,
      accent: "#5865F2",
      icon: (
        <svg className="h-7 w-7" viewBox="0 0 24 24" fill="#5865F2">
          <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.873-.894.077.077 0 0 1-.008-.128c.126-.093.252-.19.372-.287a.075.075 0 0 1 .077-.011c3.92 1.793 8.18 1.793 12.061 0a.073.073 0 0 1 .078.009c.12.099.246.195.373.289a.077.077 0 0 1-.006.127 12.298 12.298 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
        </svg>
      ),
    },
    {
      name: "Telegram",
      description:
        "Trigger deployments and pull cluster status from a lightweight bot you can reach from any device.",
      command: "/k8s rollout status api",
      status: "Live",
      available: true,
      accent: "#24A1DE",
      icon: (
        <svg className="h-7 w-7" viewBox="0 0 24 24" fill="#24A1DE">
          <path d="M11.944 0C5.347 0 0 5.347 0 11.944c0 6.595 5.347 11.944 11.944 11.944 6.596 0 11.944-5.349 11.944-11.944C23.888 5.347 18.54 0 11.944 0zm5.503 8.161c-.177 1.859-.942 6.362-1.328 8.426-.163.873-.485 1.166-.796 1.195-.677.062-1.19-.448-1.846-.879-1.027-.674-1.607-1.092-2.604-1.748-1.152-.759-.405-1.176.251-1.86.172-.178 3.158-2.896 3.216-3.142.007-.031.014-.148-.056-.21-.07-.063-.173-.041-.247-.024-.105.024-1.781 1.134-5.048 3.336-.48.33-.913.492-1.302.484-.428-.008-1.252-.241-1.865-.44-.752-.244-1.349-.374-1.297-.789.027-.216.324-.437.893-.663 3.51-1.529 5.85-2.537 7.021-3.023 3.34-1.385 4.035-1.625 4.489-1.633.1.002.322.027.466.144a.49.49 0 0 1 .151.354c-.007.075-.015.22-.023.38z" />
        </svg>
      ),
    },
    {
      name: "Slack",
      description:
        "Slash commands and approval workflows for teams standardized on Slack. Coming Q3 2026 — join the waitlist to get early access.",
      command: "/k8s scale web --replicas 4",
      status: "Upcoming",
      available: false,
      accent: "#E01E5A",
      icon: (
        <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none">
          <path
            d="M5.042 15.165a2.528 2.528 0 1 1-2.52 2.523v-2.523h2.52zM6.305 15.165a2.528 2.528 0 0 1 5.056 0v6.311a2.528 2.528 0 1 1-5.056 0v-6.311z"
            fill="#36C5F0"
          />
          <path
            d="M8.828 5.043a2.528 2.528 0 1 1 2.522-2.52v2.52h-2.522zM8.828 6.305a2.528 2.528 0 0 1 0 5.056H2.517a2.528 2.528 0 1 1 0-5.056h6.311z"
            fill="#2EB67D"
          />
          <path
            d="M18.958 8.828a2.528 2.528 0 1 1 2.52-2.522v2.522h-2.52zM17.695 8.828a2.528 2.528 0 0 1-5.056 0V2.517a2.528 2.528 0 1 1 5.056 0v6.311z"
            fill="#ECB22E"
          />
          <path
            d="M15.172 18.957a2.528 2.528 0 1 1-2.522 2.52v-2.52h2.522zM15.172 17.695a2.528 2.528 0 0 1 0-5.056h6.311a2.528 2.528 0 1 1 0 5.056h-6.311z"
            fill="#E01E5A"
          />
        </svg>
      ),
    },
  ];

  return (
    <section className="relative overflow-hidden bg-[#FAFBFC] py-24 px-6">
      {/* Faint grid backdrop */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.6]"
        style={{
          backgroundImage:
            "linear-gradient(#EEF1F4 1px, transparent 1px), linear-gradient(90deg, #EEF1F4 1px, transparent 1px)",
          backgroundSize: "42px 42px",
          maskImage:
            "radial-gradient(ellipse 70% 60% at 50% 0%, black 40%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 70% 60% at 50% 0%, black 40%, transparent 100%)",
        }}
      />

      <div className="relative mx-auto max-w-6xl">
        {/* Heading */}
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#E2E6EB] bg-white px-3 py-1 shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-[#326CE5]" />
            <span className="font-mono text-xs tracking-wide text-[#6B7280]">
              // integrations.yaml
            </span>
          </div>

          <h2 className="mt-6 text-3xl font-bold tracking-tight text-[#111827] sm:text-4xl">
            Run kubectl from the chat you already live in
          </h2>

          <p className="mt-4 text-base leading-7 text-[#6B7280]">
            KubeChatOps ships bots for{" "}
            <span className="font-medium text-[#111827]">Discord</span> and{" "}
            <span className="font-medium text-[#111827]">Telegram</span>{" "}
            today. <span className="font-medium text-[#E01E5A]">Slack</span> is
            launching soon — join the waitlist to be first in line.
          </p>
        </div>

        {/* Cards */}
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {integrations.map((app) => (
            <div
              key={app.name}
              className={`group relative flex flex-col overflow-hidden rounded-2xl border bg-white transition-all duration-300 ${
                app.available
                  ? "border-[#E5E8EC] hover:-translate-y-1 hover:border-[#D1D7DE] hover:shadow-[0_20px_45px_-24px_rgba(15,23,42,0.25)]"
                  : "border-dashed border-[#E5E8EC] opacity-95 hover:border-[#E01E5A] hover:shadow-[0_20px_45px_-24px_rgba(224,30,90,0.15)]"
              }`}
            >
              {/* Status strip */}
              <div className="flex items-center justify-between border-b border-[#EEF1F4] px-5 py-3">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    {app.available && (
                      <span
                        className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-60"
                        style={{ backgroundColor: app.accent }}
                      />
                    )}
                    <span
                      className="relative inline-flex h-2 w-2 rounded-full"
                      style={{ backgroundColor: app.accent }}
                    />
                  </span>
                  <span className="font-mono text-[11px] uppercase tracking-wider text-[#8B95A1]">
                    {app.status}
                  </span>
                </div>
                <div className="rounded-md p-2">{app.icon}</div>
              </div>

              {/* Body */}
              <div className="flex flex-1 flex-col px-5 py-5">
                <h3 className="text-lg font-semibold text-[#111827]">
                  {app.name}
                </h3>
                <p className="mt-2 text-sm leading-6 text-[#6B7280]">
                  {app.description}
                </p>

                {/* Terminal snippet */}
                <div className="mt-4 rounded-lg border border-[#EAEDF1] bg-[#F7F8FA] px-3 py-2.5">
                  <code className="font-mono text-[12px] text-[#4B5563]">
                    <span className="text-[#B0B8C1]">$ </span>
                    <span
                      style={{
                        color: app.available ? app.accent : "#9AA3AE",
                      }}
                    >
                      {app.command}
                    </span>
                  </code>
                </div>

                <div className="mt-5 pt-1">
                  {app.available ? (
                    <button className="w-full rounded-lg bg-[#111827] py-2.5 text-sm font-semibold text-white transition hover:bg-[#1F2937]">
                      Set up {app.name}
                    </button>
                  ) : (
                    <button
                      className="w-full rounded-lg bg-[#E01E5A] py-2.5 text-sm font-semibold text-white transition hover:bg-[#C01A4E] hover:shadow-lg"
                      onClick={() => {
                        // Add waitlist signup logic here
                        alert("You've been added to the Slack waitlist!");
                      }}
                    >
                      Coming Soon
                    </button>
                  )}
                </div>

              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default IntegrationsSection;