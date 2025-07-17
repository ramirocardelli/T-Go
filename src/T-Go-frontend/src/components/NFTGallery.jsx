import { displayImageFromBytes, getLocationById } from "../lib/utils";

function NFTGallery({ displayedNFTs, setSelectedNFT, locations }) {

  return (
    <section className="nft-gallery-section">
      <div className="nft-gallery-container">
        <div className="nft-grid">
          {displayedNFTs.map((nft) => {
            return (
              <div key={nft.id} className="nft-card">
                <div
                  className="nft-image-container"
                  onClick={() => setSelectedNFT(nft)}
                >
                  <div className="nft-image-overlay"></div>
                  <img
                    src={displayImageFromBytes(nft.image) || "/placeholder.svg"}
                    alt={nft.description}
                    className="nft-image"
                  />
                  <div className="nft-hover-overlay">
                    <button
                      className="nft-view-button"
                      onClick={() => setSelectedNFT(nft)}
                    >
                      👁 View Details
                    </button>
                  </div>
                </div>

                <div className="nft-card-body">
                  <h3 className="nft-title">{nft.description}</h3>
                  <p className="nft-location">
                    📍 {getLocationById(locations, nft.location)}
                  </p>

                  <div className="nft-user">
                    <img
                      src="https://cdn-icons-png.flaticon.com/512/3607/3607444.png"
                      alt={nft.user?.username}
                      className="nft-avatar"
                    />
                    <span>Owner ID: {nft.owner.toString()}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default NFTGallery;
