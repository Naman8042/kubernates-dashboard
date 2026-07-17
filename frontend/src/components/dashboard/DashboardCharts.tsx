import {
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

interface NamespaceData {
  namespace: string;
  pods: number;
}

interface DeploymentStatus {
  name: string;
  value: number;
}

interface Props {
  namespaces: NamespaceData[];
  deploymentStatus: DeploymentStatus[];
}

const COLORS = [
  "#3B82F6",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
];

export default function DashboardCharts({
  namespaces,
  deploymentStatus,
}: Props) {
  return (
    <div className="grid gap-6 xl:grid-cols-2">
      {/* Pods By Namespace */}

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-1 text-lg font-semibold">
          Pods by Namespace
        </h2>

        <p className="mb-6 text-sm text-slate-500">
          Distribution of pods across namespaces
        </p>

        <div className="h-[320px]">
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <BarChart data={namespaces}>
              <CartesianGrid
                strokeDasharray="3 3"
              />

              <XAxis
                dataKey="namespace"
              />

              <YAxis />

              <Tooltip />

              <Bar
                dataKey="pods"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Deployment Status */}

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-1 text-lg font-semibold">
          Deployment Status
        </h2>

        <p className="mb-6 text-sm text-slate-500">
          Current deployment health
        </p>

        <div className="h-[320px]">
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <PieChart>
              <Pie
                data={deploymentStatus}
                dataKey="value"
                nameKey="name"
                outerRadius={110}
                label
              >
                {deploymentStatus.map(
                  (_, index) => (
                    <Cell
                      key={index}
                      fill={
                        COLORS[
                          index %
                            COLORS.length
                        ]
                      }
                    />
                  )
                )}
              </Pie>

              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}