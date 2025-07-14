function LoginButton({ isAuthenticated, login, logout }) {
  return (
    <>
      {isAuthenticated ? (
        <button onClick={logout} className='logout-button'>
          Logout
        </button>
      ) : (
        <button onClick={login} className='logout-button'>
          Login with Internet Identity
        </button>
      )}
    </>
  );
}

export default LoginButton;