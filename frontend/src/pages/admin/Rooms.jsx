import { useEffect, useState } from "react";
import { getRooms, addRoom } from "../../services/roomService";

const emptyForm = { roomNumber: "", type: "SINGLE", pricePerNight: "" };

export default function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  const loadRooms = async () => {
    try {
      const res = await getRooms();
      setRooms(res.data);
    } catch {
      setError("Could not load rooms. Is the backend running?");
    }
  };

  useEffect(() => {
    loadRooms();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await addRoom({ ...form, pricePerNight: Number(form.pricePerNight) });
      setForm(emptyForm);
      loadRooms();
    } catch (err) {
      const data = err.response?.data;
      setError(data ? Object.values(data).join(", ") : "Something went wrong");
    }
  };

  return (
    <div style={{ maxWidth: 700, margin: "2rem auto", padding: "0 1rem" }}>
      <h1>Rooms</h1>

      <form onSubmit={handleSubmit} style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <input
          name="roomNumber"
          placeholder="Room number"
          value={form.roomNumber}
          onChange={handleChange}
        />
        <select name="type" value={form.type} onChange={handleChange}>
          <option value="SINGLE">Single</option>
          <option value="DOUBLE">Double</option>
          <option value="SUITE">Suite</option>
        </select>
        <input
          name="pricePerNight"
          type="number"
          placeholder="Price per night"
          value={form.pricePerNight}
          onChange={handleChange}
        />
        <button type="submit">Add room</button>
      </form>

      {error && <p style={{ color: "crimson" }}>{error}</p>}

      <table width="100%" cellPadding="8" style={{ textAlign: "left" }}>
        <thead>
          <tr>
            <th>Room</th>
            <th>Type</th>
            <th>Price / night</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {rooms.map((room) => (
            <tr key={room.id}>
              <td>{room.roomNumber}</td>
              <td>{room.type}</td>
              <td>₹{room.pricePerNight}</td>
              <td>{room.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}