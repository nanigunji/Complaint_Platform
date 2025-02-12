import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import "./Login.css"; // Import custom CSS for additional styling
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [role, setRole] = useState("user");
  let navigate=useNavigate()

  const handleUserLogin = () => {
    window.location.href = "https://github.com/login";
  };

  const handleAdminLogin = (e) => {
    e.preventDefault();
    const adminId = e.target.adminId.value;
    const password = e.target.password.value;
    console.log(`Admin login attempt with ID: ${adminId}`);
    // Add admin authentication logic here
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="login-container p-5 shadow-lg rounded-3 bg-white">
        <h2 className="text-center mb-4">Welcome Back</h2>
        <p className="text-center mb-4">Please login to your account</p>

        {/* Role Selector - Merged Buttons */}
        <div className="role-selector d-flex justify-content-center mb-4">
          <div
            className={`role-option ${role === "user" ? "active" : ""}`}
            onClick={() => setRole("user")}
          >
            User
          </div>
          <div
            className={`role-option ${role === "admin" ? "active" : ""}`}
            onClick={() => setRole("admin")}
          >
            Admin
          </div>
        </div>

        {/* User Login */}
        {role === "user" ? (
          <div className="user-login text-center">
            <button
              onClick={handleUserLogin}
              className="btn btn-dark w-100 mb-3 d-flex align-items-center justify-content-center"
            >
              <i className="fab fa-github me-2"></i>
              Login with GitHub
            </button>
            <p className="text-muted">
              Don't have a GitHub account?{" "}
              <a
                href="https://github.com/signup"
                target="_blank"
                rel="noopener noreferrer"
                className="text-decoration-none"
              >
                Create one
              </a>
            </p>
          </div>
        ) : (
          // Admin Login
          <form onSubmit={handleAdminLogin} className="admin-login">
            <div className="mb-3">
              <input
                type="text"
                name="adminId"
                placeholder="Admin ID"
                className="form-control"
                required
              />
            </div>
            <div className="mb-3">
              <input
                type="password"
                name="password"
                placeholder="Admin Password"
                className="form-control"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100" onClick={()=>navigate('/adminpage')}>
              Login
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;