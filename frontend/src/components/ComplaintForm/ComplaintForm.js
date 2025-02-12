import React, { useState } from "react";
import "./ComplaintForm.css";

const ComplaintForm = () => {
  const [name, setName] = useState("John Doe"); // Example user name
  const [avatar, setAvatar] = useState("https://via.placeholder.com/50"); // Default avatar

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const githubIssue = e.target.githubIssue.value.trim();

    if (!githubIssue) {
      alert("GitHub Issue Link is required!");
      return;
    }

    // Proceed with form submission
    alert("Your complaint is registered!");
  };

  return (
    <div className="complaint-container">
      <h2>Register a Complaint</h2>
      
      {/* Avatar and User Name */}
      <div className="user-info">
        <img src="https://i.pravatar.cc/50" alt="User Avatar" className="avatar" />
        <span className="username">{name}</span>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="complaint-form">
        
        <label>Title:</label>
        <input type="text" name="title" placeholder="Enter Title" required />

        <label>Tag:</label>
        <select name="category" required>
          <option value="" disabled>Select a category</option>
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

        <label>Description:</label>
        <textarea name="description" placeholder="Write description" required></textarea>

        <label>GitHub Issue Link:</label>
        <input
          type="url"
          name="githubIssue"
          placeholder="GitHub Issue Link"
          required
          pattern="https://github\.com/.*"
          title="Enter a valid GitHub issue URL (e.g., https://github.com/user/repo/issues/1)"
        />

        <button type="submit">Register Complaint</button>
      </form>
    </div>
  );
};

export default ComplaintForm;