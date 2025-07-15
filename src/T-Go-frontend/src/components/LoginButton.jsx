function LoginButton({ isAuthenticated, login, logout }) {
  return (
    <>
      {isAuthenticated ? (
        <div className="connect-wallet">
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <div className="connect-wallet">
          <button onClick={login}>Connect Wallet</button>
        </div>
      )}
    </>
  );
}

export default LoginButton;
