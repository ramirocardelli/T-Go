import { Link } from "react-router-dom";

function HeroSection() {
  return (
    <section className="hero-section">
      <div className="container content">
        <div className="text-box">
          <h1>
            Turn your travels into&nbsp;
            <span className="highlight">on-chain memories</span>
          </h1>
          <p>
            Get verified travel NFTs from real-world locations by visiting our
            partners.
          </p>

          <div className="button-group">
            <Link className="decoration-none" to="/gallery">
              <button className="btn btn-gradient">
                Explore NFTs
                <span className="icon">→</span>
              </button>
            </Link>
            <Link to="/map" className="btn btn-outline decoration-none">
              <span className="icon">📍</span>
              View Partner Locations
            </Link>
          </div>
        </div>
      </div>

      <div className="globe-illustration">
        <div className="globe">🌐</div>
      </div>
    </section>
  );
}

export default HeroSection;
