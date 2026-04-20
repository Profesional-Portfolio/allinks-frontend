import React, { useEffect, useState } from "react";
import { useProfile } from "../hooks/use-profile";
import "./profile.page.css";

export const ProfilePage: React.FC = () => {
  const { profile, isLoading, error, getProfile, updateProfile, updateAvatar, deleteAvatar } = useProfile();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    bio: "",
    username: "",
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    getProfile();
  }, [getProfile]);

  useEffect(() => {
    if (profile) {
      setFormData((prev) => {
        if (
          prev.firstName === (profile.firstName || "") &&
          prev.lastName === (profile.lastName || "") &&
          prev.bio === (profile.bio || "") &&
          prev.username === (profile.username || "")
        ) {
          return prev;
        }
        return {
          firstName: profile.firstName || "",
          lastName: profile.lastName || "",
          bio: profile.bio || "",
          username: profile.username || "",
        };
      });
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
      
      {error && <div className="error-banner">Error loading profile: {error}</div>}

      <div className="profile-container">
        <section className="avatar-section">
          <div className="avatar-wrapper">
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt="Profile Avatar" className="profile-avatar-large" />
            ) : (
              <div className="avatar-placeholder-large">
                {profile?.firstName?.[0]}{profile?.lastName?.[0]}
              </div>
            )}
            <label className="btn-upload-avatar">
              <input type="file" onChange={handleAvatarChange} accept="image/*" />
              Change Photo
            </label>
            {profile?.avatar_url && (
              <button onClick={deleteAvatar} className="btn-delete-avatar">Remove Photo</button>
            )}
          </div>
          <div className="profile-summary">
            <h2>{profile?.firstName} {profile?.lastName}</h2>
            <p className="profile-handle">@{profile?.username}</p>
          </div>
        </section>

        <section className="info-section">
          <div className="section-header">
            <h3>Personal Information</h3>
            {!isEditing && (
              <button onClick={() => setIsEditing(true)} className="btn-edit">Edit Profile</button>
            )}
          </div>

          <form onSubmit={handleSubmit} className={isEditing ? "editing" : "viewing"}>
            <div className="form-grid">
              <div className="form-group">
                <label>First Name</label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                />
              </div>
              <div className="form-group full-width">
                <label>Username</label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                />
              </div>
              <div className="form-group full-width">
                <label>Bio</label>
                <textarea
                  disabled={!isEditing}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Tell us about yourself..."
                />
              </div>
            </div>

            {isEditing && (
              <div className="form-actions">
                <button type="button" onClick={() => setIsEditing(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">Save Changes</button>
              </div>
            )}
          </form>
        </section>
      </div>
    </div>
  );
};
