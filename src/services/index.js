import { QueryClient } from "@tanstack/react-query";
import axios from "axios";

const Axios = axios.create({
    baseURL: "http://localhost:3000"
});

export const QUERYCLIENT = new QueryClient();
