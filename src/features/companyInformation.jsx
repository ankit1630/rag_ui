import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import {
  Button,
  Card,
  CardContent,
  TextField,
} from "@mui/material";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Typography from "@mui/material/Typography";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';  

import "./../styles/companyInformation.css";

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

export function CompanyInformation() {
  const dispatch = useDispatch();
  const [companyDetails, setCompanyDetails] = useState({
    id: "",
    taxId: "",
    address: "",
    owners: [],
  });
  const [ownerDetails, setOwnerDetails] = useState({
    id: "",
    name: "",
    role: "",
    licenceFile: null,
  });
  const [companyFormIsOpen, setCompanyFormIsOpen] = useState(false);
  const [ownerFormIsOpen, setOwnerFormIsOpen] = useState(false);

  const handleAddCompanyForm = () => {
    if (companyFormIsOpen) {
      setOwnerFormIsOpen(false);
      setOwnerDetails({
        id: "",
        name: "",
        role: "",
        licenceFile: null,
      });
      setCompanyFormIsOpen(false);
      setCompanyDetails({
        id: "",
        taxId: "",
        address: "",
        owners: [],
      });
    } else {
      setCompanyFormIsOpen(true);
    }
  };

  const handleAddOwnersClick = () => {
    if (ownerFormIsOpen) {
      setOwnerFormIsOpen(false);
      setOwnerDetails({
        id: "",
        name: "",
        role: "",
        licenceFile: null,
      });
    } else {
      setOwnerFormIsOpen(true);
    }
  };

  const handleCompanyDetailUpdate = (key, value) => {
    setCompanyDetails({
      ...companyDetails,
      [key]: value
    })
  };

  const handleOnwerNameChange = (ev) => {
    setOwnerDetails({
      ...ownerDetails,
      name: ev.target.value
    })
  };

  const handleOwnerRoleChange = (ev) => {
    setOwnerDetails({
      ...ownerDetails,
      role: ev.target.value
    });
  };

  const handleOwnerLicenceUpload = (ev) => {
    setOwnerDetails({
      ...ownerDetails,
      licenceFile: ev.target.files[0]
    });
  };

  const handleOwnerSave = () => {

  };

  const _renderOwnerForm = () => {
    if (!ownerFormIsOpen) return null;

    return (
      <div>
        <TextField
          sx={{ width: "100%", marginTop: "12px", marginBottom: "12px" }}
          id="outlined-basic"
          variant="outlined"
          className="company-name"
          placeholder="Enter owner name"
          value={ownerDetails.name}
          onChange={handleOnwerNameChange}
        />
        <FormControl className="owner-role">
          <FormLabel id="demo-row-radio-buttons-group-label">Role</FormLabel>
          <RadioGroup
            row
            aria-labelledby="demo-row-radio-buttons-group-label"
            name="row-radio-buttons-group"
            value={ownerDetails.role}
            onChange={handleOwnerRoleChange}
          >
            <FormControlLabel value="user" control={<Radio />} label="User" />
            <FormControlLabel value="business" control={<Radio />} label="Business" />
          </RadioGroup>
        </FormControl>
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
            Upload file
            <VisuallyHiddenInput type="file" onChange={handleOwnerLicenceUpload}/>
          </Button>
        </div>
        <Button variant="outlined" onClick={handleAddOwnersClick} style={{width: '100%', marginTop: "20px"}} onClick={handleOwnerSave}>
            Save Owner Details
        </Button>
      </div>
    )
  };

  const _renderCompanyForm = () => {
    if (!companyFormIsOpen) return null;

    return (
      <div className="company-form">
        <TextField
          sx={{ width: "100%", marginTop: "12px" }}
          id="outlined-basic"
          variant="outlined"
          className="company-name"
          placeholder="Enter your tax Id"
          value={companyDetails.taxId}
          onChange={(ev) => handleCompanyDetailUpdate("taxId", ev.target.value)}
        />
        <TextField
          sx={{ width: "100%", marginTop: "12px" }}
          id="outlined-basic"
          variant="outlined"
          className="company-address"
          placeholder="Enter your address"
          value={companyDetails.address}
          onChange={(ev) => handleCompanyDetailUpdate("address", ev.target.value)}
        />
        <div className="owner-form">
          <div className="company-info-header">
            <Typography sx={{ fontSize: 14, marginTop: "20px" }} color="text.secondary" gutterBottom>
              <strong>Owners</strong>
            </Typography>
            <Button variant="outlined" onClick={handleAddOwnersClick}>
              Add Owners
            </Button>
          </div>
          {_renderOwnerForm()}
        </div>
      </div>
    );
  };

  return (
    <Card sx={{ width: "100%" }} className="card company-information">
      <CardContent>
        <div className="company-info-header">
          <Typography sx={{ fontSize: 16 }} color="text.secondary" gutterBottom>
            <strong>Company Information</strong>
          </Typography>
          <Button variant="contained" onClick={handleAddCompanyForm}>
            Add Company
          </Button>
        </div>
        {_renderCompanyForm()}
        <Button variant="outlined" onClick={handleAddOwnersClick} style={{width: '100%', marginTop: "20px"}}>
            Save Company Details
        </Button>
      </CardContent>
    </Card>
  );
}
