import { AuthClient } from '@dfinity/auth-client';
import { useState, useEffect } from 'react';
import { canisterId, createActor } from '../../declarations/T-Go-frontend';
import Gallery from './components/Gallery';
import Minting from './components/Minting';
import { Outlet, Link } from 'react-router-dom';

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
  const [mintingPartners, setMintingPartners] = useState(['6kgbm-hm7rp-sails-s4cy4-g4iyz-jo6kt-ituet-ut7y4-y5e3l-izipj-sqe']);
  
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
        <h1 className='title'>T-Go: Proof of Travel Through NFTs</h1>
        {isAuthenticated ? (
          <button onClick={logout} className='logout-button'>
            Logout
          </button>
        ) : (
          <button onClick={login} className='logout-button'>
            Login with Internet Identity
          </button>
        )}
      </div>

      {!isAuthenticated ? (
        <div>
          <p>Please sign in to access the gallery.</p>
        </div>
      ) : mintingPartners.includes(authClient.getIdentity().getPrincipal().toText()) ? (
        <Minting/>
      ) : (
        <Gallery/>
      )}
    </div>
  );
}

export default App;