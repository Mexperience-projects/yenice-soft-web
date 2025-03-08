import { VisitType } from "@/lib/types";
import { useState } from "react";
import { axiosUser } from "@/lib/axios/noUser";

export type visit_6b7e2dType = Pick<
  VisitType,
  "client" | "service" | "items" | "datetime" | "payments"
>;

export function useVisit_6b7e2d() {
  const [loading, loadingHandler] = useState(false);
  const update_visit_data = async (formData: any) => {
    loadingHandler(true);
    // create backend form
    const data = Object.fromEntries(formData);
    const response = await axiosUser.put("visit/6b7e2d/", data);
    const serverData = response.data.visit;
    // set response of server on state
    loadingHandler(false);
  };
  const delete_visit_data = async () => {
    loadingHandler(true);
    const response = await axiosUser.delete("visit/6b7e2d/");
    const serverData = response.data.visit;
    // set response of server on state
    loadingHandler(false);
  };

  return { loading, update_visit_data, delete_visit_data };
}
