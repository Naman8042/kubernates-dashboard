import { ChevronDown, Server } from "lucide-react";

interface Cluster {
  id: number;
  name: string;
  status: string;
}

interface DashboardClusterSelectorProps {
  clusters: Cluster[];
  selectedCluster: string;
  onChange: (clusterId: string) => void;
}

export default function DashboardClusterSelector({
  clusters,
  selectedCluster,
  onChange,
}: DashboardClusterSelectorProps) {
  const selected = clusters.find(
    (cluster) => String(cluster.id) === selectedCluster
  );

  return (
    <div className="flex flex-col gap-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-6">
      {/* Left */}
      <div className="min-w-0">
        <h2 className="text-xl font-bold text-slate-900">
          Cluster
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Select a Kubernetes cluster to manage.
        </p>
      </div>

      {/* Right */}
      <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
        {selected && (
          <span
            className={`inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-semibold capitalize ${
              selected.status.toLowerCase() === "online"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            <span
              className={`mr-2 h-2 w-2 rounded-full ${
                selected.status.toLowerCase() === "online"
                  ? "bg-green-500"
                  : "bg-red-500"
              }`}
            />

            {selected.status}
          </span>
        )}

        <div className="relative w-full sm:w-72">
          <Server
            size={18}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-blue-600"
          />

          <select
            value={selectedCluster}
            onChange={(e) => onChange(e.target.value)}
            className="h-12 w-full appearance-none rounded-xl border border-slate-300 bg-white pl-11 pr-10 text-sm font-medium text-slate-700 shadow-sm transition-all outline-none hover:border-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          >
            <option value="">Select Cluster</option>

            {clusters.map((cluster) => (
              <option
                key={cluster.id}
                value={cluster.id}
              >
                {cluster.name}
              </option>
            ))}
          </select>

          <ChevronDown
            size={18}
            className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
          />
        </div>
      </div>
    </div>
  );
}