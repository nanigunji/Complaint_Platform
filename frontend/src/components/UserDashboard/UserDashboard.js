import React, { useState, useEffect } from "react";
import { Card, Button, Row, Col } from "react-bootstrap";
import { FaThumbsUp, FaThumbsDown, FaUserCircle, FaGithub } from "react-icons/fa"; // Icons for upvote/downvote, avatar, and GitHub
import { useAuth } from "../../Context/AuthContext"; // Import the useAuth hook
import axios from "axios"; // For making HTTP requests
import "./UserDashboard.css"; // Import the CSS file

const UserDashboard = () => {
  // Get user details from AuthContext
  const { user } = useAuth();
  const userEmail = user?.email; // Get the user's email from context

  // Initialize state for complaints and user details
  const [complaints, setComplaints] = useState([]);
  const [expandedComplaint, setExpandedComplaint] = useState(null);

  // Fetch complaints based on the user's email
  useEffect(() => {
    if (userEmail) {
      axios
        .get(`http://localhost:4000/user-api/view-complaints/${userEmail}`)
        .then((response) => {
          setComplaints(response.data.complaints);
        })
        .catch((error) => {
          console.error("Error fetching complaints:", error);
        });
    }
  }, [userEmail]); // Run the effect whenever the userEmail changes

  // Toggle visibility of the full description when clicked
  const handleExpand = (complaintId) => {
    setExpandedComplaint(expandedComplaint === complaintId ? null : complaintId);
  };

  // Function to format date & time
  const formatDateTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString(); // Converts to readable format (adjustable as needed)
  };

  return (
    <div className="user-dashboard-container">
      <div className="dashboard-container">
        {/* Page Heading */}
        <div className="page-heading">
          <h1>VNRVJIET Complaint Portal</h1>
          <p>Welcome to the platform where your voice matters!</p>
        </div>

        {/* User Info Section */}
        <div className="user-info">
          <div className="user-avatar">
            <FaUserCircle size={50} /> {/* Avatar icon */}
          </div>
          <div className="user-details">
            <h2>Welcome, {user?.displayName || "User"}</h2>
            <p><strong>Email:</strong> {userEmail}</p>
          </div>
        </div>

        {/* My Complaints Heading */}
        <div className="my-complaints-heading">
          <h2>My Complaints</h2>
        </div>

        {/* Complaints Section */}
        <Row className="complaints-cards">
          {complaints.map((complaint) => (
            <Col key={complaint._id} xs={12} sm={6} md={4} className="mb-4">
              <Card className="complaint-card">
                <Card.Body>
                  {/* Status Badge at Top Right */}
                  <div className="status-badge">
                    <span className={`status ${complaint.status.toLowerCase()}`}>
                      {complaint.status}
                    </span>
                  </div>

                  <Card.Title>{complaint.title}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    Category: {complaint.category}
                  </Card.Subtitle>
                  <div className="vote-section">
                    <span>
                      <FaThumbsUp className="thumbs-icon" /> {complaint.likes}
                    </span>
                    <span>
                      <FaThumbsDown className="thumbs-icon" /> {complaint.dislikes}
                    </span>
                  </div>

                  {/* Show description, GitHub issue, and Admin Updates only if expanded */}
                  {expandedComplaint === complaint.complaint_id && (
                    <>
                      <Card.Text>
                        <strong>Description:</strong> {complaint.description}
                      </Card.Text>

                      {/* GitHub Issue Link */}
                      {complaint.github_issue && (
                        <Card.Text>
                          <strong>GitHub Issue:</strong>{" "}
                          <a
                            href={complaint.github_issue}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="github-link"
                          >
                            <FaGithub /> View Issue on GitHub
                          </a>
                        </Card.Text>
                      )}

                      {/* Admin Updates Section */}
                      <div className="admin-updates mt-3">
                        <h5 className="updates-title">Admin Updates:</h5>
                        <div className="updates-container">
                          {complaint.comments && complaint.comments.length > 0 ? (
                            complaint.comments.map((update) => (
                              <div key={update.id} className="update-entry">
                                <p className="update-text">{update.text}</p>
                                <span className="update-time">{formatDateTime(update.date)}</span>
                              </div>
                            ))
                          ) : (
                            <p className="no-updates">No updates yet.</p>
                          )}
                        </div>
                      </div>
                    </>
                  )}

                  <Button variant="primary" onClick={() => handleExpand(complaint.complaint_id)}>
                    {expandedComplaint === complaint.complaint_id ? "Hide Details" : "View Details"}
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
};

export default UserDashboard;
