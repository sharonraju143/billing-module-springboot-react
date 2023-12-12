import React from "react";
import Sidenav from "../components/Sidenav";
import Navbar from "../components/Navbar";
import { Box } from "@mui/material";


export const GcpPage = () => {
  return (
    <>
     <Navbar />
    <Box height={30} />
      <Box sx={{ display: "flex" }}>
        <Sidenav />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}></Box>
        <h1>GcpPage</h1>
      </Box>
    </>
  );
};

export default GcpPage;
