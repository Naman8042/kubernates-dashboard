import { useEffect, useState } from "react";
import axios from "axios";
import {
  Search,
  AlertTriangle,
  Info,
  CheckCircle2,
  RefreshCw,
  Filter,
} from "lucide-react";
import { BACKEND_URL } from "../config";

interface EventItem {
  type: string;
  reason: string;
  message: string;
  namespace: string;
  object: string;
  count: number;
  firstTimestamp: string;
  lastTimestamp: string;
}

export default function Events() {
  const [clusters, setClusters] = useState<any[]>([]);
  const [selectedCluster, setSelectedCluster] = useState("");
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
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
        setSelectedCluster(String(res.data[0].id));
        fetchEvents(String(res.data[0].id));
      }
    } catch (e) {
      console.error(e);
    }
  }

  async function fetchEvents(clusterId: string) {
    try {
      setLoading(true);
      const res = await axios.get(
        `${BACKEND_URL}/api/events/${clusterId}`,
        {
          withCredentials: true,
        }
      );
      setEvents(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  function badge(type: string) {
    switch (type) {
      case "Warning":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 sm:px-3 py-1 text-xs font-semibold text-red-600">
            <AlertTriangle size={14} />
            Warning
          </span>
        );
      case "Normal":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 sm:px-3 py-1 text-xs font-semibold text-green-600">
            <CheckCircle2 size={14} />
            Normal
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 sm:px-3 py-1 text-xs font-semibold text-blue-600">
            <Info size={14} />
            {type}
          </span>
        );
    }
  }

  function getEventIcon(type: string) {
    switch (type) {
      case "Warning":
        return <AlertTriangle className="text-red-500" size={18} />;
      case "Normal":
        return <CheckCircle2 className="text-green-500" size={18} />;
      default:
        return <Info className="text-blue-500" size={18} />;
    }
  }

  // Filter events based on search and type
  const filteredEvents = events.filter((event) => {
    const matchesSearch = 
      event.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.object.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.namespace.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || event.type.toLowerCase() === filterType.toLowerCase();
    return matchesSearch && matchesType;
  });

  return (
    <div className="min-h-screen flex-1 bg-slate-50 p-3 sm:p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Top Bar */}
        <div className="mb-4 sm:mb-6 md:mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
          <div className="relative w-full sm:w-64 md:w-80 lg:w-96">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <select
              value={selectedCluster}
              onChange={(e) => {
                setSelectedCluster(e.target.value);
                fetchEvents(e.target.value);
              }}
              className="flex-1 sm:flex-none rounded-lg border border-slate-200 bg-white px-3 sm:px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {clusters.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            <button
              onClick={() => fetchEvents(selectedCluster)}
              className="flex items-center justify-center gap-1 sm:gap-2 rounded-lg bg-blue-600 px-3 sm:px-4 py-2 text-sm text-white hover:bg-blue-700 transition flex-1 sm:flex-none"
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
              <span className="hidden sm:inline">Refresh</span>
              <span className="sm:hidden">↻</span>
            </button>
          </div>
        </div>

        {/* Header */}
        <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Kubernetes Events</h1>
            <p className="mt-0.5 sm:mt-1 text-sm sm:text-base text-slate-500">
              Recent cluster activity
            </p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
              className="sm:hidden flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm w-full"
            >
              <Filter size={16} />
              Filter: {filterType === "all" ? "All" : filterType}
            </button>
          </div>
        </div>

        {/* Mobile Filter Dropdown */}
        {isMobileFiltersOpen && (
          <div className="sm:hidden mb-4 p-4 bg-white rounded-lg border border-slate-200">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
            >
              <option value="all">All Types</option>
              <option value="normal">Normal</option>
              <option value="warning">Warning</option>
            </select>
          </div>
        )}

        {/* Filter - Desktop */}
        <div className="hidden sm:flex items-center gap-3 mb-4 sm:mb-6">
          <span className="text-sm text-slate-500">Filter:</span>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Types</option>
            <option value="normal">Normal</option>
            <option value="warning">Warning</option>
          </select>
          <span className="text-sm text-slate-500 ml-2">
            Showing {filteredEvents.length} of {events.length} events
          </span>
        </div>

        {/* Mobile event count */}
        <div className="sm:hidden text-xs text-slate-500 mb-3">
          Showing {filteredEvents.length} of {events.length} events
        </div>

        {/* Table / Cards */}
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead className="border-b bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-4 sm:px-6 py-3 sm:py-4 text-left">Type</th>
                  <th className="px-4 sm:px-6 py-3 sm:py-4 text-left">Reason</th>
                  <th className="px-4 sm:px-6 py-3 sm:py-4 text-left">Object</th>
                  <th className="px-4 sm:px-6 py-3 sm:py-4 text-left">Namespace</th>
                  <th className="px-4 sm:px-6 py-3 sm:py-4 text-left">Message</th>
                  <th className="px-4 sm:px-6 py-3 sm:py-4 text-left">Count</th>
                  <th className="px-4 sm:px-6 py-3 sm:py-4 text-left">Last Seen</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="py-10 sm:py-12 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-300 border-t-blue-600" />
                        <span className="text-sm text-slate-500">Loading events...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredEvents.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-10 sm:py-12 text-center text-slate-500">
                      <Info className="mx-auto text-slate-300" size={32} />
                      <p className="mt-2 text-sm">No events found</p>
                    </td>
                  </tr>
                ) : (
                  filteredEvents.map((event, index) => (
                    <tr key={index} className="border-b hover:bg-slate-50 transition">
                      <td className="px-4 sm:px-6 py-3 sm:py-4">{badge(event.type)}</td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 font-semibold text-sm">{event.reason}</td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 text-sm">{event.object}</td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 text-sm">{event.namespace}</td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 text-sm text-slate-600 max-w-xs truncate">
                        {event.message}
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 text-sm">{event.count}</td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 text-sm whitespace-nowrap">
                        {new Date(event.lastTimestamp).toLocaleString()}
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
              <div className="p-8 text-center">
                <div className="flex flex-col items-center gap-3">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-300 border-t-blue-600" />
                  <span className="text-sm text-slate-500">Loading events...</span>
                </div>
              </div>
            ) : filteredEvents.length === 0 ? (
              <div className="p-8 text-center text-slate-500">
                <Info className="mx-auto text-slate-300" size={32} />
                <p className="mt-2 text-sm">No events found</p>
              </div>
            ) : (
              filteredEvents.map((event, index) => (
                <div key={index} className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      {getEventIcon(event.type)}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm text-slate-800 truncate">
                          {event.reason}
                        </h3>
                        <p className="text-xs text-slate-500 truncate">
                          {event.object}
                        </p>
                      </div>
                    </div>
                    <span className="shrink-0">{badge(event.type)}</span>
                  </div>

                  <div className="space-y-1.5">
                    <p className="text-xs text-slate-600 line-clamp-2">
                      {event.message}
                    </p>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                      <span>Namespace: {event.namespace}</span>
                      <span>•</span>
                      <span>Count: {event.count}</span>
                      <span>•</span>
                      <span className="truncate">
                        {new Date(event.lastTimestamp).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}