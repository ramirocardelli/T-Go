import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="logo">
              <div className="logo-icon">
                <span>🌐</span>
              </div>
              <span className="logo-text">T-Go</span>
            </div>
            <p className="description">
              Transform your travel experiences into unique blockchain memories.
              Collect, trade, and showcase your journey.
            </p>
            <div className="socials">
              <div className="social-btn">X</div>
              <div className="social-btn">IG</div>
              <div className="social-btn">DC</div>
            </div>
          </div>

          <div className="footer-links">
            <h4>Company</h4>
            <Link to="/">About</Link>
            <Link to="/">FAQ</Link>
            <Link to="/">Privacy</Link>
            <Link to="/">Terms</Link>
          </div>
        </div>

        <div className="footer-bottom">
          <p>
            © 2025 T-Go. All rights reserved. Built on the Internet Computer.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
