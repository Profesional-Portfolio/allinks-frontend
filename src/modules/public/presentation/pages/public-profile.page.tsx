import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { PublicProfile } from "../../domain/models/public-profile";
import { PublicApiService } from "../../infrastructure/services/public-api.service";
import { AxiosHttpClient } from "@/core/infrastructure/adapters/axios-http-client";
import { API_CONFIG } from "@/config/api-config";
import "./public-profile.page.css";

const httpClient = new AxiosHttpClient(API_CONFIG.BASE_URL);
const publicApiService = new PublicApiService(httpClient);

export const PublicProfilePage: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (username) {
      const fetchProfile = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const response = await publicApiService.getPublicProfile(username);
          if (response.data) {
            setProfile(response.data);
          } else {
            setError("Profile not found");
          }
        } catch (err) {
          setError(err instanceof Error ? err.message : "Failed to load profile");
        } finally {
          setIsLoading(false);
        }
      };

      fetchProfile();
    }
  }, [username]);

  if (isLoading) {
    return <div className="public-loading">Loading...</div>;
  }

  if (error || !profile) {
    return (
      <div className="public-error">
        <h1>404</h1>
        <p>{error || "User not found"}</p>
      </div>
    );
  }

  return (
    <div className="public-profile-container">
      <div className="public-profile-card">
        <header className="public-header">
          {profile.avatar_url ? (
            <img src={profile.avatar_url} alt={profile.username} className="public-avatar" />
          ) : (
            <div className="public-avatar-placeholder">
              {profile.firstName?.[0]}{profile.lastName?.[0]}
            </div>
          )}
          <h1 className="public-name">{profile.firstName} {profile.lastName}</h1>
          <p className="public-username">@{profile.username}</p>
          {profile.bio && <p className="public-bio">{profile.bio}</p>}
        </header>

        <div className="public-links-list">
          {profile.links && profile.links.length > 0 ? (
            profile.links
              .filter((l) => l.visibility === "public")
              .map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="public-link-item"
                >
                  <span className="link-text">{link.title}</span>
                  <svg className="external-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                    <polyline points="15 3 21 3 21 9"></polyline>
                    <line x1="10" y1="14" x2="21" y2="3"></line>
                  </svg>
                </a>
              ))
          ) : (
            <p className="no-links">This user hasn't shared any links yet.</p>
          )}
        </div>

        <footer className="public-footer">
          <p>Made with <span className="brand">AllLinks</span></p>
        </footer>
      </div>
    </div>
  );
};
