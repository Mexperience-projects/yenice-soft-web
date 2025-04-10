import { ItemsType, USER_PERMISSIONS } from "@/lib/types";
import { useState } from "react";
import { axiosUser } from "@/lib/axios/noUser";
import { useAppDispatch, useAppSelector } from "@/store/HOCs";
import { setItems } from "@/store/slice/items";

export type items_691d50Type = Pick<
  ItemsType,
  "name" | "price" | "count" | "id" | "limit"
>;

export function useItems_691d50() {
  const [loading, loadingHandler] = useState(false);
  const dispatch = useAppDispatch();
  const items_list = useAppSelector((store) => store.items);
  const user = useAppSelector((store) => store.auth.user);

  const get_items_list_list = async () => {
    if (
      !user?.is_admin &&
      !user?.permissions.some((p) =>
        [
          USER_PERMISSIONS.INVENTORY,
          USER_PERMISSIONS.VISITS,
          USER_PERMISSIONS.SERVICES,
        ].includes(p)
      )
      // !user.permissions.includes(USER_PERMISSIONS.VISITS)
    ) {
      return;
    }
    loadingHandler(true);
    const response = await axiosUser.get("items/");
    const serverData = response.data.items;
    // set response of server on state
    dispatch(setItems(serverData));
    loadingHandler(false);
  };
  const create_items_data = async (formData: any) => {
    if (
      !user?.is_admin &&
      !user?.permissions.includes(USER_PERMISSIONS.INVENTORY)
    )
      return;
    loadingHandler(true);
    // create backend form
    const data = Object.fromEntries(formData);
    const response = await axiosUser.post("items/", data);
    const serverData = response.data.items;
    get_items_list_list();
    // set response of server on state
    loadingHandler(false);
  };
  const update_items_data = async (formData: any) => {
    if (
      !user?.is_admin &&
      !user?.permissions.includes(USER_PERMISSIONS.INVENTORY)
    )
      return;
    loadingHandler(true);
    // create backend form
    const data = Object.fromEntries(formData);
    const response = await axiosUser.put("items/", data);
    const serverData = response.data.items;
    get_items_list_list();
    // set response of server on state
    loadingHandler(false);
  };
  const delete_items_data = async (id: number) => {
    if (
      !user?.is_admin &&
      !user?.permissions.includes(USER_PERMISSIONS.INVENTORY)
    )
      return;
    loadingHandler(true);
    const response = await axiosUser.delete("items/", { params: { id } });
    const serverData = response.data.items;
    get_items_list_list();
    // set response of server on state
    loadingHandler(false);
  };

  return {
    loading,
    items_list,
    get_items_list_list,
    create_items_data,
    update_items_data,
    delete_items_data,
  };
}
