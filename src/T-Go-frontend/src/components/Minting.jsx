import { useState } from 'react'
import { T_Go_backend } from '../../../declarations/T-Go-backend';

function Minting() {  
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const formData = new FormData(e.target);
      const imageFile = formData.get('image');
      
      if (!imageFile) {
        setMessage('Please select an image');
        return;
      }

      // Convert file to blob
      const arrayBuffer = await imageFile.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      
      // Call the backend canister
      const imageId = await T_Go_backend.postImage(uint8Array, imageFile.type);
      
      setMessage(`Image uploaded successfully! ID: ${imageId}`);
      e.target.reset();
      
    } catch (error) {
      console.error('Error uploading image:', error);
      setMessage('Error uploading image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Mint NFT</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="identity" style={{ display: 'block', marginBottom: '5px' }}>
            Internet Identity Number:
          </label>
          <input
            type="text"
            id="identity"
            name="identity"
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        
        <div style={{ marginBottom: '15px', flexDirection: 'column' }}>
          <label htmlFor="image" style={{ display: 'block', marginBottom: '5px' }}>
            Select Image:
          </label>
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        
        <button type="submit" className='mint-button'>
          Mint NFT
        </button>
      </form>
    </div>
  );
}

export default Minting;