import { useState } from "react";
import { axiosUser } from "@/lib/axios/noUser";
import { useAppDispatch, useAppSelector } from "@/store/HOCs";
import { setClients } from "@/store/slice/clients";

export function useClients() {
  const [loading, loadingHandler] = useState(false);
  const dispatch = useAppDispatch();
  const clients_list = useAppSelector((store) => store.clients);
  const get_clients_list_list = async () => {
    loadingHandler(true);
    const response = await axiosUser.get("clients/");
    const serverData = response.data.clients;
    // set response of server on state
    dispatch(setClients(serverData));
    loadingHandler(false);
  };
  const create_clients_data = async (formData: any) => {
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
    loadingHandler(true);
    // create backend form
    const data = Object.fromEntries(formData);
    const response = await axiosUser.put("clients/", data);
    get_clients_list_list();
    // set response of server on state
    loadingHandler(false);
  };
  const delete_clients_data = async (id: number) => {
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
