// ============================================
// PROFILE PAGE - User account settings
// ============================================

import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { updateProfile, changePassword, updateAvatar, removeAvatar, deleteAccount } from "../api/auth";
import NavBar from "../components/NavBar";
import "../styles/profile.css";

export default function ProfilePage() {
  const { user, updateUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // Profile info state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Avatar state
  const [avatarUrl, setAvatarUrl] = useState("");

  // Delete account state
  const [deletePassword, setDeletePassword] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // UI state
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    setName(user.name || "");
    setEmail(user.email || "");
    setAvatarUrl(user.avatar || "");
  }, [user, navigate]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const result = await updateProfile(name, email);
      if (result.error) {
        setError(result.error);
      } else {
        updateUser({ ...user!, name: result.name, email: result.email });
        setMessage("Profile updated successfully!");
      }
    } catch (err: any) {
      setError(err.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (newPassword !== confirmPassword) {
      setError("New passwords don't match");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      const result = await changePassword(currentPassword, newPassword);
      if (result.error) {
        setError(result.error);
      } else {
        setMessage("Password changed successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (err: any) {
      setError(err.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAvatar = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const result = await updateAvatar(avatarUrl);
      if (result.error) {
        setError(result.error);
      } else {
        updateUser({ ...user!, avatar: result.avatar });
        setMessage("Avatar updated successfully!");
      }
    } catch (err: any) {
      setError(err.message || "Failed to update avatar");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveAvatar = async () => {
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const result = await removeAvatar();
      if (result.error) {
        setError(result.error);
      } else {
        updateUser({ ...user!, avatar: null });
        setAvatarUrl("");
        setMessage("Avatar removed successfully!");
      }
    } catch (err: any) {
      setError(err.message || "Failed to remove avatar");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const result = await deleteAccount(deletePassword);
      if (result.error) {
        setError(result.error);
      } else {
        setMessage("Account deleted successfully");
        setTimeout(() => {
          logout();
          navigate("/");
        }, 1500);
      }
    } catch (err: any) {
      setError(err.message || "Failed to delete account");
    } finally {
      setLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  if (!user) return null;

  const isOAuthUser = user.email?.includes("@gmail.com") && !user.email?.includes("test");

  return (
    <div className="profile-page">
      <NavBar />
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-badge">Your Account</div>
          <h1 className="profile-title">
            Profile Settings<span className="title-dot">.</span>
          </h1>
          <p className="profile-description">Manage your account information and preferences</p>
        </div>

        {message && <div className="success-message">{message}</div>}
        {error && <div className="error-message">{error}</div>}

        <div className="profile-sections">
          {/* Profile Information */}
          <section className="profile-section">
            <h2 className="section-title">Profile Information</h2>
            <form onSubmit={handleUpdateProfile} className="profile-form">
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  required
                />
              </div>
              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? "Updating..." : "Update Profile"}
              </button>
            </form>
          </section>

          {/* Avatar */}
          <section className="profile-section">
            <h2 className="section-title">Profile Picture</h2>
            <div className="avatar-preview">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" className="avatar-image" />
              ) : (
                <div className="avatar-placeholder">
                  {user.name?.charAt(0).toUpperCase() || "?"}
                </div>
              )}
            </div>
            <form onSubmit={handleUpdateAvatar} className="profile-form">
              <div className="form-group">
                <label htmlFor="avatar">Avatar URL</label>
                <input
                  type="url"
                  id="avatar"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="https://example.com/avatar.jpg"
                />
                <p className="form-hint">Enter a URL to an image (or use a service like Gravatar)</p>
              </div>
              <div className="avatar-actions">
                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? "Updating..." : "Update Avatar"}
                </button>
                {avatarUrl && (
                  <button type="button" className="remove-avatar-btn" onClick={handleRemoveAvatar} disabled={loading}>
                    {loading ? "Removing..." : "Remove Avatar"}
                  </button>
                )}
              </div>
            </form>
          </section>

          {/* Change Password - Only for non-OAuth users */}
          {!isOAuthUser && (
            <section className="profile-section">
              <h2 className="section-title">Change Password</h2>
              <form onSubmit={handleChangePassword} className="profile-form">
                <div className="form-group">
                  <label htmlFor="currentPassword">Current Password</label>
                  <input
                    type="password"
                    id="currentPassword"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="newPassword">New Password</label>
                  <input
                    type="password"
                    id="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirm New Password</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    required
                  />
                </div>
                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? "Updating..." : "Change Password"}
                </button>
              </form>
            </section>
          )}

          {/* Delete Account */}
          <section className="profile-section danger-section">
            <h2 className="section-title danger-title">Danger Zone</h2>
            <p className="danger-warning">
              Once you delete your account, there is no going back. Please be certain.
            </p>
            {!showDeleteConfirm ? (
              <button
                className="danger-btn"
                onClick={() => setShowDeleteConfirm(true)}
              >
                Delete Account
              </button>
            ) : (
              <div className="delete-confirm">
                <p className="confirm-text">Are you absolutely sure? This action cannot be undone.</p>
                {!isOAuthUser && (
                  <div className="form-group">
                    <label htmlFor="deletePassword">Enter your password to confirm</label>
                    <input
                      type="password"
                      id="deletePassword"
                      value={deletePassword}
                      onChange={(e) => setDeletePassword(e.target.value)}
                      placeholder="Your password"
                    />
                  </div>
                )}
                <div className="confirm-actions">
                  <button
                    className="cancel-btn"
                    onClick={() => {
                      setShowDeleteConfirm(false);
                      setDeletePassword("");
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    className="danger-btn-confirm"
                    onClick={handleDeleteAccount}
                    disabled={loading}
                  >
                    {loading ? "Deleting..." : "Yes, Delete My Account"}
                  </button>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
