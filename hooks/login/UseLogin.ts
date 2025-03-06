import { useState } from "react";
import { axiosUser } from "@/lib/axios/noUser";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export function useLogin() {
  const [loading, loadingHandler] = useState(false);
  const router = useRouter();
  const login = async (username: string, password: string) => {
    loadingHandler(true);
    const response = await axiosUser.post("/user/login/", {
      username,
      password,
    });

    if (response.status === 200) {
      router.push("/panel/dashboard");
      toast.success("Login Succesfull");
    } else if (response.status === 401) {
      toast.error("Username or Password is Wrong");
    } else {
      toast.error("Can't Login Yet");
    }

    const token = response.data["access"];
    const refresh = response.data["refresh"];
    // set response of server on state
    localStorage.setItem("token", token);
    localStorage.setItem("refresh", refresh);
    loadingHandler(false);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh");
    router.push("/login");
  };

  return { loading, login, logout };
}
