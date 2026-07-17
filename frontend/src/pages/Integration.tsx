import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { useNavigate } from "react-router-dom";
import type { IconType } from "react-icons";
import { FaTelegramPlane, FaDiscord, FaSlack } from "react-icons/fa";
import {
  Shield,
  X,
  Calendar,
  Hash,
  Check,
  Copy,
  Trash2,
  Link2,
  ArrowUpRight,
  Clock,
  ExternalLink,
} from "lucide-react";

const DISCORD_OAUTH_URL =
  "https://discord.com/oauth2/authorize?client_id=1509956256071417977&permissions=117824&integration_type=0&scope=bot+applications.commands";

interface Integration {
  id: string;
  platform: "telegram" | "discord" | "slack";
  verified: boolean;
  externalId: string | null;
  username: string | null;
  createdAt: string | null;
  organizationId: string;
  isConnected?: boolean;
  platformId?: string;
  name?: string;
  color?: string;
  icon?: IconType;
  command?: string;
  available?: boolean;
}

interface Platform {
  id: "telegram" | "discord" | "slack";
  name: string;
  icon: IconType;
  color: string;
  available: boolean;
}

export default function Integrations() {
  const navigate = useNavigate();
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [generatedCode, setGeneratedCode] = useState("");
  const [codeLoading, setCodeLoading] = useState(false);
  const [selectedPlatformForCode, setSelectedPlatformForCode] = useState<Integration["platform"] | null>(null);
  const [confirmingDisconnect, setConfirmingDisconnect] = useState(false);
  const [copied, setCopied] = useState(false);
  const [waitlisted, setWaitlisted] = useState(false);
  const [showDiscordModal, setShowDiscordModal] = useState(false);
  const [urlCopied, setUrlCopied] = useState(false);

  const allPlatforms: Platform[] = [
    { id: "telegram", name: "Telegram", icon: FaTelegramPlane, color: "#24A1DE", available: true },
    { id: "discord", name: "Discord", icon: FaDiscord, color: "#5865F2", available: true },
    { id: "slack", name: "Slack", icon: FaSlack, color: "#DE1F69", available: false },
  ];

  const commandMap: Record<Platform["id"], string> = {
    telegram: "/start YOUR_CODE",
    discord: "!start YOUR_CODE",
    slack: "/kube connect YOUR_CODE",
  };

  useEffect(() => {
    fetchIntegrations();
  }, []);

  async function fetchIntegrations() {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/integrations`, {
        withCredentials: true,
      });
      setIntegrations(res.data);
    } catch (error) {
      console.error("Failed to fetch integrations:", error);
      // If the request fails (401 unauthorized), redirect to login
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  }

  async function generateCode(platform: Integration["platform"]) {
    setCodeLoading(true);
    setSelectedPlatformForCode(platform);
    try {
      const res = await axios.post(
        `${BACKEND_URL}/api/integrations/link-code`,
        { platform },
        { withCredentials: true }
      );
      setGeneratedCode(res.data.code);
      setCopied(false);
      setShowCodeModal(true);
    } catch (error) {
      console.error(error);
      // If unauthorized, redirect to login
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        navigate("/login");
      } else {
        navigate("/login");
        alert("Failed to generate verification code. Please Login First");
      }
    } finally {
      setCodeLoading(false);
    }
  }

  function handleConnect(platform: Integration["platform"]) {
    if (platform === "discord") {
      setUrlCopied(false);
      setShowDiscordModal(true);
      return;
    }
    generateCode(platform);
  }

  function copyDiscordUrl() {
    navigator.clipboard.writeText(DISCORD_OAUTH_URL);
    setUrlCopied(true);
    setTimeout(() => setUrlCopied(false), 1800);
  }

  async function joinWaitlist(platform: Integration["platform"]) {
    try {
      await axios.post(
        `${BACKEND_URL}/api/integrations/waitlist`,
        { platform },
        { withCredentials: true }
      );
      setWaitlisted(true);
    } catch (error) {
      console.error(error);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        navigate("/login");
      } else {
        alert("Failed to join waitlist. Please try again.");
      }
    }
  }

  async function disconnectIntegration(id: string) {
    if (!confirmingDisconnect) {
      setConfirmingDisconnect(true);
      return;
    }
    try {
      await axios.delete(`${BACKEND_URL}/api/integrations/${id}`, {
        withCredentials: true,
      });
      fetchIntegrations();
      setShowModal(false);
      setConfirmingDisconnect(false);
    } catch (error) {
      console.error(error);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        navigate("/login");
      } else {
        alert("Failed to disconnect integration.");
      }
    }
  }

  function copyCode() {
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  function formatDate(dateString: string | null) {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  function getDisplayIntegrations(): Integration[] {
    const result: Integration[] = [];
    allPlatforms.forEach((platform) => {
      const platformIntegrations = integrations.filter(
        (item) => item.platform === platform.id
      );
      if (platformIntegrations.length > 0) {
        platformIntegrations.forEach((item) => {
          result.push({
            ...item,
            name: platform.name,
            icon: platform.icon,
            color: platform.color,
            platformId: platform.id,
            isConnected: true,
            command: commandMap[platform.id],
            available: platform.available,
          });
        });
      } else {
        result.push({
          id: `not-connected-${platform.id}`,
          platform: platform.id,
          name: platform.name,
          icon: platform.icon,
          color: platform.color,
          platformId: platform.id,
          isConnected: false,
          verified: false,
          externalId: null,
          username: null,
          createdAt: null,
          organizationId: "",
          command: commandMap[platform.id],
          available: platform.available,
        });
      }
    });
    return result;
  }

  const displayIntegrations = getDisplayIntegrations();
  const totalConnections = integrations.length;
  const verifiedConnections = integrations.filter((i) => i.verified).length;
  const connectedPlatforms = new Set(integrations.map((i) => i.platform)).size;

  // If still loading, show spinner
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[#EEF0F3] border-t-[#4F46E5] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFBFC]" style={{ fontFamily: "'Inter', ui-sans-serif, system-ui" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500;600&display=swap');
        .font-mono { font-family: 'JetBrains Mono', ui-monospace, monospace; }
        @keyframes fade-up { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        .fade-up { animation: fade-up 0.25s ease-out; }
      `}</style>

      {/* Hero / header */}
      <div className="relative border-b border-[#EEF0F3] bg-white overflow-hidden">
        <div
          className="hidden md:block absolute -right-16 -top-24 w-[420px] h-[420px] rounded-full opacity-[0.16] blur-3xl pointer-events-none"
          style={{ background: "radial-gradient(circle, #635BFF 0%, transparent 70%)" }}
        />
        <div
          className="hidden md:block absolute right-24 top-10 w-[220px] h-[220px] rounded-full opacity-[0.14] blur-3xl pointer-events-none"
          style={{ background: "radial-gradient(circle, #24A1DE 0%, transparent 70%)" }}
        />

        <div className="max-w-6xl mx-auto px-6 sm:px-8 py-12 sm:py-14 relative">
          <h1 className="text-[28px] sm:text-[32px] font-semibold tracking-tight text-[#0A2540]">
            Integrations
          </h1>
          <p className="mt-2 text-[15px] text-[#6B7C93] max-w-md leading-relaxed">
            Connect a chat platform to manage your cluster without leaving the conversation.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-x-2.5 gap-y-1.5 text-[13px] text-[#6B7C93]">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#059669]" />
              {verifiedConnections} verified
            </span>
            <span className="text-[#D8DCE3]">·</span>
            <span>{totalConnections} total connection{totalConnections === 1 ? "" : "s"}</span>
            <span className="text-[#D8DCE3]">·</span>
            <span>{connectedPlatforms} of 2 available platforms</span>
          </div>
        </div>
      </div>

      {/* Cards */}
      <div className="max-w-6xl mx-auto px-6 sm:px-8 py-10 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {displayIntegrations.map((integration) => {
            const Icon = integration.icon;
            const isConnected = integration.isConnected;
            const isVerified = integration.verified;
            const isAvailable = integration.available !== false;
            const isGeneratingThis = codeLoading && selectedPlatformForCode === integration.platform;

            return (
              <div
                key={integration.id}
                className={`flex flex-col h-full bg-white rounded-2xl p-6 transition-all duration-200 ${
                  isAvailable
                    ? "border border-[#EEF0F3] hover:border-[#D8DCE3]"
                    : "border border-dashed border-[#EEF0F3] hover:border-[#DE1F69]"
                }`}
                style={{
                  boxShadow: isConnected ? "0 1px 2px rgba(10,37,64,0.04)" : "none",
                  opacity: isAvailable ? 1 : 0.97,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = isAvailable
                    ? "0 12px 28px -14px rgba(10,37,64,0.16)"
                    : "0 12px 28px -14px rgba(222,31,105,0.14)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = isConnected
                    ? "0 1px 2px rgba(10,37,64,0.04)"
                    : "none";
                }}
              >
                {/* Header row */}
                <div className="flex items-start justify-between mb-5">
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{
                        backgroundColor: isConnected ? `${integration.color}14` : "#F6F8FA",
                      }}
                    >
                      {Icon && (
                        <Icon
                          size={18}
                          style={{ color: isConnected ? integration.color : "#A3ACBA" }}
                        />
                      )}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-[15px] font-semibold text-[#0A2540] truncate">
                        {integration.name}
                      </h3>
                      {isConnected ? (
                        <p className="text-[12.5px] text-[#8792A2] truncate font-mono">
                          @{integration.username || integration.externalId}
                        </p>
                      ) : isAvailable ? (
                        <p className="text-[12.5px] text-[#A3ACBA]">Not connected</p>
                      ) : (
                        <p className="text-[12.5px] text-[#A3ACBA]">Not yet available</p>
                      )}
                    </div>
                  </div>

                  {isConnected && (
                    <span
                      className="inline-flex items-center gap-1.5 text-[12px] font-medium flex-shrink-0 ml-2"
                      style={{ color: isVerified ? "#059669" : "#B45309" }}
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: isVerified ? "#059669" : "#D97706" }}
                      />
                      {isVerified ? "Verified" : "Pending"}
                    </span>
                  )}

                  {!isConnected && !isAvailable && (
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold flex-shrink-0 ml-2 rounded-full bg-[#FDF2F8] text-[#DE1F69] px-2.5 py-1">
                      <Clock size={11} />
                      Upcoming
                    </span>
                  )}
                </div>

                {!isAvailable ? (
                  // Slack — coming soon, waitlist only
                  <>
                    <p className="text-[13px] text-[#8792A2] leading-relaxed mb-6">
                      Slack support is on the way. Join the waitlist and we'll email you the moment it's ready.
                    </p>

                    <div className="mt-auto">
                      <button
                        onClick={() => joinWaitlist(integration.platform)}
                        disabled={waitlisted}
                        className={`w-full py-2.5 px-4 rounded-lg text-[13.5px] font-medium transition-colors flex items-center justify-center gap-2 ${
                          waitlisted
                            ? "bg-[#FDF2F8] text-[#DE1F69] cursor-default"
                            : "bg-[#DE1F69] hover:bg-[#C21A5C] text-white"
                        }`}
                      >
                        {waitlisted ? (
                          <>
                            <Check size={14} />
                            You're on the list
                          </>
                        ) : (
                          <>
                            <Clock size={14} />
                            Join waitlist
                          </>
                        )}
                      </button>
                    </div>
                  </>
                ) : isConnected ? (
                  <>
                    <div className="space-y-2 mb-5 text-[13px] text-[#6B7C93]">
                      <div className="flex items-center gap-2">
                        <Hash size={12} className="text-[#A3ACBA] flex-shrink-0" />
                        <span className="font-mono">{integration.externalId}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar size={12} className="text-[#A3ACBA] flex-shrink-0" />
                        <span>Connected {formatDate(integration.createdAt)}</span>
                      </div>
                    </div>

                    {isVerified ? (
                      <code className="text-[12px] font-mono text-[#4F46E5] bg-[#F5F5FF] border border-[#E8E7FF] rounded-lg px-3 py-2 mb-5 block truncate">
                        {integration.command}
                      </code>
                    ) : (
                      <p className="text-[13px] text-[#8792A2] leading-relaxed mb-5">
                        {integration.platform === "discord"
                          ? "The bot has been added to your server. Click below to get a one-time code, then send it to the bot to finish linking this account."
                          : "Click below to get a one-time code, then send it to the bot to finish linking this account."}
                      </p>
                    )}

                    <div className="mt-auto">
                      {isVerified ? (
                        <button
                          onClick={() => {
                            setSelectedIntegration(integration);
                            setConfirmingDisconnect(false);
                            setShowModal(true);
                          }}
                          className="w-full py-2.5 px-4 rounded-lg border border-[#E3E6EB] hover:border-[#D8DCE3] hover:bg-[#FAFBFC] text-[#0A2540] text-[13.5px] font-medium transition-colors flex items-center justify-center gap-1.5"
                        >
                          Manage
                          <ArrowUpRight size={13} className="text-[#8792A2]" />
                        </button>
                      ) : (
                        <button
                          onClick={() => generateCode(integration.platform)}
                          disabled={isGeneratingThis}
                          className="w-full py-2.5 px-4 rounded-lg bg-[#4F46E5] hover:bg-[#433CD1] disabled:opacity-60 text-white text-[13.5px] font-medium transition-colors flex items-center justify-center gap-2"
                        >
                          {isGeneratingThis ? (
                            <>
                              <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              Generating…
                            </>
                          ) : (
                            <>
                              <Shield size={14} />
                              Verify connection
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <p className="text-[13px] text-[#8792A2] leading-relaxed mb-6">
                      {integration.platform === "discord" ? (
                        <>Authorize the bot on Discord to connect your server.</>
                      ) : (
                        <>
                          Send <code className="font-mono text-[#0A2540] bg-[#F6F8FA] px-1 py-0.5 rounded">{integration.command}</code> from {integration.name} once you have a code.
                        </>
                      )}
                    </p>

                    <div className="mt-auto">
                      <button
                        onClick={() => handleConnect(integration.platform)}
                        disabled={isGeneratingThis}
                        className="w-full py-2.5 px-4 rounded-lg border border-[#E3E6EB] hover:border-[#4F46E5] hover:text-[#4F46E5] disabled:opacity-60 text-[#0A2540] text-[13.5px] font-medium transition-colors flex items-center justify-center gap-2"
                      >
                        {isGeneratingThis ? (
                          <>
                            <div className="w-3.5 h-3.5 border-2 border-[#D8DCE3] border-t-[#4F46E5] rounded-full animate-spin" />
                            Generating…
                          </>
                        ) : (
                          <>
                            <Link2 size={14} />
                            Connect {integration.name}
                          </>
                        )}
                      </button>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Manage Integration Modal */}
      {showModal && selectedIntegration && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A2540]/40 backdrop-blur-sm"
          onClick={() => setShowModal(false)}
        >
          <div
            className="fade-up bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-[#EEF0F3] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${selectedIntegration.color}14` }}
                >
                  {selectedIntegration.icon && (
                    <selectedIntegration.icon size={17} style={{ color: selectedIntegration.color }} />
                  )}
                </div>
                <div>
                  <h3 className="text-[15px] font-semibold text-[#0A2540]">
                    {selectedIntegration.name}
                  </h3>
                  <p className="text-[12.5px] text-[#8792A2] font-mono">
                    @{selectedIntegration.username || selectedIntegration.externalId}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 rounded-lg hover:bg-[#F6F8FA] transition-colors"
              >
                <X size={17} className="text-[#8792A2]" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-x-4 gap-y-4">
                <div>
                  <p className="text-[11.5px] text-[#A3ACBA] mb-1">Status</p>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#059669]" />
                    <span className="text-[13.5px] font-medium text-[#0A2540]">Verified</span>
                  </div>
                </div>
                <div>
                  <p className="text-[11.5px] text-[#A3ACBA] mb-1">Connected</p>
                  <p className="text-[13.5px] font-medium text-[#0A2540]">
                    {formatDate(selectedIntegration.createdAt)}
                  </p>
                </div>
                <div>
                  <p className="text-[11.5px] text-[#A3ACBA] mb-1">External ID</p>
                  <p className="text-[13.5px] font-medium text-[#0A2540] font-mono">
                    {selectedIntegration.externalId}
                  </p>
                </div>
                <div>
                  <p className="text-[11.5px] text-[#A3ACBA] mb-1">Username</p>
                  <p className="text-[13.5px] font-medium text-[#0A2540]">
                    {selectedIntegration.username || "Not set"}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-[11.5px] text-[#A3ACBA] mb-1">Organization ID</p>
                  <p className="text-[13.5px] font-medium text-[#0A2540] font-mono">
                    {selectedIntegration.organizationId}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-[#EEF0F3] flex flex-col gap-2">
              <button
                onClick={() => disconnectIntegration(selectedIntegration.id)}
                className={`w-full py-2.5 px-4 rounded-lg text-[13.5px] font-medium transition-colors flex items-center justify-center gap-2 ${
                  confirmingDisconnect
                    ? "bg-[#DC2626] hover:bg-[#B91C1C] text-white"
                    : "border border-[#E3E6EB] hover:border-[#DC2626] hover:text-[#DC2626] text-[#0A2540]"
                }`}
              >
                <Trash2 size={13} />
                {confirmingDisconnect ? "Click again to confirm" : "Disconnect integration"}
              </button>
              <button
                onClick={() => {
                  setShowModal(false);
                  setConfirmingDisconnect(false);
                }}
                className="w-full py-2.5 px-4 rounded-lg text-[#6B7C93] hover:bg-[#F6F8FA] text-[13.5px] font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Verification Code Modal */}
      {showCodeModal && generatedCode && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A2540]/40 backdrop-blur-sm"
          onClick={() => setShowCodeModal(false)}
        >
          <div
            className="fade-up bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-[#EEF0F3] flex items-center justify-between">
              <h3 className="text-[15px] font-semibold text-[#0A2540]">Verification code</h3>
              <button
                onClick={() => setShowCodeModal(false)}
                className="p-1.5 rounded-lg hover:bg-[#F6F8FA] transition-colors"
              >
                <X size={17} className="text-[#8792A2]" />
              </button>
            </div>

            <div className="flex justify-center items-center mt-5">
              <a
                href="https://t.me/Kuberneteschatops_bot"
                target="_blank"
                rel="noopener noreferrer"
                className="mb-5 flex items-center justify-center gap-2 rounded-xl bg-[#229ED9] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#1C8CC5]"
              >
                Open Telegram Bot
              </a>
            </div>

            <div className="p-6">
              <p className="text-[13.5px] text-[#6B7C93] leading-relaxed mb-5">
                Send this code to the bot on {selectedPlatformForCode} to finish connecting.
              </p>

              <div className="flex items-center justify-between gap-3 rounded-xl border border-[#EEF0F3] bg-[#FAFBFC] pl-4 pr-2 py-3">
                <code className="text-[19px] font-mono font-semibold tracking-[0.15em] text-[#0A2540]">
                  {generatedCode}
                </code>
                <button
                  onClick={copyCode}
                  className={`p-2 rounded-lg transition-colors flex-shrink-0 ${
                    copied ? "bg-[#ECFDF5] text-[#059669]" : "hover:bg-[#F0F0FF] text-[#4F46E5]"
                  }`}
                  title="Copy code"
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                </button>
              </div>
            </div>

            <div className="p-6 border-t border-[#EEF0F3]">
              <button
                onClick={() => setShowCodeModal(false)}
                className="w-full py-2.5 px-4 rounded-lg text-[#6B7C93] hover:bg-[#F6F8FA] text-[13.5px] font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {showDiscordModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A2540]/40 backdrop-blur-sm"
          onClick={() => setShowDiscordModal(false)}
        >
          <div
            className="fade-up bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-[#EEF0F3] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: "#5865F214" }}
                >
                  <FaDiscord size={17} style={{ color: "#5865F2" }} />
                </div>
                <h3 className="text-[15px] font-semibold text-[#0A2540]">
                  {generatedCode ? "Verification Code" : "Connect Discord"}
                </h3>
              </div>
              <button
                onClick={() => {
                  setShowDiscordModal(false);
                  setGeneratedCode("");
                  setSelectedPlatformForCode(null);
                }}
                className="p-1.5 rounded-lg hover:bg-[#F6F8FA] transition-colors"
              >
                <X size={17} className="text-[#8792A2]" />
              </button>
            </div>

            <div className="p-6">
              {!generatedCode ? (
                // Step 1: Authorize bot
                <>
                  <p className="text-[13.5px] text-[#6B7C93] leading-relaxed mb-5">
                    Authorize the bot on your Discord server. After adding the bot, 
                    click "Generate Code" below to get a verification code.
                  </p>

                  <div className="flex items-center justify-between gap-3 rounded-xl border border-[#EEF0F3] bg-[#FAFBFC] pl-4 pr-2 py-3 mb-4">
                    <span className="text-[12.5px] font-mono text-[#0A2540] truncate">
                      {DISCORD_OAUTH_URL}
                    </span>
                    <button
                      onClick={copyDiscordUrl}
                      className={`p-2 rounded-lg transition-colors flex-shrink-0 ${
                        urlCopied ? "bg-[#ECFDF5] text-[#059669]" : "hover:bg-[#F0F0FF] text-[#4F46E5]"
                      }`}
                      title="Copy URL"
                    >
                      {urlCopied ? <Check size={16} /> : <Copy size={16} />}
                    </button>
                  </div>

                  <a
                    href={DISCORD_OAUTH_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-4 rounded-lg bg-[#5865F2] hover:bg-[#4A54D6] text-white text-[13.5px] font-medium transition-colors flex items-center justify-center gap-2 mb-3"
                  >
                    <ExternalLink size={14} />
                    Open Discord authorization
                  </a>

                  <button
                    onClick={() => generateCode("discord")}
                    disabled={codeLoading}
                    className="w-full py-2.5 px-4 rounded-lg bg-[#4F46E5] hover:bg-[#433CD1] disabled:opacity-60 text-white text-[13.5px] font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    {codeLoading ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Generating…
                      </>
                    ) : (
                      <>
                        <Shield size={14} />
                        Generate Verification Code
                      </>
                    )}
                  </button>
                </>
              ) : (
                // Step 2: Show verification code (same as Telegram flow)
                <>
                  <p className="text-[13.5px] text-[#6B7C93] leading-relaxed mb-5">
                    Send this code to the Discord bot using the <code className="font-mono text-[#0A2540] bg-[#F6F8FA] px-1 py-0.5 rounded">/verify YOUR_CODE</code> command to finish connecting.
                  </p>

                  <div className="flex items-center justify-between gap-3 rounded-xl border border-[#EEF0F3] bg-[#FAFBFC] pl-4 pr-2 py-3">
                    <code className="text-[19px] font-mono font-semibold tracking-[0.15em] text-[#0A2540]">
                      {generatedCode}
                    </code>
                    <button
                      onClick={copyCode}
                      className={`p-2 rounded-lg transition-colors flex-shrink-0 ${
                        copied ? "bg-[#ECFDF5] text-[#059669]" : "hover:bg-[#F0F0FF] text-[#4F46E5]"
                      }`}
                      title="Copy code"
                    >
                      {copied ? <Check size={16} /> : <Copy size={16} />}
                    </button>
                  </div>

                  <div className="mt-4 p-3 rounded-lg bg-[#F5F5FF] border border-[#E8E7FF]">
                    <p className="text-[12px] text-[#6B7C93]">
                      <span className="font-semibold text-[#4F46E5]">Tip:</span> Use the command{' '}
                      <code className="font-mono text-[#0A2540] bg-white px-1.5 py-0.5 rounded border border-[#E8E7FF]">
                        /verify {generatedCode}
                      </code>
                      {' '}in any channel where the bot is present.
                    </p>
                  </div>
                </>
              )}
            </div>

            <div className="p-6 border-t border-[#EEF0F3] flex gap-2">
              {generatedCode && (
                <button
                  onClick={() => {
                    setGeneratedCode("");
                    setShowDiscordModal(false);
                    setSelectedPlatformForCode(null);
                    // Refresh integrations to check if connection succeeded
                    fetchIntegrations();
                  }}
                  className="flex-1 py-2.5 px-4 rounded-lg bg-[#059669] hover:bg-[#047857] text-white text-[13.5px] font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Check size={14} />
                  Done, I've sent the code
                </button>
              )}
              <button
                onClick={() => {
                  setShowDiscordModal(false);
                  setGeneratedCode("");
                  setSelectedPlatformForCode(null);
                }}
                className={`${generatedCode ? 'flex-1' : 'w-full'} py-2.5 px-4 rounded-lg text-[#6B7C93] hover:bg-[#F6F8FA] text-[13.5px] font-medium transition-colors`}
              >
                {generatedCode ? "Close" : "Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}