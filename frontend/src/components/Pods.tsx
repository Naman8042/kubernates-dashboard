import { useEffect, useState } from "react";
import axios from "axios";
import { Box, Activity, RefreshCw, Search, ChevronDown } from "lucide-react";
import { BACKEND_URL } from "../config";

interface Cluster {
  id: number;
  name: string;
}

interface Pod {
  name: string;
  namespace: string;
  status: string;
  node?: string;
  ip?: string;
}

export default function Pods() {
  const [clusters, setClusters] = useState<Cluster[]>([]);
  const [selectedCluster, setSelectedCluster] = useState<string>("");
  const [pods, setPods] = useState<Pod[]>([]);
  const [loading, setLoading] = useState(false);
  const [clusterLoading, setClusterLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  useEffect(() => {
    fetchClusters();
  }, []);

  async function fetchClusters() {
    try {
      setClusterLoading(true);
      const res = await axios.get(`${BACKEND_URL}/api/clusters`, {
        withCredentials: true,
      });

      console.log("Clusters:", res.data);
      setClusters(res.data);

      if (Array.isArray(res.data) && res.data.length > 0) {
        const firstCluster = res.data[0];
        setSelectedCluster(String(firstCluster.id));
        fetchPods(firstCluster.id);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setClusterLoading(false);
    }
  }

  async function fetchPods(clusterId: number) {
    try {
      setLoading(true);
      const res = await axios.get(`${BACKEND_URL}/pods/${clusterId}`, {
        withCredentials: true,
      });

      console.log("Pods:", res.data);
      setPods(res.data || []);
    } catch (error) {
      console.error(error);
      setPods([]);
    } finally {
      setLoading(false);
    }
  }

  // Filter pods based on search and status
  const filteredPods = pods.filter((pod) => {
    const matchesSearch = pod.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          pod.namespace.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || pod.status.toLowerCase() === filterStatus.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const runningPods = pods.filter((pod: Pod) => pod.status === "Running").length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Running":
        return "bg-green-100 text-green-700";
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      case "Failed":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 overflow-x-hidden">
      <div className="w-full max-w-full px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8 md:mb-10 flex flex-col gap-4 md:gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0 flex-1">
            <span className="inline-block rounded-full bg-blue-100 px-3 sm:px-4 py-1 text-xs sm:text-sm font-medium text-blue-700">
              Kubernetes Dashboard
            </span>
            <h1 className="mt-3 sm:mt-4 text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-slate-900 break-words">
              Pods
            </h1>
            <p className="mt-1 sm:mt-2 text-sm sm:text-base text-slate-500 break-words">
              View, monitor and inspect pods running across your Kubernetes cluster.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto sm:flex-shrink-0">
            <select
              value={selectedCluster}
              onChange={(e) => {
                const id = Number(e.target.value);
                setSelectedCluster(e.target.value);
                fetchPods(id);
              }}
              className="h-11 sm:h-12 w-full sm:min-w-[180px] md:min-w-[220px] rounded-xl sm:rounded-2xl border border-slate-200 bg-white px-3 sm:px-4 text-sm shadow-sm transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 truncate"
            >
              {clusters.map((cluster) => (
                <option key={cluster.id} value={cluster.id}>
                  {cluster.name?.trim() ? cluster.name : `Cluster #${cluster.id}`}
                </option>
              ))}
            </select>

            <button
              onClick={() => fetchPods(Number(selectedCluster))}
              className="h-11 sm:h-12 w-full sm:w-12 flex items-center justify-center rounded-xl sm:rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:bg-slate-100 flex-shrink-0"
            >
              <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
            </button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="mb-4 md:mb-6 flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search pods by name or namespace..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm min-w-0"
            />
          </div>
          
          {/* Mobile filter toggle */}
          <button
            onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
            className="sm:hidden flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm flex-shrink-0"
          >
            <ChevronDown className={`w-4 h-4 transition-transform ${isMobileFiltersOpen ? 'rotate-180' : ''}`} />
            Filter by Status
          </button>

          {/* Desktop filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="hidden sm:block h-11 sm:h-12 min-w-[140px] rounded-xl border border-slate-200 bg-white px-3 sm:px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 flex-shrink-0"
          >
            <option value="all">All Status</option>
            <option value="running">Running</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
        </div>

        {/* Mobile filter dropdown */}
        {isMobileFiltersOpen && (
          <div className="sm:hidden mb-4 p-4 bg-white rounded-xl border border-slate-200">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
            >
              <option value="all">All Status</option>
              <option value="running">Running</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        )}

        {/* Stats */}
        <div className="mb-6 sm:mb-8 md:mb-10 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
          <div className="rounded-2xl sm:rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 md:p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-slate-500">Total Pods</p>
                <h2 className="mt-2 sm:mt-3 text-3xl sm:text-4xl font-bold break-words">{pods.length}</h2>
              </div>
              <div className="rounded-xl sm:rounded-2xl bg-blue-100 p-3 sm:p-4 flex-shrink-0 ml-3">
                <Box className="text-blue-600" size={24} />
              </div>
            </div>
          </div>
          <div className="rounded-2xl sm:rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 md:p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-slate-500">Running Pods</p>
                <h2 className="mt-2 sm:mt-3 text-3xl sm:text-4xl font-bold text-green-600 break-words">
                  {runningPods}
                </h2>
              </div>
              <div className="rounded-xl sm:rounded-2xl bg-green-100 p-3 sm:p-4 flex-shrink-0 ml-3">
                <Activity className="text-green-600" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Table / Cards */}
        <div className="overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-200 bg-white shadow-lg">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b bg-slate-50 px-4 sm:px-6 py-4 sm:py-5 gap-2 sm:gap-0">
            <div>
              <h2 className="text-base sm:text-lg font-semibold">Pod List</h2>
              <p className="text-xs sm:text-sm text-slate-500">
                {filteredPods.length} Pods Found
              </p>
            </div>
            <div className="text-xs sm:text-sm text-slate-500 truncate max-w-full">
              {searchTerm && `Filtered by: "${searchTerm}"`}
            </div>
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead className="bg-slate-100 text-xs uppercase tracking-wide text-slate-600">
                <tr>
                  <th className="p-3 sm:p-4 text-left">Name</th>
                  <th className="p-3 sm:p-4 text-left">Namespace</th>
                  <th className="p-3 sm:p-4 text-left">Status</th>
                  <th className="p-3 sm:p-4 text-left">Node</th>
                  <th className="p-3 sm:p-4 text-left">IP</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="p-8 sm:p-10 text-center text-slate-500">
                      <div className="flex flex-col items-center gap-3">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-300 border-t-blue-600" />
                        <span>Loading Pods...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredPods.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 sm:p-10 text-center text-slate-500">
                      No Pods Found
                    </td>
                  </tr>
                ) : (
                  filteredPods.map((pod: Pod) => (
                    <tr
                      key={`${pod.namespace}-${pod.name}`}
                      className="border-t transition hover:bg-blue-50/40"
                    >
                      <td className="p-3 sm:p-4 font-medium text-sm break-words max-w-[150px]">{pod.name}</td>
                      <td className="p-3 sm:p-4 text-sm break-words max-w-[120px]">{pod.namespace}</td>
                      <td className="p-3 sm:p-4">
                        <span className={`inline-block rounded-full px-2 sm:px-3 py-1 text-xs font-medium whitespace-nowrap ${getStatusColor(pod.status)}`}>
                          {pod.status}
                        </span>
                      </td>
                      <td className="p-3 sm:p-4 text-sm break-words max-w-[120px]">{pod.node || "-"}</td>
                      <td className="p-3 sm:p-4 text-sm break-words max-w-[120px]">{pod.ip || "-"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden divide-y divide-slate-100">
            {loading ? (
              <div className="p-8 text-center text-slate-500">
                <div className="flex flex-col items-center gap-3">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-300 border-t-blue-600" />
                  <span>Loading Pods...</span>
                </div>
              </div>
            ) : filteredPods.length === 0 ? (
              <div className="p-8 text-center text-slate-500">
                No Pods Found
              </div>
            ) : (
              filteredPods.map((pod: Pod) => (
                <div key={`${pod.namespace}-${pod.name}`} className="p-4 space-y-3">
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-slate-800 text-sm truncate">
                        {pod.name}
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5 truncate">
                        {pod.namespace}
                      </p>
                    </div>
                    <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap ${getStatusColor(pod.status)}`}>
                      {pod.status}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="min-w-0">
                      <span className="text-slate-500">Node:</span>
                      <span className="ml-1 font-medium text-slate-700 break-words">
                        {pod.node || "-"}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <span className="text-slate-500">IP:</span>
                      <span className="ml-1 font-medium text-slate-700 break-words">
                        {pod.ip || "-"}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Debug */}
        {clusterLoading === false && clusters.length === 0 && (
          <div className="mt-4 sm:mt-6 rounded-xl border border-yellow-200 bg-yellow-50 p-3 sm:p-4 text-sm text-yellow-700 break-words">
            No clusters found. Create a cluster first from the Clusters page.
          </div>
        )}
      </div>
    </div>
  );
}