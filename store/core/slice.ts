// import { PayloadAction, createSlice } from "@reduxjs/toolkit";
// import { PartnerGroupType } from "../slice/";
// import { HostType } from "../slice/hosts";

// export enum ServerStatusEnum {
//   accepted,
//   pending,
//   rejected,
// }

// export type appMessageType = {
//   type: "" | "success" | "error" | "warning" | "info";
//   title: string;
//   desc: string;
// };

// export type coreType = {
//   message: appMessageType;
//   groupModal?: PartnerGroupType;
//   selectanalyticsModal?: { host: HostType };
//   partnerSelectModalOpen?: boolean;
// };

// const initialState: coreType = {
//   message: {
//     type: "",
//     title: "",
//     desc: "",
//   },
// };

// const coreSlice = createSlice({
//   name: "coreSlice",
//   initialState,
//   reducers: {
//     changeMessage: (state, action: PayloadAction<appMessageType>) => {
//       state.message = action.payload;
//     },
//     clearMessage: (state) => {
//       state.message = {
//         type: "",
//         title: "",
//         desc: "",
//       };
//     },
//     openSelectanalyticsModal: (state, action: PayloadAction<HostType>) => ({
//       ...state,
//       selectanalyticsModal: { host: action.payload },
//     }),
//     openGroupModal: (state, action: PayloadAction<PartnerGroupType>) => ({
//       ...state,
//       groupModal: action.payload,
//     }),
//     openpartnerSelectModal: (state) => ({
//       ...state,
//       partnerSelectModalOpen: true,
//     }),
//     closeModal: (state) => ({
//       ...state,
//       groupModal: undefined,
//       selectanalyticsModal: undefined,
//       partnerSelectModalOpen: undefined,
//     }),
//   },
// });

// export default coreSlice.reducer;
// export const {
//   changeMessage,
//   clearMessage,
//   openGroupModal,
//   closeModal,
//   openSelectanalyticsModal,
//   openpartnerSelectModal,
// } = coreSlice.actions;
