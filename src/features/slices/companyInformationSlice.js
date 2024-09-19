import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  companies: {},
  owners: {},
};

export const companyInformationSlice = createSlice({
  name: 'companyInformation',
  initialState,
  reducers: {
    addCompany: (state, action) => {
        const company = action.payload;

        if (!state.companies[company.id]) {
            state.companies[company.id] = company;
        }
    },
    addOwner: (state, action) => {
        if (!state.owners[action.payload.id]) {
            state.owners[action.payload.id] = action.payload;
        }
    },
    resetCompanyInformation: (state) => {
      state.companies = {};
      state.owners = {};
    }
  },
});

export const { addCompany, addOwner, resetCompanyInformation } = companyInformationSlice.actions;

export const selectCompanies = ({companyInformation}) => companyInformation.companies;
export const selectOwners = ({companyInformation}) => companyInformation.owners;

export default companyInformationSlice.reducer;
