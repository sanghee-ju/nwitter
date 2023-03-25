import React from "react";
import { Link } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import styled from "styled-components";

const Nav = styled.nav`
  display: flex;
  justify-content: center;
`;

const Ul = styled.ul`
  display: flex;
  padding: 0;
  width: 150px;
  justify-content: space-between;
`;

const Navigation = ({ userObj = {} }) => {
  const displayName = userObj?.displayName?.length
    ? `${userObj.displayName}`
    : "Profile";
  return (
    <Nav>
      <Ul>
        <li style={{ display: "inline-block" }}>
          <Link
            to="/"
            style={{
              color: "#1d9bf0",
              textDecoration: "none",
            }}
          >
            <div style={{ marginRight: "10px" }}>
              <img src="image/twitter.png" width="30px" height="30px" />
            </div>
          </Link>
        </li>
        <li style={{ display: "inline-block" }}>
          <Link
            to="/profile"
            style={{
              color: "#2d3436",
              textDecoration: "none",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div style={{ fontSize: "30px", color: "#1d9bf0" }}>
              <FaUser />
            </div>
            <div style={{ color: "#f5f6fa" }}>{displayName}</div>
          </Link>
        </li>
      </Ul>
    </Nav>
  );
};

export default Navigation;
