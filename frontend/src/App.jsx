import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Rooms from "./pages/admin/Rooms";
import Customers from "./pages/admin/Customers";

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/rooms" />} />
        <Route path="/rooms" element={<Rooms />} />
        <Route path="/customers" element={<Customers />} />
      </Routes>
    </>
  );
}