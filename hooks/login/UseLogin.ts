import { useState } from "react";
import { axiosUser } from "@/lib/axios/noUser";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { useAppDispatch } from "@/store/HOCs";
import { setAuth } from "@/store/slice/auth";
import { USER_PERMISSIONS } from "@/lib/types";

export function useLogin() {
  const [loading, loadingHandler] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();

  const login = async (username: string, password: string) => {
    loadingHandler(true);

    const response = await axiosUser.post("/user/login/", {
      username,
      password,
    });

    if (response.status === 200) {
      router.push("/panel/analytics");
      toast.success("Login Succesfull");
      const token = response.data["access"];
      const refresh = response.data["refresh"];
      // set response of server on state
      localStorage.setItem("token", token);
      localStorage.setItem("refresh", refresh);
      dispatch(setAuth(response.data.user));
    }

    loadingHandler(false);
  };

  const logout = () => {
    loadingHandler(true);
    localStorage.removeItem("token");
    localStorage.removeItem("refresh");
    router.push("/");
    loadingHandler(false);
  };

  return { loading, login, logout };
}
