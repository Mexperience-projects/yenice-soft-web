import { useState } from "react";
import { axiosUser } from "@/lib/axios/noUser";
import { useAppDispatch, useAppSelector } from "@/store/HOCs";
import { setClients } from "@/store/slice/clients";
import { USER_PERMISSIONS } from "@/lib/types";

export function useClients() {
  const [loading, loadingHandler] = useState(false);
  const dispatch = useAppDispatch();
  const clients_list = useAppSelector((store) => store.clients);
  const user = useAppSelector((store) => store.auth.user);
  const get_clients_list_list = async () => {
    if (
      !user?.is_admin &&
      !user?.permissions.some((p) =>
        [USER_PERMISSIONS.CLIENTS, USER_PERMISSIONS.VISITS].includes(p)
      )
    ) {
      return;
    }
    loadingHandler(true);
    const response = await axiosUser.get("clients/");
    const serverData = response.data.clients;
    // set response of server on state
    dispatch(setClients(serverData));
    loadingHandler(false);
  };
  const create_clients_data = async (formData: any) => {
    if (
      !user?.is_admin &&
      !user?.permissions.includes(USER_PERMISSIONS.CLIENTS)
    )
      return;
    loadingHandler(true);
    // create backend form
    const data = Object.fromEntries(formData);
    const response = await axiosUser.post("clients/", data);
    get_clients_list_list();
    // set response of server on state
    loadingHandler(false);
    return data;
  };
  const update_clients_data = async (formData: any) => {
    if (
      !user?.is_admin &&
      !user?.permissions.includes(USER_PERMISSIONS.CLIENTS)
    )
      return;
    loadingHandler(true);
    // create backend form
    const data = Object.fromEntries(formData);
    const response = await axiosUser.put("clients/", data);
    get_clients_list_list();
    // set response of server on state
    loadingHandler(false);
  };
  const delete_clients_data = async (id: number) => {
    if (
      !user?.is_admin &&
      !user?.permissions.includes(USER_PERMISSIONS.CLIENTS)
    )
      return;
    loadingHandler(true);
    const response = await axiosUser.delete("clients/", { params: { id } });
    get_clients_list_list();
    // set response of server on state
    loadingHandler(false);
  };

  return {
    loading,
    clients_list,
    get_clients_list_list,
    create_clients_data,
    update_clients_data,
    delete_clients_data,
  };
}
