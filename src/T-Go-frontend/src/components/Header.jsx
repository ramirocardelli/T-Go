import { Link } from "react-router-dom";
import { useState } from "react";
import LoginButton from "./LoginButton";

function Header({ isAuthenticated, isMintingPartner, login, logout }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-inner">
          <div className="logo">
            <span className="title">T-Go</span>
          </div>

          <nav className="desktop-menu">
            <Link className="navbar-button" to="/">
              Home
            </Link>
            <Link className="navbar-button" to="/minting">
              Minting
            </Link>
            <Link className="navbar-button" to="/gallery">
              Gallery
            </Link>
            <Link className="navbar-button" to="/map">
              Map
            </Link>
            <Link className="navbar-button" to="/profile">
              My NFTs
            </Link>
            {isMintingPartner && (
            <Link className="navbar-button" to="/validation">
              Validation
            </Link>
            )}
          </nav>

          <div className="connect-wallet">
            <LoginButton
              isAuthenticated={isAuthenticated}
              login={login}
              logout={logout}
            />
          </div>

          <button className="mobile-toggle" onClick={toggleMobileMenu}>
            <svg
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        <div className={`mobile-menu ${isMobileMenuOpen ? "open" : ""}`}>
          <nav>
            <Link to="/" onClick={closeMobileMenu}>
              Home
            </Link>
            <Link to="/minting" onClick={closeMobileMenu}>
              Minting
            </Link>
            <Link to="/gallery" onClick={closeMobileMenu}>
              Gallery
            </Link>
            <Link to="/map" onClick={closeMobileMenu}>
              Map
            </Link>
            <Link to="/profile" onClick={closeMobileMenu}>
              My NFTs
            </Link>
            <LoginButton
              isAuthenticated={isAuthenticated}
              login={login}
              logout={logout}
            />
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;
