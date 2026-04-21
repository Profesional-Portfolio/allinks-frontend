import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { PublicProfile } from "../../domain/models/public-profile";
import { PublicApiService } from "../../infrastructure/services/public-api.service";
import { AxiosHttpClient } from "@/core/infrastructure/adapters/axios-http-client";
import { API_CONFIG } from "@/config/api-config";
import { Platforms } from "@/core/domain/enums/platforms.enum";
import "./public-profile.page.css";

const PLATFORM_LABELS: Record<Platforms, string> = {
  [Platforms.DISCORD]: "Discord",
  [Platforms.FACEBOOK]: "Facebook",
  [Platforms.GITHUB]: "GitHub",
  [Platforms.INSTAGRAM]: "Instagram",
  [Platforms.LINKEDIN]: "LinkedIn",
  [Platforms.MEDIUM]: "Medium",
  [Platforms.PINTEREST]: "Pinterest",
  [Platforms.REDDIT]: "Reddit",
  [Platforms.SNAPCHAT]: "Snapchat",
  [Platforms.THREADS]: "Threads",
  [Platforms.TIKTOK]: "TikTok",
  [Platforms.TWITCH]: "Twitch",
  [Platforms.WEBSITE]: "Website",
  [Platforms.X]: "X",
  [Platforms.YOUTUBE]: "YouTube",
};

const PLATFORM_COLORS: Record<Platforms, string> = {
  [Platforms.DISCORD]: "#5865F2",
  [Platforms.FACEBOOK]: "#1877F2",
  [Platforms.GITHUB]: "#181717",
  [Platforms.INSTAGRAM]: "#E4405F",
  [Platforms.LINKEDIN]: "#0A66C2",
  [Platforms.MEDIUM]: "#000000",
  [Platforms.PINTEREST]: "#BD081C",
  [Platforms.REDDIT]: "#FF4500",
  [Platforms.SNAPCHAT]: "#FFFC00",
  [Platforms.THREADS]: "#000000",
  [Platforms.TIKTOK]: "#000000",
  [Platforms.TWITCH]: "#9146FF",
  [Platforms.WEBSITE]: "#667eea",
  [Platforms.X]: "#000000",
  [Platforms.YOUTUBE]: "#FF0000",
};

const getPlatformIconUrl = (platform: string): string => {
  const slug = platform === Platforms.X ? "x" : platform.toLowerCase();
  return `https://cdn.simpleicons.org/${slug}/white`;
};

const httpClient = new AxiosHttpClient(API_CONFIG.BASE_URL);
const publicApiService = new PublicApiService(httpClient);

export const PublicProfilePage = () => {
  const { username } = useParams<{ username: string }>();
  const [profile, setProfile] = useState<PublicProfile>(
    null as unknown as PublicProfile,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (e: React.MouseEvent, linkId: string, url: string) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(url);
    setCopiedId(linkId);
    setTimeout(() => setCopiedId(null), 2000);
  };

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
          setError(
            err instanceof Error ? err.message : "Failed to load profile",
          );
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
            <img
              src={profile.avatar_url}
              alt={profile.username}
              className="public-avatar"
            />
          ) : (
            <div className="public-avatar-placeholder">
              {profile.first_name?.[0]}
              {profile.last_name?.[0]}
            </div>
          )}
          <h1 className="public-name">
            {profile.first_name} {profile.last_name}
          </h1>
          <p className="public-username">@{profile.username}</p>
          {profile.bio && <p className="public-bio">{profile.bio}</p>}
        </header>

        <div className="public-links-list">
          {profile.links && profile.links.length > 0 ? (
            profile.links
              .filter((l) => l.is_active)
              .map((link) => {
                const platformColor =
                  PLATFORM_COLORS[link.platform as Platforms] ?? "#667eea";
                const platformLabel =
                  PLATFORM_LABELS[link.platform as Platforms] ?? link.platform;
                const iconUrl = getPlatformIconUrl(link.platform);
                const isCopied = copiedId === link.id;
                return (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="public-link-item"
                    onClick={(e) => {
                      if ((e.target as HTMLElement).closest(".btn-copy-link")) {
                        e.preventDefault();
                      }
                    }}
                  >
                    <div className="link-item-left">
                      <div
                        className="platform-icon-wrap"
                        style={{ backgroundColor: platformColor }}
                      >
                        <img
                          src={iconUrl}
                          alt={platformLabel}
                          className="platform-icon"
                          onError={(e) => {
                            (
                              e.currentTarget as HTMLImageElement
                            ).style.display = "none";
                          }}
                        />
                      </div>
                      <div className="link-item-info">
                        <span className="link-platform-name">
                          {platformLabel}
                        </span>
                        <span className="link-title-text">{link.title}</span>
                      </div>
                    </div>
                    <button
                      className={`btn-copy-link ${isCopied ? "copied" : ""}`}
                      title={isCopied ? "Copied!" : "Copy link"}
                      onClick={(e) => handleCopy(e, link.id, link.url)}
                    >
                      {isCopied ? (
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      ) : (
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <rect
                            x="9"
                            y="9"
                            width="13"
                            height="13"
                            rx="2"
                            ry="2"
                          ></rect>
                          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                        </svg>
                      )}
                    </button>
                  </a>
                );
              })
          ) : (
            <p className="no-links">This user hasn't shared any links yet.</p>
          )}
        </div>

        <footer className="public-footer">
          <p>
            Made with <span className="brand">AllLinks</span>
          </p>
        </footer>
      </div>
    </div>
  );
};
