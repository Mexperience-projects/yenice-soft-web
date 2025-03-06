import { ServicesType } from "@/lib/types";
import { useState } from "react";
import { axiosUser } from "@/lib/axios/noUser";

export type services_10cd39Type = Pick<
  ServicesType,
  | "id"
  | "name"
  | "price"
  | "description"
  | "personel"
  | "items"
  | "personel_fixed_fee"
  | "personel_precent_fee"
>;

export function useServices_10cd39() {
  const [loading, loadingHandler] = useState(false);
  const [services_list, services_listHandler] = useState<services_10cd39Type[]>(
    []
  );
  const get_services_list_list = async () => {
    loadingHandler(true);
    const response = await axiosUser.get("services/10cd39/");
    const serverData = response.data.services;
    // set response of server on state
    services_listHandler(serverData);
    loadingHandler(false);
  };
  const create_services_data = async (formData: any) => {
    loadingHandler(true);
    // create backend form
    const data = Object.fromEntries(formData);
    const response = await axiosUser.post("services/10cd39/", data);
    const serverData = response.data.services;
    // set response of server on state
    loadingHandler(false);
  };
  const update_services_data = async (formData: any) => {
    loadingHandler(true);
    // create backend form
    const data = Object.fromEntries(formData);
    const response = await axiosUser.put("services/10cd39/", data);
    const serverData = response.data.services;
    // set response of server on state
    loadingHandler(false);
  };
  const delete_services_data = async () => {
    loadingHandler(true);
    const response = await axiosUser.delete("services/10cd39/");
    const serverData = response.data.services;
    // set response of server on state
    loadingHandler(false);
  };

  return {
    loading,
    services_list,
    get_services_list_list,
    create_services_data,
    update_services_data,
    delete_services_data,
  };
}
