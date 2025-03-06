import { ItemsType } from "@/lib/types";
import { useState } from "react";
import { axiosUser } from "@/lib/axios/noUser";

export type items_691d50Type = Pick<
  ItemsType,
  "name" | "price" | "count" | "id"
>;

export function useItems_691d50() {
  const [loading, loadingHandler] = useState(false);
  const [items_list, items_listHandler] = useState<items_691d50Type[]>([]);
  const get_items_list_list = async () => {
    loadingHandler(true);
    const response = await axiosUser.get("items/");
    const serverData = response.data.items;
    // set response of server on state
    items_listHandler(serverData);
    loadingHandler(false);
  };
  const create_items_data = async (formData: any) => {
    loadingHandler(true);
    // create backend form
    const data = Object.fromEntries(formData);
    const response = await axiosUser.post("items/", data);
    const serverData = response.data.items;
    // set response of server on state
    loadingHandler(false);
  };
  const update_items_data = async (formData: any) => {
    loadingHandler(true);
    // create backend form
    const data = Object.fromEntries(formData);
    const response = await axiosUser.put("items/", data);
    const serverData = response.data.items;
    // set response of server on state
    loadingHandler(false);
  };
  const delete_items_data = async (id: number) => {
    loadingHandler(true);
    const response = await axiosUser.delete("items/", { params: { id } });
    const serverData = response.data.items;
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
