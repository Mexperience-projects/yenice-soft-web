import { UsersType } from "@/lib/types";
import { useState } from "react";
import { axiosUser } from "@/lib/axios/noUser";
import { useAppDispatch, useAppSelector } from "@/store/HOCs";
import { setuserss } from "@/store/slice/users";

export type user_e02ed2Type = Pick<UsersType, "id" | "name" | "description">;

export function useuser_e02ed2() {
  const dispatch = useAppDispatch();
  const [loading, loadingHandler] = useState(false);
  const user_list = useAppSelector((store) => store.users);

  const get_user_list_list = async () => {
    loadingHandler(true);
    const response = await axiosUser.get("/user/");
    const serverData = response.data.user;
    // set response of server on state
    dispatch(setuserss(serverData));

    loadingHandler(false);
  };

  const create_user_data = async (formData: any) => {
    loadingHandler(true);
    console.log("creating");

    // create backend form
    const data = Object.fromEntries(formData);
    const response = await axiosUser.post("/user/", data);
    const serverData = response.data.user;
    get_user_list_list();
    // set response of server on state
    loadingHandler(false);
  };
  const update_user_data = async (formData: any) => {
    loadingHandler(true);
    // create backend form
    const data = Object.fromEntries(formData);
    const response = await axiosUser.put("/user/", data);
    const serverData = response.data.user;
    // set response of server on state
    get_user_list_list();
    loadingHandler(false);
  };
  const delete_user_data = async (user_id: UsersType["id"]) => {
    loadingHandler(true);
    const response = await axiosUser.delete("/user/", {
      params: { user_id },
    });
    const serverData = response.data.user;
    // set response of server on state
    get_user_list_list();
    loadingHandler(false);
  };

  return {
    loading,
    user_list,
    get_user_list_list,
    create_user_data,
    update_user_data,
    delete_user_data,
  };
}
