import React from "react";
import {
  ArrowRight,
  CheckCircle,
  ChevronRight,
  Cloud,
  Download,
  Info,
} from "lucide-react";

const InstallationPage: React.FC = () => {
  return (
    <div className="mx-auto max-w-4xl">
      {/* Breadcrumb */}
      <div className="mb-8 flex items-center gap-2 text-sm text-slate-500">
        Documentation
        <ChevronRight size={14} />
        Installation
      </div>

      {/* Header */}
      <h1 className="text-5xl font-bold tracking-tight text-slate-900">
        Installation
      </h1>

      <p className="mt-4 text-lg leading-8 text-slate-600">
        Connect your Kubernetes cluster to KubeChatOps by deploying the
        lightweight agent. The installation takes less than two minutes and
        requires only two Kubernetes manifests.
      </p>

      {/* Requirements */}
      <section className="mt-12">
        <h2 className="text-2xl font-bold text-slate-900">
          Prerequisites
        </h2>

        <div className="mt-6 space-y-3">
          {[
            "A Kubernetes cluster (v1.24 or later)",
            "kubectl configured with cluster access",
            "Cluster administrator permissions",
            "A KubeChatOps account",
          ].map((item) => (
            <div
              key={item}
              className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4"
            >
              <CheckCircle
                size={18}
                className="shrink-0 text-green-600"
              />
              <span className="text-slate-700">{item}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Installation Steps */}
      <section className="mt-14">
        <h2 className="text-2xl font-bold text-slate-900">
          Installation Steps
        </h2>

        <div className="mt-8 space-y-6">

          {/* Step 1 */}
          <div className="rounded-2xl border bg-white p-6">
            <div className="flex gap-5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700">
                1
              </div>

              <div>
                <h3 className="text-lg font-semibold">
                  Create a Cluster
                </h3>

                <p className="mt-2 text-slate-600 leading-7">
                  Log in to the KubeChatOps dashboard and create a new
                  Kubernetes cluster. KubeChatOps automatically generates the
                  configuration files required to connect your cluster.
                </p>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="rounded-2xl border bg-white p-6">
            <div className="flex gap-5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700">
                2
              </div>

              <div className="flex-1">
                <h3 className="text-lg font-semibold">
                  Download Configuration Files
                </h3>

                <p className="mt-2 leading-7 text-slate-600">
                  Download the generated Kubernetes manifests from the
                  dashboard.
                </p>

                <div className="mt-5 grid gap-4 md:grid-cols-2">

                  <div className="rounded-xl border bg-slate-50 p-5">
                    <Cloud className="mb-3 text-blue-600" />

                    <h4 className="font-semibold">
                      rbac.yaml
                    </h4>

                    <p className="mt-2 text-sm text-slate-600">
                      Creates the ServiceAccount, ClusterRole and
                      ClusterRoleBinding required for the agent.
                    </p>
                  </div>

                  <div className="rounded-xl border bg-slate-50 p-5">
                    <Download className="mb-3 text-green-600" />

                    <h4 className="font-semibold">
                      agent-deployment.yaml
                    </h4>

                    <p className="mt-2 text-sm text-slate-600">
                      Deploys the KubeChatOps agent with your unique cluster
                      token already configured.
                    </p>
                  </div>

                </div>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="rounded-2xl border bg-white p-6">
            <div className="flex gap-5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700">
                3
              </div>

              <div className="flex-1">
                <h3 className="text-lg font-semibold">
                  Apply the Kubernetes Manifests
                </h3>

                <p className="mt-2 leading-7 text-slate-600">
                  Deploy the RBAC resources first, followed by the
                  KubeChatOps agent.
                </p>

                <div className="mt-4 overflow-hidden rounded-xl border bg-slate-950">
                  <div className="border-b border-slate-800 px-4 py-2 text-sm text-slate-400">
                    bash
                  </div>

                  <pre className="overflow-x-auto p-4 text-sm text-green-400">
{`kubectl apply -f rbac.yaml

kubectl apply -f agent-deployment.yaml`}
                  </pre>
                </div>
              </div>
            </div>
          </div>

          {/* Step 4 */}
          <div className="rounded-2xl border bg-white p-6">
            <div className="flex gap-5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700">
                4
              </div>

              <div className="flex-1">
                <h3 className="text-lg font-semibold">
                  Verify the Installation
                </h3>

                <p className="mt-2 leading-7 text-slate-600">
                  Verify that the KubeChatOps agent is running successfully.
                </p>

                <div className="mt-4 overflow-hidden rounded-xl border bg-slate-950">
                  <div className="border-b border-slate-800 px-4 py-2 text-sm text-slate-400">
                    bash
                  </div>

                  <pre className="overflow-x-auto p-4 text-sm text-green-400">
{`kubectl get pods -n kubechatops`}
                  </pre>
                </div>
              </div>
            </div>
          </div>

          {/* Step 5 */}
          <div className="rounded-2xl border bg-white p-6">
            <div className="flex gap-5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-100 font-bold text-green-700">
                ✓
              </div>

              <div>
                <h3 className="text-lg font-semibold">
                  Cluster Connected
                </h3>

                <p className="mt-2 leading-7 text-slate-600">
                  Once the agent connects successfully, your cluster will
                  appear in the KubeChatOps dashboard. You can immediately
                  start viewing namespaces, pods, deployments, services,
                  nodes, and logs.
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Note */}
      <div className="mt-12 rounded-2xl border border-blue-200 bg-blue-50 p-6">
        <div className="flex items-start gap-3">
          <Info className="mt-1 text-blue-700" />

          <div>
            <h3 className="font-semibold text-blue-900">
              Secure by Design
            </h3>

            <p className="mt-2 leading-7 text-blue-800">
              The Kubernetes agent authenticates using a unique cluster token.
              RBAC resources ensure the agent only has the permissions required
              to interact with Kubernetes.
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="mt-12 flex justify-between border-t pt-8">
        <button className="rounded-xl border px-5 py-3 text-sm hover:bg-slate-50">
          ← Getting Started
        </button>

        <button className="flex items-center gap-2 rounded-xl border px-5 py-3 text-sm hover:bg-slate-50">
          Next: Architecture
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default InstallationPage;