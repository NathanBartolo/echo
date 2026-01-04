// ============================================
// GOOGLE SIGN IN - OAuth authentication button
// ============================================

const GoogleSignIn = () => {
  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_BASE || 'http://localhost:5000'}/api/auth/google`;
  };

  return (
    <button onClick={handleGoogleLogin} className="google-btn">
      <span>Sign in with Google</span>
    </button>
  );
};

export default GoogleSignIn;
