import { AuthClient } from '@dfinity/auth-client';
import { useState, useEffect } from 'react';
import { canisterId, createActor } from '../../declarations/T-Go-frontend';
import Gallery from './pages/Gallery';
import Minting from './pages/Minting';
import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import LoginButton from './components/LoginButton';
import Map from './pages/Map';
import Profile from './pages/Profile';

const network = process.env.DFX_NETWORK;
const identityProvider =
  network === 'ic'
    ? 'https://identity.ic0.app' // Mainnet
    : 'http://rdmx6-jaaaa-aaaaa-aaadq-cai.localhost:4943'; // Local
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authClient, setAuthClient] = useState();
  const [actor, setActor] = useState();
  const [errorMessage, setErrorMessage] = useState();
  const [mintingPartners, setMintingPartners] = useState([
    {
      id: '6kgbm-hm7rp-sails-s4cy4-g4iyz-jo6kt-ituet-ut7y4-y5e3l-izipj-sqe',
      name: 'Hard Rock Buenos Aires',
      lat: -34.556595668513665,
      lng: -58.413784906320174
    },
  ]);
  const [isPartner, setIsPartner] = useState('');

  useEffect(() => {
    updateActor();
    setErrorMessage();
  }, []);

  async function updateActor() {
    const authClient = await AuthClient.create();
    const identity = authClient.getIdentity();
    const actor = createActor(canisterId, {
      agentOptions: {
        identity
      }
    });
    const isAuthenticated = await authClient.isAuthenticated();

    setActor(actor);
    setAuthClient(authClient);
    setIsAuthenticated(isAuthenticated);
    setIsPartner(mintingPartners.some(partner => partner.id === authClient.getIdentity().getPrincipal().toText()));
  }

  async function login() {
    await authClient.login({
      identityProvider,
      onSuccess: updateActor
    });
  }

  async function logout() {
    await authClient.logout();
    updateActor();
  }
  
  return (
    <div>
      <div className='header'>
        <nav>
          <Link to="/">Home</Link> | <Link to="/minting">Minting</Link> | <Link to="/gallery">Gallery</Link> | <Link to="/map">Map</Link> | <Link to="/profile">Profile</Link>
        </nav>
        <LoginButton
          isAuthenticated={isAuthenticated}
          login={login}
          logout={logout}
        />
      </div>


      {!isAuthenticated ? (
        <div>
          <p>Please sign in to access T-Go</p>
        </div>
      ) : (
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/minting" element={<Minting isPartner={isPartner} />} />
          <Route path="/map" element={<Map mintingPartners={mintingPartners}/>} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      )}
    </div>
  );
}

export default App;