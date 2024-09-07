import { configureStore } from "@reduxjs/toolkit";
import businessFormSlice from "../features/slices/businessFormSlice";
import { companyInformationSlice } from "../features/slices/companyInformationSlice";


export const store = configureStore({
  reducer: {
    businessForm: businessFormSlice,
    companyInformation: companyInformationSlice,
  },
});
