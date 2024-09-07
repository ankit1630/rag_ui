import React from "react";
import { useSelector, useDispatch } from "react-redux";

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
  const submitterDetails = useSelector(selectSubmmitterDetails);
  const submitterIsOwner = useSelector(isSubmitterOwner);

  console.log(submitterDetails);

  const handleFileUpload = (ev) => {
    dispatch(changeSubmmitterDetails({key: "licenceFile", value: ev.target.files[0]}))
  }

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
  }

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
  }

  return (
    <div className="business-form">
      {_renderSubmitterForm()}
      <CompanyInformation />
    </div>
  );
}
