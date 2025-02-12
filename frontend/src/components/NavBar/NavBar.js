import React from "react";
import { NavLink } from "react-router-dom"; // Import NavLink from react-router-dom
import "./NavBar.css"; // Optional: Add your CSS file for the NavBar

const NavBar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <div className="logo">VNRVJIET</div>
        <ul className="navbar-nav ms-auto mb-lg-0">
          <li className="nav-item">
            <NavLink
              className="nav-link"
              to="home"
              style={({ isActive }) => ({
                color: isActive ? "yellow" : "white", // Active link style
              })}
            >
              Home
            </NavLink>
          </li>

          <li className="nav-item">
            <NavLink
              className="nav-link"
              to="/about"
              style={({ isActive }) => ({
                color: isActive ? "yellow" : "white",
              })}
            >
              About
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              className="nav-link"
              to="/login"
              style={({ isActive }) => ({
                color: isActive ? "yellow" : "white",
              })}
            >
              Login
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;
