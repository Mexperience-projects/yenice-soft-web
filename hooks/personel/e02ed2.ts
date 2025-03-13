import { PersonelType, USER_PERMISSIONS } from "@/lib/types";
import { useState } from "react";
import { axiosUser } from "@/lib/axios/noUser";
import { useAppDispatch, useAppSelector } from "@/store/HOCs";
import { setPersonels } from "@/store/slice/personels";

export type personel_e02ed2Type = Pick<
  PersonelType,
  "id" | "name" | "description"
>;

export function usePersonel_e02ed2() {
  const dispatch = useAppDispatch();
  const [loading, loadingHandler] = useState(false);
  const personel_list = useAppSelector((store) => store.personels);

  const user = useAppSelector((store) => store.auth.user);

  const get_personel_list_list = async () => {
    if (
      !user?.is_admin &&
      !user?.permissions.includes(USER_PERMISSIONS.PERSONELS)
    )
      return;
    loadingHandler(true);
    const response = await axiosUser.get("/personel/");
    const serverData = response.data.personel;
    // set response of server on state
    dispatch(setPersonels(serverData));

    loadingHandler(false);
  };

  const create_personel_data = async (formData: any) => {
    if (
      !user?.is_admin &&
      !user?.permissions.includes(USER_PERMISSIONS.PERSONELS)
    )
      return;
    loadingHandler(true);
    console.log("creating");

    // create backend form
    const data = Object.fromEntries(formData);
    const response = await axiosUser.post("/personel/", data);
    const serverData = response.data.personel;
    get_personel_list_list();
    loadingHandler(false);
  };
  const update_personel_data = async (formData: any) => {
    if (
      !user?.is_admin &&
      !user?.permissions.includes(USER_PERMISSIONS.PERSONELS)
    )
      return;
    loadingHandler(true);
    // create backend form
    const data = Object.fromEntries(formData);
    const response = await axiosUser.put("/personel/", data);
    const serverData = response.data.personel;
    // set response of server on state
    get_personel_list_list();
    loadingHandler(false);
  };
  const delete_personel_data = async (personel_id: PersonelType["id"]) => {
    if (
      !user?.is_admin &&
      !user?.permissions.includes(USER_PERMISSIONS.PERSONELS)
    )
      return;
    loadingHandler(true);
    const response = await axiosUser.delete("/personel/", {
      params: { personel_id },
    });
    const serverData = response.data.personel;
    // set response of server on state
    get_personel_list_list();
    loadingHandler(false);
  };

  return {
    loading,
    personel_list,
    get_personel_list_list,
    create_personel_data,
    update_personel_data,
    delete_personel_data,
  };
}
