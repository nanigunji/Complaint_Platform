import React from "react";
import { Link } from "react-router-dom"; // For internal navigation

const Footer = () => {
  return (
    <footer className="bg-dark text-white py-4 mt-5">
      <div className="container">
        <div className="row">
          {/* Column 1: Website Title */}
          <div className="col-md-4">
            <h5>VNRVJIET Complaints</h5>
            <p>Your go-to platform for reporting and resolving campus issues.</p>
          </div>

          {/* Column 2: Useful Links */}
          <div className="col-md-4">
            <h5>Useful Links</h5>
            <ul className="list-unstyled">
              <li>
                <Link to="/home" className="text-white">Home</Link>
              </li>
              <li>
                <Link to="/departments" className="text-white">Departments</Link>
              </li>
              <li>
                <Link to="/about" className="text-white">About</Link>
              </li>
              <li>
                <Link to="/login" className="text-white">Login</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact Info */}
          <div className="col-md-4">
            <h5>Contact Us</h5>
            <p>Feel free to reach out for any queries or support.</p>
            <ul className="list-unstyled">
              <li>Email: support@vnrjiet.edu</li>
              <li>Phone: +91 123 456 7890</li>
            </ul>
          </div>
        </div>
        <hr />
        <div className="text-center">
          <p>&copy; {new Date().getFullYear()} VNRVJIET Complaints. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
