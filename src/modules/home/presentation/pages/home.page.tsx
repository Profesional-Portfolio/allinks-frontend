import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/auth/presentation/hooks/use-auth";
import "./home.page.css";

export const HomePage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="home-container">
      <div className="home-content">
        <div className="welcome-card">
          <div className="welcome-header">
            <div className="avatar">
              {user?.firstName?.[0]}
              {user?.lastName?.[0]}
            </div>
            <div className="welcome-text">
              <h1 className="welcome-title">
                Welcome back, {user?.firstName}!
              </h1>
              <p className="welcome-subtitle">You're successfully logged in</p>
            </div>
          </div>

          <div className="user-info">
            <div className="info-card">
              <div className="info-icon">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
              <div className="info-content">
                <p className="info-label">Username</p>
                <p className="info-value">{user?.username}</p>
              </div>
            </div>

            <div className="info-card">
              <div className="info-icon">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
              </div>
              <div className="info-content">
                <p className="info-label">Email</p>
                <p className="info-value">{user?.email}</p>
              </div>
            </div>

            <div className="info-card">
              <div className="info-icon">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
              <div className="info-content">
                <p className="info-label">Full Name</p>
                <p className="info-value">
                  {user?.firstName} {user?.lastName}
                </p>
              </div>
            </div>
          </div>

          <button onClick={handleLogout} className="logout-btn">
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
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};
