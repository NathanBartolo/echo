// ============================================
// GOOGLE SIGN IN - OAuth authentication button
// ============================================

const GoogleSignIn = () => {
  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:5000/api/auth/google";
  };

  return (
    <button onClick={handleGoogleLogin} className="google-btn">
      <span>Sign in with Google</span>
    </button>
  );
};

export default GoogleSignIn;
