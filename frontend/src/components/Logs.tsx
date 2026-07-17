import { useEffect, useState } from "react";
import axios from "axios";
import { Terminal, RefreshCw, Server } from "lucide-react";
import { BACKEND_URL } from "../config";

interface Cluster {
  id: number;
  name: string;
}

interface Pod {
  name: string;
  namespace: string;
}

interface LogsData {
  podName: string;
  namespace: string;
  logs: string;
}

export default function Logs() {
  const [clusters, setClusters] = useState<Cluster[]>([]);
  const [pods, setPods] = useState<Pod[]>([]);
  const [selectedCluster, setSelectedCluster] = useState("");
  const [selectedPod, setSelectedPod] = useState("");
  const [logsData, setLogsData] = useState<LogsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);

  useEffect(() => {
    fetchClusters();
  }, []);

  // Auto-refresh effect
  useEffect(() => {
    let interval:any;
    if (autoRefresh && selectedPod) {
      interval = setInterval(() => {
        fetchLogs();
      }, 5000); // Refresh every 5 seconds
    }
    return () => clearInterval(interval);
  }, [autoRefresh, selectedPod]);

  async function fetchClusters() {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/clusters`, {
        withCredentials: true,
      });

      setClusters(res.data);

      if (res.data.length > 0) {
        const cluster = res.data[0];
        setSelectedCluster(String(cluster.id));
        fetchPods(cluster.id);
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function fetchPods(clusterId: number) {
    try {
      const res = await axios.get(`${BACKEND_URL}/pods/${clusterId}`, {
        withCredentials: true,
      });

      setPods(res.data);

      if (res.data.length > 0) {
        setSelectedPod(res.data[0].name);
        // Auto-fetch logs when pod changes
        setTimeout(() => fetchLogs(), 100);
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function fetchLogs() {
    try {
      const pod = pods.find((p) => p.name === selectedPod);
      if (!pod) return;

      setLoading(true);
      const res = await axios.get(
        `${BACKEND_URL}/logs/${selectedCluster}`,
        {
          params: {
            namespace: pod.namespace,
            pod: pod.name,
          },
          withCredentials: true,
        }
      );

      setLogsData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const getPodName = () => {
    if (logsData?.podName) return logsData.podName;
    return selectedPod || "No pod selected";
  };

  return (
    <div className="min-h-screen bg-slate-50 p-3 sm:p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-4 sm:mb-6 md:mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900">
              Logs
            </h1>
            <p className="mt-1 sm:mt-2 text-sm sm:text-base text-slate-500">
              View Kubernetes Pod Logs
            </p>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`flex items-center gap-1 sm:gap-2 rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium transition ${
                autoRefresh
                  ? "bg-green-600 text-white hover:bg-green-700"
                  : "bg-slate-200 text-slate-700 hover:bg-slate-300"
              }`}
            >
              <RefreshCw size={14} className={autoRefresh ? "animate-spin" : ""} />
              {autoRefresh ? "Auto" : "Manual"}
            </button>
            
            <button
              onClick={fetchLogs}
              className="flex items-center gap-1 sm:gap-2 rounded-xl bg-slate-900 px-3 sm:px-5 py-2 sm:py-3 text-xs sm:text-sm text-white hover:bg-slate-800 transition flex-1 sm:flex-none justify-center"
            >
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
              <span className="hidden sm:inline">Refresh Logs</span>
              <span className="sm:hidden">Refresh</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-4 sm:mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <div className="rounded-xl sm:rounded-2xl border bg-white p-4 sm:p-5">
            <label className="mb-1.5 sm:mb-2 block text-xs sm:text-sm font-medium text-slate-700">
              Cluster
            </label>
            <select
              value={selectedCluster}
              onChange={(e) => {
                setSelectedCluster(e.target.value);
                setLogsData(null);
                fetchPods(Number(e.target.value));
              }}
              className="w-full rounded-xl border border-slate-200 px-3 sm:px-4 py-2 sm:py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              {clusters.map((cluster) => (
                <option key={cluster.id} value={cluster.id}>
                  {cluster.name || `Cluster #${cluster.id}`}
                </option>
              ))}
            </select>
          </div>

          <div className="rounded-xl sm:rounded-2xl border bg-white p-4 sm:p-5">
            <label className="mb-1.5 sm:mb-2 block text-xs sm:text-sm font-medium text-slate-700">
              Pod
            </label>
            <select
              value={selectedPod}
              onChange={(e) => {
                setSelectedPod(e.target.value);
                setLogsData(null);
                setTimeout(() => fetchLogs(), 100);
              }}
              className="w-full rounded-xl border border-slate-200 px-3 sm:px-4 py-2 sm:py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              {pods.map((pod) => (
                <option key={pod.name} value={pod.name}>
                  {pod.name}
                </option>
              ))}
            </select>
          </div>

          <div className="rounded-xl sm:rounded-2xl border bg-white p-4 sm:p-5 col-span-1 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="rounded-xl bg-blue-100 p-2.5 sm:p-3">
                <Server className="text-blue-600" size={20} />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-slate-500">Total Pods</p>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                  {pods.length}
                </h2>
              </div>
            </div>
          </div>
        </div>

        {/* Log Info */}
        {logsData && (
          <div className="mb-3 sm:mb-4 rounded-xl sm:rounded-2xl border bg-white p-4 sm:p-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              <div>
                <p className="text-xs text-slate-500">Pod</p>
                <p className="text-sm sm:text-base font-medium text-slate-900 truncate">
                  {logsData.podName}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Namespace</p>
                <p className="text-sm sm:text-base font-medium text-slate-900">
                  {logsData.namespace}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Cluster</p>
                <p className="text-sm sm:text-base font-medium text-slate-900">
                  {clusters.find(c => String(c.id) === selectedCluster)?.name || selectedCluster}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Terminal */}
        <div className="overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-800 bg-slate-950 shadow-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-800 px-3 sm:px-5 py-2.5 sm:py-3 gap-2 sm:gap-0">
            <div className="flex items-center gap-2">
              <Terminal className="text-green-400" size={18} />
              <span className="text-xs sm:text-sm text-slate-300 font-medium">
                {autoRefresh ? "Live Logs (Auto-refresh)" : "Live Logs"}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="hidden sm:inline">{getPodName()}</span>
              <span className="sm:hidden truncate max-w-[120px]">{getPodName()}</span>
              {loading && (
                <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-green-400"></span>
              )}
            </div>
          </div>

          <div className="h-[400px] sm:h-[500px] md:h-[600px] overflow-auto p-3 sm:p-4 md:p-5 font-mono text-xs sm:text-sm">
            {loading ? (
              <div className="flex items-center gap-3 text-green-400">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-green-400 border-t-transparent" />
                <span>Loading logs...</span>
              </div>
            ) : logsData?.logs ? (
              <pre className="whitespace-pre-wrap text-green-400 leading-relaxed">
                {logsData.logs}
              </pre>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-slate-500">
                <Terminal size={40} className="mb-3 opacity-20" />
                <p className="text-center">
                  Select a pod and click Refresh Logs
                </p>
                <p className="text-xs text-slate-600 mt-1">
                  Or enable auto-refresh for live updates
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Log stats */}
        {logsData?.logs && (
          <div className="mt-3 sm:mt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
            <span>
              Lines: {logsData.logs.split('\n').length}
            </span>
            <span>
              {autoRefresh ? 'Auto-refreshing every 5s' : 'Manual mode'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}