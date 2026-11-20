import api from "./api";

export const getRooms = () => api.get("/rooms");
export const addRoom = (room) => api.post("/rooms", room);