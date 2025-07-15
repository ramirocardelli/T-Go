import {
  CheckCircle,
  Clock,
  MapPin,
  Calendar,
  Heart,
  Eye,
  Share2,
  ExternalLink,
} from "lucide-react";

const NFTDialog = ({ selectedNFT, setSelectedNFT }) => {
  if (!selectedNFT) return null;

  const getCategoryIcon = (category) => {
    // Replace this with actual icon logic
    return Calendar;
  };

  const displayImageFromBytes = (byteArray, mimeType, imgElementId) => {
    const uint8Array = new Uint8Array(byteArray);
    const blob = new Blob([uint8Array], { type: mimeType });
    const imageUrl = URL.createObjectURL(blob);
    return imageUrl;
  }

  return (
    <div className="nft-dialog-backdrop" onClick={() => setSelectedNFT(null)}>
      <div
        className="nft-dialog-container"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="nft-dialog-title">{selectedNFT.title}</h2>

        <div className="nft-dialog-grid">
          {/* Image */}
          <div className="nft-dialog-image-wrapper">
            <div className="nft-dialog-image-gradient" />
            <img
              src={displayImageFromBytes(selectedNFT.data) || "/placeholder.svg"}
              alt={selectedNFT.title}
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
                <span>{selectedNFT.location}</span>
              </div>
            </div>

            <div className="nft-dialog-section nft-dialog-row">
              <div>
                <h3>Minted</h3>
                <div className="nft-dialog-icon-text">
                  <Calendar className="nft-dialog-icon turquoise" />
                  <span>
                    {new Date(selectedNFT.mintedDate).toLocaleDateString()}
                  </span>
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
