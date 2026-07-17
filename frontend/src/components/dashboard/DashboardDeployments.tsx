import {
  CheckCircle2,
  RefreshCcw,
  Activity,
  MoreVertical,
  Rocket,
} from "lucide-react";

interface Deployment {
  name: string;
  namespace: string;
  replicas: number;
  readyReplicas: number;
}

interface DashboardDeploymentsProps {
  deployments: Deployment[];
}

export default function DashboardDeployments({
  deployments,
}: DashboardDeploymentsProps) {
    console.log(deployments)
  function getStatus(d: Deployment) {
    if (d.readyReplicas === d.replicas) {
      return {
        label: "Ready",
        color: "bg-green-100 text-green-700",
        icon: (
          <CheckCircle2
            size={14}
            className="text-green-600"
          />
        ),
      };
    }

    if (d.readyReplicas === 0) {
      return {
        label: "Unavailable",
        color: "bg-red-100 text-red-700",
        icon: (
          <Activity
            size={14}
            className="text-red-600"
          />
        ),
      };
    }

    return {
      label: "Updating",
      color: "bg-yellow-100 text-yellow-700",
      icon: (
        <RefreshCcw
          size={14}
          className="animate-spin text-yellow-600"
        />
      ),
    };
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}

      <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
        <div>
          <h2 className="text-lg font-semibold">
            Deployments
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Recent Kubernetes deployments
          </p>
        </div>

        <Rocket className="text-blue-600" />
      </div>

      {/* Table */}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr className="text-left text-xs uppercase tracking-wider text-slate-500">
              <th className="px-6 py-4">
                Deployment
              </th>

              <th className="px-6 py-4">
                Namespace
              </th>

              <th className="px-6 py-4">
                Status
              </th>

              <th className="px-6 py-4">
                Ready
              </th>

              <th className="w-10 px-6 py-4"></th>
            </tr>
          </thead>

          <tbody>
            {deployments.length ===
            0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="py-12 text-center text-slate-500"
                >
                  No deployments found
                </td>
              </tr>
            ) : (
              deployments.map(
                (
                  deployment,
                  index
                ) => {
                  const status =
                    getStatus(
                      deployment
                    );

                  return (
                    <tr
                      key={index}
                      className="border-t transition hover:bg-slate-50"
                    >
                      <td className="px-6 py-4 font-semibold">
                        {
                          deployment.name
                        }
                      </td>

                      <td className="px-6 py-4 text-slate-500">
                        {
                          deployment.namespace
                        }
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${status.color}`}
                        >
                          {
                            status.icon
                          }

                          {
                            status.label
                          }
                        </span>
                      </td>

                      <td className="px-6 py-4 font-medium">
                        {
                          deployment.readyReplicas
                        }
                        /
                        {
                          deployment.replicas
                        }
                      </td>

                      <td className="px-6 py-4">
                        <button className="text-slate-400 hover:text-slate-700">
                          <MoreVertical
                            size={18}
                          />
                        </button>
                      </td>
                    </tr>
                  );
                }
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}