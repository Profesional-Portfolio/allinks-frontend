import React, { useEffect, useState } from "react";
import { useLinks } from "../hooks/use-links";
import type { CreateLinkData } from "../../domain/repositories/links.repository";
import { Platforms } from "@/core/domain/enums/platforms.enum";
import "./links.page.css";

export const LinksPage: React.FC = () => {
  const {
    links,
    isLoading,
    error,
    getLinks,
    createLink,
    deleteLink,
    changeVisibility,
  } = useLinks();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<CreateLinkData>({
    title: "",
    url: "",
    platform: Platforms.WEBSITE,
    description: "",
    visibility: "public",
  });

  useEffect(() => {
    getLinks();
  }, [getLinks]);

  const handleCreateLink = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createLink(formData);
      setIsModalOpen(false);
      setFormData({
        title: "",
        url: "",
        platform: Platforms.WEBSITE,
        description: "",
        visibility: "public",
      });
    } catch (err) {
      console.error("Failed to create link:", err);
    }
  };

  return (
    <div className="links-page">
      <header className="links-header">
        <div>
          <h1 className="page-title">My Links</h1>
          <p className="page-subtitle">
            Manage your personal collection of links
          </p>
        </div>
        <button className="btn-add-link" onClick={() => setIsModalOpen(true)}>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Add New Link
        </button>
      </header>

      {error && <div className="error-banner">{error}</div>}

      <div className="links-grid">
        {isLoading && links.length === 0 ? (
          <div className="loading-state">Loading links...</div>
        ) : links.length === 0 ? (
          <div className="empty-state">
            <p>No links found. Create your first link to get started!</p>
          </div>
        ) : (
          links.map((link) => (
            <div
              key={link.id}
              className={`link-card ${link.is_active ? "public" : "private"}`}
            >
              <div className="link-card-header">
                <h3 className="link-title">{link.title}</h3>
                <div className="link-actions">
                  <button
                    onClick={() => changeVisibility(link.id)}
                    className="btn-icon"
                    title="Toggle Visibility"
                  >
                    {link.is_active ? (
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    ) : (
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                        <line x1="1" y1="1" x2="23" y2="23"></line>
                      </svg>
                    )}
                  </button>
                  <button
                    onClick={() => deleteLink(link.id)}
                    className="btn-icon btn-delete"
                    title="Delete"
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                  </button>
                </div>
              </div>
              <p className="link-description">
                {link.description || "No description"}
              </p>
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="link-url"
              >
                {link.url}
              </a>
              <div className="link-card-footer">
                <span
                  className={`badge ${link.is_active ? "public" : "private"}`}
                >
                  {link.is_active ? "Public" : "Private"}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="modal-title">Create New Link</h2>
            <form onSubmit={handleCreateLink}>
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Link Title"
                />
              </div>
              <div className="form-group">
                <label>URL</label>
                <input
                  type="url"
                  required
                  value={formData.url}
                  onChange={(e) =>
                    setFormData({ ...formData, url: e.target.value })
                  }
                  placeholder="https://example.com"
                />
              </div>
              <div className="form-group">
                <label>Platform</label>
                <select
                  required
                  value={formData.platform}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      platform: e.target.value as Platforms,
                    })
                  }
                >
                  {Object.entries(Platforms).map(([key, value]) => (
                    <option key={value} value={value}>
                      {key.charAt(0) + key.slice(1).toLowerCase()}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Description (Optional)</label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Short description of the link"
                />
              </div>
              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
