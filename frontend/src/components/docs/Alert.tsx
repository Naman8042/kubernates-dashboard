export default function Alerts() {
  return (
    <div>
      <h1 className="text-5xl font-bold">
        Alerts
      </h1>

      <ul className="mt-8 space-y-4">
        <li>🚨 Pod CrashLoopBackOff</li>
        <li>🚨 Node Not Ready</li>
        <li>🚨 High CPU Usage</li>
        <li>🚨 High Memory Usage</li>
      </ul>
    </div>
  );
}