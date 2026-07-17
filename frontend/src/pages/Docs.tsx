import React from 'react'
import {
  BookOpen,
  Terminal,
  MessageCircle,
  ChevronRight,
  Shield,
  Rocket, 
} from "lucide-react";
import GettingStartedPage from '../components/docs/Gettingstarted';
import InstallationPage from '../components/docs/Installation';
import RbacPage from '../components/docs/Rbacsetup'
import AgentDeploymentPage from '../components/docs/Agentdeployment';
import TelegramPage from '../components/docs/Telegram';
import DiscordPage from '../components/docs/Discord';

interface SidebarProps {
  activeItem: string;
  setActiveItem: React.Dispatch<React.SetStateAction<string>>;
} 

// Sidebar component
const Sidebar = ({ activeItem, setActiveItem }:SidebarProps) => {
  const sidebarItems = [
    { id: "getting-started", title: "Getting Started", icon: BookOpen },
    { id: "installation", title: "Installation", icon: Terminal },
    { id: "rbac", title: "RBAC Setup", icon: Shield },
    { id: "agent-deployment", title: "Agent Deployment", icon: Rocket },
    { id: "telegram", title: "Telegram", icon: MessageCircle },
    { id: "discord", title: "Discord", icon: MessageCircle },
    // { id: "slack", title: "Slack", icon: MessageCircle },
  ];

  return (
    <aside className="sticky top-16 hidden h-[calc(100vh-64px)] w-72 overflow-y-auto border-r bg-white lg:block">
      <div className="p-5">
        <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
          Documentation
        </p>

        <nav className="space-y-1">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveItem(item.id)}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition ${
                  isActive
                    ? "bg-blue-50 text-blue-700"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                <Icon size={18} className={isActive ? "text-blue-700" : ""} />
                <span className={isActive ? "font-medium" : ""}>{item.title}</span>
                {isActive && (
                  <ChevronRight size={16} className="ml-auto text-blue-700" />
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};


// Main Docs Component
export default function DocsPage() {
  const [activeItem, setActiveItem] = React.useState("getting-started");

  const renderPage = () => {
    switch (activeItem) {
      case "getting-started":
        return <GettingStartedPage />;
      case "installation":
        return <InstallationPage />;
      case "rbac":
        return <RbacPage />;
      case "agent-deployment":
        return <AgentDeploymentPage />;
      case "telegram":
        return <TelegramPage />;
      case "discord":
        return <DiscordPage />;
      default:
        return <GettingStartedPage />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto flex max-w-7xl">
        <Sidebar activeItem={activeItem} setActiveItem={setActiveItem} />

        <main className="flex-1 px-6 py-10 lg:px-12">
          {renderPage()}
        </main>

        {/* <aside className="sticky top-20 hidden h-fit w-64 p-6 xl:block">
          <div className="rounded-2xl border bg-white p-5">
            <h3 className="font-semibold">On this page</h3>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <a href="#" className="block hover:text-blue-600">Overview</a>
              <a href="#" className="block hover:text-blue-600">Installation</a>
              <a href="#" className="block hover:text-blue-600">Configuration</a>
              <a href="#" className="block hover:text-blue-600">Commands</a>
              <a href="#" className="block hover:text-blue-600">Integrations</a>
            </div>
          </div>
        </aside> */}
      </div>
    </div>
  );
}