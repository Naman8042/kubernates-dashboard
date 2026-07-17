import {
  Database,
  Box,
  Rocket,
  Globe,
} from "lucide-react";

interface Namespace {
  name: string;
  pods: number;
  deployments: number;
  services: number;
  status: "Healthy" | "Warning" | "Critical";
}

interface DashboardNamespacesProps {
  namespaces: Namespace[];
}

export default function DashboardNamespaces({
  namespaces,
}: DashboardNamespacesProps) {
  function getStatusColor(status: string) {
    switch (status) {
      case "Healthy":
        return "bg-green-100 text-green-700";

      case "Warning":
        return "bg-yellow-100 text-yellow-700";

      case "Critical":
        return "bg-red-100 text-red-700";

      default:
        return "bg-slate-100 text-slate-700";
    }
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}

      <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
        <div>
          <h2 className="text-lg font-semibold">
            Namespaces
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Kubernetes namespaces overview
          </p>
        </div>

        <Database className="text-blue-600" />
      </div>

      {/* Table */}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr className="text-left text-xs uppercase tracking-wider text-slate-500">
              <th className="px-6 py-4">
                Namespace
              </th>

              <th className="px-6 py-4">
                Pods
              </th>

              <th className="px-6 py-4">
                Deployments
              </th>

              <th className="px-6 py-4">
                Services
              </th>

              <th className="px-6 py-4">
                Status
              </th>
            </tr>
          </thead>

          <tbody>
            {namespaces.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="py-12 text-center text-slate-500"
                >
                  No namespaces found
                </td>
              </tr>
            ) : (
              namespaces.map((ns) => (
                <tr
                  key={ns.name}
                  className="border-t hover:bg-slate-50 transition"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Globe
                        size={18}
                        className="text-blue-600"
                      />

                      <span className="font-semibold">
                        {ns.name}
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Box
                        size={16}
                        className="text-blue-500"
                      />

                      {ns.pods}
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Rocket
                        size={16}
                        className="text-green-600"
                      />

                      {ns.deployments}
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    {ns.services}
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(
                        ns.status
                      )}`}
                    >
                      {ns.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}