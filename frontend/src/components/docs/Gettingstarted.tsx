import {
  ChevronRight,
  Server,
  Shield,
  Activity,
  Terminal,
  Info,
} from "lucide-react";

const GettingStartedPage = () => {
  return (
    <div className="mx-auto max-w-4xl">
      {/* Breadcrumb */}
      <div className="mb-8 flex items-center gap-2 text-sm text-slate-500">
        Documentation
        <ChevronRight size={14} />
        Getting Started
      </div>

      {/* Hero */}
      <div>
        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
          Getting Started
        </span>

        <h1 className="mt-4 text-5xl font-bold tracking-tight text-slate-900">
          Welcome to KubeChatOps
        </h1>

        <p className="mt-6 text-lg leading-8 text-slate-600">
          KubeChatOps is an open-source Kubernetes management platform designed
          to simplify cluster operations. Deploy a lightweight agent inside your
          Kubernetes cluster, connect it to the KubeChatOps server, and manage
          your infrastructure from a centralized dashboard. Execute Kubernetes
          operations, inspect workloads, view logs, and monitor cluster
          resources—all from a single interface.
        </p>
      </div>

      {/* Features */}
      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {/* Agent */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 transition hover:shadow-md">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
            <Server size={24} />
          </div>

          <h3 className="text-lg font-semibold text-slate-900">
            Lightweight Kubernetes Agent
          </h3>

          <p className="mt-3 text-sm leading-6 text-slate-600">
            Deploy a lightweight agent inside your Kubernetes cluster. The agent
            securely connects to the KubeChatOps server over WebSocket and
            executes Kubernetes operations on your behalf.
          </p>
        </div>

        {/* WebSocket */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 transition hover:shadow-md">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-700">
            <Activity size={24} />
          </div>

          <h3 className="text-lg font-semibold text-slate-900">
            Real-Time Communication
          </h3>

          <p className="mt-3 text-sm leading-6 text-slate-600">
            Maintain a persistent WebSocket connection between your Kubernetes
            cluster and the KubeChatOps server for fast command execution and
            live cluster communication.
          </p>
        </div>

        {/* Security */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 transition hover:shadow-md">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-purple-700">
            <Shield size={24} />
          </div>

          <h3 className="text-lg font-semibold text-slate-900">
            Secure Authentication
          </h3>

          <p className="mt-3 text-sm leading-6 text-slate-600">
            Authenticate every Kubernetes cluster using a unique agent token.
            Kubernetes RBAC ensures the agent operates with only the permissions
            required for its assigned tasks.
          </p>
        </div>

        {/* Cluster Management */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 transition hover:shadow-md">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-orange-700">
            <Terminal size={24} />
          </div>

          <h3 className="text-lg font-semibold text-slate-900">
            Cluster Management
          </h3>

          <p className="mt-3 text-sm leading-6 text-slate-600">
            Browse namespaces, deployments, pods, services, nodes, and view pod
            logs directly from the KubeChatOps dashboard. Execute Kubernetes
            operations without switching between multiple tools.
          </p>
        </div>
      </div>

      {/* Architecture */}
      <div className="mt-12 rounded-2xl border border-slate-200 bg-white p-8">
        <h2 className="text-2xl font-bold text-slate-900">
          How KubeChatOps Works
        </h2>

        <p className="mt-4 leading-7 text-slate-600">
          KubeChatOps follows an agent-based architecture. A lightweight agent
          runs inside your Kubernetes cluster and establishes a secure WebSocket
          connection with the KubeChatOps server. When you perform an action
          from the dashboard, the server forwards the request to the connected
          agent, which communicates with the Kubernetes API and returns the
          response in real time.
        </p>
      </div>

      {/* Quick Start */}
      <div className="mt-12 rounded-2xl border border-blue-200 bg-blue-50 p-6">
        <div className="flex items-start gap-4">
          <Info size={22} className="mt-1 text-blue-700" />

          <div>
            <h3 className="text-lg font-semibold text-blue-900">
              Ready to get started?
            </h3>

            <p className="mt-2 leading-7 text-blue-800">
              Deploy the KubeChatOps agent inside your Kubernetes cluster,
              generate an agent token, connect your cluster to the KubeChatOps
              server, and start managing Kubernetes resources from the web
              dashboard in just a few minutes.
            </p>

            <p className="mt-4 text-sm text-blue-700">
              <strong>Coming Soon:</strong> Slack, Discord, Telegram
              integrations, real-time alerts, notifications, audit logs, and
              multi-cluster management.
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="mt-12 flex justify-end border-t border-slate-200 pt-8">
        <button className="rounded-xl border border-slate-300 px-6 py-3 text-sm font-medium transition hover:bg-slate-50">
          Next: Installation →
        </button>
      </div>
    </div>
  );
};

export default GettingStartedPage;