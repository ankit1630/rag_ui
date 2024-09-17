import React, {useState} from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";

// CSS
import "./../styles/businessForm.css";

// Components
import TextField from "@mui/material/TextField";
import { Card, CardContent } from "@mui/material";
import Typography from "@mui/material/Typography";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import {
  changeSubmmitterDetails,
  isSubmitterOwner,
  selectSubmmitterDetails,
  toggleSubmitterIsOwner,
} from "./slices/businessFormSlice";
import { selectCompanies, selectOwners } from "./slices/companyInformationSlice";
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { CompanyInformation } from "./companyInformation";

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

export function BusinessForm() {
  const dispatch = useDispatch();
  const [submitInProgress, setSubmitInProgress] = useState(false);
  const submitterDetails = useSelector(selectSubmmitterDetails);
  const submitterIsOwner = useSelector(isSubmitterOwner);
  const companies = useSelector(selectCompanies);
  const owners = useSelector(selectOwners);

  const prepareCompanyDetails = () => {
    const companiesIds = Object.keys(companies);

    return companiesIds.map((companyId) => {
      return companies[companyId];
    });
  };

  const companyDetails = prepareCompanyDetails();

  const handleSubmit = async () => {
    setSubmitInProgress(true);

    const formData = new FormData();
    console.log(submitterDetails.licenceFile);
    formData.append("submitterDetails", JSON.stringify(submitterDetails));
    formData.append("companyDetails", JSON.stringify(companyDetails));
    formData.append("owners", JSON.stringify(owners));
    formData.append("submitterLicense", submitterDetails.licenceFile);

    const ownerIds = Object.keys(owners);
    ownerIds.forEach((ownerId) => {
      formData.append(ownerId, owners[ownerId].licenceFile);
    })

    const response = axios.post("/api/saveForm", formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });

    console.log(response);

    setSubmitInProgress(false);
  };

  const handleFileUpload = (ev) => {
    dispatch(changeSubmmitterDetails({key: "licenceFile", value: ev.target.files[0]}))
  };

  const isSubmitterDetailsIsValid = () => {
    if (!submitterDetails.name || !submitterDetails.email) {
      return false;
    }

    if (submitterIsOwner && !(submitterDetails.address && submitterDetails.contact && submitterDetails.licenceFile)) {
      return false;
    }

    return true;
  };

  const _renderAddressFields = () => {
    if (!submitterIsOwner) return null;

    return (
      <>
        <div className="submitter-address">
          <div>Address</div>
          <TextField
            sx={{ width: "100%", marginTop: "12px" }}
            id="outlined-basic"
            variant="outlined"
            className="submitter-address-text-field"
            placeholder="Enter your address"
            value={submitterDetails.address}
            onChange={(ev) =>
              dispatch(changeSubmmitterDetails({key: "address", value: ev.target.value}))
            }
          />
        </div>
        <div className="submitter-contact">
          <div>Contact Number</div>
          <TextField
            sx={{ width: "100%", marginTop: "12px" }}
            id="outlined-basic"
            variant="outlined"
            className="submitter-contact-text-field"
            placeholder="Enter your contact number"
            value={submitterDetails.contact}
            onChange={(ev) =>
              dispatch(changeSubmmitterDetails({key: "contact", value: ev.target.value}))
            }
          />
        </div>
        <div>
          <div>Upload Licence</div>
          <Button
            component="label"
            role={undefined}
            variant="contained"
            tabIndex={-1}
            startIcon={<CloudUploadIcon />}
            sx={{ width: "100%", marginTop: "12px" }}
          >
            {submitterDetails.licenceFile ? submitterDetails.licenceFile.name : "Upload file"}
            <VisuallyHiddenInput type="file" onChange={handleFileUpload}/>
          </Button>
        </div>
      </>
    );
  };

  const _renderSubmitterForm = () => {
    return (
      <Card sx={{ width: "100%" }} className="card submitter-card">
        <CardContent>
          <Typography sx={{ fontSize: 16 }} color="text.secondary" gutterBottom>
            <strong>Submitter Details</strong>
          </Typography>
          <div className="submitter-name">
            <div>Name</div>
            <TextField
              sx={{ width: "100%", marginTop: "12px" }}
              id="outlined-basic"
              variant="outlined"
              className="submitter-name-text-field"
              placeholder="Enter complete name"
              value={submitterDetails.name}
              onChange={(ev) => dispatch(changeSubmmitterDetails({key: "name", value: ev.target.value}))}
            />
          </div>
          <div className="submitter-email">
            <div>Email</div>
            <TextField
              sx={{ width: "100%", marginTop: "12px" }}
              id="outlined-basic"
              variant="outlined"
              className="submitter-email-text-field"
              placeholder="Enter your email"
              value={submitterDetails.email}
              onChange={(ev) =>
                dispatch(changeSubmmitterDetails({key: "email", value: ev.target.value}))
              }
            />
          </div>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={submitterIsOwner}
                  onChange={() =>
                    dispatch(toggleSubmitterIsOwner(!submitterIsOwner))
                  }
                />
              }
              label="Is the submitter different from the owner?"
            />
          </FormGroup>
          {_renderAddressFields()}
        </CardContent>
      </Card>
    );
  };

  const submitBtnIsDisabled = submitInProgress || !(isSubmitterDetailsIsValid() && companyDetails.length)

  return (
    <div className="business-form">
      {_renderSubmitterForm()}
      <CompanyInformation />
      <Button variant="contained" className="submit-button" disabled={submitBtnIsDisabled} onClick={handleSubmit}>Submit Details</Button>
    </div>
  );
}