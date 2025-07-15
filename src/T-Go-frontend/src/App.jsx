import { AuthClient } from "@dfinity/auth-client";
import { useState, useEffect } from "react";
import { canisterId, createActor } from "../../declarations/T-Go-frontend";
import Gallery from "./pages/Gallery";
import Minting from "./pages/Minting";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Map from "./pages/Map";
import UserProfile from "./pages/UserProfile";
import Header from "./components/Header";
import FloatingBackground from "./components/FloatingBackground";

const network = process.env.DFX_NETWORK;
const identityProvider =
  network === "ic"
    ? "https://identity.ic0.app" // Mainnet
    : "http://rdmx6-jaaaa-aaaaa-aaadq-cai.localhost:4943"; // Local
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authClient, setAuthClient] = useState();
  const [actor, setActor] = useState();
  const [errorMessage, setErrorMessage] = useState();
  const [mintingPartners, setMintingPartners] = useState([
    {
      id: "6kgbm-hm7rp-sails-s4cy4-g4iyz-jo6kt-ituet-ut7y4-y5e3l-izipj-sqe",
      name: "Hard Rock Buenos Aires",
      address: "Av. Corrientes 857, C1043AAH CABA, Argentina",
      availability: "8:00 - 22:00",
      services: "NFT Minting and Verification",
      lat: -34.556595668513665,
      lng: -58.413784906320174,
    },
    {
      id: "7lhcn-in8sp-tbijt-t5dz5-h5jza-kp7lu-jvufu-vu8z5-z6f4m-jabqk-tre",
      name: "Hard Rock Cafe Times Square",
      address: "1501 Broadway, New York, NY 10036, USA",
      availability: "11:00 - 23:00",
      services: "NFT Minting and Verification",
      lat: 40.75773,
      lng: -73.98586,
    },
  ]);
  const [isPartner, setIsPartner] = useState("");

  useEffect(() => {
    updateActor();
    setErrorMessage();
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
        <div>
          <p>Please sign in to access T-Go</p>
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
          </Routes>
        </div>
      )}
    </div>
  );
}

export default App;
