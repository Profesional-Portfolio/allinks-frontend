import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { AxiosHttpClient } from "@/core/infrastructure/adapters/axios-http-client";
import { AuthApiService } from "../../infrastructure/services/auth-api.service";
import { API_CONFIG } from "@/config/api-config";
import "../pages/auth.page.css";

const httpClient = new AxiosHttpClient(API_CONFIG.BASE_URL);
const authApiService = new AuthApiService(httpClient);

export const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [formData, setFormData] = useState({
    password: "",
    password_confirmation: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(true);

  useEffect(() => {
    if (!token) {
      setError("Invalid or missing reset token.");
      setIsValidating(false);
      return;
    }

    const validateToken = async () => {
      try {
        await authApiService.validateToken(token);
      } catch (err) {
        console.error("Token validation failed:", err);
        setError("Your reset link has expired or is invalid.");
      } finally {
        setIsValidating(false);
      }
    };

    validateToken();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.password_confirmation) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      if (!token) throw new Error("Missing token");
      await authApiService.resetPassword({
        token,
        password: formData.password,
        password_confirmation: formData.password_confirmation,
      });
      navigate("/login", { state: { message: "Password reset successful. Please log in with your new password." } });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to reset password");
    } finally {
      setIsLoading(false);
    }
  };

  if (isValidating) return <div className="auth-loading">Validating reset link...</div>;

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">Reset Password</h1>
          <p className="auth-subtitle">Choose a new secure password</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        {!error && (
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="password">New Password</label>
              <input
                id="password"
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
              />
            </div>
            <div className="form-group">
              <label htmlFor="password_confirmation">Confirm New Password</label>
              <input
                id="password_confirmation"
                type="password"
                required
                value={formData.password_confirmation}
                onChange={(e) => setFormData({ ...formData, password_confirmation: e.target.value })}
                placeholder="••••••••"
              />
            </div>
            <button type="submit" className="btn-primary" disabled={isLoading}>
              {isLoading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}

        <div className="auth-footer">
          <Link to="/login" className="auth-link">Back to Login</Link>
        </div>
      </div>
    </div>
  );
};
