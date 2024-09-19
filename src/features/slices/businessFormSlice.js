import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  submitterDetails: {
    name: "",
    email: "",
    address: "",
    contact: "",
    licenceFile: null
  },
  submitterIsOwner: false,
  numberOfCompanyOwned: null,
  usersDetail: {},
  companyDetails: {}
};

export const businessFormSlice = createSlice({
  name: 'businessForm',
  initialState,
  reducers: {
    changeSubmmitterDetails: (state, {payload}) => {
      state.submitterDetails[payload.key] = payload.value;
    },
    toggleSubmitterIsOwner: (state, action) => {
      state.submitterIsOwner = action.payload;
    },
    changeCompanyCount: (state, {payload}) => {
      state.numberOfCompanyOwned = payload.value;
    },
    resetSubmitterDetails: (state) => {
      state.submitterDetails = {
        name: "",
        email: "",
        address: "",
        contact: "",
        licenceFile: null
      };
      state.submitterIsOwner = false;
    }
  },
});

export const { changeSubmmitterDetails, toggleSubmitterIsOwner, changeCompanyCount, resetSubmitterDetails } = businessFormSlice.actions;

export const selectSubmmitterDetails = ({businessForm}) => businessForm.submitterDetails;
export const isSubmitterOwner = ({businessForm}) => businessForm.submitterIsOwner;
export const selectNumberOfCompanyOwned = ({businessForm}) => businessForm.numberOfCompanyOwned;

export default businessFormSlice.reducer;
