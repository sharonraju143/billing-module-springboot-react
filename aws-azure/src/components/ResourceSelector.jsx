import React from "react";
import { FormControl, Select, MenuItem } from "@mui/material";

const ResourceSelector = ({ resource, handleResourceChange }) => {
  const resourceOptions = [
    null,
    "Resource 1",
    "Resource 2",
    "Resource 3",
    // Add your resource options here
  ];

  const newPropsCss = {
    backgroundColor: "#FFFF",
    width: "340px",
    textAlign: "center",
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
    <FormControl sx={{ ...newPropsCss }} fullWidth>
      <Select
        fullWidth
        sx={{ ...newPropsCss, height: "2.4em" }}
        labelId="resource-label"
        value={resource}
        onChange={handleResourceChange}
      >
        <MenuItem value={null}>Select Resource</MenuItem>
        {resourceOptions.map((option, index) => (
          <MenuItem key={index} value={option} sx={{ ...newPropsCss }}>
            {option}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default ResourceSelector;
