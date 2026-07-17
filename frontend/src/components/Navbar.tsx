import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Menu, X, Sun, User, LayoutDashboard, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { BACKEND_URL } from "../config";

interface userInterface {
  name?: string;
  email?: string;
}

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // const [loading, setLoading] = useState(true);

  const [user, setUser] = useState<userInterface>({ name: "", email: "" });
  console.log(isLoggedIn);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setProfileOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  async function logout() {
    try {
      await axios.post(
        `${BACKEND_URL}/api/auth/logout`,
        {},
        {
          withCredentials: true,
        },
      );

      window.location.href = "/";
    } catch (err) {
      console.error(err);
    }
  }

  async function fetchCurrentUser() {
    try {
      // setLoading(true);

      const res = await axios.get(`${BACKEND_URL}/api/auth/me`, {
        withCredentials: true,
      });
      console.log(res);
      setUser(res.data);
      setIsLoggedIn(true);
    } catch (err) {
      console.log(err);
      setUser({ name: "", email: "" });
      setIsLoggedIn(false);
    } finally {
      // setLoading(false);
    }
  }

  const navLinks = [
    // { name: "Features", href: "/features" },
    { name: "Integrations", href: "/integrations" },
    { name: "Docs", href: "/docs" },
    { name: "Pricing", href: "/pricing" },
    // { name: "About", href: "/about" },
  ];

  return (
    <nav className="w-full bg-white border-b border-gray-100 text-slate-900 font-sans sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Left: Logo Section */}
          <div className="flex items-center gap-2 flex-shrink-0 cursor-pointer">
            {/* Simulated Kubernetes-style Blue Hexagon Logo */}
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold shadow-sm shadow-blue-200">
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <polygon points="12 2 22 7 22 17 12 22 2 17 2 7" />
              </svg>
            </div>
            <Link to={"/"}>
            <span className="text-xl font-bold tracking-tight text-slate-900">
              KubeChatOps
            </span>
            </Link>
          </div>

          {/* Center: Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Right: Desktop Action Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {!isLoggedIn ? (
              <>
                <button
                  onClick={() => (window.location.href = "/login")}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Sign In
                </button>

                <button
                  onClick={() => (window.location.href = "/register")}
                  className="rounded-xl bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
                >
                  Get Started
                </button>
              </>
            ) : (
              <div ref={dropdownRef} className="relative">
                {/* Profile Button */}
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-3 rounded-2xl  bg-white px-3 py-2 transition-all hover:border-blue-200 hover:bg-slate-50"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 font-semibold text-white">
                    {user?.name?.charAt(0)?.toUpperCase()}
                  </div>
                </button>

                {/* Dropdown */}
                {profileOpen && (
                  <div className="absolute right-0 mt-3 w-72 overflow-hidden rounded-2xl bg-white shadow-2xl">
                    {/* User */}
                    <div className="border-b bg-slate-50 p-5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-lg font-bold text-white">
                          {user?.name?.charAt(0)?.toUpperCase()}
                        </div>

                        <div>
                          <h4 className="font-semibold text-slate-900">
                            {user?.name}
                          </h4>

                          <p className="text-sm text-slate-500">
                            {user?.email}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Menu */}

                    <button
                      onClick={() => (window.location.href = "/profile")}
                      className="flex w-full items-center gap-3 px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                    >
                      <User size={18} />
                      Profile
                    </button>

                    <button
                      onClick={() => (window.location.href = "/dashboard")}
                      className="flex w-full items-center gap-3 px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                    >
                      <LayoutDashboard size={18} />
                      Dashboard
                    </button>

                    <div className="border-t" />

                    <button
                      onClick={logout}
                      className="flex w-full items-center gap-3 px-5 py-3 text-sm font-medium text-red-600 transition hover:bg-red-50"
                    >
                      <LogOut size={18} />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Right: Hamburger Toggle */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white animate-fadeIn">
          <div className="px-4 pt-2 pb-4 space-y-2 shadow-inner">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="block px-3 py-2 text-base font-medium text-slate-600 hover:text-slate-900 hover:bg-gray-50 rounded-md"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </a>
            ))}

            <hr className="my-3 border-gray-100" />

            {/* Mobile Utility Actions */}
            <div className="flex items-center justify-between px-3 py-2">
              <span className="text-sm font-medium text-slate-600">Theme</span>
              <button className="p-2 text-slate-600 hover:text-slate-900 border border-gray-200 rounded-lg">
                <Sun size={18} />
              </button>
            </div>
            {!isLoggedIn ? (
              <div className="grid grid-cols-2 gap-3 pt-2 px-3">
                <button
                  onClick={() => (window.location.href = "/login")}
                  className="w-full rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Sign In
                </button>

                <button
                  onClick={() => (window.location.href = "/register")}
                  className="w-full rounded-xl bg-blue-600 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  Get Started
                </button>
              </div>
            ) : (
              <div className="px-3 pt-3">
                {/* User Card */}
                <div className="mb-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-lg font-bold text-white">
                      {user?.name?.charAt(0)?.toUpperCase()}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate font-semibold text-slate-900">
                        {user?.name}
                      </p>

                      <p className="truncate text-sm text-slate-500">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="space-y-1">
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      window.location.href = "/profile";
                    }}
                    className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                  >
                    <User size={18} />
                    Profile
                  </button>

                  <button
                    onClick={() => {
                      setIsOpen(false);
                      window.location.href = "/dashboard";
                    }}
                    className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                  >
                    <LayoutDashboard size={18} />
                    Dashboard
                  </button>

                  <button
                    onClick={async () => {
                      setIsOpen(false);
                      await logout();
                    }}
                    className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-600 transition hover:bg-red-50"
                  >
                    <LogOut size={18} />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
