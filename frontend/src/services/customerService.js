import api from "./api";

export const getCustomers = () => api.get("/customers");
export const addCustomer = (customer) => api.post("/customers", customer);