import React, { useState, useEffect } from "react";
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  MapPin,
  Clock,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { T_Go_backend } from "../../../declarations/T-Go-backend";
import { AuthClient } from "@dfinity/auth-client";
import { Principal } from "@dfinity/principal";
import { displayImageFromBytes, formatDate, formatTime, getLocationById } from "../lib/utils";

function Validation({isMintingPartner}) {
  const [submissions, setSubmissions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const authClient = await AuthClient.create();
        const identity = authClient.getIdentity().getPrincipal().toText();
        const principal = Principal.fromText(identity);
        const submissions = await T_Go_backend.getSubmissionsByLocation(principal);
        setSubmissions(submissions);
      } catch (error) {
        console.error("Failed to load submissions:", error);
        setIsLoading(false);
      }
    };
    const fetchLocations = async () => {
      try {
        const locations = await T_Go_backend.getAllLocations();
        setLocations(locations);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to load locations:", error);
      }
    };
    fetchLocations();
    fetchSubmissions();
  }, []);

  const handleAction = async (submissionId, action) => {
    const authClient = await AuthClient.create();
    const identity = authClient.getIdentity().getPrincipal().toText();
    const principal = Principal.fromText(identity);
    setSubmissions((prev) =>
      prev.map((sub) =>
        sub.id === submissionId ? { ...sub, status: action } : sub,
      ),
    );
    // Call backend to update submission status
    if (action === "approved") {
      T_Go_backend.acceptSubmission(principal, submissionId);
    } else if (action === "rejected") {
      T_Go_backend.rejectSubmission(principal, submissionId);
    }
    // Remove the submission from the list to hot reload the components
    setSubmissions((prev) => prev.filter((sub) => sub.id !== submissionId));
    console.log(`Submission ${submissionId} ${action}`);
  };

  if (!isMintingPartner) {
    return (
      <div className="validation-container">
        <div className="not-partner-message">
          <AlertCircle size={48} />
          <h3>Access Denied</h3>
          <p>
            You must be a minting partner to access the validation dashboard.
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="validation-container">
        <div className="loading-state">
          <div className="loading-spinner">
            <RefreshCw size={32} />
          </div>
          <p>Loading validation submissions...</p>
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
        <p className="page-subtitle">
          Review and approve NFT minting submissions
        </p>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-number">
            {submissions.length}
          </div>
          <div className="stat-label">Total</div>
        </div>
      </div>

      {/* Submissions Grid */}
      <div className="submissions-grid">
        {submissions.length === 0 ? (
          <div className="empty-state">
            <AlertCircle size={48} />
            <h3>No submissions found</h3>
            <p>No validation submissions match your current filters.</p>
          </div>
        ) : (
          submissions.map((submission) => (
            <SubmissionCard
              key={submission.id}
              submission={submission}
              onAction={handleAction}
              locations={locations}
            />
          ))
        )}
      </div>
    </div>
  );
}

function SubmissionCard({ submission, onAction, locations }) {
  return (
    <div className="card-container-validation">
      <div className="card-content-validation">
        <div className="location-info">
          <MapPin size={16} />
          <span>{getLocationById(locations, submission.location.toText())}</span>
        </div>

        <div className="visit-time">
          <Clock size={16} />
          <span>
            {formatDate(submission.timestamp)}
            {" at "}
            {formatTime(submission.timestamp)}
          </span>
        </div>
        {submission.description && (
          <div className="user-description">
            <p>"{submission.description}"</p>
          </div>
        )}
      </div>

      {submission.image && (
        <div className="card-image">
          <img
            src={displayImageFromBytes(
              submission.image,
              submission.contentType,
            )}
            alt={`${submission.owner.toString()}'s visit to ${getLocationById(locations, submission.location)}`}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                "https://placehold.co/400x300/cccccc/333333?text=Image+Not+Found";
            }}
          />
        </div>
      )}

      <div className="card-actions">
        <button
          className="btn-validation btn-approve"
          onClick={() => onAction(submission.id, "approved")}
        >
          <CheckCircle size={20} />
          Approve
        </button>
        <button
          className="btn-validation btn-reject"
          onClick={() => onAction(submission.id, "rejected")}
        >
          <XCircle size={20} />
          Reject
        </button>
      </div>
    </div>
  );
}

export default Validation;
