import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
} from "react-router-dom";
import { Sidebar } from "./components/Sidebar";
import { Box } from "lucide-react";
import DashboardContent from "./components/DashboardContent";
import Deployments from "./components/DeploymentContent";
import Logs from "./components/Logs";
import Clusters from "./components/Cluster";
import Pods from "./components/Pods";
import Metrics from "./components/Metrics";
import Alerts from "./components/Alerts";
import IntegrationPage from "./pages/Integration";
import Home from "./pages/Home";
import ClusterDetails from "./components/ClusterDetail";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Navbar from "./components/Navbar"
import DocsPage from "./pages/Docs";
import PricingPage from "./pages/Pricing";
import Footer from "./components/Footer";
import Events from "./components/Events";
import { ToastContainer, toast } from 'react-toastify';
import { useEffect, useState } from "react";
import {useNavigate } from "react-router-dom";
import axios from "axios";

import { BACKEND_URL } from "./config";

export function DashboardLayout() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {    checkAuth();
  }, []);

  async function checkAuth() {
    const notify = () => toast.error("Please sign in to continue.");
    try {
      await axios.get(
        `${BACKEND_URL}/api/auth/me`,
        {
          withCredentials: true,
        }
      );
      setLoading(false);
    } catch (err) {
      notify();
      navigate("/login", { replace: true });
    }
  }

  // Close mobile menu when route changes
  useEffect(() => {
    const handleRouteChange = () => {
      setIsMobileMenuOpen(false);
    };
    // Listen for navigation events
    window.addEventListener('popstate', handleRouteChange);
    return () => window.removeEventListener('popstate', handleRouteChange);
  }, []);

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-300 border-t-blue-600" />
          <p className="text-slate-600">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar 
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />

      {/* Main Content */}
      <main className="flex-1 transition-all duration-300 lg:ml-64">
        {/* Mobile Header */}
        <div className="sticky top-0 z-30 flex items-center justify-between bg-white px-4 py-3 shadow-sm lg:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100"
            aria-label="Open menu"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-600 rounded-lg shadow-sm">
              <Box className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-slate-800">Kubernetes</span>
          </div>
          <div className="w-10" /> {/* Spacer for alignment */}
        </div>

        <div className="p-4 md:p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}


function NormalLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer/>
    </>
  );
}

function App() {
  return (
    <Router>
       <ToastContainer />
      <Routes>
        {/* Public Routes */}
        <Route element={<NormalLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/integrations" element={<IntegrationPage />} />
          <Route path="/docs" element={<DocsPage/>}/>
          <Route path="/pricing" element={<PricingPage/>}/>
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Dashboard Routes */}
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardContent />} />
          <Route path="/deployments" element={<Deployments />} />
          <Route path="/logs" element={<Logs />} />
          <Route path="/clusters" element={<Clusters />} />
          <Route path="/clusters/:id" element={<ClusterDetails />} />
          <Route path="/pods" element={<Pods />} />
          <Route path="/metrics" element={<Metrics />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/events" element={<Events />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
