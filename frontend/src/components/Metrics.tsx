import { useEffect, useState } from "react";
import axios from "axios";
import {
  Activity,
  Boxes,
  RefreshCw,
  Server,
  ShieldCheck,
} from "lucide-react";
import { BACKEND_URL } from "../config";

interface Cluster {
  id: number;
  name: string;
}

interface NodeMetric {
  name: string;
  cpu: string;
  memory: string;
  pods: string;
  architecture: string;
  os: string;
  kubeletVersion: string;
  containerRuntime: string;
  status: string;
}

interface Summary {
  totalNodes: number;
  readyNodes: number;
  totalPods: number;
  runningPods: number;
  pendingPods: number;
  failedPods: number;
  succeededPods: number;
  totalDeployments: number;
  totalNamespaces: number;
  totalServices: number;
}

interface MetricsResponse {
  clusterHealth: string;
  summary: Summary;
  nodes: NodeMetric[];
}

export default function Metrics() {
  const [clusters, setClusters] = useState<Cluster[]>([]);
  const [selectedCluster, setSelectedCluster] = useState("");
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<MetricsResponse | null>(null);

  useEffect(() => {
    fetchClusters();
  }, []);

  async function fetchClusters() {
    try {
      const res = await axios.get(
        `${BACKEND_URL}/api/clusters`,
        {
          withCredentials: true,
        }
      );

      setClusters(res.data);

      if (res.data.length > 0) {
        const id = String(res.data[0].id);
        setSelectedCluster(id);
        fetchMetrics(id);
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function fetchMetrics(clusterId: string) {
    try {
      setLoading(true);
      const res = await axios.get(
        `${BACKEND_URL}/api/metrics/${clusterId}`,
        {
          withCredentials: true,
        }
      );
      setMetrics(res.data);
    } catch (err) {
      console.error(err);
      setMetrics(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="mx-auto max-w-7xl px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8 md:mb-10 flex flex-col gap-4 md:gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <span className="inline-block rounded-full bg-blue-100 px-3 sm:px-4 py-1 text-xs sm:text-sm font-semibold text-blue-700">
              Kubernetes Metrics
            </span>
            <h1 className="mt-3 sm:mt-4 text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-slate-900">
              Cluster Metrics
            </h1>
            <p className="mt-1 sm:mt-2 text-sm sm:text-base text-slate-500">
              View the health and capacity of your Kubernetes cluster.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <select
              value={selectedCluster}
              onChange={(e) => {
                setSelectedCluster(e.target.value);
                fetchMetrics(e.target.value);
              }}
              className="h-11 sm:h-12 w-full sm:min-w-[200px] md:min-w-[280px] rounded-xl sm:rounded-2xl border border-slate-200 bg-white px-3 sm:px-4 text-sm shadow-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            >
              {clusters.map((cluster) => (
                <option key={cluster.id} value={cluster.id}>
                  {cluster.name}
                </option>
              ))}
            </select>

            <button
              onClick={() => fetchMetrics(selectedCluster)}
              className="flex h-11 sm:h-12 items-center justify-center gap-2 rounded-xl sm:rounded-2xl bg-blue-600 px-4 sm:px-5 text-sm sm:text-base font-semibold text-white transition hover:bg-blue-700 flex-1 sm:flex-none"
            >
              <RefreshCw
                size={18}
                className={loading ? "animate-spin" : ""}
              />
              <span className="sm:inline">Refresh</span>
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex h-60 sm:h-80 items-center justify-center">
            <div className="text-center">
              <RefreshCw
                size={32}
                className="mx-auto animate-spin text-blue-600"
              />
              <p className="mt-3 sm:mt-4 text-sm sm:text-base text-slate-600">
                Loading metrics...
              </p>
            </div>
          </div>
        ) : metrics ? (
          <>
            {/* Summary Cards */}
            <div className="mb-6 sm:mb-8 md:mb-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
              <div className="rounded-2xl sm:rounded-3xl border border-slate-200 bg-white p-4 sm:p-5 md:p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-slate-500">Nodes</p>
                    <h2 className="mt-1 sm:mt-2 text-2xl sm:text-3xl md:text-4xl font-bold">
                      {metrics.summary.totalNodes}
                    </h2>
                  </div>
                  <Server className="text-blue-600" size={20} />
                </div>
              </div>

              <div className="rounded-2xl sm:rounded-3xl border border-slate-200 bg-white p-4 sm:p-5 md:p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-slate-500">Pods</p>
                    <h2 className="mt-1 sm:mt-2 text-2xl sm:text-3xl md:text-4xl font-bold">
                      {metrics.summary.totalPods}
                    </h2>
                  </div>
                  <Boxes className="text-indigo-600" size={20} />
                </div>
              </div>

              <div className="rounded-2xl sm:rounded-3xl border border-slate-200 bg-white p-4 sm:p-5 md:p-6 shadow-sm col-span-2 sm:col-span-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-slate-500">Deployments</p>
                    <h2 className="mt-1 sm:mt-2 text-2xl sm:text-3xl md:text-4xl font-bold">
                      {metrics.summary.totalDeployments}
                    </h2>
                  </div>
                  <Activity className="text-green-600" size={20} />
                </div>
              </div>

              <div className="rounded-2xl sm:rounded-3xl border border-slate-200 bg-white p-4 sm:p-5 md:p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-slate-500">Services</p>
                    <h2 className="mt-1 sm:mt-2 text-2xl sm:text-3xl md:text-4xl font-bold">
                      {metrics.summary.totalServices}
                    </h2>
                  </div>
                  <Boxes className="text-orange-600" size={20} />
                </div>
              </div>

              <div className="rounded-2xl sm:rounded-3xl border border-slate-200 bg-white p-4 sm:p-5 md:p-6 shadow-sm col-span-2 sm:col-span-3 lg:col-span-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-slate-500">Cluster Health</p>
                    <span
                      className={`mt-1 sm:mt-2 inline-block rounded-full px-2.5 sm:px-3 py-1 text-xs sm:text-sm font-semibold ${
                        metrics.clusterHealth === "Healthy"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {metrics.clusterHealth}
                    </span>
                  </div>
                  <ShieldCheck className="text-green-600" size={20} />
                </div>
              </div>
            </div>

            {/* Nodes Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {metrics.nodes.map((metric) => (
                <div
                  key={metric.name}
                  className="rounded-2xl sm:rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 md:p-7 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
                    <div className="min-w-0">
                      <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900 truncate">
                        {metric.name}
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-500">
                        Kubernetes Worker Node
                      </p>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-2.5 sm:px-3 py-1 text-xs font-semibold ${
                        metric.status === "Ready"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {metric.status}
                    </span>
                  </div>

                  <div className="mt-5 sm:mt-6 md:mt-8 grid grid-cols-2 gap-3 sm:gap-4 md:gap-5">
                    <div className="rounded-xl sm:rounded-2xl bg-slate-50 p-3 sm:p-4">
                      <p className="text-xs sm:text-sm text-slate-500">CPU</p>
                      <h3 className="mt-1 sm:mt-2 text-xl sm:text-2xl font-bold text-blue-600">
                        {metric.cpu}
                      </h3>
                    </div>

                    <div className="rounded-xl sm:rounded-2xl bg-slate-50 p-3 sm:p-4">
                      <p className="text-xs sm:text-sm text-slate-500">Memory</p>
                      <h3 className="mt-1 sm:mt-2 text-xl sm:text-2xl font-bold text-emerald-600">
                        {metric.memory}
                      </h3>
                    </div>

                    <div className="rounded-xl sm:rounded-2xl bg-slate-50 p-3 sm:p-4">
                      <p className="text-xs sm:text-sm text-slate-500">Pod Capacity</p>
                      <h3 className="mt-1 sm:mt-2 text-xl sm:text-2xl font-bold">
                        {metric.pods}
                      </h3>
                    </div>

                    <div className="rounded-xl sm:rounded-2xl bg-slate-50 p-3 sm:p-4">
                      <p className="text-xs sm:text-sm text-slate-500">Architecture</p>
                      <h3 className="mt-1 sm:mt-2 text-base sm:text-lg font-semibold truncate">
                        {metric.architecture}
                      </h3>
                    </div>
                  </div>

                  <div className="mt-5 sm:mt-6 md:mt-8 space-y-3 sm:space-y-4 border-t border-slate-100 pt-4 sm:pt-5 md:pt-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 sm:gap-0">
                      <span className="text-xs sm:text-sm text-slate-500">Operating System</span>
                      <span className="text-sm sm:text-base font-semibold text-slate-900">
                        {metric.os}
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 sm:gap-0">
                      <span className="text-xs sm:text-sm text-slate-500">Kubelet Version</span>
                      <span className="text-sm sm:text-base font-semibold text-slate-900">
                        {metric.kubeletVersion}
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 sm:gap-0">
                      <span className="text-xs sm:text-sm text-slate-500">Container Runtime</span>
                      <span className="text-sm sm:text-base font-semibold text-slate-900">
                        {metric.containerRuntime}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="flex h-60 sm:h-80 items-center justify-center rounded-2xl sm:rounded-3xl border border-dashed border-slate-300 bg-white">
            <div className="text-center px-4">
              <Server
                size={40}
                className="mx-auto text-slate-300"
              />
              <h3 className="mt-3 sm:mt-4 text-lg sm:text-xl font-semibold text-slate-900">
                No Metrics Available
              </h3>
              <p className="mt-1 sm:mt-2 text-sm sm:text-base text-slate-500">
                Unable to retrieve cluster metrics.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}