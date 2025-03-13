import { PaymentsType, USER_PERMISSIONS } from "@/lib/types";
import { useState } from "react";
import { axiosUser } from "@/lib/axios/noUser";
import { useAppDispatch, useAppSelector } from "@/store/HOCs";
import { setPayments } from "@/store/slice/payments";

export function usePayments() {
  const [loading, loadingHandler] = useState(false);
  const dispatch = useAppDispatch();
  const payments_list = useAppSelector((store) => store.payments);

  const permissions =
    useAppSelector((store) => store.auth.user?.permissions) || [];

  const get_payments_list_list = async () => {
    if (!permissions.includes(USER_PERMISSIONS.PAYMENTS)) return;
    loadingHandler(true);
    const response = await axiosUser.get("payments/");
    const serverData = response.data.payments;
    // set response of server on state
    dispatch(setPayments(serverData));
    loadingHandler(false);
  };

  const create_payments_data = async (formData: any) => {
    if (!permissions.includes(USER_PERMISSIONS.PAYMENTS)) return;
    loadingHandler(true);
    // create backend form
    const data = Object.fromEntries(formData);
    const response = await axiosUser.post("payments/", data);
    const serverData = response.data.payments;
    get_payments_list_list();
    // set response of server on state
    loadingHandler(false);
  };

  const update_payments_data = async (formData: any) => {
    if (!permissions.includes(USER_PERMISSIONS.PAYMENTS)) return;
    loadingHandler(true);
    // create backend form
    const data = Object.fromEntries(formData);
    const response = await axiosUser.put("payments/", data);
    const serverData = response.data.payments;
    get_payments_list_list();
    // set response of server on state
    loadingHandler(false);
  };

  const delete_payments_data = async (id: number) => {
    if (!permissions.includes(USER_PERMISSIONS.PAYMENTS)) return;
    loadingHandler(true);
    const response = await axiosUser.delete("payments/", { params: { id } });
    const serverData = response.data.payments;
    get_payments_list_list();
    // set response of server on state
    loadingHandler(false);
  };

  return {
    loading,
    payments_list,
    get_payments_list_list,
    create_payments_data,
    update_payments_data,
    delete_payments_data,
  };
}
