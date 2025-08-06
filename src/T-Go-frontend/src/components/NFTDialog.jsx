import { MapPin, Calendar } from "lucide-react";
import { displayImageFromBytes, formatDate, formatTime } from "../lib/utils";

const NFTDialog = ({ selectedNFT, setSelectedNFT }) => {
  // TODO: Check if the information is correctly displayed
  if (!selectedNFT) return null;

  return (
    <div className="nft-dialog-backdrop" onClick={() => setSelectedNFT(null)}>
      <div
        className="nft-dialog-container"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="nft-dialog-title">Travel NFT</h2>

        <div className="nft-dialog-grid">
          {/* Image */}
          <div className="nft-dialog-image-wrapper">
            <div className="nft-dialog-image-gradient" />
            <img
              src={displayImageFromBytes(selectedNFT.image)}
              alt={selectedNFT.description}
              className="nft-dialog-image"
            />
          </div>

          {/* Details */}
          <div className="nft-dialog-details">
            <div className="nft-dialog-section">
              <h3>Description</h3>
              <p>{selectedNFT.description}</p>
            </div>

            <div className="nft-dialog-section">
              <h3>Location</h3>
              <div className="nft-dialog-icon-text">
                <MapPin className="nft-dialog-icon turquoise" />
                <span>{selectedNFT.locationName}</span>
              </div>
            </div>

            <div className="nft-dialog-section nft-dialog-row">
              <div>
                <h3>Minted</h3>
                <div className="nft-dialog-icon-text">
                  <Calendar className="nft-dialog-icon turquoise" />

                  <span>
            {formatDate(selectedNFT.timestamp)}
            {" at "}
            {formatTime(selectedNFT.timestamp)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NFTDialog;
