import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Server, Plus, Trash2, ExternalLink } from "lucide-react";

import { BACKEND_URL } from "../config";

export default function Clusters() {
  const [clusters, setClusters] = useState<any[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [error, setError] = useState("");
  const [name, setName] = useState("");

  async function fetchClusters() {
    const res = await axios.get(`${BACKEND_URL}/api/clusters`, {
      withCredentials: true,
    });

    setClusters(res.data);
  }

async function createCluster() {
  if (!name.trim()) {
    setError("Cluster name is required");
    return;
  }

  await axios.post(
    `${BACKEND_URL}/api/clusters`,
    { name: name.trim() },
    {
      withCredentials: true,
    }
  );

  setName("");
  setError("");
  setShowCreateModal(false);

  fetchClusters();
}

  async function deleteCluster(id: number) {
    await axios.delete(`${BACKEND_URL}/api/clusters/${id}`, {
      withCredentials: true,
    });

    fetchClusters();
  }

  useEffect(() => {
    fetchClusters();
  }, []);

  return (
  <>
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="inline-flex items-center rounded-full bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-700">
              Kubernetes Management
            </div>

            <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Clusters
            </h1>

            <p className="mt-2 max-w-2xl text-slate-600">
              Create and manage your Kubernetes clusters from one place.
              Connect new clusters and start managing workloads instantly.
            </p>
          </div>

          <button
            onClick={() => {
              setName("");
              setError("");
              setShowCreateModal(true);
            }}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-6 py-3 font-semibold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-xl"
          >
            <Plus size={18} />
            New Cluster
          </button>
        </div>

        {/* Empty State */}
        {clusters.length === 0 && (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white py-24 text-center shadow-sm">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
              <Server
                size={36}
                className="text-slate-500"
              />
            </div>

            <h2 className="mt-6 text-2xl font-bold text-slate-900">
              No Clusters Yet
            </h2>

            <p className="mx-auto mt-3 max-w-md text-slate-500">
              Create your first Kubernetes cluster and connect it with
              KubeChatOps.
            </p>

            <button
              onClick={() => {
                setName("");
                setError("");
                setShowCreateModal(true);
              }}
              className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              <Plus size={18} />
              Create First Cluster
            </button>
          </div>
        )}

        {/* Cards */}
        {clusters.length > 0 && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {clusters.map((cluster) => (
              <div
                key={cluster.id}
                className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                {/* Top */}
                <div className="flex items-center justify-between border-b bg-gradient-to-r from-slate-50 to-white p-6">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100">
                    <Server
                      size={28}
                      className="text-blue-600"
                    />
                  </div>

                  <span
                    className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                      cluster.status === "online"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    <span
                      className={`h-2 w-2 rounded-full ${
                        cluster.status === "online"
                          ? "bg-green-500"
                          : "bg-red-500"
                      }`}
                    />

                    {cluster.status}
                  </span>
                </div>

                {/* Body */}
                <div className="p-6">
                  <h2 className="truncate text-xl font-bold text-slate-900">
                    {cluster.name ||
                      `Cluster #${cluster.id}`}
                  </h2>

                  <div className="mt-5 space-y-3 rounded-2xl bg-slate-50 p-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-500">
                        Cluster ID
                      </span>

                      <span className="font-semibold text-slate-800">
                        #{cluster.id}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-slate-500">
                        Created
                      </span>

                      <span className="font-medium text-slate-800">
                        {new Date(
                          cluster.createdAt
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="mt-6 flex gap-3">
                    <Link
                      to={`/clusters/${cluster.id}`}
                      className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-slate-900 py-3 font-semibold text-white transition hover:bg-slate-800"
                    >
                      <ExternalLink size={17} />
                      Open
                    </Link>

                    <button
                      onClick={() =>
                        deleteCluster(cluster.id)
                      }
                      className="flex h-12 w-12 items-center justify-center rounded-2xl border border-red-200 text-red-600 transition hover:bg-red-50"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>

    {/* Create Cluster Modal */}
{showCreateModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
    <div className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200">
      {/* Header */}
      <div className="border-b border-slate-200 px-6 py-5">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100">
            <Server
              size={24}
              className="text-blue-600"
            />
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Create Cluster
            </h2>

            <p className="text-sm text-slate-500">
              Give your Kubernetes cluster a name.
            </p>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="space-y-5 p-6">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Cluster Name
          </label>

          <input
            autoFocus
            value={name}
            maxLength={40}
            onChange={(e) => {
              setName(e.target.value);
              setError("");
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                createCluster();
              }
            }}
            placeholder="Production Cluster"
            className={`w-full rounded-2xl border px-4 py-3 outline-none transition-all focus:ring-4 ${
              error
                ? "border-red-400 focus:ring-red-100"
                : "border-slate-300 focus:border-blue-500 focus:ring-blue-100"
            }`}
          />

          {error && (
            <p className="mt-2 text-sm font-medium text-red-600">
              {error}
            </p>
          )}
        </div>

        <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
          A unique cluster token will be generated automatically after
          creation. You can then download the deployment manifests and connect
          your Kubernetes cluster.
        </div>
      </div>

      {/* Footer */}
      <div className="flex flex-col-reverse gap-3 border-t border-slate-200 bg-slate-50 px-6 py-5 sm:flex-row sm:justify-end">
        <button
          onClick={() => {
            setShowCreateModal(false);
            setName("");
            setError("");
          }}
          className="rounded-2xl border border-slate-300 px-5 py-3 font-medium transition hover:bg-white"
        >
          Cancel
        </button>

        <button
          onClick={createCluster}
          disabled={!name.trim()}
          className="flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-6 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Plus size={18} />
          Create Cluster
        </button>
      </div>
    </div>
  </div>
)}

</>
);
}
