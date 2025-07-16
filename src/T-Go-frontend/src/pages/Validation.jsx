import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  MapPin, 
  Clock,
  RefreshCw,
  Sparkles
} from 'lucide-react';
// Assuming '../styles/validation.scss' is compiled to CSS and available
// If not, you might need to embed the CSS directly or ensure your build process handles SCSS.

function Validation() {
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  // TODO: Replace with actual API call to fetch validation requests
  // TODO: Implement data
  // Mock data for demonstration
  const mockRequests = [
    {
      id: 1,
      user: {
        name: "Alice Johnson",
        id: "alice.johnson.2024",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice"
      },
      location: {
        name: "Eiffel Tower",
        coordinates: { lat: 48.8584, lng: 2.2945 }
      },
      visitDetails: {
        date: "2024-01-15",
        time: "14:30",
        timestamp: "2024-01-15T14:30:00Z"
      },
      userContent: {
        image: "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=400&h=300&fit=crop",
        description: "Amazing view from the top! The sunset was breathtaking and the city looked magical from up here."
      },
      status: "pending",
      submittedAt: "2024-01-15T14:35:00Z"
    },
    {
      id: 2,
      user: {
        name: "Bob Smith",
        id: "bob.smith.travel",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bob"
      },
      location: {
        name: "Starbucks Times Square",
        coordinates: { lat: 40.7580, lng: -73.9855 }
      },
      visitDetails: {
        date: "2024-01-14",
        time: "09:15",
        timestamp: "2024-01-14T09:15:00Z"
      },
      userContent: {
        image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop",
        description: "Morning coffee in the heart of NYC. The energy here is incredible!"
      },
      status: "pending",
      submittedAt: "2024-01-14T09:20:00Z"
    },
    {
      id: 3,
      user: {
        name: "Carol Davis",
        id: "carol.wanderlust",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Carol"
      },
      location: {
        name: "Sydney Opera House",
        coordinates: { lat: -33.8568, lng: 151.2153 }
      },
      visitDetails: {
        date: "2024-01-13",
        time: "16:45",
        timestamp: "2024-01-13T16:45:00Z"
      },
      userContent: {
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
        description: "Iconic architecture against the beautiful harbor. A must-visit landmark!"
      },
      status: "pending",
      submittedAt: "2024-01-13T16:50:00Z"
    },
    {
      id: 4,
      user: {
        name: "David Wilson",
        id: "david.explorer",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David"
      },
      location: {
        name: "Times Square",
        coordinates: { lat: 40.7580, lng: -73.9855 }
      },
      visitDetails: {
        date: "2024-01-12",
        time: "18:20",
        timestamp: "2024-01-12T18:20:00Z"
      },
      userContent: {
        image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&h=300&fit=crop",
        description: "The bright lights and bustling energy of Times Square at night!"
      },
      status: "pending",
      submittedAt: "2024-01-12T18:25:00Z"
    },
    {
      id: 5,
      user: {
        name: "Emma Thompson",
        id: "emma.travels",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma"
      },
      location: {
        name: "Golden Gate Bridge",
        coordinates: { lat: 37.8199, lng: -122.4783 }
      },
      visitDetails: {
        date: "2024-01-11",
        time: "12:45",
        timestamp: "2024-01-11T12:45:00Z"
      },
      userContent: {
        image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop",
        description: "Stunning views of the Golden Gate Bridge on a clear San Francisco day!"
      },
      status: "pending",
      submittedAt: "2024-01-11T12:50:00Z"
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setRequests(mockRequests);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleAction = (requestId, action) => {
    setRequests(prev => prev.map(req => 
      req.id === requestId 
        ? { ...req, status: action }
        : req
    ));
    console.log(`Request ${requestId} ${action}`);
  };

  if (isLoading) {
    return (
      <div className="validation-container">
        <div className="loading-state">
          <div className="loading-spinner">
            <RefreshCw size={32} />
          </div>
          <p>Loading validation requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="validation-container">
      {/* Header */}
      <div className="validation-header">
        <h1 className="page-title">
          <Sparkles className="icon sparkles" />
          Validation Dashboard
        </h1>
        <p className="page-subtitle">Review and approve NFT minting requests</p>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-number">{requests.filter(r => r.status === 'pending').length}</div>
          <div className="stat-label">Pending</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{requests.filter(r => r.status === 'approved').length}</div>
          <div className="stat-label">Approved</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{requests.filter(r => r.status === 'rejected').length}</div>
          <div className="stat-label">Rejected</div>
        </div>
      </div>

      {/* Requests Grid */}
      <div className="requests-grid">
        {requests.length === 0 ? (
          <div className="empty-state">
            <AlertCircle size={48} />
            <h3>No requests found</h3>
            <p>No validation requests match your current filters.</p>
          </div>
        ) : (
          requests.map(request => (
            <RequestCard 
              key={request.id}
              request={request}
              onAction={handleAction}
            />
          ))
        )}
      </div>
    </div>
  );
}

function RequestCard({ request, onAction }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    // Ensure timeString is a valid date string for parsing
    const date = new Date(timeString);
    if (isNaN(date.getTime())) {
      // If parsing fails, try to parse with a dummy date to get time
      const [hour, minute] = timeString.split(':');
      const dummyDate = new Date(2000, 0, 1, parseInt(hour), parseInt(minute));
      return dummyDate.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      });
    }
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="card-container-validation">
      <div className="card-content">
        <div className="location-info">
          <MapPin size={16} />
          <span>{request.location.name}</span>
        </div>
        
        <div className="visit-time">
          <Clock size={16} />
          <span>{formatDate(request.visitDetails.date)} at {formatTime(request.visitDetails.timestamp)}</span>
        </div>
        {request.userContent.description && (
          <div className="user-description">
            <p>"{request.userContent.description}"</p>
          </div>
        )}
      </div>

      {request.userContent.image && (
        <div className="card-image">
          <img 
            src={request.userContent.image} 
            alt={`${request.user.name}'s visit to ${request.location.name}`}
            onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/400x300/cccccc/333333?text=Image+Not+Found"; }}
          />
        </div>
      )}

      <div className="card-actions">
        <button 
          className="btn-validation btn-approve"
          onClick={() => onAction(request.id, 'approved')}
        >
          <CheckCircle size={20} />
          Approve
        </button>
        <button 
          className="btn-validation btn-reject"
          onClick={() => onAction(request.id, 'rejected')}
        >
          <XCircle size={20} />
          Reject
        </button>
      </div>
    </div>
  );
}

export default Validation;