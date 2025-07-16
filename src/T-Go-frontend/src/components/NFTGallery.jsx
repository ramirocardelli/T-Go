

function NFTGallery({ displayedNFTs, setSelectedNFT }) {

  // TODO: Check if the NFTs information is correctly displayed

  const displayImageFromBytes = (byteArray, mimeType) => {
    const uint8Array = new Uint8Array(byteArray);
    const blob = new Blob([uint8Array], { type: mimeType });
    const imageUrl = URL.createObjectURL(blob);
    return imageUrl;
  }

  console.log("NFTs in Gallery:", displayedNFTs);

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
                    src={displayImageFromBytes(nft.data) || "/placeholder.svg"}
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
                  <p className="nft-location">📍 {nft.locationId}</p>

                  <div className="nft-user">
                    <img
                    src="/placeholder.svg"
                    alt={nft.user?.username }
                    className="nft-avatar"
                    />
                    <span>II: {nft.user?.username}</span>
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
