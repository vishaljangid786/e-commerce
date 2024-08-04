import React from "react";
import "./Navbar.css";
import shopper_logo from "../../assets/shopper-logo.png";
import navProfile from "../../assets/nav-profile.jpeg";

const Navbar = () => {
  return (
    <div className="navbar">
      <div className="nav-logo">
        <img src={shopper_logo} alt="" />
        <h3>Admin Panel</h3>
      </div>
      <div className="nav-profile">
        <img src={navProfile} alt="" />
        <ion-icon name="chevron-down-outline"></ion-icon>
      </div>
    </div>
  );
};

export default Navbar;
