import HashMap "mo:base/HashMap";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Iter "mo:base/Iter";
import Buffer "mo:base/Buffer";
import Nat32 "mo:base/Nat32";
import Text "mo:base/Text";
import Time "mo:base/Time";

actor NFTMinting {
    
    // Type definitions
    public type NFT = {
        id: Nat;
        image: Blob;
        description: Text;
        location: Principal;
        contentType: Text;
        owner: Principal;
        timestamp: Int; // Unix timestamp in nanoseconds when NFT was minted
    };
    
    public type Location = {
        id: Principal;
        name: Text;
        address: Text;
        lat: Float;
        lng: Float;
    };
    
    public type LocationSummary = {
        id: Principal;
        name: Text;
    };
    
    public type Submission = {
        id: Nat;
        image: Blob;
        description: Text;
        location: Principal;
        contentType: Text;
        owner: Principal;
        timestamp: Int; // Unix timestamp in nanoseconds when submission was created
    };
    
    // Storage
    private stable var nextNFTId: Nat = 0;
    private stable var nextSubmissionId: Nat = 0;
    
    // Using HashMap for better performance
    private var nfts = HashMap.HashMap<Nat, NFT>(10, func(x: Nat, y: Nat) : Bool { x == y }, func(x: Nat) : Nat32 { 
        Nat32.fromNat(x) 
    });
    
    private var submissions = HashMap.HashMap<Nat, Submission>(10, func(x: Nat, y: Nat) : Bool { x == y }, func(x: Nat) : Nat32 { 
        Nat32.fromNat(x) 
    });
    
    private var locations = HashMap.HashMap<Principal, Location>(10, Principal.equal, Principal.hash);
    
    // For tracking minting partners (locations that can approve/reject)
    private var mintingPartners = HashMap.HashMap<Principal, Bool>(10, Principal.equal, Principal.hash);
    
    // Map location names to Principal IDs for validation
    private var locationNameToPrincipal = HashMap.HashMap<Text, Principal>(10, Text.equal, Text.hash);
    
    // System upgrade handling
    system func preupgrade() {
        // Convert HashMaps to stable arrays for upgrade
    };
    
    system func postupgrade() {
        // Restore HashMaps from stable arrays after upgrade
    };
    
    // Helper function to check if caller is a minting partner
    private func isMintingPartner(caller: Principal) : Bool {
        switch (mintingPartners.get(caller)) {
            case (?true) { true };
            case _ { false };
        }
    };
    
    // Helper function to check if caller owns an NFT
    private func isNFTOwner(nftId: Nat, caller: Principal) : Bool {
        switch (nfts.get(nftId)) {
            case (?nft) { Principal.equal(nft.owner, caller) };
            case null { false };
        }
    };
    
    // Helper function to validate location exists
    private func isValidLocation(location: Principal) : Bool {
        switch (locations.get(location)) {
            case (?_) { true };
            case null { false };
        }
    };

    
    // Admin function to add locations and minting partners
    public func addLocation(location: Location) : async Bool {
        locations.put(location.id, location);
        mintingPartners.put(location.id, true);
        // Map location name to Principal for string-based lookups
        locationNameToPrincipal.put(location.name, location.id);
        true
    };

    // Add a minting partner (location that can approve/reject submissions)
    public func addMintingPartner(partnerId: Principal) : async Bool {
        mintingPartners.put(partnerId, true);
        true
    };
    
    // Remove a minting partner
    public func removeMintingPartner(partnerId: Principal) : async Bool {
        mintingPartners.delete(partnerId);
        true
    };

    // Get all minting partners (locations with approval privileges)
    public query func getAllMintingPartners() : async [Location] {
        let partnersBuffer = Buffer.Buffer<Location>(0);
        
        for ((partnerId, _) in mintingPartners.entries()) {
            switch (locations.get(partnerId)) {
                case (?location) {
                    partnersBuffer.add(location);
                };
                case null { /* Skip if location not found */ };
            }
        };
        
        Buffer.toArray(partnersBuffer)
    };
    
    // Get all locations (only id and name)
    public query func getAllLocations() : async [LocationSummary] {
        let locationsBuffer = Buffer.Buffer<LocationSummary>(0);
        
        for ((_, location) in locations.entries()) {
            locationsBuffer.add({
                id = location.id;
                name = location.name;
            });
        };
        
        Buffer.toArray(locationsBuffer)
    };
    
    // Get one NFT by ID
    public query func getOneNFT(id: Nat) : async ?NFT {
        nfts.get(id)
    };
    
    // Submit an NFT for minting (creates a submission)
    public func mintNFT(
        owner: Principal,
        image: Blob,
        description: Text,
        location: Principal,
        contentType: Text
    ) : async Result.Result<Submission, Text> {
        // Validate location exists
        if (not isValidLocation(location)) {
            return #err("Invalid location ID");
        };
        
        let now = Time.now();
        
        let submission: Submission = {
            id = nextSubmissionId;
            image = image;
            description = description;
            location = location;
            contentType = contentType;
            owner = owner;
            timestamp = now;
        };
        
        submissions.put(nextSubmissionId, submission);
        nextSubmissionId += 1;
        
        #ok(submission)
    };
    
    // Transfer NFT ownership
    public func transferNFT(owner: Principal, id: Nat, to: Principal) : async Result.Result<NFT, Text> {
        if (not isNFTOwner(id, owner)) {
            return #err("You don't own this NFT");
        };
        
        switch (nfts.get(id)) {
            case (?nft) {
                let updatedNFT: NFT = {
                    id = nft.id;
                    image = nft.image;
                    description = nft.description;
                    location = nft.location;
                    contentType = nft.contentType;
                    owner = to;
                    timestamp = nft.timestamp; // Keep original timestamp
                };
                
                nfts.put(id, updatedNFT);
                #ok(updatedNFT)
            };
            case null {
                #err("NFT not found")
            };
        }
    };
    
    // Accept a submission (only minting partners can do this)
    public func acceptSubmission(partner: Principal, id: Nat) : async Result.Result<NFT, Text> {
        if (not isMintingPartner(partner)) {
            return #err("Only minting partners can accept submissions");
        };
        
        switch (submissions.get(id)) {
            case (?submission) {
                // Check if the partner is the location for this submission
                if (not Principal.equal(partner, submission.location)) {
                    return #err("You can only accept submissions for your location");
                };
                
                // Create NFT from submission with current timestamp
                let now = Time.now();
                let nft: NFT = {
                    id = nextNFTId;
                    image = submission.image;
                    description = submission.description;
                    location = submission.location;
                    contentType = submission.contentType;
                    owner = submission.owner;
                    timestamp = now; // NFT gets new timestamp when minted
                };
                
                // Add to NFTs and remove from submissions
                nfts.put(nextNFTId, nft);
                submissions.delete(id);
                nextNFTId += 1;
                
                #ok(nft)
            };
            case null {
                #err("Submission not found")
            };
        }
    };
    
    // Reject a submission (only minting partners can do this)
    public func rejectSubmission(partner: Principal, id: Nat) : async Result.Result<Submission, Text> {
        if (not isMintingPartner(partner)) {
            return #err("Only minting partners can reject submissions");
        };
        
        switch (submissions.get(id)) {
            case (?submission) {
                // Check if the partner is the location for this submission
                if (not Principal.equal(partner, submission.location)) {
                    return #err("You can only reject submissions for your location");
                };
                
                // Remove from submissions
                submissions.delete(id);
                #ok(submission)
            };
            case null {
                #err("Submission not found")
            };
        }
    };
    
    // Additional helper functions for querying
    public shared query func getAllNFTs() : async [NFT] {
        Iter.toArray(nfts.vals())
    };
    
    public query func getAllSubmissions() : async [Submission] {
        Iter.toArray(submissions.vals())
    };
    
    public query func getNFTsByOwner(owner: Principal) : async [NFT] {
        let ownerNFTs = Buffer.Buffer<NFT>(0);
        
        for ((_, nft) in nfts.entries()) {
            if (Principal.equal(nft.owner, owner)) {
                ownerNFTs.add(nft);
            };
        };
        
        Buffer.toArray(ownerNFTs)
    };
    
    public query func getSubmissionsByOwner(owner: Principal) : async [Submission] {
        let ownerSubmissions = Buffer.Buffer<Submission>(0);
        
        for ((_, submission) in submissions.entries()) {
            if (Principal.equal(submission.owner, owner)) {
                ownerSubmissions.add(submission);
            };
        };
        
        Buffer.toArray(ownerSubmissions)
    };

    public func getMyNFTs(owner: Principal) : async [NFT] {
        let ownerNFTs = Buffer.Buffer<NFT>(0);
        for ((_, nft) in nfts.entries()) {
            if (Principal.equal(nft.owner, owner)) {
                ownerNFTs.add(nft);
            };
        };
        Buffer.toArray(ownerNFTs)
    };

    public func getMySubmissions(owner: Principal) : async [Submission] {
        let ownerSubmissions = Buffer.Buffer<Submission>(0);
        for ((_, submission) in submissions.entries()) {
            if (Principal.equal(submission.owner, owner)) {
                ownerSubmissions.add(submission);
            };
        };
        Buffer.toArray(ownerSubmissions)
    };
    
    // Helper function to get NFTs by location Principal
    public query func getNFTsByLocation(location: Principal) : async [NFT] {
        let locationNFTs = Buffer.Buffer<NFT>(0);
        
        for ((_, nft) in nfts.entries()) {
            if (Principal.equal(nft.location, location)) {
                locationNFTs.add(nft);
            };
        };
        
        Buffer.toArray(locationNFTs)
    };
    
    // Helper function to get submissions by location Principal
    public query func getSubmissionsByLocation(location: Principal) : async [Submission] {
        let locationSubmissions = Buffer.Buffer<Submission>(0);
        
        for ((_, submission) in submissions.entries()) {
            if (Principal.equal(submission.location, location)) {
                locationSubmissions.add(submission);
            };
        };
        
        Buffer.toArray(locationSubmissions)
    };
    
    // Get all submissions for a location (for minting partners to manage)
    public query func getSubmissionsForLocation(location: Principal) : async [Submission] {
        let locationSubmissions = Buffer.Buffer<Submission>(0);
        
        for ((_, submission) in submissions.entries()) {
            if (Principal.equal(submission.location, location)) {
                locationSubmissions.add(submission);
            };
        };
        
        Buffer.toArray(locationSubmissions)
    };
    
    // Helper function to get current timestamp
    public query func getCurrentTime() : async Int {
        Time.now()
    };
}