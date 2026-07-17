import React from "react";
import {
  ChevronRight,
  Shield,
  FileText,
  Layers,
  Cpu,
 Inbox,
  Globe,
 GitBranch,
  RefreshCw,
  Terminal,
  ScrollText,
  Info,
  ArrowRight,
} from "lucide-react";

const permissions = [
  {
    title: "Pods",
    description: "List and inspect pods running in the cluster.",
    icon: Layers,
    access: "Read",
  },
  {
    title: "Pod Logs",
    description: "Retrieve logs from Kubernetes pods.",
    icon: ScrollText,
    access: "Read",
  },
  {
    title: "Namespaces",
    description: "View available namespaces.",
    icon: Inbox,
    access: "Read",
  },
  {
    title: "Nodes",
    description: "Retrieve node information.",
    icon: Cpu,
    access: "Read",
  },
  {
    title: "Services",
    description: "List Kubernetes services.",
    icon: Globe,
    access: "Read",
  },
  {
    title: "Deployments",
    description: "View deployment status and perform rollout actions.",
    icon: GitBranch,
    access: "Read / Update",
  },
  {
    title: "ReplicaSets",
    description: "Inspect ReplicaSets created by deployments.",
    icon: RefreshCw,
    access: "Read",
  },
  {
    title: "Exec",
    description: "Execute commands inside running containers (optional feature).",
    icon: Terminal,
    access: "Create",
  },
];

const RbacPage: React.FC = () => {
  return (
    <div className="mx-auto max-w-4xl">
      {/* Breadcrumb */}
      <div className="mb-8 flex items-center gap-2 text-sm text-slate-500">
        Documentation
        <ChevronRight size={14} />
        RBAC Setup
      </div>

      {/* Header */}
      <h1 className="text-5xl font-bold tracking-tight text-slate-900">
        RBAC Setup
      </h1>

      <p className="mt-4 text-lg leading-8 text-slate-600">
        KubeChatOps uses Kubernetes Role-Based Access Control (RBAC) to securely
        communicate with your Kubernetes cluster. The generated RBAC manifest
        grants only the permissions required for the features supported by the
        KubeChatOps agent.
      </p>

      {/* Security Notice */}
      <div className="mt-10 rounded-2xl border border-blue-200 bg-blue-50 p-6">
        <div className="flex items-start gap-4">
          <Shield className="mt-1 text-blue-700" size={22} />

          <div>
            <h3 className="text-lg font-semibold text-blue-900">
              Principle of Least Privilege
            </h3>

            <p className="mt-2 leading-7 text-blue-800">
              The generated RBAC configuration grants only the permissions
              required for cluster operations such as viewing workloads,
              retrieving logs, and interacting with Kubernetes resources. No
              unnecessary administrator permissions are granted.
            </p>
          </div>
        </div>
      </div>

      {/* Permissions */}
      <section className="mt-14">
        <h2 className="text-2xl font-bold text-slate-900">
          Granted Permissions
        </h2>

        <p className="mt-3 text-slate-600">
          The following Kubernetes resources are accessible by the
          KubeChatOps agent.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {permissions.map((permission) => {
            const Icon = permission.icon;

            return (
              <div
                key={permission.title}
                className="rounded-xl border border-slate-200 bg-white p-5"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
                    <Icon size={18} />
                  </div>

                  <div className="flex-1">
                    <h3 className="font-semibold">
                      {permission.title}
                    </h3>

                    <p className="mt-1 text-sm text-slate-600">
                      {permission.description}
                    </p>
                  </div>

                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                    {permission.access}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Manifest */}
      <section className="mt-14">
        <h2 className="text-2xl font-bold text-slate-900">
          RBAC Manifest
        </h2>

        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
          <div className="flex items-start gap-4">
            <FileText className="text-blue-600" size={22} />

            <div>
              <h3 className="font-semibold">
                Generated Automatically
              </h3>

              <p className="mt-2 leading-7 text-slate-600">
                During cluster creation, KubeChatOps generates an
                <code className="mx-1 rounded bg-slate-100 px-2 py-1 text-sm">
                  rbac.yaml
                </code>
                manifest containing the ServiceAccount, ClusterRole, and
                ClusterRoleBinding required by the Kubernetes agent.
              </p>

              <p className="mt-4 text-sm text-slate-500">
                Apply this manifest before deploying the agent.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Info */}
      <div className="mt-12 rounded-2xl border border-amber-200 bg-amber-50 p-6">
        <div className="flex items-start gap-3">
          <Info className="mt-1 text-amber-700" size={20} />

          <div>
            <h3 className="font-semibold text-amber-900">
              Important
            </h3>

            <p className="mt-2 leading-7 text-amber-800">
              Always apply the generated <code>rbac.yaml</code> before deploying
              the Kubernetes agent. Without the required RBAC resources, the
              agent will not be able to communicate with the Kubernetes API.
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="mt-12 flex justify-between border-t border-slate-200 pt-8">
        <button className="rounded-xl border border-slate-300 px-5 py-3 text-sm transition hover:bg-slate-50">
          ← Installation
        </button>

        <button className="flex items-center gap-2 rounded-xl border border-slate-300 px-5 py-3 text-sm transition hover:bg-slate-50">
          Next: Agent Deployment
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default RbacPage;