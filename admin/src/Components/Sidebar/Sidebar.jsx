import React from "react";
import "./Sidebar.css";
import { Link } from "react-router-dom";
import Cart_icon from '../../assets/cart_icon.svg';
import product_icon from '../../assets/product_icon.svg';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <Link to={"/addproduct"} style={{ textDecoration: "none" }}>
        <div className="sidebar-item">
            <img src={Cart_icon} alt="" />
          <p>Add Product</p>
        </div>
      </Link>
      <Link to={"/listproduct"} style={{ textDecoration: "none" }}>
        <div className="sidebar-item">
          <img src={product_icon} alt="" />
          <p> Product List</p>
        </div>
      </Link>
    </div>
  );
};

export default Sidebar;
