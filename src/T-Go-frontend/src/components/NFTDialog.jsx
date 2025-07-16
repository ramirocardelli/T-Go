import { MapPin, Calendar } from "lucide-react";

const NFTDialog = ({ selectedNFT, setSelectedNFT, locations }) => {
  // TODO: Check if the information is correctly displayed
  if (!selectedNFT) return null;

  const displayImageFromBytes = (byteArray, mimeType, imgElementId) => {
    const uint8Array = new Uint8Array(byteArray);
    const blob = new Blob([uint8Array], { type: mimeType });
    const imageUrl = URL.createObjectURL(blob);
    return imageUrl;
  };

  const getDayFromTimestamp = (timestamp) => {
    const date = new Date(Number(timestamp / 1000000n));
    return date.toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getLocationById = (locationId) => {
    const location = locations.find((loc) => loc.id.toString() === locationId);
    if (location) {
      return location.name;
    }
    return "Undefined location";
  };

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
                <span>{getLocationById(selectedNFT.locationId)}</span>
              </div>
            </div>

            <div className="nft-dialog-section nft-dialog-row">
              <div>
                <h3>Minted</h3>
                <div className="nft-dialog-icon-text">
                  <Calendar className="nft-dialog-icon turquoise" />
                  <span>{getDayFromTimestamp(selectedNFT.timestamp)}</span>
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
