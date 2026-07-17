export default function ClusterAgent() {
  return (
    <div>
      <h1 className="text-5xl font-bold">
        Cluster Agent
      </h1>

      <p className="mt-4">
        The Cluster Agent connects
        your Kubernetes cluster to
        KubeChatOps.
      </p>

      <div className="mt-8 rounded-xl bg-slate-950 p-6 text-green-400">
{`KUBECHATOPS_TOKEN=abc123 node agent.js`}
      </div>
    </div>
  );
}