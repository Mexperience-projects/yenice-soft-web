import { VisitType } from "@/lib/types";
import { useState } from "react";
import { axiosUser } from "@/lib/axios/noUser";
import { useAppDispatch, useAppSelector } from "@/store/HOCs";
import { setVisits } from "@/store/slice/visits";

export function useVisits() {
  const visit_list = useAppSelector((store) => store.visits);
  const dispatch = useAppDispatch();

  const get_visit_list_list = async () => {
    const response = await axiosUser.get("visit/");
    const serverData = response.data.visit;
    // set response of server on state
    dispatch(setVisits(serverData));
  };
  const create_visit_data = async (data: any) => {
    // create backend form
    console.log("send data to server -> ", data);

    const response = await axiosUser.post("visit/", data);
    get_visit_list_list();
  };

  const update_visit_data = async (formData: any) => {
    // create backend form
    const data = Object.fromEntries(formData);
    const response = await axiosUser.put("visit/", data);
    const serverData = response.data.visit;
    get_visit_list_list();
  };
  const delete_visit_data = async (visit_id: VisitType["id"]) => {
    const response = await axiosUser.delete("visit/", { params: { visit_id } });
    const serverData = response.data.visit;
    get_visit_list_list();
  };

  return {
    visit_list,
    get_visit_list_list,
    create_visit_data,
    delete_visit_data,
    update_visit_data,
  };
}
