import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../config";

import {
  Shield,
  Building2,
  User,
  Mail,
  Lock,
  ArrowRight,
  Server,
  Bell,
} from "lucide-react";

export default function Signup() {
  const navigate = useNavigate();

  const [loading, setLoading] =
    useState(false);

  const [form, setForm] =
    useState({
      name: "",
      organizationName: "",
      email: "",
      password: "",
    });

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    try {
      setLoading(true);

      await axios.post(
         `${BACKEND_URL}/api/auth/register`,
        {
          name: form.name,
          organizationName:
            form.organizationName,
          email: form.email,
          password: form.password,
        },
        {
          withCredentials: true,
        }
      );

      navigate("/login");
    } catch (error: any) {
      alert(
        error?.response?.data?.message ||
          "Signup failed"
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
              Start Managing
              <br />
              Kubernetes Smarter
            </h2>

            <p className="mt-6 max-w-md text-lg text-slate-400">
              Connect clusters,
              receive alerts,
              monitor workloads and
              manage everything from
              Telegram, Discord and
              Slack.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4">
              <Server size={22} />
              <div>
                <h3 className="font-medium">
                  Multi Cluster
                  Management
                </h3>
                <p className="text-sm text-slate-400">
                  Manage all your
                  clusters in one
                  place
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
                  Get notified about
                  failures instantly
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
                  Organization based
                  authentication
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* FORM */}
        <div className="flex items-center justify-center px-6 py-10">
          <div className="w-full max-w-md">
            <div className="rounded-3xl border border-slate-200 bg-white/80 p-8 shadow-xl backdrop-blur">
              <h2 className="text-3xl font-bold text-slate-900">
                Create Account
              </h2>

              <p className="mt-2 text-slate-500">
                Start your DevOps
                journey with
                KubeChatOps
              </p>

              <form
                onSubmit={
                  handleSubmit
                }
                className="mt-8 space-y-5"
              >
                <div className="relative">
                  <User
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    placeholder="Full Name"
                    value={
                      form.name
                    }
                    onChange={(
                      e
                    ) =>
                      setForm({
                        ...form,
                        name:
                          e.target
                            .value,
                      })
                    }
                    className="w-full rounded-xl border border-slate-200 py-3 pl-12 pr-4 outline-none transition focus:border-slate-900"
                  />
                </div>

                <div className="relative">
                  <Building2
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    placeholder="Organization Name"
                    value={
                      form.organizationName
                    }
                    onChange={(
                      e
                    ) =>
                      setForm({
                        ...form,
                        organizationName:
                          e.target
                            .value,
                      })
                    }
                    className="w-full rounded-xl border border-slate-200 py-3 pl-12 pr-4 outline-none transition focus:border-slate-900"
                  />
                </div>

                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="email"
                    placeholder="Email"
                    value={
                      form.email
                    }
                    onChange={(
                      e
                    ) =>
                      setForm({
                        ...form,
                        email:
                          e.target
                            .value,
                      })
                    }
                    className="w-full rounded-xl border border-slate-200 py-3 pl-12 pr-4 outline-none transition focus:border-slate-900"
                  />
                </div>

                <div className="relative">
                  <Lock
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="password"
                    placeholder="Password"
                    value={
                      form.password
                    }
                    onChange={(
                      e
                    ) =>
                      setForm({
                        ...form,
                        password:
                          e.target
                            .value,
                      })
                    }
                    className="w-full rounded-xl border border-slate-200 py-3 pl-12 pr-4 outline-none transition focus:border-slate-900"
                  />
                </div>

                <button
                  disabled={
                    loading
                  }
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 py-3 font-medium text-white transition hover:bg-slate-800 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Creating...
                    </>
                  ) : (
                    <>
                      Create Account
                      <ArrowRight
                        size={18}
                      />
                    </>
                  )}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-slate-500">
                Already have an
                account?{" "}
                <button
                  onClick={() =>
                    navigate(
                      "/login"
                    )
                  }
                  className="font-semibold text-slate-900 hover:underline"
                >
                  Sign In
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
