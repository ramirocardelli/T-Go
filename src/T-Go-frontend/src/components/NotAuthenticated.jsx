function NotAuthenticated ({ login }){
    return (
        <div className="auth-prompt">
          <div className="auth-content">
            <div className="auth-icon">
              <svg
                width="64"
                height="64"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 2L2 7L12 12L22 7L12 2Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2 17L12 22L22 17"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2 12L12 17L22 12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h1 className="auth-title">Welcome to T-Go</h1>
            <p className="auth-subtitle">
              Discover the world through NFTs and collect memories from your
              travels
            </p>
            <button className="auth-button" onClick={login}>
              Sign in with Internet Identity
            </button>
            <p className="auth-note">
              Sign in to start minting location-based NFTs and exploring the
              world
            </p>
          </div>
        </div>
      );
};

export default NotAuthenticated;
