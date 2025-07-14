import { useState, useEffect } from "react";
import { T_Go_backend } from '../../../declarations/T-Go-backend';

function Gallery() {
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    try {
      setIsLoading(true);
      
      // Get all images from the canister
      const imageDataArray = await T_Go_backend.getAllImages();
      
      // Convert to displayable format
      const loadedImages = imageDataArray.map(imageData => {
        const blob = new Blob([imageData.data], { type: imageData.contentType });
        const imageUrl = URL.createObjectURL(blob);
        
        return {
          id: imageData.id,
          url: imageUrl,
          timestamp: imageData.timestamp,
          contentType: imageData.contentType
        };
      });
      
      setImages(loadedImages);
    } catch (err) {
      console.error('Error loading images:', err);
      setError('Failed to load images');
    } finally {
      setIsLoading(false);
    }
  };

  // Cleanup object URLs when component unmounts
  useEffect(() => {
    return () => {
      images.forEach(image => {
        if (image.url.startsWith('blob:')) {
          URL.revokeObjectURL(image.url);
        }
      });
    };
  }, [images]);
if (isLoading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p>Loading images...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p style={{ color: 'red' }}>{error}</p>
        <button onClick={loadImages}>Try Again</button>
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p>No images found. Upload some images first!</p>
      </div>
    );
  }

  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
      gap: '20px', 
      padding: '20px' 
    }}>
      {images.map((image) => (
        <div key={image.id} style={{
          border: '1px solid #ddd',
          borderRadius: '8px',
          overflow: 'hidden',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <img 
            src={image.url} 
            alt={`Gallery image ${image.id}`}
            style={{
              width: '100%',
              height: '200px',
              objectFit: 'cover'
            }}
          />
          <div style={{ padding: '10px', fontSize: '12px', color: '#666' }}>
            <p>ID: {image.id}</p>
            <p>Type: {image.contentType}</p>
            <p>Uploaded: {new Date(Number(image.timestamp) / 1000000).toLocaleString()}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Gallery;