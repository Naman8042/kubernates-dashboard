import {
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";

interface Alert {
  severity: "critical" | "warning" | "info";
  pod: string;
  namespace: string;
  status: string;
  message?: string;
}

interface DashboardAlertsProps {
  alerts: Alert[];
}

export default function DashboardAlerts({
  alerts,
}: DashboardAlertsProps) {
  if (alerts.length === 0) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-red-50 p-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Active Alerts
              </h2>

              <p className="text-sm text-slate-500">
                Cluster health notifications
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center py-14">
          <CheckCircle2 className="mb-4 h-14 w-14 text-green-500" />

          <h3 className="text-lg font-semibold text-slate-900">
            No Active Alerts
          </h3>

          <p className="mt-2 text-center text-sm text-slate-500">
            Your cluster is healthy.
            <br />
            No critical or warning events detected.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-red-50 p-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Active Alerts
            </h2>

            <p className="text-sm text-slate-500">
              {alerts.length} active issue
              {alerts.length > 1 ? "s" : ""}
            </p>
          </div>
        </div>

        <div className="rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700">
          {alerts.length}
        </div>
      </div>

      <div className="max-h-[430px] overflow-y-auto">
        {alerts.map((alert, index) => (
          <div
            key={`${alert.pod}-${index}`}
            className="border-b border-slate-100 p-5 transition hover:bg-slate-50 last:border-none"
          >
            <div className="flex items-start gap-4">
              <div
                className={`mt-1 rounded-xl p-2 ${
                  alert.severity === "critical"
                    ? "bg-red-100"
                    : "bg-yellow-100"
                }`}
              >
                {alert.severity === "critical" ? (
                  <AlertCircle className="h-5 w-5 text-red-600" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                )}
              </div>

              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold text-slate-900">
                    {alert.pod}
                  </h3>

                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                      alert.severity === "critical"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {alert.status}
                  </span>
                </div>

                <p className="mt-1 text-sm text-slate-500">
                  Namespace:{" "}
                  <span className="font-medium">
                    {alert.namespace}
                  </span>
                </p>

                {alert.message && (
                  <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <p className="font-mono text-xs leading-relaxed text-slate-700">
                      {alert.message}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 px-6 py-4">
        <p className="text-sm text-slate-500">
          Alerts are generated from pod health and container status.
        </p>

        <button className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100">
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </div>
    </div>
  );
}