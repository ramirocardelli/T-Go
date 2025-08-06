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
import { T_Go_backend } from "../../declarations/T-Go-backend";
import NotAuthenticated from "./components/NotAuthenticated";

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
  const [isMintingPartner, setIsMintingPartner] = useState(false);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  updateActor();
}, []);

useEffect(() => {
  const fetchMintingPartners = async () => {
    try {
      const partners = await T_Go_backend.getAllMintingPartners();
      setMintingPartners(partners);

      if (authClient && isAuthenticated) {
        const isPartner = partners.some(
          (partner) =>
            partner.id.toString() ===
            authClient.getIdentity().getPrincipal().toString()
        );
        setIsMintingPartner(isPartner);
      } else {
        setIsMintingPartner(false);
      }
    } catch (error) {
      console.error("Error fetching partners:", error);
    }
  };

  if (authClient) {
    fetchMintingPartners();
  }
}, [authClient, isAuthenticated]);



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

  //console.log(authClient.getIdentity().getPrincipal().toString());
  return (
    <div className="my-gradient-background">
      <FloatingBackground />
      <Header isAuthenticated={isAuthenticated} isMintingPartner={isMintingPartner} login={login} logout={logout} />
      {!isAuthenticated ? (
        <NotAuthenticated
          login={login}
        />
      ) : (
        <div className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route
              path="/minting"
              element={<Minting isMintingPartner={isMintingPartner} />}
            />
            <Route
              path="/map"
              element={<Map mintingPartners={mintingPartners} />}
            />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/validation" element={<Validation isMintingPartner={isMintingPartner} />} />
            <Route path="/transfer" element={<Transfer />} />
          </Routes>
        </div>
      )}
    </div>
  );
}

export default App;
