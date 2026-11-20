import api from "./api";

export const getBookings = () => api.get("/bookings");
export const createBooking = (booking) => api.post("/bookings", booking);
export const cancelBooking = (id) => api.put(`/bookings/${id}/cancel`);