import { NavLink, Outlet } from "react-router-dom";
import {
  BookOpen,
  Terminal,
  Bot,
  MessageCircle,
  Bell,
  Server,
} from "lucide-react";

const docs = [
  {
    name: "Getting Started",
    path: "/docs",
    icon: BookOpen,
  },
  {
    name: "Installation",
    path: "/docs/installation",
    icon: Terminal,
  },
  {
    name: "Cluster Agent",
    path: "/docs/cluster-agent",
    icon: Server,
  },
  {
    name: "Telegram",
    path: "/docs/telegram",
    icon: MessageCircle,
  },
  {
    name: "Discord",
    path: "/docs/discord",
    icon: MessageCircle,
  },
  {
    name: "Slack",
    path: "/docs/slack",
    icon: MessageCircle,
  },
  {
    name: "Commands",
    path: "/docs/commands",
    icon: Bot,
  },
  {
    name: "Alerts",
    path: "/docs/alerts",
    icon: Bell,
  },
];

export default function DocsLayout() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto flex max-w-7xl">
        <aside className="sticky top-0 h-screen w-72 border-r bg-white p-5">
          <h2 className="mb-6 text-xl font-bold">
            KubeChatOps Docs
          </h2>

          <nav className="space-y-2">
            {docs.map((doc) => {
              const Icon = doc.icon;

              return (
                <NavLink
                  key={doc.path}
                  to={doc.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-xl px-4 py-3 ${
                      isActive
                        ? "bg-blue-50 text-blue-600"
                        : "hover:bg-slate-100"
                    }`
                  }
                >
                  <Icon size={18} />
                  {doc.name}
                </NavLink>
              );
            })}
          </nav>
        </aside>

        <main className="flex-1 p-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}