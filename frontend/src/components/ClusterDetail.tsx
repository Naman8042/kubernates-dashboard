import axios from "axios";
import {
  Copy,
  Download,
  Server,
  Shield,
  Terminal,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import {
  useParams,
} from "react-router-dom";

import { BACKEND_URL } from "../config";

export default function ClusterDetails() {
  const { id } = useParams();

  const [cluster, setCluster] =
    useState<any>(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const res = await axios.get(
      `${BACKEND_URL}/api/clusters/${id}`,
      {
        withCredentials: true,
      }
    );

    setCluster(res.data);
  }

  if (!cluster) {
    return (
      <div>Loading...</div>
    );
  }

  const rbacYaml =
    cluster.rbacYaml;

  const deploymentYaml =
    cluster.deploymentYaml;

  const combinedYaml = `
${rbacYaml}

---

${deploymentYaml}
`;

  function copy(text: string) {
    navigator.clipboard.writeText(
      text
    );
  }

  function download(
    filename: string,
    content: string
  ) {
    const blob = new Blob(
      [content],
      {
        type: "text/yaml",
      }
    );

    const url =
      URL.createObjectURL(
        blob
      );

    const a =
      document.createElement(
        "a"
      );

    a.href = url;
    a.download = filename;

    a.click();
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold">
              {cluster.name}
            </h1>

            <p className="mt-2 text-slate-500">
              Cluster Details
            </p>
          </div>

          <span
            className={`rounded-full px-4 py-2 ${
              cluster.status ===
              "online"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {
              cluster.status
            }
          </span>
        </div>

        <div className="mb-8 grid gap-5 md:grid-cols-3">
          <div className="rounded-3xl border bg-white p-6">
            <Server className="mb-3 text-blue-600" />
            <h3>Status</h3>
            <p className="mt-2 text-2xl font-bold">
              {
                cluster.status
              }
            </p>
          </div>

          <div className="rounded-3xl border bg-white p-6">
            <Shield className="mb-3 text-purple-600" />
            <h3>RBAC</h3>
            <p className="mt-2 text-2xl font-bold">
              Enabled
            </p>
          </div>

          <div className="rounded-3xl border bg-white p-6">
            <Terminal className="mb-3 text-green-600" />
            <h3>Last Seen</h3>
            <p className="mt-2">
              {cluster.lastSeen
                ? new Date(
                    cluster.lastSeen
                  ).toLocaleString()
                : "Never"}
            </p>
          </div>
        </div>

        {/* Install */}

        <div className="mb-8 rounded-3xl border bg-white p-6">
          <h2 className="text-xl font-semibold">
            Installation
          </h2>

          <div className="mt-4 rounded-xl bg-slate-950 p-5 text-green-400">
            kubectl apply -f
            kubechatops-agent.yaml
          </div>

          <div className="mt-4 flex gap-3">
            <button
              onClick={() =>
                download(
                  "kubechatops-agent.yaml",
                  combinedYaml
                )
              }
              className="rounded-xl bg-slate-900 px-5 py-3 text-white"
            >
              Download YAML
            </button>

            <button
              onClick={() =>
                copy(
                  combinedYaml
                )
              }
              className="rounded-xl border px-5 py-3"
            >
              Copy YAML
            </button>
          </div>
        </div>

        {/* Token */}

        <div className="mb-8 rounded-3xl border bg-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">
              Cluster Token
            </h2>

            <button
              onClick={() =>
                copy(
                  cluster.clusterToken
                )
              }
            >
              <Copy />
            </button>
          </div>

          <code className="mt-4 block rounded-xl bg-slate-100 p-4">
            {
              cluster.clusterToken
            }
          </code>
        </div>

        {/* RBAC */}

        <div className="mb-8 overflow-hidden rounded-3xl border">
          <div className="flex items-center justify-between border-b bg-white p-5">
            <h2>
              RBAC Manifest
            </h2>

            <button
              onClick={() =>
                download(
                  "rbac.yaml",
                  rbacYaml
                )
              }
            >
              <Download />
            </button>
          </div>

          <pre className="overflow-auto bg-slate-950 p-5 text-green-400">
            {rbacYaml}
          </pre>
        </div>

        {/* Deployment */}

        <div className="overflow-hidden rounded-3xl border">
          <div className="flex items-center justify-between border-b bg-white p-5">
            <h2>
              Deployment Manifest
            </h2>

            <button
              onClick={() =>
                download(
                  "deployment.yaml",
                  deploymentYaml
                )
              }
            >
              <Download />
            </button>
          </div>

          <pre className="overflow-auto bg-slate-950 p-5 text-green-400">
            {
              deploymentYaml
            }
          </pre>
        </div>
      </div>
    </div>
  );
}