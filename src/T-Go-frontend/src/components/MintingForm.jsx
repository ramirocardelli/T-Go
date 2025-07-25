import { MapPin, ImageIcon, Sparkles, FileText } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { X, Check, Camera, Upload } from "lucide-react";
import { T_Go_backend } from "../../../declarations/T-Go-backend";
import { AuthClient } from "@dfinity/auth-client";
import { Principal } from "@dfinity/principal";

function MintingHeader() {
  const [locations, setLocations] = useState([]);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    image: null,
    description: "",
    destination: "",
  });
  const fileInputRef = useRef(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const locations = await T_Go_backend.getAllLocations();
        setLocations(locations);
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    };

    fetchData();
  }, []);

  const handleFileInput = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result);
      };
      reader.readAsDataURL(file);
      setFormData({ ...formData, image: file });
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result);
      };
      reader.readAsDataURL(file);
      setFormData({ ...formData, image: file });
    }
  };

  const isFormComplete =
    formData.image && formData.description.trim() && formData.destination;

  const handleDescriptionChange = (e) => {
    setFormData({ ...formData, description: e.target.value });
  };

  const handleDestinationChange = (e) => {
    setFormData({ ...formData, destination: e.target.value });
  };
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    // TODO: Check if everything is working correctly
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      // Convert image file to Uint8Array
      const imageBuffer = await formData.image.arrayBuffer();
      const imageBytes = new Uint8Array(imageBuffer);
      const principal = (await AuthClient.create()).getIdentity().getPrincipal();
      const result = await T_Go_backend.mintNFT(
        principal,
        imageBytes,
        formData.description,
        Principal.fromText(formData.destination),
        formData.image.type,
      );
      if (!result.err) {
        console.log("NFT minted successfully:", result);
        window.location.href = "/profile";
    } else {
      console.error("Failed to mint NFT");
        setIsSubmitting(false);
        setError(result.err);
    }
  } catch (error) {
    console.error("Error minting NFT:", error);
    setIsSubmitting(false);
    }
  };

  return (
    <div className="card-container">
      <div className="card-header">
        <h3 className="card-title">
          <Sparkles className="icon sparkles" />
          NFT Details
        </h3>
      </div>

      <div className="card-content">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="label">
              <ImageIcon className="icon image" />
              Travel Photo
            </label>
            <div
              className={`image-uploader ${
                dragActive ? "drag-active" : ""
              } ${uploadedImage ? "has-image" : ""}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {uploadedImage ? (
                <div className="image-preview">
                  <img src={uploadedImage} alt="Uploaded travel" />
                  <button
                    type="button"
                    onClick={() => {
                      setUploadedImage(null);
                      setFormData({ ...formData, image: null });
                    }}
                    className="remove-btn"
                  >
                    <X size={16} />
                  </button>
                  <div className="upload-status">
                    <Check size={16} className="check" />
                    <span>Image uploaded</span>
                  </div>
                </div>
              ) : (
                <div className="upload-instructions">
                  <div className="upload-icon">
                    <Camera size={32} />
                  </div>
                  <p className="upload-text">
                    Drag & drop your travel photo here
                  </p>
                  <p className="subtext">or click to browse files</p>
                  <button
                    type="button"
                    className="browse-btn"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload size={16} />
                    Choose File
                  </button>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileInput}
                className="file-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="label">
              <FileText className="icon file-text" />
              Description
            </label>
            <textarea
              className="description-input"
              maxLength="200"
              value={formData.description}
              onChange={handleDescriptionChange}
              placeholder="Describe your travel experience..."
            />
          </div>

          <div className="form-group">
            <label className="label">
              <MapPin className="icon map-pin" />
              Travel Destination
            </label>
            <select
              className="destination-select"
              value={formData.destination}
              onChange={handleDestinationChange}
            >
              <option value="">Choose your destination</option>
              {locations.map((location) => (
                <option
                  key={location.id.toString()}
                  value={location.id.toString()}
                >
                  {location.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mint-button-wrapper">
            <button
              type="submit"
              className="mint-button"
              disabled={!isFormComplete || isSubmitting}
            >
              <Sparkles className="icon sparkles" />
              {isSubmitting ? "Minting..." : "Mint Travel NFT"}
            </button>
          </div>

          {error && <div className="error-message">{error}</div>}
          <div className="form-status">
            <p>
              {isSubmitting
                ? "Minting your NFT..."
                : isFormComplete
                  ? "Ready to mint!"
                  : "Please fill in all fields to mint your NFT"}
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default MintingHeader;