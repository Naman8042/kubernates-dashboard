import React from "react";
import {
  ArrowRight,
  CheckCircle,
  ChevronRight,
  Info,
  Rocket,
  Server,
  Wifi,
} from "lucide-react";

const AgentDeploymentPage: React.FC = () => {
  return (
    <div className="mx-auto max-w-4xl">
      {/* Breadcrumb */}
      <div className="mb-8 flex items-center gap-2 text-sm text-slate-500">
        Documentation
        <ChevronRight size={14} />
        Agent Deployment
      </div>

      {/* Header */}
      <h1 className="text-5xl font-bold tracking-tight text-slate-900">
        Agent Deployment
      </h1>

      <p className="mt-4 text-lg leading-8 text-slate-600">
        The KubeChatOps Agent runs inside your Kubernetes cluster and acts as a
        secure bridge between your cluster and the KubeChatOps platform. Once
        deployed, it establishes a persistent WebSocket connection and executes
        Kubernetes operations requested from the dashboard.
      </p>

      {/* Features */}
      <section className="mt-10">
        <div className="grid gap-5 md:grid-cols-3">
          <div className="rounded-2xl border bg-white p-6">
            <Server className="mb-4 text-blue-600" size={28} />

            <h3 className="font-semibold">Runs Inside Cluster</h3>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              The agent is deployed as a Kubernetes Deployment and runs
              continuously inside your cluster.
            </p>
          </div>

          <div className="rounded-2xl border bg-white p-6">
            <Wifi className="mb-4 text-green-600" size={28} />

            <h3 className="font-semibold">Secure Connection</h3>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              Connects securely to the KubeChatOps server using a unique agent
              token over WebSocket.
            </p>
          </div>

          <div className="rounded-2xl border bg-white p-6">
            <Rocket className="mb-4 text-purple-600" size={28} />

            <h3 className="font-semibold">Ready in Minutes</h3>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              Deploy using the generated Kubernetes manifest with a single
              kubectl command.
            </p>
          </div>
        </div>
      </section>

      {/* Deployment */}
      <section className="mt-14">
        <h2 className="text-2xl font-bold text-slate-900">
          Deploy the Agent
        </h2>

        <div className="mt-6 rounded-2xl border bg-white p-6">
          <h3 className="font-semibold">
            Apply the generated deployment manifest
          </h3>

          <p className="mt-2 leading-7 text-slate-600">
            Download <code>agent-deployment.yaml</code> from the dashboard and
            apply it to your Kubernetes cluster.
          </p>

          <div className="mt-5 overflow-hidden rounded-xl border bg-slate-950">
            <div className="border-b border-slate-800 px-4 py-2 text-sm text-slate-400">
              bash
            </div>

            <pre className="overflow-x-auto p-4 text-sm text-green-400">
{`kubectl apply -f agent-deployment.yaml`}
            </pre>
          </div>
        </div>
      </section>

      {/* Verification */}
      <section className="mt-14">
        <h2 className="text-2xl font-bold text-slate-900">
          Verify Deployment
        </h2>

        <div className="mt-6 space-y-5">
          <div className="rounded-2xl border bg-white p-6">
            <h3 className="font-semibold">
              Check the Agent Pod
            </h3>

            <div className="mt-4 overflow-hidden rounded-xl border bg-slate-950">
              <div className="border-b border-slate-800 px-4 py-2 text-sm text-slate-400">
                bash
              </div>

              <pre className="overflow-x-auto p-4 text-sm text-green-400">
{`kubectl get pods -n kubechatops`}
              </pre>
            </div>
          </div>

          <div className="rounded-2xl border bg-white p-6">
            <h3 className="font-semibold">
              View Agent Logs
            </h3>

            <div className="mt-4 overflow-hidden rounded-xl border bg-slate-950">
              <div className="border-b border-slate-800 px-4 py-2 text-sm text-slate-400">
                bash
              </div>

              <pre className="overflow-x-auto p-4 text-sm text-green-400">
{`kubectl logs deployment/kubechatops-agent -n kubechatops`}
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Status */}
      <section className="mt-14">
        <h2 className="text-2xl font-bold text-slate-900">
          Successful Deployment
        </h2>

        <div className="mt-6 rounded-2xl border border-green-200 bg-green-50 p-6">
          <div className="flex items-start gap-4">
            <CheckCircle
              size={24}
              className="mt-1 text-green-700"
            />

            <div>
              <h3 className="text-lg font-semibold text-green-900">
                Cluster Connected
              </h3>

              <p className="mt-2 leading-7 text-green-800">
                After the agent authenticates successfully, your Kubernetes
                cluster will appear as <strong>Online</strong> in the
                KubeChatOps dashboard. You can immediately browse namespaces,
                pods, deployments, services, nodes, and view logs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Troubleshooting */}
      <section className="mt-14">
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
          <div className="flex items-start gap-4">
            <Info className="mt-1 text-amber-700" size={22} />

            <div>
              <h3 className="font-semibold text-amber-900">
                Troubleshooting
              </h3>

              <ul className="mt-3 space-y-2 text-sm leading-6 text-amber-800">
                <li>• Verify that RBAC resources were applied first.</li>
                <li>• Ensure the agent token is valid.</li>
                <li>• Check the agent logs for connection errors.</li>
                <li>• Confirm the cluster has internet access to reach the KubeChatOps server.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation */}
      <div className="mt-12 flex justify-between border-t pt-8">
        <button className="rounded-xl border px-5 py-3 text-sm transition hover:bg-slate-50">
          ← RBAC Setup
        </button>

        <button className="flex items-center gap-2 rounded-xl border px-5 py-3 text-sm transition hover:bg-slate-50">
          Next: Dashboard
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default AgentDeploymentPage;