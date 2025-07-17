import axios from "axios";

const httpRequest = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_BASE_URL || "https://blog-data.up.railway.app",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default httpRequest;
