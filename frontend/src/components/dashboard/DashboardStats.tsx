import {
  Box,
  Rocket,
  Server,
  AlertCircle,
} from "lucide-react";

import StatCard from "./StatCard";

interface DashboardStatsProps {
  pods: number;
  deployments: number;
  nodes: number;
  alerts: number;
}

export default function DashboardStats({
  pods,
  deployments,
  nodes,
  alerts,
}: DashboardStatsProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      <StatCard
        title="Pods"
        value={pods}
        subtitle="Total Pods"
        icon={<Box size={24} />}
        color="bg-blue-100 text-blue-600"
      />

      <StatCard
        title="Deployments"
        value={deployments}
        subtitle="Active Deployments"
        icon={<Rocket size={24} />}
        color="bg-green-100 text-green-600"
      />

      <StatCard
        title="Nodes"
        value={nodes}
        subtitle="Cluster Nodes"
        icon={<Server size={24} />}
        color="bg-violet-100 text-violet-600"
      />

      <StatCard
        title="Alerts"
        value={alerts}
        subtitle="Critical Alerts"
        icon={<AlertCircle size={24} />}
        color="bg-red-100 text-red-600"
      />
    </div>
  );
}