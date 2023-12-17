import React, { useEffect, useState } from "react";
import { Button, Card, Grid } from "@mui/material";
import {  azureService, listService } from "../services/Services";
import DurationSelector from "../components/DurationSelector";
import AwsTable from "../tables/AwsTable";
import ServiceSelector from "../components/ServiceSelector";
import DateSelector from "../components/DateSelector";
import Paper from "@mui/material/Paper";
import Sidenav from "../components/Sidenav";
import Navbar from "../components/Navbar";
import { Box } from "@mui/material";
import Typography from "@mui/material/Typography";
import BarChat from "../components/BarChart";
import ServicesChart from "../components/ServicesChart";
import ServicesPieChart from "../components/servicesPiechart";
import ResourceSelector from "../components/ResourceSelector";


export const AzurePage = () => {

  //const [service, setService] = useState("");
  const [resource, setResource] = useState(""); 
  const [sidenavOpen, setSidenavOpen] = useState(false);
  const [dateRange, setDateRange] = useState({
    startDate: "",
    endDate: "",
  });
  const [months, setMonths] = useState(0);
  const [display,setDisplay]=useState(false)

  const [data, setData] = useState([]);
  

  const handleStartDateChange = (event) => {
    setDateRange({
      ...dateRange,
      startDate: event.target.value,
    });
  };

  const handleEndDateChange = (event) => {
    setDateRange({
      ...dateRange,
      endDate: event.target.value,
    });
  };

  const handleMonthChange = (event) => {
    setMonths(event.target.value);
    console.log(display)
   
    
  };

  // const handleServiceChange = (event) => {
  //   setService(event.target.value);
  // };

  const handleResourceChange = (event) => {
    setResource(event.target.value); // Update state variable setter function
  };

  const toggleSidenav = () => {
    setSidenavOpen(!sidenavOpen);
  };

  const resetFilters = () => {
  //  setService("");
    setDateRange({
      startDate: "",
      endDate: "",
    });
    setMonths(0);
  };

  const forAzureGet = async () => {
    try {
      const res = await azureService(
        //service
        resource,
        dateRange.startDate,
        dateRange.endDate,
        months
      );
      console.log(res);
      setData(res);
    } catch (error) {
      console.log(error);
    }
  };

  const bodyStyle = {
    backgroundColor: "#f0f0f0",
    minHeight: "100vh",
    padding: "20px",
    overflowX: "hidden",
  };

  const contentStyle = {
    transition: "margin-left 0.5s",
    marginLeft: sidenavOpen ? 250 : 0,
    width: "100%",
  };

  const MonthDisabled = () => {
    return dateRange.startDate !== "" || dateRange.endDate !== "";
  };

  const DateDisabled = () => {
    return months !== 0;
  };
useEffect(()=>{
setDisplay(true)
},[display])
  useEffect(() => {
    // Load data from localStorage on component mount
   // const savedService = localStorage.getItem("service");
   const savedResource = localStorage.getItem("resource");
    const savedStartDate = localStorage.getItem("startDate");
    const savedEndDate = localStorage.getItem("endDate");
    const savedMonths = localStorage.getItem("months");

    //if (savedService) setService(savedService);
    if (savedResource) setResource(savedResource);
    if (savedStartDate) setDateRange({ ...dateRange, startDate: savedStartDate });
    if (savedEndDate) setDateRange({ ...dateRange, endDate: savedEndDate });
    if (savedMonths) setMonths(savedMonths);
  }, []);

  const updateLocalStorage = () => {
    // Save state to localStorage whenever it changes
  //  localStorage.setItem("service", service);
  localStorage.setItem("resource",resource);
    localStorage.setItem("startDate", dateRange.startDate);
    localStorage.setItem("endDate", dateRange.endDate);
    localStorage.setItem("months", months);
  };

  useEffect(() => {
    forAzureGet();
    updateLocalStorage();
  }, [ resource, dateRange.endDate, dateRange.startDate, months]);

  return (
    <div style={bodyStyle}>
      <React.Fragment>
        <Navbar toggleSidenav={toggleSidenav} />
        <Box height={50} />
        <Box sx={{ display: "flex" }}>
          <Sidenav open={sidenavOpen} onClose={toggleSidenav} />

          <Box
            component="main"
            sx={{ ...contentStyle, marginLeft: sidenavOpen ? 250 : 0, width: "100%", flexGrow:1, }}
          >
            <Card sx={{ px: 2, py: 4, m: 2 }}>
              <Box
                component={"div"}
                sx={{
                  display: "flex",
                  justifyContent: "space-around",
                  alignItems: "center",
                }}
              >
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6} md={6} lg={4} xl={4}>
                    <h5>Select Resource</h5>
                    <ResourceSelector
                      resource={resource}
                      handleServiceChange={handleResourceChange}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6} md={6} lg={5} xl={5}>
                    <h5>select Date</h5>
                    <DateSelector
                      handleStartDateChange={handleStartDateChange}
                      handleEndDateChange={handleEndDateChange}
                      dateRange={dateRange}
                      DateDisabled={DateDisabled}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6} md={6} lg={2 } xl={2}>
                    <h5>select Duration</h5>
                    <DurationSelector
                      handleMonthChange={handleMonthChange}
                      months={months}
                      MonthDisabled={MonthDisabled}
                    />
                  </Grid>

                  <Grid item xs={6} md={0.8} sm={12}>
                    <Button variant="outlined" onClick={resetFilters}>
                      Reset
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Card>

            <Grid container spacing={3}>
              <Grid sx={{ px: 2, py: 4, m: 2 }} item xs={11.2} md={6} lg={8}>
                {(data?.monthlyTotalAmounts?.length > 0 && resource) ||
                (!resource &&
                  ((dateRange.startDate && dateRange.endDate) || months)) ? (
                  <BarChat data={data?.monthlyTotalAmounts} />
                ) : (
                  <div className="chart-container">
                    <div className="headtag">
                      <h4>Bar Chart</h4>
                      <p>No data available</p>
                    </div>
                  </div>
                )}
              </Grid>

              {data?.totalAmount && (
                <Grid sx={{ px: 2, py: 4, m: 2 }} item xs={11.2} md={6} lg={3}>
                  <Paper
                    sx={{
                      p: 2,
                      display: "flex",
                      flexDirection: "column",
                      height: 250,
                      padding: 5,
                      backgroundColor: "#d3d3f3",
                    }}
                  >
                    <h5>Total Amount</h5>
                    <Typography component="p" variant="h6">
                      ${data?.totalAmount}
                    </Typography>
                  </Paper>
                </Grid>
              )}

              <Grid sx={{ px: 2, py: 4, m: 2 }} item xs={11.2} md={6} lg={7}>
                <ServicesChart dataset={data && data?.top10Services} />
              </Grid>

              <Grid sx={{ px: 2, py: 4, m: 2 }} item xs={11.2} md={6} lg={4}>
                <ServicesPieChart dataset={data && data?.top10Services} />
              </Grid>
            </Grid>

            <Card sx={{ px: 2, py: 4, m: 2 }}>
              <Box
                component={"div"}
                sx={{
                  display: "flex",
                  justifyContent: "space-around",
                  alignItems: "center",
                }}
              >
                <Grid container spacing={2} className="mb-3">
                  <Grid
                    item
                    xs={11}
                    sm={11}
                    lg={12}
                    className="mx-auto mx-sm-0"
                  >
                    <AwsTable data={data.billingDetails} />
                  </Grid>
                </Grid>
              </Box>
            </Card>
          </Box>
        </Box>
      </React.Fragment>
    </div>
  );
 
};

export default AzurePage;
