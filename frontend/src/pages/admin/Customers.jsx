import { useEffect, useState } from "react";
import { getCustomers, addCustomer } from "../../services/CustomerService";

const emptyForm = { fullName: "", email: "", phone: "", address: "" };

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  const loadCustomers = async () => {
    try {
      const res = await getCustomers();
      setCustomers(res.data);
    } catch {
      setError("Could not load customers. Is the backend running?");
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await addCustomer(form);
      setForm(emptyForm);
      loadCustomers();
    } catch (err) {
      const data = err.response?.data;
      setError(data ? Object.values(data).join(", ") : "Something went wrong");
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: "2rem auto", padding: "0 1rem" }}>
      <h1>Customers</h1>

      <form onSubmit={handleSubmit} style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
        <input name="fullName" placeholder="Full name" value={form.fullName} onChange={handleChange} />
        <input name="email" placeholder="Email" value={form.email} onChange={handleChange} />
        <input name="phone" placeholder="Phone (10 digits)" value={form.phone} onChange={handleChange} />
        <input name="address" placeholder="Address" value={form.address} onChange={handleChange} />
        <button type="submit">Add customer</button>
      </form>

      {error && <p style={{ color: "crimson" }}>{error}</p>}

      <table width="100%" cellPadding="8" style={{ textAlign: "left" }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Address</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((c) => (
            <tr key={c.id}>
              <td>{c.fullName}</td>
              <td>{c.email}</td>
              <td>{c.phone}</td>
              <td>{c.address}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}