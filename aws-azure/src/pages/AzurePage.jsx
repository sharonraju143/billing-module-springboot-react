import React from "react";
import Sidenav from "../components/Sidenav";
import Navbar from "../components/Navbar";
import { Box } from "@mui/material";
import Typography from "@mui/material/Typography";

export const AzurePage = () => {
  return (
    <>
     <Navbar />
    <Box height={30} />
      <Box sx={{ display: "flex" }}>
        <Sidenav />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}></Box>
        <h1>AzurePage</h1>
      </Box>
    </>
  );
};

export default AzurePage;
