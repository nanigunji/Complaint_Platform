import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    fetchComplaints();
  }, [categoryFilter, statusFilter]);

  const fetchComplaints = async () => {
    try {
      const url = `http://localhost:4000/user-api/filter-complaints?category=${categoryFilter}&status=${statusFilter}`;
      const response = await axios.get(url);
      console.log("API Response:", response.data);

      if (response.data && Array.isArray(response.data.complaints)) {
        setComplaints(response.data.complaints);
      } else {
        setComplaints([]);
      }
    } catch (error) {
      console.error("Error fetching complaints:", error);
      setComplaints([]);
    }
  };

  const filteredComplaints = complaints.filter(
    (complaint) =>
      (search === "" || complaint.title.toLowerCase().includes(search.toLowerCase()))
  );

  const handleVote = async (id, type) => {
    try {
      const url = `http://localhost:4000/user-api/${type === "upvote" ? "like" : "dislike"}-complaint/${id}`;
      await axios.post(url);

      // Update state dynamically
      setComplaints((prevComplaints) =>
        prevComplaints.map((complaint) =>
          complaint.complaint_id === id
            ? {
                ...complaint,
                likes: type === "upvote" ? complaint.likes + 1 : complaint.likes,
                dislikes: type === "downvote" ? complaint.dislikes + 1 : complaint.dislikes,
              }
            : complaint
        )
      );
    } catch (error) {
      console.error("Error updating vote:", error);
    }
  };

  return (
    <div className="homepage-container">
      <div className="search-filter">
        <input
          type="text"
          placeholder="Search complaints..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
          <option value="">All Categories</option>
          <option value="Infrastructure">Infrastructure</option>
          <option value="Transport">Transport</option>
          <option value="Canteen">Canteen</option>
          <option value="Faculty and Staff">Faculty and Staff</option>
          <option value="Examination">Examination</option>
          <option value="Fee Payment">Fee Payment</option>
          <option value="Hostel and Accommodation">Hostel and Accommodation</option>
          <option value="Extracurricular and Events">Extracurricular and Events</option>
          <option value="Others">Others</option>
        </select>

        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Ongoing">Ongoing</option>
          <option value="Resolved">Resolved</option>
        </select>
      </div>

      <div className="complaints-list">
        {filteredComplaints.map((complaint) => (
          <div key={complaint.complaint_id} className="complaint-card">
            <div className="card-header">
              <span className="username">
                {complaint.is_anonymous ? "Anonymous" : complaint.user_id}
              </span>
              <span className="tag">{complaint.category}</span>
            </div>
            <div className="card-content">
              <h4>{complaint.title}</h4>
              <p>{complaint.description}</p>
            </div>
            <div className="card-footer">
              <button
                className="vote-btn upvote"
                onClick={() => handleVote(complaint.complaint_id, "upvote")}
              >
                👍 {complaint.likes}
              </button>
              <button
                className="vote-btn downvote"
                onClick={() => handleVote(complaint.complaint_id, "downvote")}
              >
                👎 {complaint.dislikes}
              </button>
              <span className={`status ${complaint.status.toLowerCase()}`}>
                {complaint.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      <button
        className="add-complaint-btn"
        onClick={() => navigate("/complaint-form")}
      >
        ➕ Add Complaint
      </button>
    </div>
  );
};

export default Home;
