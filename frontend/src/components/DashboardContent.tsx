import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../config";
import Loader from "./Loader";
import DashboardClusterSelector from "../components/dashboard/DashboardCluster";
import DashboardStats from "../components/dashboard/DashboardStats";
import DashboardHealth from "../components/dashboard/DashboardHealth";
import DashboardCharts from "../components/dashboard/DashboardCharts";
import DashboardEvents from "../components/dashboard/DashboardEvents";
import DashboardAlerts from "../components/dashboard/DashboardAlerts";
import DashboardDeployments from "../components/dashboard/DashboardDeployments";
import DashboardNamespaces from "../components/dashboard/DashboardNamespace";

interface Pod {
  status: string;
  namespace: string;
  // Add other pod properties as needed
}

interface Deployment {
  name: string;
  namespace: string;
  replicas: number;
  readyReplicas: number;
}

interface Cluster {
  id: number;
  name: string;
  status: string;
}

interface Event {
  reason: string;
  message: string;
  namespace: string;
  type: string;
  time: string;
}

export default function Dashboard() {
  const [clusters, setClusters] = useState<Cluster[]>([]);
  const [selectedCluster, setSelectedCluster] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [pods, setPods] = useState<Pod[]>([]);
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    fetchClusters();
  }, []);

  async function fetchClusters() {
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
      fetchDashboard(id);
    }
  }

  async function fetchDashboard(clusterId: string) {
    try {
      setLoading(true);

      const [podsRes, depRes, eventRes, alertsRes] = await Promise.all([
        axios.get(`${BACKEND_URL}/pods/${clusterId}`, {
          withCredentials: true,
        }),
        axios.get(`${BACKEND_URL}/api/deployments/${clusterId}`, {
          withCredentials: true,
        }),
        axios.get(`${BACKEND_URL}/api/events/${clusterId}`, {
          withCredentials: true,
        }),
        axios.get(`${BACKEND_URL}/api/alerts/${clusterId}`, {
          withCredentials: true,
        }),
      ]);

      setPods(podsRes.data);
      setDeployments(depRes.data);
      setEvents(eventRes.data);
      setAlerts(alertsRes.data);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  }

  const runningPods = pods.filter(
    (p: Pod) => p.status === "Running"
  ).length;

  const pendingPods = pods.filter(
    (p: Pod) => p.status === "Pending"
  ).length;

  const failedPods = pods.filter(
    (p: Pod) => p.status === "Failed"
  ).length;

  const namespaceMap: Record<string, number> = {};

  pods.forEach((pod: Pod) => {
    namespaceMap[pod.namespace] =
      (namespaceMap[pod.namespace] || 0) + 1;
  });

  const namespaceChart = Object.entries(namespaceMap).map(
    ([namespace, pods]) => ({
      namespace,
      pods,
    })
  );

  const deploymentChart = [
    {
      name: "Ready",
      value: deployments.filter(
        (d: Deployment) => d.readyReplicas === d.replicas
      ).length,
    },
    {
      name: "Updating",
      value: deployments.filter(
        (d: Deployment) =>
          d.readyReplicas < d.replicas && d.readyReplicas > 0
      ).length,
    },
    {
      name: "Unavailable",
      value: deployments.filter(
        (d: Deployment) => d.readyReplicas === 0
      ).length,
    },
  ];

  const namespaceTable = Object.entries(namespaceMap).map(
    ([namespace, podCount]) => ({
      name: namespace,
      pods: podCount,
      deployments: deployments.filter(
        (d: Deployment) => d.namespace === namespace
      ).length,
      services: 0,
      status: "Healthy" as const,
    })
  );

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 p-3 sm:p-4 md:p-6 lg:p-8 bg-slate-50 min-h-screen">
      {/* Cluster Selector - Full width on mobile */}
      <div className="w-full">
        <DashboardClusterSelector
          clusters={clusters}
          selectedCluster={selectedCluster}
          onChange={(id: string) => {
            setSelectedCluster(id);
            fetchDashboard(id);
          }}
        />
      </div>

      {/* Stats Cards - Responsive grid */}
      <div className="w-full">
        <DashboardStats
          pods={pods.length}
          deployments={deployments.length}
          nodes={0}
          alerts={alerts.length}
        />
      </div>

      {/* Health Cards - Responsive grid */}
      <div className="w-full">
        <DashboardHealth
          runningPods={runningPods}
          pendingPods={pendingPods}
          failedPods={failedPods}
        />
      </div>

      {/* Charts - Stack on mobile */}
      <div className="w-full">
        <DashboardCharts
          namespaces={namespaceChart}
          deploymentStatus={deploymentChart}
        />
      </div>

      {/* Events and Alerts - Stack on mobile, side by side on large screens */}
      <div className="grid grid-cols-1 gap-4 sm:gap-6 xl:grid-cols-2">
        <div className="w-full min-w-0">
          <DashboardEvents events={events} />
        </div>
        <div className="w-full min-w-0">
          <DashboardAlerts alerts={alerts} />
        </div>
      </div>

      {/* Deployments - Full width with horizontal scroll on mobile */}
      <div className="w-full overflow-hidden">
        <DashboardDeployments deployments={deployments} />
      </div>

      {/* Namespaces - Full width with horizontal scroll on mobile */}
      <div className="w-full overflow-hidden">
        <DashboardNamespaces namespaces={namespaceTable} />
      </div>
    </div>
  );
}