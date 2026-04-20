import React, { useEffect, useState, useRef } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { AxiosHttpClient } from "@/core/infrastructure/adapters/axios-http-client";
import { AuthApiService } from "../../infrastructure/services/auth-api.service";
import { API_CONFIG } from "@/config/api-config";
import "../pages/auth.page.css";

const httpClient = new AxiosHttpClient(API_CONFIG.BASE_URL);
const authApiService = new AuthApiService(httpClient);

export const VerifyEmailPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"verifying" | "success" | "error">(
    token ? "verifying" : "error",
  );
  const [message, setMessage] = useState(
    token ? "" : "Missing verification token.",
  );
  const isVerifying = useRef(false);

  useEffect(() => {
    if (!token || isVerifying.current) return;
    isVerifying.current = true;

    const verify = async () => {
      try {
        await authApiService.verifyEmail(token);
        setStatus("success");
        setMessage("Your email has been successfully verified!");
      } catch (err) {
        setStatus("error");
        setMessage(
          err instanceof Error
            ? err.message
            : "Verification failed. The link may be expired.",
        );
      }
    };

    verify();
  }, [token]);

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">Email Verification</h1>
        </div>

        <div className={`verification-status ${status}`}>
          {status === "verifying" && (
            <div className="loading-spinner">Verifying your email...</div>
          )}
          {status === "success" && (
            <div className="flex flex-col">
              <div className="success-icon">✓</div>
              <p>{message}</p>
              <Link to="/auth/login" className="btn-primary">
                Go to Login
              </Link>
            </div>
          )}
          {status === "error" && (
            <div className="flex flex-col">
              <div className="error-icon">✕</div>
              <p>{message}</p>
              <Link to="/auth/register" className="btn-secondary">
                Try Registering Again
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
