import { useState } from "react";
import { MapPin, Award, Clock, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

const validatedNFTs = [
  {
    id: 1,
    title: "Tokyo Neon Dreams",
    location: "Shibuya, Tokyo",
    image:
      "https://postalmuseum.si.edu/sites/default/files/exhibitions/npm-2011_2005_302.jpg",
    validatedDate: "2024-01-15",
  },
  {
    id: 2,
    title: "Mount Fuji Sunrise",
    location: "Fujinomiya, Japan",
    image:
      "https://postalmuseum.si.edu/sites/default/files/exhibitions/npm-2011_2005_302.jpg",
    validatedDate: "2024-01-10",
  },
  {
    id: 3,
    title: "Kyoto Temple Serenity",
    location: "Kyoto, Japan",
    image:
      "https://postalmuseum.si.edu/sites/default/files/exhibitions/npm-2011_2005_302.jpg",
    validatedDate: "2024-01-08",
  },
  {
    id: 4,
    title: "Osaka Street Food",
    location: "Dotonbori, Osaka",
    image:
      "https://postalmuseum.si.edu/sites/default/files/exhibitions/npm-2011_2005_302.jpg",
    validatedDate: "2024-01-05",
  },
  {
    id: 5,
    title: "Hiroshima Peace Memorial",
    location: "Hiroshima, Japan",
    image:
      "https://postalmuseum.si.edu/sites/default/files/exhibitions/npm-2011_2005_302.jpg",
    validatedDate: "2024-01-03",
  },
  {
    id: 6,
    title: "Nara Deer Park",
    location: "Nara, Japan",
    image:
      "https://postalmuseum.si.edu/sites/default/files/exhibitions/npm-2011_2005_302.jpg",
    validatedDate: "2024-01-01",
  },
];

const pendingNFTs = [
  {
    id: 7,
    title: "Seoul Night Market",
    location: "Myeongdong, Seoul",
    image:
      "https://postalmuseum.si.edu/sites/default/files/exhibitions/npm-2011_2005_302.jpg",
    submittedDate: "2024-01-20",
  },
  {
    id: 8,
    title: "Jeju Island Coastline",
    location: "Jeju, South Korea",
    image:
      "https://postalmuseum.si.edu/sites/default/files/exhibitions/npm-2011_2005_302.jpg",
    submittedDate: "2024-01-18",
  },
  {
    id: 9,
    title: "Busan Beach Sunset",
    location: "Haeundae, Busan",
    image:
      "https://postalmuseum.si.edu/sites/default/files/exhibitions/npm-2011_2005_302.jpg",
    submittedDate: "2024-01-16",
  },
  {
    id: 10,
    title: "Gyeongbokgung Palace",
    location: "Seoul, South Korea",
    image:
      "https://postalmuseum.si.edu/sites/default/files/exhibitions/npm-2011_2005_302.jpg",
    submittedDate: "2024-01-14",
  },
];

function UserProfile() {
  const [activeTab, setActiveTab] = useState("validated");

  return (
    <div className="user-profile">
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
                  <img src={nft.image} alt={nft.title} />
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
                      <MapPin className="mappin" size={14} /> {nft.location}
                    </div>
                    <div className="details">
                      {activeTab === "validated" ? (
                        <>
                          <Award className="award" size={12} /> Validated {nft.validatedDate}
                        </>
                      ) : (
                        <>
                          <Clock className="clock" size={12} /> Submitted {nft.submittedDate}
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
    </div>
  );
}

export default UserProfile;
