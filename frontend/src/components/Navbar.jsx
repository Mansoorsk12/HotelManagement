import { NavLink } from "react-router-dom";

const linkStyle = ({ isActive }) => ({
  marginRight: 16,
  textDecoration: "none",
  fontWeight: isActive ? "bold" : "normal",
  color: isActive ? "#1d4ed8" : "#333",
});

export default function Navbar() {
  return (
    <nav style={{ padding: "1rem 2rem", borderBottom: "1px solid #ddd" }}>
      <NavLink to="/rooms" style={linkStyle}>Rooms</NavLink>
      <NavLink to="/customers" style={linkStyle}>Customers</NavLink>
    </nav>
  );
}