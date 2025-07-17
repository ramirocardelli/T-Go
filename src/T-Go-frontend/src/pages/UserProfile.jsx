import { useEffect, useState } from "react";
import { MapPin, Award, Clock, CheckCircle, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import { T_Go_backend } from "../../../declarations/T-Go-backend";
import { AuthClient } from "@dfinity/auth-client";
import { displayImageFromBytes, formatDate, formatTime, getLocationById } from "../lib/utils";

function UserProfile() {
  const [activeTab, setActiveTab] = useState("validated");
  const [pendingNFTs, setPendingNFTs] = useState([]);
  const [validatedNFTs, setValidatedNFTs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [locations, setLocations] = useState([]);
  const [principal, setPrincipal] = useState("");

  const fetchNFTs = async () => {
    try {
      // TODO: Check if the NFTs information is correctly displayed
      // TODO: Make it work with the NFTs of the caller, I don't think it is necessary to pass the user ID
      const authClient = await AuthClient.create();
      const principal = authClient.getIdentity().getPrincipal();
      const myValidatedNFTs = await T_Go_backend.getMyNFTs(principal);
      const myPendingNFTs = await T_Go_backend.getMySubmissions(principal);
      const allLocations = await T_Go_backend.getAllLocations();
      setPrincipal(principal.toText());
      setValidatedNFTs(myValidatedNFTs);
      setPendingNFTs(myPendingNFTs);
      setLocations(allLocations);
      setIsLoading(false);
      console.log("Fetched Locations:", allLocations);
      console.log("Fetched NFTs:", myValidatedNFTs);
      console.log("Fetched Pending NFTs:", myPendingNFTs);
    } catch (error) {
      console.error("Error fetching NFTs:", error);
    }
  };

  useEffect(() => {
    fetchNFTs();
  }, []);

  if (isLoading) {
    return (
      <div className="validation-container">
        <div className="loading-state">
          <div className="loading-spinner">
            <RefreshCw size={32} />
          </div>
          <p>Loading your NFTs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="user-profile">
      <h1 className="profile-title">My NFTs</h1>
      <p className="profile-description">
        Welcome! Here are your NFTs.
      </p>
      <p className="profile-principal">
        Your Principal ID: <span className="principal-id">{principal}</span>
      </p>
        {validatedNFTs.length === 0 && pendingNFTs.length === 0 ? (
          <div className="no-nfts">
            <p>You have no NFTs yet.</p>
            <Link to="/mint">
              <button className="mint-button">Mint Your First NFT</button>
            </Link>
          </div>
        ) : (
      <section className="nft-tabs">

        <div className="tab-header">
          <button
            className={activeTab === "validated" ? "active" : ""}
            onClick={() => setActiveTab("validated")}
          >
            <CheckCircle size={16} /> Validated NFTs ({validatedNFTs.length})
          </button>
          <button
            className={activeTab === "pending" ? "active" : ""}
            onClick={() => setActiveTab("pending")}
          >
            <Clock size={16} /> Pending Validation ({pendingNFTs.length})
          </button>
        </div>

        <div className="nft-grid">
          {(activeTab === "validated" ? validatedNFTs : pendingNFTs).map(
            (nft) => {
              return (
                <div className="nft-card" key={nft.id}>
                  <img
                    src={displayImageFromBytes(nft.image, nft.type)}
                    alt={nft.description}
                  />
                  <div className={`badge top-left ${activeTab}`}>
                    {activeTab === "validated" ? (
                      <CheckCircle size={12} />
                    ) : (
                      <Clock size={12} />
                    )}
                    <span>
                      {activeTab === "validated" ? "Validated" : "Pending"}
                    </span>
                  </div>
                  <div className="nft-content">
                    <h3>{nft.title}</h3>
                    <div className="location">
                      <MapPin className="mappin" size={14} />{" "}
                      {getLocationById(locations, nft.location)}
                    </div>
                    <div className="details">
                      {activeTab === "validated" ? (
                        <>
                          <Award className="award" size={12} /> Validated{" "}
                          {formatDate(nft.timestamp)} - {formatTime(nft.timestamp)}
                        </>
                      ) : (
                        <>
                          <Clock className="clock" size={12} /> Submitted{" "}
                          {formatDate(nft.timestamp)} - {formatTime(nft.timestamp)}
                        </>
                      )}
                    </div>
                    {activeTab === "validated" && (
                      <div className="nft-actions">
                        <Link to={`/transfer?id=${nft.id}`}>
                          <button className="transfer-button">Transfer</button>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              );
            },
          )}
        </div>
      </section>
  )}
    </div>
  );
}

export default UserProfile;
