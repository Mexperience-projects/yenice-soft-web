import { useState } from "react";
import { axiosUser } from "@/lib/axios/noUser";
import { useAppDispatch, useAppSelector } from "@/store/HOCs";
import { setServices } from "@/store/slice/services";
import { USER_PERMISSIONS } from "@/lib/types";

export function useServices_10cd39() {
  const [loading, loadingHandler] = useState(false);
  const services_list = useAppSelector((store) => store.services);

  const user = useAppSelector((store) => store.auth.user);
  const dispatch = useAppDispatch();

  const get_services_list_list = async () => {
    if (
      !user?.is_admin &&
      !user?.permissions.some((p) =>
        [USER_PERMISSIONS.SERVICES, USER_PERMISSIONS.VISITS].includes(p)
      )
    ) {
      return;
    }

    loadingHandler(true);
    const response = await axiosUser.get("services/");
    const serverData = response.data.services;
    // set response of server on state
    dispatch(setServices(serverData));
    loadingHandler(false);
  };
  const create_services_data = async (formData: any) => {
    if (
      !user?.is_admin &&
      !user?.permissions.includes(USER_PERMISSIONS.SERVICES)
    )
      return;

    loadingHandler(true);
    // create backend form
    const data = Object.fromEntries(formData);
    const response = await axiosUser.post("services/", data);
    const serverData = response.data.services;
    // set response of server on state
    get_services_list_list();
    loadingHandler(false);
  };
  const update_services_data = async (formData: any) => {
    if (
      !user?.is_admin &&
      !user?.permissions.includes(USER_PERMISSIONS.SERVICES)
    )
      return;

    loadingHandler(true);
    // create backend form
    const data = Object.fromEntries(formData);
    const response = await axiosUser.put("services/", data);
    const serverData = response.data.services;
    // set response of server on state
    get_services_list_list();
    loadingHandler(false);
  };
  const delete_services_data = async (id: number) => {
    if (
      !user?.is_admin &&
      !user?.permissions.includes(USER_PERMISSIONS.SERVICES)
    )
      return;

    loadingHandler(true);
    const response = await axiosUser.delete("services/", {
      params: { id: id },
    });
    const serverData = response.data.services;
    get_services_list_list();
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
