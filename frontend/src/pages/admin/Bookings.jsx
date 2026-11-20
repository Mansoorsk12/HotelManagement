import { useEffect, useState } from "react";
import { getBookings, createBooking, cancelBooking } from "../../services/bookingService";
import { getCustomers } from "../../services/CustomerService";
import { getRooms } from "../../services/roomService";

const emptyForm = { customerId: "", roomId: "", checkInDate: "", checkOutDate: "" };

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  const today = new Date().toISOString().split("T")[0];

  const loadAll = async () => {
    try {
      const [b, c, r] = await Promise.all([getBookings(), getCustomers(), getRooms()]);
      setBookings(b.data);
      setCustomers(c.data);
      setRooms(r.data);
    } catch {
      setError("Could not load data. Is the backend running?");
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // Estimated total, shown before booking
  const selectedRoom = rooms.find((r) => r.id === Number(form.roomId));
  let estimate = null;
  if (selectedRoom && form.checkInDate && form.checkOutDate) {
    const nights =
      (new Date(form.checkOutDate) - new Date(form.checkInDate)) / (1000 * 60 * 60 * 24);
    if (nights > 0) {
      estimate = { nights, total: nights * selectedRoom.pricePerNight };
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await createBooking({
        customerId: Number(form.customerId),
        roomId: Number(form.roomId),
        checkInDate: form.checkInDate,
        checkOutDate: form.checkOutDate,
      });
      setForm(emptyForm);
      loadAll();
    } catch (err) {
      const data = err.response?.data;
      setError(data ? Object.values(data).join(", ") : "Something went wrong");
    }
  };

  const handleCancel = async (id) => {
    setError("");
    try {
      await cancelBooking(id);
      loadAll();
    } catch (err) {
      const data = err.response?.data;
      setError(data ? Object.values(data).join(", ") : "Could not cancel booking");
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: "2rem auto", padding: "0 1rem" }}>
      <h1>Bookings</h1>

      <form onSubmit={handleSubmit} style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
        <select name="customerId" value={form.customerId} onChange={handleChange} required>
          <option value="">Select customer</option>
          {customers.map((c) => (
            <option key={c.id} value={c.id}>{c.fullName}</option>
          ))}
        </select>

        <select name="roomId" value={form.roomId} onChange={handleChange} required>
          <option value="">Select room</option>
          {rooms.map((r) => (
            <option key={r.id} value={r.id}>
              {r.roomNumber} ({r.type}) ₹{r.pricePerNight}
            </option>
          ))}
        </select>

        <input type="date" name="checkInDate" min={today} value={form.checkInDate} onChange={handleChange} required />
        <input type="date" name="checkOutDate" min={form.checkInDate || today} value={form.checkOutDate} onChange={handleChange} required />

        <button type="submit">Book</button>
      </form>

      {estimate && (
        <p>
          {estimate.nights} night(s) × ₹{selectedRoom.pricePerNight} = <b>₹{estimate.total}</b>
        </p>
      )}

      {error && <p style={{ color: "crimson" }}>{error}</p>}

      <table width="100%" cellPadding="8" style={{ textAlign: "left", marginTop: 16 }}>
        <thead>
          <tr>
            <th>#</th>
            <th>Customer</th>
            <th>Room</th>
            <th>Check-in</th>
            <th>Check-out</th>
            <th>Total</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((b) => (
            <tr key={b.id} style={{ opacity: b.status === "CANCELLED" ? 0.5 : 1 }}>
              <td>{b.id}</td>
              <td>{b.customer.fullName}</td>
              <td>{b.room.roomNumber}</td>
              <td>{b.checkInDate}</td>
              <td>{b.checkOutDate}</td>
              <td>₹{b.totalAmount}</td>
              <td>{b.status}</td>
              <td>
                {b.status === "CONFIRMED" && (
                  <button onClick={() => handleCancel(b.id)}>Cancel</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}