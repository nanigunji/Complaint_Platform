import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Timer, CheckCircle2, ThumbsUp, ThumbsDown, Search, Calendar, MessageCircle } from "lucide-react";
import { FaChevronUp, FaChevronDown, FaClock } from "react-icons/fa";
import axios from "axios";
import { useAuth } from "../../Context/AuthContext";
import "./Home.css";

const CATEGORIES = [
  "Infrastructure", "Transport", "Canteen", "Faculty and Staff", "Examination",
  "Fee Payment", "Hostel and Accommodation", "Extracurricular and Events", "Others"
];
const STATUSES = ["Pending", "Ongoing", "Resolved"];

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const token = user?.accessToken;
  const [userVotes, setUserVotes] = useState({});
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [complaints, setComplaints] = useState([]);
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    fetchComplaints();
  }, [categoryFilter, statusFilter]);

  const fetchComplaints = async () => {
    try {
      const url = `http://localhost:4000/user-api/filter-complaints?category=${categoryFilter}&status=${statusFilter}`;
      const response = await axios.get(url);
      setComplaints(response.data.complaints || []);
    } catch (error) {
      console.error("Error fetching complaints:", error);
      setComplaints([]);
    }
  };

  const toggleUpdates = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "Unknown Date";
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      weekday: "short", year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
    });
  };

  const filteredComplaints = complaints.filter((complaint) => {
    const matchesSearch = search ? complaint.title.toLowerCase().includes(search.toLowerCase()) : true;
    const matchesCategory = categoryFilter ? complaint.category === categoryFilter : true;
    const matchesStatus = statusFilter ? complaint.status === statusFilter : true;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="home-container-page">
      <div className="homepage-container container">
        <div className="complaints-list container">
          {filteredComplaints.map((complaint) => (
            <div key={complaint.complaint_id} className="complaint-card">
              <div className="card-header">
                <div className="date-info">
                  <Calendar className="calendar-icon" size={18} />
                  <span className="date">{formatDate(complaint.timestamp)}</span>
                </div>
              </div>

              <div className="card-content">
                <h4>{complaint.title}</h4>
                <p>{complaint.description}</p>
                <div className="card-footer">
                  <span className="category-tag">{complaint.category}</span>
                  <span className={`status-badge ${complaint.status.toLowerCase()}`}>
                    {complaint.status === "Resolved" ? (
                      <CheckCircle2 className="status-icon" size={18} />
                    ) : (
                      <Timer className="status-icon" size={18} />
                    )}
                    {complaint.status}
                  </span>
                </div>
                
                {/* Admin Updates Button */}
                <button className="admin-updates-btn" onClick={() => toggleUpdates(complaint.complaint_id)}>
                  🛠 Admin Updates {expanded[complaint.complaint_id] ? <FaChevronUp /> : <FaChevronDown />}
                </button>

                {/* Admin Updates Section */}
                {expanded[complaint.complaint_id] && (
                  <div className="admin-updates-section">
                    {complaint.comments && complaint.comments.length > 0 ? (
                      complaint.comments.map((comment, index) => (
                        <div key={index} className="admin-update">
                          <p className="update-text">{comment.text}</p>
                          <span className="update-time">
                            <FaClock /> {formatDate(comment.date)}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="no-updates">No updates available</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <button className="add-complaint-btn" onClick={() => navigate("/complaint-form")}>
          ➕ Add Complaint
        </button>
      </div>
    </div>
  );
};

export default Home;  