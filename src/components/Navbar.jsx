import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const loc = useLocation();

  const NavLink = ({ to, label }) => (
    <Link
      to={to}
      className={`px-3 py-1 rounded-xl text-sm ${
        loc.pathname === to ? "bg-black text-white" : "bg-gray-200 hover:bg-gray-300"
      }`}
    >
      {label}
    </Link>
  );

  return (
    <nav className="w-full sticky top-0 z-50 bg-white/90 backdrop-blur border-b">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/home" className="font-black text-xl">damnnn</Link>

        <div className="flex items-center gap-2">
          <NavLink to="/home" label="Home" />
          <NavLink to="/match" label="Match Room" />
          <NavLink to="/leaderboard" label="Leaderboard" />
          <NavLink to="/chat" label="Chat" />
          <NavLink to="/profile" label="Profile" />
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600">{user?.email}</span>
          <button
            onClick={logout}
            className="px-3 py-1 rounded-xl bg-red-500 text-white hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
