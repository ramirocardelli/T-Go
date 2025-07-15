import { useEffect, useState } from "react";
import GalleryTitle from "../components/GalleryTitle";
import NFTGallery from "../components/NFTGallery";
import NFTDialog from "../components/NFTDialog";
import { T_Go_backend } from "../../../declarations/T-Go-backend";

function Gallery() {
  const [selectedNFT, setSelectedNFT] = useState(null);
  const [NFTs, setNFTs] = useState([]);

  const fetchNFTs = async () => {
    try {
      const data = await T_Go_backend.getAllNFTs();
      setNFTs(data);
      console.log("Fetched NFTs:", data);
    } catch (error) {
      console.error('Error fetching NFTs:', error);
    }
  };

  useEffect(() => {
    fetchNFTs();
  }, []);

  return (
    <>
      <GalleryTitle />
      <NFTGallery
        displayedNFTs={NFTs}
        viewMode="grid"
        setSelectedNFT={setSelectedNFT}
      />
      <NFTDialog selectedNFT={selectedNFT} setSelectedNFT={setSelectedNFT} />
    </>
  );
}

export default Gallery;
