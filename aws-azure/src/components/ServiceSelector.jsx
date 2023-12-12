import React, { useEffect, useState } from "react";
import { FormControl, Select, MenuItem } from "@mui/material";

const ServiceSelector = ({ service, handleServiceChange }) => {
  const serviceOptions = [
    null,
    "AWS CloudShell",
    "Tax",
    "EC2 - Other",
    "Amazon Virtual Private Cloud",
    "Amazon Elastic Compute Cloud - Compute",
    "AWS Cost Explorer",
    "AWS Key Management Service",
    "Amazon Relational Database Service",
    "Amazon Simple Storage Service",
    "AmazonCloudWatch",
  ];

  //const[list,setList]=useState([])

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

  // const forListGet = async () => {
  //   try {
  //     const res = await listService();
  //     console.log(res);
  //     setList(res)
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // useEffect(()=>{
  //   forListGet()
  // },[])

  return (
    <React.Fragment>
      <FormControl sx={{ ...newPropsCss }} fullWidth>
        <Select
          fullWidth
          sx={{ ...newPropsCss, height: "2.4em" }}
          labelId="service-label"
          value={service}
          onChange={handleServiceChange}
        >
          <MenuItem value={null}>Select Service</MenuItem>
          {serviceOptions.map((option, index) => (
            <MenuItem key={index} value={option} sx={{ ...newPropsCss }}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </React.Fragment>
  );
};

export default ServiceSelector;
