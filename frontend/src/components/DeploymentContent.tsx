import {
  Search,
  ChevronDown,
  Plus,
  CheckCircle2,
  RefreshCcw,
  Menu,
} from "lucide-react";
import { useState, useEffect } from "react";
import { BACKEND_URL } from "../config";
import axios from "axios";

interface Cluster {
  id: string;
  name: string;
}

interface DeploymentResponse {
  name: string;
  namespace: string;
  replicas: number;
  readyReplicas: number;
}

interface DeploymentRow {
  name: string;
  namespace: string;
  replicas: string;
  status: "Ready" | "Updating";
  statusColor: string;
  pods: number[];
}

const Deployments = () => {
  const [clusters, setClusters] = useState<Cluster[]>([]);
  const [deployments, setDeployments] = useState<DeploymentRow[]>([]);
  const [selectedCluster, setSelectedCluster] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  useEffect(() => {
    fetchClusters();
  }, []);

  async function fetchClusters() {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/clusters`, {
        withCredentials: true,
      });

      setClusters(res.data);

      if (res.data.length) {
        const id = String(res.data[0].id);
        setSelectedCluster(id);
        fetchDeployments(id);
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function describeDeployment(namespace: string, deployment: string) {
    try {
      const res = await axios.post(
        `${BACKEND_URL}/api/deployments/${selectedCluster}`,
        {
          namespace,
          deployment,
        },
        {
          withCredentials: true,
        }
      );

      alert("Deployment details loaded. Check console.");
      console.log(res.data);
    } catch (err) {
      console.error(err);
    }
  }

  async function restartDeployment(namespace: string, deployment: string) {
    try {
      await axios.post(
        `${BACKEND_URL}/api/deployments/deployment/${selectedCluster}`,
        {
          namespace,
          deployment,
        },
        {
          withCredentials: true,
        }
      );

      alert("Deployment restarted successfully.");
      fetchDeployments(selectedCluster);
    } catch (err) {
      console.error(err);
    }
  }

  async function fetchDeployments(clusterId: string) {
    try {
      setLoading(true);

      const res = await axios.get(
        `${BACKEND_URL}/api/deployments/${clusterId}`,
        {
          withCredentials: true,
        }
      );

      const formatted: DeploymentRow[] = (res.data as DeploymentResponse[]).map((d) => ({
        name: d.name,
        namespace: d.namespace,
        replicas: `${d.readyReplicas || 0}/${d.replicas}`,
        status: (d.readyReplicas || 0) === d.replicas ? "Ready" : "Updating",
        statusColor:
          (d.readyReplicas || 0) === d.replicas
            ? "bg-emerald-100 text-emerald-700"
            : "bg-amber-100 text-amber-700",
        pods: Array(d.replicas || 0)
          .fill(1)
          .map((_: any, i: number) => (i < (d.readyReplicas || 0) ? 1 : 0)),
      }));

      setDeployments(formatted);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  // Filter deployments based on search and status
  const filteredDeployments = deployments.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.namespace.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || item.status.toLowerCase() === filterStatus.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex-1 bg-slate-50 min-h-screen p-3 sm:p-4 md:p-6 lg:p-8 text-slate-800">
      {/* --- TOP BAR --- */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8">
        <div className="relative w-full sm:w-64 md:w-80 lg:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search deployments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Mobile filter toggle */}
          <button
            onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
            className="sm:hidden flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm"
          >
            <Menu className="w-4 h-4" />
            Filters
          </button>

          <select
            value={selectedCluster}
            onChange={(e) => {
              setSelectedCluster(e.target.value);
              fetchDeployments(e.target.value);
            }}
            className="flex-1 sm:flex-none rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {clusters.map((cluster: Cluster) => (
              <option key={cluster.id} value={cluster.id}>
                {cluster.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Mobile Filters */}
      {isMobileFiltersOpen && (
        <div className="sm:hidden mb-4 p-4 bg-white rounded-lg border border-slate-200">
          <div className="flex flex-col gap-3">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
            >
              <option value="all">All Status</option>
              <option value="ready">Ready</option>
              <option value="updating">Updating</option>
            </select>
          </div>
        </div>
      )}

      {/* --- HEADER --- */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Deployments</h1>
          <p className="text-slate-500 mt-1 flex items-center gap-2 text-sm">
            Selected:
            <span className="font-semibold text-slate-700">
              {clusters.find((c) => String(c.id) === selectedCluster)?.name ||
                "No Cluster"}
            </span>
          </p>
        </div>
        <button
          onClick={() => fetchDeployments(selectedCluster)}
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-5 py-2.5 rounded-lg flex items-center justify-center gap-2 text-sm font-bold shadow-lg shadow-blue-200 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" /> Create Deployment
        </button>
      </div>

      {/* --- FILTER BAR - Desktop --- */}
      <div className="hidden sm:flex gap-3 mb-6">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="bg-white border border-slate-200 px-4 py-1.5 rounded-md text-sm text-slate-600 flex items-center gap-6 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Status</option>
          <option value="ready">Ready</option>
          <option value="updating">Updating</option>
        </select>
        <button className="bg-white border border-slate-200 px-4 py-1.5 rounded-md text-sm text-slate-600 flex items-center gap-6 hover:border-slate-300">
          Namespace <ChevronDown className="w-4 h-4 text-slate-400" />
        </button>
        <button className="bg-white border border-slate-200 px-4 py-1.5 rounded-md text-sm text-slate-600 flex items-center gap-6 hover:border-slate-300">
          Label <ChevronDown className="w-4 h-4 text-slate-400" />
        </button>
      </div>

      {/* --- TABLE --- */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-400 uppercase text-[11px] font-bold tracking-widest border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Deployment Name</th>
                <th className="px-6 py-4">Namespace</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Replicas/Pods</th>
                <th className="px-6 py-4 w-10">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center gap-3">
                      <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-300 border-t-blue-600" />
                      <span>Loading deployments...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredDeployments.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-500">
                    No deployments found
                  </td>
                </tr>
              ) : (
                filteredDeployments.map((item, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-slate-50/80 transition-colors group"
                  >
                    <td className="px-6 py-4 font-semibold text-slate-800">
                      {item.name}
                    </td>
                    <td className="px-6 py-4 text-slate-500 font-medium">
                      {item.namespace}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${item.statusColor}`}
                      >
                        {item.status === "Ready" && (
                          <CheckCircle2 className="w-3 h-3" />
                        )}
                        {item.status === "Updating" && (
                          <RefreshCcw className="w-3 h-3 animate-spin" />
                        )}
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-slate-700">
                          {item.replicas}
                        </span>
                        <div className="flex gap-1">
                          {item.pods.map((p, i) => (
                            <div
                              key={i}
                              className={`w-3.5 h-3.5 rounded-full border-2 border-white ${p === 1 ? "bg-emerald-400" : "bg-slate-200"}`}
                            ></div>
                          ))}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            describeDeployment(item.namespace, item.name)
                          }
                          className="rounded-md bg-blue-600 px-3 py-1 text-xs font-semibold text-white hover:bg-blue-700 transition-colors"
                        >
                          Describe
                        </button>
                        <button
                          onClick={() =>
                            restartDeployment(item.namespace, item.name)
                          }
                          className="rounded-md bg-orange-500 px-3 py-1 text-xs font-semibold text-white hover:bg-orange-600 transition-colors"
                        >
                          Restart
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden divide-y divide-slate-100">
          {loading ? (
            <div className="py-12 text-center text-slate-500">
              <div className="flex flex-col items-center gap-3">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-300 border-t-blue-600" />
                <span>Loading deployments...</span>
              </div>
            </div>
          ) : filteredDeployments.length === 0 ? (
            <div className="py-12 text-center text-slate-500">
              No deployments found
            </div>
          ) : (
            filteredDeployments.map((item, idx) => (
              <div key={idx} className="p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-slate-800">{item.name}</h3>
                    <p className="text-sm text-slate-500">{item.namespace}</p>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${item.statusColor}`}
                  >
                    {item.status === "Ready" && (
                      <CheckCircle2 className="w-3 h-3" />
                    )}
                    {item.status === "Updating" && (
                      <RefreshCcw className="w-3 h-3 animate-spin" />
                    )}
                    {item.status}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-slate-700">
                    Replicas: {item.replicas}
                  </span>
                  <div className="flex gap-1">
                    {item.pods.map((p, i) => (
                      <div
                        key={i}
                        className={`w-3 h-3 rounded-full border border-white ${p === 1 ? "bg-emerald-400" : "bg-slate-200"}`}
                      ></div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() =>
                      describeDeployment(item.namespace, item.name)
                    }
                    className="flex-1 rounded-md bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700 transition-colors"
                  >
                    Describe
                  </button>
                  <button
                    onClick={() =>
                      restartDeployment(item.namespace, item.name)
                    }
                    className="flex-1 rounded-md bg-orange-500 px-3 py-2 text-xs font-semibold text-white hover:bg-orange-600 transition-colors"
                  >
                    Restart
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Deployment count */}
      {!loading && (
        <div className="mt-4 text-sm text-slate-500">
          Showing {filteredDeployments.length} of {deployments.length} deployments
        </div>
      )}
    </div>
  );
};

export default Deployments;