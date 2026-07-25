import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/auth/presentation/hooks/use-auth";
import { useProfile } from "@/profile/presentation/hooks/use-profile";
// import useProfile
import "./home.page.css";

export const HomePage: React.FC = () => {
  const { logout } = useAuth();
  const { profile } = useProfile()
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/auth/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo">
            <span className="logo-icon">∞</span>
            <span className="logo-text">AllLinks</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <NavLink
            to="/"
            end
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
            </svg>
            My Links
          </NavLink>
          <NavLink
            to="/profile"
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            Profile
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          <div className="user-profile-small">
            {profile?.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile.username}
                className="user-avatar-small"
              />
            ) : (
              <div className="user-avatar-placeholder-small">
                {profile?.first_name?.[0]}
                {profile?.last_name?.[0]}
              </div>
            )}
            <div className="user-info-small">
              <p className="user-name-small">
                {profile?.first_name} {profile?.last_name}
              </p>
              <p className="user-handle-small">@{profile?.username}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="btn-logout-small"
            title="Sign Out"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
          </button>
        </div>
      </aside>

      <main className="dashboard-main">
        <Outlet />
      </main>
    </div>
  );
};
