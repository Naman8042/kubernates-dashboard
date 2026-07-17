import { useEffect, useState } from "react";
import axios from "axios";
import {
  AlertTriangle,
  CheckCircle2,
  Bell,
  RefreshCw,
  Filter,
} from "lucide-react";
import { BACKEND_URL } from "../config";

interface Cluster {
  id: number;
  name: string;
}

interface AlertItem {
  severity: string;
  title: string;
  message: string;
  namespace: string;
  resource: string;
  time: string;
}

export default function Alerts() {
  const [clusters, setClusters] = useState<Cluster[]>([]);
  const [selectedCluster, setSelectedCluster] = useState("");
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [critical, setCritical] = useState(0);
  const [warning, setWarning] = useState(0);
  const [resolved, setResolved] = useState(0);
  const [filterSeverity, setFilterSeverity] = useState<string>("all");
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

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

      if (res.data.length) {
        const id = String(res.data[0].id);
        setSelectedCluster(id);
        fetchAlerts(id);
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function fetchAlerts(clusterId: string) {
    try {
      setLoading(true);
      const res = await axios.get(
        `${BACKEND_URL}/api/alerts/${clusterId}`,
        {
          withCredentials: true,
        }
      );

      setAlerts(res.data);

      setCritical(
        res.data.filter(
          (a: AlertItem) => a.severity === "Critical"
        ).length
      );

      setWarning(
        res.data.filter(
          (a: AlertItem) => a.severity === "Warning"
        ).length
      );

      setResolved(
        res.data.filter(
          (a: AlertItem) => a.severity === "Resolved"
        ).length
      );
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function getBadge(severity: string) {
    switch (severity) {
      case "Critical":
        return "bg-red-100 text-red-700";
      case "Warning":
        return "bg-yellow-100 text-yellow-700";
      case "Resolved":
        return "bg-green-100 text-green-700";
      default:
        return "bg-blue-100 text-blue-700";
    }
  }

  function getSeverityIcon(severity: string) {
    switch (severity) {
      case "Critical":
        return <AlertTriangle className="text-red-500" size={20} />;
      case "Warning":
        return <Bell className="text-yellow-500" size={20} />;
      case "Resolved":
        return <CheckCircle2 className="text-green-500" size={20} />;
      default:
        return null;
    }
  }

  // Filter alerts based on severity
  const filteredAlerts = alerts.filter((alert) => {
    if (filterSeverity === "all") return true;
    return alert.severity.toLowerCase() === filterSeverity.toLowerCase();
  });

  return (
    <div className="min-h-screen bg-slate-50 p-3 sm:p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-4 sm:mb-6 md:mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Alerts</h1>
            <p className="mt-1 text-sm sm:text-base text-slate-500">
              Cluster health notifications
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <select
              value={selectedCluster}
              onChange={(e) => {
                setSelectedCluster(e.target.value);
                fetchAlerts(e.target.value);
              }}
              className="h-11 sm:h-12 w-full sm:min-w-[180px] rounded-xl border border-slate-200 bg-white px-3 sm:px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {clusters.map((cluster) => (
                <option key={cluster.id} value={cluster.id}>
                  {cluster.name}
                </option>
              ))}
            </select>

            <button
              onClick={() => fetchAlerts(selectedCluster)}
              className="flex h-11 sm:h-12 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 sm:px-5 text-sm font-semibold text-white hover:bg-blue-700 transition flex-1 sm:flex-none"
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
              <span className="sm:inline">Refresh</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="mb-4 sm:mb-6 md:mb-8 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
          <div className="rounded-xl border bg-white p-4 sm:p-5 md:p-6 shadow-sm">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="rounded-xl bg-red-100 p-2.5 sm:p-3">
                <AlertTriangle className="text-red-600" size={20} />
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-red-600">
                  {critical}
                </h2>
                <p className="text-xs sm:text-sm text-slate-500">Critical Alerts</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border bg-white p-4 sm:p-5 md:p-6 shadow-sm">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="rounded-xl bg-yellow-100 p-2.5 sm:p-3">
                <Bell className="text-yellow-600" size={20} />
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-yellow-600">
                  {warning}
                </h2>
                <p className="text-xs sm:text-sm text-slate-500">Warnings</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border bg-white p-4 sm:p-5 md:p-6 shadow-sm">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="rounded-xl bg-green-100 p-2.5 sm:p-3">
                <CheckCircle2 className="text-green-600" size={20} />
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-green-600">
                  {resolved}
                </h2>
                <p className="text-xs sm:text-sm text-slate-500">Resolved</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Section */}
        <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
              className="sm:hidden flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm w-full"
            >
              <Filter size={16} />
              Filter: {filterSeverity === "all" ? "All" : filterSeverity}
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-2">
            <span className="text-sm text-slate-500">Filter:</span>
            <select
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value)}
              className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All</option>
              <option value="critical">Critical</option>
              <option value="warning">Warning</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>

          <div className="text-xs sm:text-sm text-slate-500">
            Showing {filteredAlerts.length} of {alerts.length} alerts
          </div>
        </div>

        {/* Mobile Filter Dropdown */}
        {isMobileFiltersOpen && (
          <div className="sm:hidden mb-4 p-4 bg-white rounded-xl border border-slate-200">
            <select
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
            >
              <option value="all">All</option>
              <option value="critical">Critical</option>
              <option value="warning">Warning</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
        )}

        {/* Alerts List */}
        <div className="space-y-3 sm:space-y-4">
          {loading ? (
            <div className="rounded-xl bg-white p-8 sm:p-10 text-center">
              <div className="flex flex-col items-center gap-3">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-300 border-t-blue-600" />
                <span className="text-sm sm:text-base text-slate-500">Loading alerts...</span>
              </div>
            </div>
          ) : filteredAlerts.length === 0 ? (
            <div className="rounded-xl bg-white p-8 sm:p-10 text-center">
              <CheckCircle2 className="mx-auto text-green-500" size={40} />
              <h3 className="mt-3 text-lg font-semibold text-slate-700">No alerts found</h3>
              <p className="mt-1 text-sm text-slate-500">
                {alerts.length > 0 
                  ? `No ${filterSeverity} alerts match your filter`
                  : "All systems are healthy!"}
              </p>
            </div>
          ) : (
            filteredAlerts.map((alert, index) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 rounded-xl border bg-white p-4 sm:p-5 shadow-sm hover:shadow-md transition"
              >
                <div className="flex items-start gap-3 w-full sm:w-auto">
                  <div className="mt-1 hidden sm:block">
                    {getSeverityIcon(alert.severity)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 sm:hidden mb-1">
                      {getSeverityIcon(alert.severity)}
                      <span
                        className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${getBadge(
                          alert.severity
                        )}`}
                      >
                        {alert.severity}
                      </span>
                    </div>
                    <h3 className="font-semibold text-sm sm:text-base text-slate-800 truncate">
                      {alert.title}
                    </h3>
                    <p className="mt-0.5 sm:mt-1 text-xs sm:text-sm text-slate-500 line-clamp-2 sm:line-clamp-1">
                      {alert.message}
                    </p>
                    <div className="mt-1.5 sm:mt-2 flex flex-wrap items-center gap-2 sm:gap-4 text-xs text-slate-400">
                      <span>Namespace: {alert.namespace}</span>
                      <span className="hidden sm:inline">•</span>
                      <span>Resource: {alert.resource}</span>
                      <span className="hidden sm:inline">•</span>
                      <span className="sm:hidden">
                        {new Date(alert.time).toLocaleDateString()}
                      </span>
                      <span className="hidden sm:inline">
                        {new Date(alert.time).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="hidden sm:block">
                  <span
                    className={`rounded-full px-3 py-1 text-sm font-semibold ${getBadge(
                      alert.severity
                    )}`}
                  >
                    {alert.severity}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}