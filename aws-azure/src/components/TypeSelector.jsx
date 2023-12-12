import React from "react";
import { FormControl, Select, MenuItem } from "@mui/material";

const TypeSelector = ({ type, handleTypeChange }) => {
  const newPropsCss = {
    backgroundColor: "#FFFF",
    width:200,textAlign:'center',
    ":hover": {
      backgroundColor: "#FFFF",
      color: "black",
    },
    "&.Mui-selected": {
      backgroundColor: "#FFFF !important",
      color: "black",
    },
  };
  return (
    <React.Fragment>
      <div className="marginx">
        <FormControl  sx={{...newPropsCss}}>
          <Select sx={{...newPropsCss,height: "2.4em"}}
            labelId="type-label"
            value={type}
            onChange={handleTypeChange}
          >
            <MenuItem value={0} sx={{...newPropsCss}} disabled>Select Type</MenuItem>
            <MenuItem value={"aws"} sx={{...newPropsCss}}>AWS</MenuItem>
            <MenuItem value={"azure"} sx={{...newPropsCss}}>Azure</MenuItem>
            <MenuItem value={"gcp"} sx={{...newPropsCss}}>GCP</MenuItem>
            <MenuItem value={"atlassian"} sx={{...newPropsCss}}>ATLASSIAN</MenuItem>
            <MenuItem value={"git"} sx={{...newPropsCss}}>GIT</MenuItem>
          </Select>
        </FormControl>
      </div>
    </React.Fragment>
  );
};

export default TypeSelector;
