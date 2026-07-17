import {
  AlertTriangle,
  CheckCircle2,
  Info,
  Clock,
} from "lucide-react";

interface Event {
  reason: string;
  message: string;
  namespace: string;
  type: string;
  time: string;
}

interface DashboardEventsProps {
  events: Event[];
}

export default function DashboardEvents({
  events,
}: DashboardEventsProps) {
  function getIcon(type: string) {
    switch (type) {
      case "Warning":
        return (
          <AlertTriangle
            size={18}
            className="text-amber-500"
          />
        );

      case "Normal":
        return (
          <CheckCircle2
            size={18}
            className="text-green-600"
          />
        );

      default:
        return (
          <Info
            size={18}
            className="text-blue-600"
          />
        );
    }
  }

  function getBadge(type: string) {
    switch (type) {
      case "Warning":
        return "bg-amber-100 text-amber-700";

      case "Normal":
        return "bg-green-100 text-green-700";

      default:
        return "bg-blue-100 text-blue-700";
    }
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
        <div>
          <h2 className="text-lg font-semibold">
            Recent Events
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Latest Kubernetes events
          </p>
        </div>

        <Clock className="text-slate-400" />
      </div>

      <div className="max-h-[420px] overflow-y-auto">
        {events.length === 0 ? (
          <div className="py-12 text-center text-slate-500">
            No recent events
          </div>
        ) : (
          events.map((event, index) => (
            <div
              key={index}
              className="border-b border-slate-100 p-5 transition hover:bg-slate-50 last:border-none"
            >
              <div className="flex items-start gap-4">
                <div className="mt-1">
                  {getIcon(event.type)}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-slate-900">
                      {event.reason}
                    </h3>

                    <span
                      className={`rounded-full px-2 py-1 text-xs font-semibold ${getBadge(
                        event.type
                      )}`}
                    >
                      {event.type}
                    </span>
                  </div>

                  <p className="mt-2 text-sm text-slate-600">
                    {event.message}
                  </p>

                  <div className="mt-3 flex items-center gap-6 text-xs text-slate-400">
                    <span>
                      Namespace:{" "}
                      <strong>
                        {event.namespace}
                      </strong>
                    </span>

                    <span>{event.time}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}