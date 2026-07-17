
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Shield,
  Server,
  Bell,
  Lock,
  Mail,
  ArrowRight,
} from "lucide-react";
import { BACKEND_URL } from "../config";

export default function Login() {
  const navigate = useNavigate();

  const [loading, setLoading] =
    useState(false);

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    try {
      setLoading(true);

      await axios.post(
        `${BACKEND_URL}/api/auth/login`,
        {
          email,
          password,
        },
        {
          withCredentials: true,
        }
      );

      navigate("/dashboard");
    } catch (error: any) {
      alert(
        error?.response?.data?.message ||
          "Login failed"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* LEFT SIDE */}
        <div className="hidden lg:flex flex-col justify-between bg-slate-950 p-12 text-white">
          <div>
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-white/10 p-3">
                <Shield size={24} />
              </div>

              <h1 className="text-2xl font-bold">
                KubeChatOps
              </h1>
            </div>

            <h2 className="mt-16 text-5xl font-bold leading-tight">
              Manage Kubernetes
              <br />
              directly from chat.
            </h2>

            <p className="mt-6 max-w-md text-lg text-slate-400">
              Connect Telegram, Discord,
              and Slack to monitor,
              restart, and manage
              Kubernetes workloads.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4">
              <Server size={22} />
              <div>
                <h3 className="font-medium">
                  Cluster Management
                </h3>
                <p className="text-sm text-slate-400">
                  Monitor pods,
                  deployments and nodes
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4">
              <Bell size={22} />
              <div>
                <h3 className="font-medium">
                  Real-time Alerts
                </h3>
                <p className="text-sm text-slate-400">
                  Get notified instantly
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4">
              <Shield size={22} />
              <div>
                <h3 className="font-medium">
                  Secure Access
                </h3>
                <p className="text-sm text-slate-400">
                  Organization-based
                  authentication
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center justify-center px-6 py-10">
          <div className="w-full max-w-md">
            <div className="rounded-3xl border border-slate-200 bg-white/80 p-8 shadow-xl backdrop-blur">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-slate-900">
                  Welcome Back
                </h2>

                <p className="mt-2 text-slate-500">
                  Sign in to your account
                </p>
              </div>

              <form
                onSubmit={handleSubmit}
                className="space-y-5"
              >
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Email
                  </label>

                  <div className="relative">
                    <Mail
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type="email"
                      value={email}
                      onChange={(e) =>
                        setEmail(
                          e.target.value
                        )
                      }
                      placeholder="john@example.com"
                      className="w-full rounded-xl border border-slate-200 py-3 pl-12 pr-4 outline-none transition focus:border-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Password
                  </label>

                  <div className="relative">
                    <Lock
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type="password"
                      value={password}
                      onChange={(e) =>
                        setPassword(
                          e.target.value
                        )
                      }
                      placeholder="••••••••"
                      className="w-full rounded-xl border border-slate-200 py-3 pl-12 pr-4 outline-none transition focus:border-slate-900"
                    />
                  </div>
                </div>

                <button
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 py-3 font-medium text-white transition hover:bg-slate-800 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Signing In...
                    </>
                  ) : (
                    <>
                      Sign In
                      <ArrowRight
                        size={18}
                      />
                    </>
                  )}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-slate-500">
                Don't have an account?{" "}
                <button
                  onClick={() =>
                    navigate(
                      "/signup"
                    )
                  }
                  className="font-semibold text-slate-900 hover:underline"
                >
                  Create Account
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
