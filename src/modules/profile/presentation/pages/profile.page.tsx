import React, { useEffect, useEffectEvent, useState } from "react";
import { useProfile } from "../hooks/use-profile";
import "./profile.page.css";
import type { Profile } from "../../domain/models/profile";

export const ProfilePage: React.FC = () => {
  const {
    profile,
    isLoading,
    error,
    getProfile,
    updateProfile,
    updateAvatar,
    deleteAvatar,
  } = useProfile();

  const [formData, setFormData] = useState({
    first_name: profile?.first_name ?? "",
    last_name: profile?.last_name ?? "",
    bio: profile?.bio ?? "",
    username: profile?.username ?? "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [showCopied, setShowCopied] = useState(false);

  const handleShare = () => {
    if (!profile?.username) return;
    const url = `${window.location.origin}/users/${profile.username}`;
    navigator.clipboard.writeText(url);
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 2000);
  };

  useEffect(() => {
    getProfile();
  }, [getProfile]);

  const updateFormData = useEffectEvent((profile: Profile) => {
    setFormData({
      first_name: profile.first_name,
      last_name: profile.last_name,
      bio: profile.bio ?? "",
      username: profile.username,
    });
  });

  useEffect(() => {
    if (profile) {
      updateFormData(profile);
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile(formData);
      setIsEditing(false);
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        await updateAvatar(file);
      } catch (err) {
        console.error("Avatar upload failed:", err);
      }
    }
  };

  if (isLoading && !profile) {
    return <div className="loading-container">Loading profile...</div>;
  }

  return (
    <div className="profile-page">
      <h1 className="page-title">Profile Settings</h1>

      {error && (
        <div className="error-banner">Error loading profile: {error}</div>
      )}

      <div className="profile-container">
        <section className="avatar-section">
          <div className="avatar-wrapper">
            {profile?.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt="Profile Avatar"
                className="profile-avatar-large"
              />
            ) : (
              <div className="avatar-placeholder-large">
                {profile?.first_name?.[0]}
                {profile?.last_name?.[0]}
              </div>
            )}
            <label className="btn-upload-avatar">
              <input
                type="file"
                onChange={handleAvatarChange}
                accept="image/*"
              />
              Change Photo
            </label>
            {profile?.avatar_url && (
              <button onClick={deleteAvatar} className="btn-delete-avatar">
                Remove Photo
              </button>
            )}
          </div>
          <div className="profile-summary">
            <div className="profile-name-row">
              <h2>
                {profile?.first_name} {profile?.last_name}
              </h2>
              <button
                onClick={handleShare}
                className="btn-share"
                title="Share Profile"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                  <polyline points="16 6 12 2 8 6"></polyline>
                  <line x1="12" y1="2" x2="12" y2="15"></line>
                </svg>
              </button>
            </div>
            <p className="profile-handle">@{profile?.username}</p>
            {showCopied && <span className="share-feedback">Link copied!</span>}
          </div>
        </section>

        <section className="info-section">
          <div className="section-header">
            <h3>Personal Information</h3>
            {!isEditing && (
              <button onClick={() => setIsEditing(true)} className="btn-edit">
                Edit Profile
              </button>
            )}
          </div>

          <form
            onSubmit={handleSubmit}
            className={isEditing ? "editing" : "viewing"}
          >
            <div className="form-grid">
              <div className="form-group">
                <label>First Name</label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={formData.first_name}
                  onChange={(e) =>
                    setFormData({ ...formData, first_name: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={formData.last_name}
                  onChange={(e) =>
                    setFormData({ ...formData, last_name: e.target.value })
                  }
                />
              </div>
              <div className="form-group full-width">
                <label>Username</label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                />
              </div>
              <div className="form-group full-width">
                <label>Bio</label>
                <textarea
                  disabled={!isEditing}
                  value={formData.bio}
                  onChange={(e) =>
                    setFormData({ ...formData, bio: e.target.value })
                  }
                  placeholder="Tell us about yourself..."
                />
              </div>
            </div>

            {isEditing && (
              <div className="form-actions">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Save Changes
                </button>
              </div>
            )}
          </form>
        </section>
      </div>
    </div>
  );
};
