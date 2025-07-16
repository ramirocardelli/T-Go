import Blob "mo:base/Blob";
import Array "mo:base/Array";
import Time "mo:base/Time";
import Result "mo:base/Result";
import Principal "mo:base/Principal";

actor {
  type ImageData = {
    id: Nat;
    data: Blob;
    timestamp: Int;
    contentType: Text;
  };
  
  type NFT = {
    id: Nat;
    owner: Principal;
    locationId: Text;
    data: Blob;
    contentType: Text;
    timestamp: Int;
  };
  

  stable var nextImageId: Nat = 0;
  stable var images: [(Nat, ImageData)] = [];

  stable var nextNftId: Nat = 0;
  stable var nfts: [NFT] = [];
  stable var minted: [(Principal, Text)] = [];

  public query func getAllImages() : async [ImageData] {
    Array.map<(Nat, ImageData), ImageData>(images, func((_, imageData)) = imageData)
  };

  public query func getAllNFTs() : async [NFT] {
    nfts
  };

  public query func getImageCount() : async Nat {
    nextNftId
  };
  public shared({ caller }) func mintImage(locationId: Text, imageBlob: Blob, contentType: Text) : async Result.Result<NFT, Text> {
    // Check if caller already minted at this location
    if (Array.find<(Principal, Text)>(minted, func((p, loc)) = p == caller and loc == locationId) != null) {
      return #err("You have already minted an NFT for this location.");
    };

    let nft: NFT = {
      id = nextNftId;
      owner = caller;
      locationId = locationId;
      data = imageBlob;
      contentType = contentType;
      timestamp = Time.now();
    };

    // Save NFT and mark as minted
    nfts := Array.append(nfts, [nft]);
    minted := Array.append(minted, [(caller, locationId)]);
    nextNftId += 1;

    return #ok(nft);
  };

}