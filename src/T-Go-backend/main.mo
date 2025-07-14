import Blob "mo:base/Blob";
import Array "mo:base/Array";
import Time "mo:base/Time";

actor {
  type ImageData = {
    id: Nat;
    data: Blob;
    timestamp: Int;
    contentType: Text;
  };

  stable var nextImageId: Nat = 0;
  stable var images: [(Nat, ImageData)] = [];

  public func postImage(imageBlob: Blob, contentType: Text) : async Nat {
    let imageId = nextImageId;
    let newImage: ImageData = {
      id = imageId;
      data = imageBlob;
      timestamp = Time.now();
      contentType = contentType;
    };
    
    images := Array.append(images, [(imageId, newImage)]);
    nextImageId += 1;
    
    return imageId;
  };

  public query func getImage(id: Nat) : async ?ImageData {
    switch (Array.find<(Nat, ImageData)>(images, func((imageId, _)) = imageId == id)) {
      case (?(_, imageData)) { ?imageData };
      case null { null };
    };
  };

    public query func getAllImages() : async [ImageData] {
    Array.map<(Nat, ImageData), ImageData>(images, func((_, imageData)) = imageData)
  };

  public query func getImageCount() : async Nat {
    nextImageId
  };
}