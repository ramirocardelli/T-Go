import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { MapPin, Award, Clock, ArrowRight, User, Send } from "lucide-react";
import { T_Go_backend } from "../../../declarations/T-Go-backend";
import { Principal } from "@dfinity/principal";
import { AuthClient } from "@dfinity/auth-client";
import { displayImageFromBytes, getLocationById } from "../lib/utils";

// TODO: Replace with the actual NFT data
const NFT = {
  id: 1,
  description: "Tokyo Neon Dreams",
  location: "Shibuya, Tokyo",
  image:
    "https://postalmuseum.si.edu/sites/default/files/exhibitions/npm-2011_2005_302.jpg",
  validatedDate: "2024-01-15",
  status: "validated",
  owner: "user123",
};

function Transfer() {
  const [searchParams] = useSearchParams();
  const [recipientId, setRecipientId] = useState("");
  const [isTransferring, setIsTransferring] = useState(false);
  const [error, setError] = useState("");
  const [nft, setNft] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [locations, setLocations] = useState([]);
  const nftId = searchParams.get("id");
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate fetching NFT data
    const fetchNFT = async () => {
      try {
        const fetchedNFT = await T_Go_backend.getOneNFT(parseInt(nftId));
        setNft(fetchedNFT[0]);
        setIsLoading(false);
      } catch (err) {
        setError("Failed to load NFT data");
        console.error(err);
        setIsLoading(false);
      }
    };
    const fetchLocations = async () => {
      try {
        const fetchedLocations = await T_Go_backend.getAllLocations();
        setLocations(fetchedLocations);
      } catch (err) {
        console.error("Failed to load locations:", err);
      }
    };
    fetchLocations();
    fetchNFT();
  }, [nftId]);

  const handleTransfer = async (e) => {
    // TODO: Implement the actual transfer logic
    e.preventDefault();

    if (!recipientId.trim()) {
      setError("Please enter a recipient ID");
      return;
    }

    if (recipientId.trim() === nft.owner) {
      setError("Cannot transfer to yourself");
      return;
    }

    setIsTransferring(true);
    setError("");

    try {
      const authClient = await AuthClient.create();
      const principal = authClient.getIdentity().getPrincipal();
      await T_Go_backend.transferNFT(principal, nft.id, Principal.fromText(recipientId));
      // Navigate back to profile or show success message
      navigate("/profile?transfer=success");
    } catch (err) {
      setError("Transfer failed. Please try again.");
      console.log(err);
    } finally {
      setIsTransferring(false);
    }
  };

  if (error && !nft) {
    return (
      <div className="transfer-container">
        <div className="error-state">
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={() => navigate("/profile")} className="back-button">
            Back to Profile
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="transfer-container">
        <div className="loading-state">
          <p>Loading NFT...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="transfer-container">
      <div className="transfer-header">
        <h1>Transfer NFT</h1>
        <p>Transfer ownership of your NFT to another user</p>
      </div>

      <div className="transfer-content">
        <div className="nft-preview">
          <h2>NFT to Transfer</h2>
          <div className="nft-card">
            <img
              src={displayImageFromBytes(nft.image, "image/jpeg")}
              alt={nft.description}
            />
            <div className="badge validated">
              <Award size={12} />
              <span>Validated</span>
            </div>
            <div className="nft-content">
              <h3>{nft.description}</h3>
              <div className="location">
                <MapPin className="mappin" size={14} />
                {getLocationById(locations, nft.location)}
              </div>
              <div className="details">
                <div>
                  <Award className="award" size={12} />
                  Validated {nft.validatedDate}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="transfer-arrow">
          <ArrowRight size={32} />
        </div>

        <div className="transfer-form">
          <h2>Transfer Details</h2>
          <form onSubmit={handleTransfer}>
            <div className="form-group">
              <label htmlFor="recipientId">
                <User size={16} />
                Recipient User ID
              </label>
              <input
                type="text"
                id="recipientId"
                value={recipientId}
                onChange={(e) => setRecipientId(e.target.value)}
                placeholder="Enter recipient's user ID"
                disabled={isTransferring}
              />
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="form-actions">
              <button
                type="button"
                onClick={() => navigate("/profile")}
                className="cancel-button"
                disabled={isTransferring}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="transfer-submit-button"
                disabled={isTransferring}
              >
                {isTransferring ? (
                  <>
                    <div className="spinner"></div>
                    Transferring...
                  </>
                ) : (
                  <>Transfer NFT</>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Transfer;
