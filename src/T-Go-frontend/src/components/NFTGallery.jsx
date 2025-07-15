

function NFTGallery({ displayedNFTs, viewMode, setSelectedNFT }) {
  const displayImageFromBytes = (byteArray, mimeType, imgElementId) => {
    const uint8Array = new Uint8Array(byteArray);
    const blob = new Blob([uint8Array], { type: mimeType });
    const imageUrl = URL.createObjectURL(blob);
    return imageUrl;
  }

  return (
    <section className="nft-gallery-section">
      <div className="nft-gallery-container">
        {viewMode === "grid" ? (
          <div className="nft-grid">
            {displayedNFTs.map((nft) => {
                return (
                <div key={nft.id} className="nft-card">
                  <div
                  className="nft-image-container"
                  onClick={() => setSelectedNFT(nft)}
                  >
                  <div className={`nft-image-overlay ${nft.gradient}`}></div>
                  <img
                    src={displayImageFromBytes(nft.data) || "/placeholder.svg"}
                    alt={nft.title}
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
                  <h3 className="nft-title">{nft.title}</h3>
                  <p className="nft-location">📍 {nft.location}</p>

                  <div className="nft-user">
                    <img
                    src={nft.user?.avatar || "/placeholder.svg"}
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
        ) : (
          <div className="nft-list">
            {displayedNFTs.map((nft) => {
              return (
                <div key={nft.id} className="nft-list-card">
                  <div
                    className="nft-list-image"
                    onClick={() => setSelectedNFT(nft)}
                  >
                    <div className={`nft-image-overlay ${nft.gradient}`}></div>
                    <img
                      src={displayImageFromBytes(nft.data) || "/placeholder.svg"}
                      alt={nft.title}
                    />
                    <div
                      className={`nft-validation ${
                        nft.validated ? "validated" : "pending"
                      }`}
                    >
                      {nft.validated ? "✅ Validated" : "🕓 Pending"}
                    </div>
                  </div>
                  <div className="nft-list-body">
                    <div className="nft-list-header">
                      <h3>{nft.title}</h3>
                    </div>
                    <p className="nft-description">{nft.description}</p>
                    <p className="nft-location">📍 {nft.location}</p>

                    <div className="nft-user">
                      <img
                        src={nft.user.avatar || "/placeholder.svg"}
                        alt={nft.user.username}
                        className="nft-avatar"
                      />
                      <div>
                        <div className="nft-username">{nft.user.name}</div>
                        <div className="nft-handle">@{nft.user.username}</div>
                      </div>
                    </div>

                    <div className="nft-actions">
                      <span className="nft-views">👁 {nft.views} views</span>
                      <span className="nft-date">
                        {new Date(nft.mintedDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

export default NFTGallery;
