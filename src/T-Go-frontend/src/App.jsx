import { AuthClient } from "@dfinity/auth-client";
import { useState, useEffect } from "react";
import { canisterId, createActor } from "../../declarations/T-Go-frontend";
import Gallery from "./pages/Gallery";
import Minting from "./pages/Minting";
import Validation from "./pages/Validation";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Map from "./pages/Map";
import UserProfile from "./pages/UserProfile";
import Header from "./components/Header";
import FloatingBackground from "./components/FloatingBackground";
import Transfer from "./pages/Transfer";

// TODO: Replace with the actual minting partners
const mockMintingPartners = [
    {
      id: "6kgbm-hm7rp-sails-s4cy4-g4iyz-jo6kt-ituet-ut7y4-y5e3l-izipj-sqe",
      name: "Hard Rock Buenos Aires",
      address: "Av. Corrientes 857, C1043AAH CABA, Argentina",
      lat: -34.556595668513665,
      lng: -58.413784906320174,
    },
    {
      id: "7lhcn-in8sp-tbijt-t5dz5-h5jza-kp7lu-jvufu-vu8z5-z6f4m-jabqk-tre",
      name: "Hard Rock Cafe Times Square",
      address: "1501 Broadway, New York, NY 10036, USA",
      lat: 40.75773,
      lng: -73.98586,
    }];

const network = process.env.DFX_NETWORK;
const identityProvider =
  network === "ic"
    ? "https://identity.ic0.app" // Mainnet
    : "http://rdmx6-jaaaa-aaaaa-aaadq-cai.localhost:4943"; // Local
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authClient, setAuthClient] = useState();
  const [actor, setActor] = useState();
  const [mintingPartners, setMintingPartners] = useState([]);
  const [isPartner, setIsPartner] = useState("");

  useEffect(() => {
    updateActor();
    // TODO: initialize mintingPartners with the actual data
    setMintingPartners(mockMintingPartners);
  }, []);

  async function updateActor() {
    const authClient = await AuthClient.create();
    const identity = authClient.getIdentity();
    const actor = createActor(canisterId, {
      agentOptions: {
        identity,
      },
    });
    const isAuthenticated = await authClient.isAuthenticated();

    setActor(actor);
    setAuthClient(authClient);
    setIsAuthenticated(isAuthenticated);
    setIsPartner(
      mintingPartners.some(
        (partner) =>
          partner.id === authClient.getIdentity().getPrincipal().toText(),
      ),
    );
  }

  async function login() {
    await authClient.login({
      identityProvider,
      onSuccess: updateActor,
    });
  }

  async function logout() {
    await authClient.logout();
    updateActor();
  }

  return (
    <div className="my-gradient-background">
      <FloatingBackground />
      <Header isAuthenticated={isAuthenticated} login={login} logout={logout} />
      {!isAuthenticated ? (
        <div className="auth-prompt">
          <div className="auth-content">
            <div className="auth-icon">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h1 className="auth-title">Welcome to T-Go</h1>
            <p className="auth-subtitle">Discover the world through NFTs and collect memories from your travels</p>
            <button className="auth-button" onClick={login}>
              Sign in with Internet Identity
            </button>
            <p className="auth-note">
              Sign in to start minting location-based NFTs and exploring the world
            </p>
          </div>
        </div>
      ) : (
        <div className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route
              path="/minting"
              element={<Minting isPartner={isPartner} />}
            />
            <Route
              path="/map"
              element={<Map mintingPartners={mintingPartners} />}
            />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/validation" element={<Validation />} />
            <Route path="/transfer" element={<Transfer />} />
          </Routes>
        </div>
      )}
    </div>
  );
}

export default App;
