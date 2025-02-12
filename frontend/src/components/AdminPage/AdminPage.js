import React from "react";
import "./AdminPage.css";

const complaints = [
  {
    id: 1,
    name: "User1",
    title: "Complaint Title 1",
    description: "This is a detailed description of the first complaint.",
    upvotes: 10,
    downvotes: 2,
  },
  {
    id: 2,
    name: "User2",
    title: "Complaint Title 2",
    description: "This is a detailed description of the second complaint.",
    upvotes: 5,
    downvotes: 1,
  },
  {
    id: 3,
    name: "User3",
    title: "Complaint Title 3",
    description: "This is a detailed description of the third complaint.",
    upvotes: 8,
    downvotes: 3,
  },
  {
    id: 4,
    name: "User4",
    title: "Complaint Title 4",
    description: "This is a detailed description of the fourth complaint.",
    upvotes: 3,
    downvotes: 0,
  },
  {
    id: 5,
    name: "User5",
    title: "Complaint Title 5",
    description: "This is a detailed description of the fifth complaint.",
    upvotes: 12,
    downvotes: 4,
  },
];

const AdminPage = () => {
  return (
    <div className="admin-home-page container">

      {/* Complaints Grid */}
      <div className="complaints-grid">
        {complaints.map((complaint) => (
          <div key={complaint.id} className="complaint-card">
            {/* User Info */}
            <div className="user-info">
              <img src="https://i.pravatar.cc/50" alt="User" />
              <span>{complaint.name}</span>
            </div>

            {/* Complaint Title */}
            <h3 className="complaint-title">{complaint.title}</h3>

            {/* Complaint Description */}
            <p className="complaint-description">{complaint.description}</p>

            {/* Upvote and Downvote Counts */}
            <div className="vote-counts">
              <span className="upvotes">
                <i className="fas fa-thumbs-up"></i> {complaint.upvotes} Upvotes
              </span>
              <span className="downvotes">
                <i className="fas fa-thumbs-down"></i> {complaint.downvotes} Downvotes
              </span>
            </div>

            {/* Edit Button */}
            <div className="edit-button">
              <button>Edit</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPage;