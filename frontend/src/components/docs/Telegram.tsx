import React from "react";
import {
  ArrowRight,
  ChevronRight,
  MessageCircle,
  Rocket,
  Shield,
  Sparkles,
} from "lucide-react";

const TelegramPage: React.FC = () => {
  return (
    <div className="mx-auto max-w-4xl">
      {/* Breadcrumb */}
      <div className="mb-8 flex items-center gap-2 text-sm text-slate-500">
        Documentation
        <ChevronRight size={14} />
        Telegram Integration
      </div>

      {/* Header */}
      <h1 className="text-5xl font-bold tracking-tight text-slate-900">
        Telegram Integration
      </h1>

      {/* <p className="mt-4 text-lg leading-8 text-slate-600">
        Telegram integration is currently under development and will be
        available in a future release of KubeChatOps.
      </p> */}

      {/* Coming Soon */}
      {/* <div className="mt-10 rounded-2xl border border-blue-200 bg-blue-50 p-8">
        <div className="flex items-start gap-4">
          <Clock3 className="mt-1 text-blue-700" size={24} />

          <div>
            <h2 className="text-xl font-semibold text-blue-900">
              Coming Soon
            </h2>

            <p className="mt-3 leading-7 text-blue-800">
              We're building a native Telegram bot that will allow you to manage
              your Kubernetes clusters directly from Telegram conversations.
            </p>
          </div>
        </div>
      </div> */}

      {/* Planned Features */}
      <section className="mt-14">
        {/* <h2 className="text-2xl font-bold text-slate-900">
          Planned Features
        </h2> */}

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          <div className="rounded-2xl border bg-white p-6">
            <MessageCircle className="mb-4 text-blue-600" size={28} />

            <h3 className="font-semibold">
              Chat-Based Cluster Management
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              Execute Kubernetes commands directly from Telegram without opening
              the dashboard.
            </p>
          </div>

          <div className="rounded-2xl border bg-white p-6">
            <Shield className="mb-4 text-green-600" size={28} />

            <h3 className="font-semibold">
              Secure Authentication
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              Link Telegram accounts securely to your KubeChatOps organization
              using one-time verification codes.
            </p>
          </div>

          <div className="rounded-2xl border bg-white p-6">
            <Rocket className="mb-4 text-purple-600" size={28} />

            <h3 className="font-semibold">
              Quick Operations
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              View pods, deployments, nodes, namespaces, services, and logs
              directly from Telegram.
            </p>
          </div>

          <div className="rounded-2xl border bg-white p-6">
            <Sparkles className="mb-4 text-amber-600" size={28} />

            <h3 className="font-semibold">
              Future Notifications
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              Receive cluster status updates and important events in Telegram as
              notification features are introduced.
            </p>
          </div>
        </div>
      </section>

      {/* Planned Commands */}
      <section className="mt-14">
        <h2 className="text-2xl font-bold text-slate-900">
          Commands
        </h2>

        <div className="mt-6 overflow-hidden rounded-2xl border bg-white">
          <div className="grid grid-cols-2 bg-slate-50 px-6 py-3 font-semibold">
            <div>Command</div>
            <div>Description</div>
          </div>

          {[
            ["/pods", "List Kubernetes pods"],
            ["/deployments", "List deployments"],
            ["/services", "View services"],
            ["/nodes", "View cluster nodes"],
            ["/logs", "Retrieve pod logs"],
            ["/namespaces", "List namespaces"],
            ["/restart", "Restart a deployment"],
            ["/help", "Display available commands"],
          ].map(([cmd, desc]) => (
            <div
              key={cmd}
              className="grid grid-cols-2 border-t px-6 py-3"
            >
              <code className="text-sm">{cmd}</code>

              <span className="text-sm text-slate-600">
                {desc}
              </span>
            </div>
          ))}
        </div>

        {/* <p className="mt-4 text-sm text-slate-500">
          These commands represent the planned functionality and are not yet
          available.
        </p> */}
      </section>

      {/* Navigation */}
      <div className="mt-12 flex justify-between border-t pt-8">
        <button className="rounded-xl border px-5 py-3 text-sm transition hover:bg-slate-50">
          ← Agent Deployment
        </button>

        <button className="flex items-center gap-2 rounded-xl border px-5 py-3 text-sm transition hover:bg-slate-50">
          Next: Architecture
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default TelegramPage;