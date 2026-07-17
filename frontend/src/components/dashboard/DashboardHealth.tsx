import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Activity,
} from "lucide-react";

interface DashboardHealthProps {
  runningPods: number;
  pendingPods: number;
  failedPods: number;
  restartingPods?: number;
}

export default function DashboardHealth({
  runningPods,
  pendingPods,
  failedPods,
  restartingPods = 0,
}: DashboardHealthProps) {
  const healthy =
    failedPods === 0 &&
    pendingPods === 0;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">
            Cluster Health
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Current Kubernetes health
          </p>
        </div>

        <div
          className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${
            healthy
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          <Activity size={16} />

          {healthy
            ? "Healthy"
            : "Issues Detected"}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="flex items-center justify-between rounded-xl bg-green-50 p-4">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="text-green-600" />

            <div>
              <p className="text-sm text-slate-500">
                Running Pods
              </p>

              <h3 className="text-xl font-bold">
                {runningPods}
              </h3>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between rounded-xl bg-yellow-50 p-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="text-yellow-600" />

            <div>
              <p className="text-sm text-slate-500">
                Pending Pods
              </p>

              <h3 className="text-xl font-bold">
                {pendingPods}
              </h3>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between rounded-xl bg-red-50 p-4">
          <div className="flex items-center gap-3">
            <XCircle className="text-red-600" />

            <div>
              <p className="text-sm text-slate-500">
                Failed Pods
              </p>

              <h3 className="text-xl font-bold">
                {failedPods}
              </h3>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between rounded-xl bg-blue-50 p-4">
          <div className="flex items-center gap-3">
            <Activity className="text-blue-600" />

            <div>
              <p className="text-sm text-slate-500">
                Restarting Pods
              </p>

              <h3 className="text-xl font-bold">
                {restartingPods}
              </h3>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <div className="mb-2 flex justify-between text-sm">
          <span>Cluster Health</span>

          <span>
            {healthy ? "100%" : "75%"}
          </span>
        </div>

        <div className="h-3 overflow-hidden rounded-full bg-slate-200">
          <div
            className={`h-full rounded-full transition-all ${
              healthy
                ? "w-full bg-green-500"
                : "w-3/4 bg-yellow-500"
            }`}
          />
        </div>
      </div>
    </div>
  );
}