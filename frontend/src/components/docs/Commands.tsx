const commands = [
  ["/pods", "List pods"],
  ["/nodes", "List nodes"],
  ["/deployments", "List deployments"],
  ["/logs", "Fetch logs"],
  ["/restart", "Restart deployment"],
];

export default function Commands() {
  return (
    <div>
      <h1 className="text-5xl font-bold">
        Commands
      </h1>

      <div className="mt-8 overflow-hidden rounded-2xl border bg-white">
        {commands.map(([cmd, desc]) => (
          <div
            key={cmd}
            className="grid grid-cols-2 border-b px-6 py-4"
          >
            <code>{cmd}</code>
            <span>{desc}</span>
          </div>
        ))}
      </div>
    </div>
  );
}