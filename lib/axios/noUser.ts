import axios from "axios";
import { SERVER_URL } from "../core";

export const axiosUser = axios.create({
    baseURL: SERVER_URL,
});
