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
    },
    addOwner: (state, action) => {
    }
  },
});

export const { addCompany, addOwner } = companyInformationSlice.actions;

export const selectCompanies = ({companyInformation}) => companyInformation.companies;
export const selectOwners = ({companyInformation}) => companyInformation.owners;

export default companyInformationSlice.reducer;
