import { useEffect, useState } from "react";
import GalleryTitle from "../components/GalleryTitle";
import NFTGallery from "../components/NFTGallery";
import NFTDialog from "../components/NFTDialog";
import { T_Go_backend } from "../../../declarations/T-Go-backend";
import { RefreshCw } from "lucide-react";

function Gallery() {
  const [selectedNFT, setSelectedNFT] = useState(null);
  const [NFTs, setNFTs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [locations, setLocations] = useState([]);

  const fetchNFTs = async () => {
    try {
      // TODO: Check if the NFTs information is correctly displayed
      const nfts = await T_Go_backend.getAllNFTs();
      setNFTs(nfts);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching NFTs:", error);
    }
  };

  const fetchLocations = async () => {
    try {
      const locations = await T_Go_backend.getAllLocations();
      setLocations(locations);
    } catch (error) {
      console.error("Error fetching locations:", error);
    }
  };

  useEffect(() => {
    fetchNFTs();
    fetchLocations();
  }, []);

  if (isLoading) {
    return (
      <div className="validation-container">
        <div className="loading-state">
          <div className="loading-spinner">
            <RefreshCw size={32} />
          </div>
          <p>Loading gallery requests...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <GalleryTitle />
      <NFTGallery
        displayedNFTs={NFTs}
        setSelectedNFT={setSelectedNFT}
        locations={locations}
      />
      <NFTDialog
        selectedNFT={selectedNFT}
        setSelectedNFT={setSelectedNFT}
        locations={locations}
      />
    </>
  );
}

export default Gallery;
